"""站点日志模块测试：记录写入、上下文隔离、级别过滤与站点概览。"""

import pytest

from app.core.context import MediaInfo
from app.helper import site_log


@pytest.fixture
def log_dir(tmp_path, monkeypatch):
    """将站点日志根目录指向临时目录，隔离每条用例的落盘数据。"""
    base = tmp_path / "rss"
    base.mkdir()
    monkeypatch.setattr(site_log, "get_base_dir", lambda: base)
    return base


def test_record_torrent_writes_jsonl(log_dir):
    """识别成功与失败记录均写入站点日志，汇总记录在结束时落盘。"""
    site_log.begin_site("观众", "audiences.me", stype="rss")
    site_log.record_torrent(
        raw_title="The Odyssey 2026 2160p",
        status="ok",
        adjusted=True,
        media_info=MediaInfo(title="奥德赛", original_title="The Odyssey",
                             year="2026", type="电影", tmdb_id=1368337),
    )
    site_log.record_torrent(raw_title="Mystery.2024.1080p", status="fail")
    site_log.end_site(total=2, new=2, ok=1, fail=1, word=1, cost=3.5)

    records = site_log.read_site_records("audiences.me")
    assert [r["type"] for r in records] == ["summary", "torrent", "torrent"]
    # 最新在前：第二条是失败记录（无识别信息）
    assert records[1]["raw"] == "Mystery.2024.1080p"
    assert "title" not in records[1]
    assert records[1]["status"] == "fail"
    # 第三条是成功记录，标题由中文译名与原名拼接
    ok_record = records[2]
    assert ok_record["title"] == "奥德赛 / The Odyssey"
    assert ok_record["tmdb_id"] == 1368337
    assert ok_record["adjusted"] is True
    assert ok_record["site"] == "观众"
    summary = records[0]
    assert (summary["total"], summary["new"], summary["ok"], summary["fail"]) == (2, 2, 1, 1)
    assert summary["cost"] == 3.5


def test_context_isolation(log_dir):
    """上下文结束后的记录调用不落盘，避免串站点；新站点写入独立文件。"""
    site_log.begin_site("观众", "audiences.me")
    site_log.record_torrent(raw_title="A", status="ok")
    site_log.end_site(total=1, new=1, ok=1, fail=0, word=0, cost=1.0)
    # 上下文已清除，这些调用应被忽略
    site_log.record_torrent(raw_title="B", status="ok")
    site_log.record_event("孤儿事件")
    records = site_log.read_site_records("audiences.me")
    assert len(records) == 2
    assert {r["type"] for r in records} == {"torrent", "summary"}

    site_log.begin_site("天空", "sky.site")
    site_log.record_torrent(raw_title="C", status="fail")
    site_log.end_site(total=1, new=0, ok=0, fail=1, word=0, cost=0.5)
    assert (log_dir / "sky.site.log").exists()


def test_read_level_filters(log_dir):
    """level 过滤只保留匹配的种子记录，汇总与事件仅在 all 视图返回。"""
    site_log.begin_site("观众", "audiences.me")
    site_log.record_torrent(raw_title="OK种子", status="ok")
    site_log.record_torrent(raw_title="坏种子", status="fail")
    site_log.record_torrent(raw_title="改名种子", status="ok", adjusted=True)
    site_log.record_event("未获取到RSS数据", level="error")
    site_log.end_site(total=3, new=3, ok=2, fail=1, word=1, cost=1.0)

    fails = site_log.read_site_records("audiences.me", level="fail")
    assert [r["raw"] for r in fails] == ["坏种子"]
    words = site_log.read_site_records("audiences.me", level="word")
    assert [r["raw"] for r in words] == ["改名种子"]
    oks = site_log.read_site_records("audiences.me", level="ok")
    assert [r["raw"] for r in oks] == ["改名种子", "OK种子"]
    all_records = site_log.read_site_records("audiences.me")
    assert {r["type"] for r in all_records} == {"torrent", "summary", "event"}


def test_list_sites_and_all_merge(log_dir):
    """list_sites 返回各站点最新汇总，domain=all 合并多站点记录。"""
    site_log.begin_site("观众", "audiences.me")
    site_log.record_torrent(raw_title="A1", status="ok")
    site_log.end_site(total=1, new=1, ok=1, fail=0, word=0, cost=1.0)
    site_log.begin_site("天空", "sky.site")
    site_log.record_torrent(raw_title="B1", status="fail")
    site_log.end_site(total=1, new=1, ok=0, fail=1, word=0, cost=2.0)

    sites = {s["domain"]: s for s in site_log.list_sites()}
    assert set(sites) == {"audiences.me", "sky.site"}
    assert sites["audiences.me"]["site"] == "观众"
    assert sites["audiences.me"]["summary"]["ok"] == 1
    assert sites["sky.site"]["summary"]["fail"] == 1

    merged = site_log.read_site_records("all")
    assert {r["raw"] for r in merged if r["type"] == "torrent"} == {"A1", "B1"}


def test_invalid_domain_ignored(log_dir):
    """非法域名不落盘、查询返回空，防止路径穿越。"""
    site_log.begin_site("坏", "..\\evil")
    site_log.record_torrent(raw_title="X", status="ok")
    site_log.end_site(total=1, new=0, ok=0, fail=0, word=0, cost=0)
    assert site_log.read_site_records("..\\evil") == []
    assert list(log_dir.glob("*")) == []


def test_record_torrent_with_enum_media_type(log_dir):
    """media_type 为 MediaType 枚举时记录应正常落盘，枚举转为字符串。"""
    from app.schemas.types import MediaType

    site_log.begin_site("观众", "audiences.me")
    site_log.record_torrent(
        raw_title="The Odyssey 2026 2160p",
        status="ok",
        media_info=MediaInfo(title="奥德赛", original_title="The Odyssey",
                             year="2026", type=MediaType.MOVIE, tmdb_id=1368337),
    )
    site_log.end_site(total=1, new=1, ok=1, fail=0, word=0, cost=1.0)
    records = site_log.read_site_records("audiences.me")
    torrent = next(r for r in records if r["type"] == "torrent")
    assert torrent["title"] == "奥德赛 / The Odyssey"
    assert torrent["media_type"] == "电影"
    assert torrent["tmdb_id"] == 1368337
