import json
import threading
import time
from contextvars import ContextVar
from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import Any, Dict, List, Optional

from app.core.context import MediaInfo
from app.log import log_settings

# 当前站点日志上下文，基于 contextvars 隔离，多任务并发刷新时互不串扰
_current_site: ContextVar[Optional[Dict[str, Any]]] = ContextVar(
    "site_log_context", default=None
)

# 写文件互斥锁，保证多线程同时写入站点日志时行完整性
_write_lock = threading.Lock()

# 单站点日志文件大小上限，超过后自动轮转保留尾部
MAX_SITE_LOG_SIZE = 10 * 1024 * 1024
# 轮转时保留的尾部数据大小
KEEP_TAIL_SIZE = 2 * 1024 * 1024

# 允许作为日志文件名的域名合法字符
_DOMAIN_CHARS = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-")

# 站点汇总记录中各统计字段的默认值
_SUMMARY_FIELDS = ("total", "new", "ok", "fail", "word", "cost")


def get_base_dir() -> Path:
    """
    获取站点日志根目录
    :return: 日志目录路径
    """
    return log_settings.LOG_PATH / "rss"


def _sanitize_domain(domain: str) -> Optional[str]:
    """
    校验域名可安全用作日志文件名
    :param domain: 站点域名
    :return: 合法时返回原域名，非法返回 None
    """
    if not domain or not set(domain) <= _DOMAIN_CHARS:
        return None
    return domain


def _time_now() -> str:
    """
    获取当前时间字符串
    :return: yyyy-MM-dd HH:mm:ss
    """
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def _to_json_value(value: Any) -> Any:
    """
    把媒体信息字段值转换为可 JSON 序列化的类型
    :param value: 原始值，可能是枚举（如 MediaType）或其他对象
    :return: 枚举取其 value，基础类型原样返回，其余转为字符串
    """
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    if isinstance(value, Enum):
        return value.value
    return str(value)


def _maybe_rotate(path: Path) -> None:
    """
    站点日志超过上限时轮转，保留最新尾部数据
    :param path: 站点日志文件路径
    """
    try:
        if not path.exists() or path.stat().st_size <= MAX_SITE_LOG_SIZE:
            return
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            f.seek(path.stat().st_size - KEEP_TAIL_SIZE)
            f.readline()  # 跳过残缺行
            tail = f.read()
        tmp = path.with_suffix(".tmp")
        tmp.write_text(tail, encoding="utf-8")
        tmp.replace(path)
    except Exception:
        # 轮转失败不影响主流程
        pass


def _append(record: Dict[str, Any]) -> None:
    """
    追加写入一条站点日志记录
    :param record: 日志记录字典
    """
    safe_domain = _sanitize_domain(record.get("domain"))
    if not safe_domain:
        return
    path = get_base_dir() / f"{safe_domain}.log"
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        line = json.dumps(record, ensure_ascii=False, separators=(",", ":"), default=str)
        with _write_lock:
            _maybe_rotate(path)
            with open(path, "a", encoding="utf-8") as f:
                f.write(line + "\n")
    except Exception:
        # 站点日志属于附加能力，任何写入失败都不能影响主流程
        pass


def begin_site(site_name: str, domain: str, stype: str = "rss") -> None:
    """
    开始一个站点的刷新处理，激活站点日志上下文
    :param site_name: 站点名称
    :param domain: 站点域名
    :param stype: 刷新类型 rss/spider
    """
    _current_site.set({
        "site": site_name,
        "domain": domain,
        "stype": stype,
        "start": time.time(),
    })


def end_site(total: int = 0, new: int = 0, ok: int = 0,
             fail: int = 0, word: int = 0, cost: float = 0) -> None:
    """
    结束当前站点的刷新处理，写入汇总记录并清除上下文
    :param total: 本轮抓取到的种子总数
    :param new: 新种子数量
    :param ok: 识别成功数量
    :param fail: 未识别数量
    :param word: 应用识别词后名称发生变化的数量
    :param cost: 本轮耗时（秒）
    """
    context = _current_site.get()
    if not context:
        return
    record = {
        "time": _time_now(),
        "type": "summary",
        "site": context.get("site"),
        "domain": context.get("domain"),
        "stype": context.get("stype"),
        "total": total,
        "new": new,
        "ok": ok,
        "fail": fail,
        "word": word,
        "cost": cost,
    }
    _current_site.set(None)
    _append(record)


def record_torrent(raw_title: str, status: str, adjusted: bool = False,
                   media_info: Optional[MediaInfo] = None) -> None:
    """
    记录一个种子的识别结果，仅在站点上下文激活时生效
    :param raw_title: 原始种子名称
    :param status: 识别状态 ok/fail
    :param adjusted: 应用识别词后名称是否发生变化
    :param media_info: 识别出的媒体信息
    """
    context = _current_site.get()
    if not context:
        return
    record = {
        "time": _time_now(),
        "type": "torrent",
        "site": context.get("site"),
        "domain": context.get("domain"),
        "raw": raw_title,
        "status": status if status in ("ok", "fail") else "fail",
        "adjusted": bool(adjusted),
    }
    if media_info:
        title = media_info.title or media_info.original_title
        if media_info.title and media_info.original_title \
                and media_info.original_title != media_info.title:
            title = f"{media_info.title} / {media_info.original_title}"
        record["title"] = title
        record["media_type"] = _to_json_value(media_info.type)
        record["year"] = _to_json_value(media_info.year)
        record["tmdb_id"] = _to_json_value(media_info.tmdb_id)
        record["douban_id"] = _to_json_value(media_info.douban_id)
        record["bangumi_id"] = _to_json_value(media_info.bangumi_id)
    _append(record)


def record_event(message: str, level: str = "info") -> None:
    """
    记录站点处理过程事件，如RSS获取失败等，仅在站点上下文激活时生效
    :param message: 事件描述
    :param level: 事件级别 info/error
    """
    context = _current_site.get()
    if not context:
        return
    record = {
        "time": _time_now(),
        "type": "event",
        "site": context.get("site"),
        "domain": context.get("domain"),
        "level": level,
        "message": message,
    }
    _append(record)


def _read_tail(path: Path, size: int) -> List[str]:
    """
    读取日志文件尾部指定字节数并返回完整行列表（正序）
    :param path: 日志文件路径
    :param size: 读取的最大字节数
    :return: 行列表
    """
    file_size = path.stat().st_size
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        if file_size > size:
            f.seek(file_size - size)
            f.readline()  # 跳过残缺行
        lines = f.read().splitlines()
    return [line for line in lines if line.strip()]


def _parse_record(line: str) -> Optional[Dict[str, Any]]:
    """
    解析单行站点日志记录
    :param line: JSON字符串
    :return: 解析后的字典，失败返回 None
    """
    try:
        record = json.loads(line)
        return record if isinstance(record, dict) else None
    except Exception:
        return None


def _iter_records(path: Path, tail_size: int = 64 * 1024) -> List[Dict[str, Any]]:
    """
    按时间倒序读取站点日志记录
    :param path: 日志文件路径
    :param tail_size: 最多读取的尾部字节数
    :return: 记录列表（最新在前）
    """
    if not path.exists():
        return []
    records = []
    for line in reversed(_read_tail(path, tail_size)):
        record = _parse_record(line)
        if record:
            records.append(record)
    return records


def list_sites() -> List[Dict[str, Any]]:
    """
    概览所有站点日志，读取每个站点文件的最新汇总与最近活动时间
    :return: 站点概览列表，按最近活动时间倒序
    """
    base_dir = get_base_dir()
    if not base_dir.exists():
        return []
    sites = []
    for path in base_dir.glob("*.log"):
        records = _iter_records(path)
        if not records:
            continue
        summary = next((r for r in records if r.get("type") == "summary"), None)
        site_name = next(
            (r.get("site") for r in records if r.get("site")), path.stem
        )
        last_time = next((r.get("time") for r in records if r.get("time")), None)
        sites.append({
            "site": site_name,
            "domain": path.stem,
            "size": path.stat().st_size,
            "mtime": int(path.stat().st_mtime),
            "last_time": last_time,
            "summary": summary,
        })
    sites.sort(key=lambda x: x["mtime"], reverse=True)
    return sites


def read_site_records(domain: str, limit: int = 200,
                      level: str = "all") -> List[Dict[str, Any]]:
    """
    读取站点日志记录，最新在前；domain 为 all 时合并所有站点
    :param domain: 站点域名，all 表示全部站点
    :param limit: 返回的最大记录数
    :param level: 过滤级别 all/ok/word/fail
    :return: 记录列表
    """
    base_dir = get_base_dir()
    if domain == "all":
        paths = list(base_dir.glob("*.log")) if base_dir.exists() else []
        records: List[Dict[str, Any]] = []
        for path in paths:
            records.extend(_iter_records(path))
        records.sort(key=lambda r: r.get("time") or "", reverse=True)
    else:
        if not _sanitize_domain(domain):
            return []
        records = _iter_records(base_dir / f"{domain}.log")
    result = []
    for record in records:
        rtype = record.get("type")
        if level == "all":
            if rtype not in ("torrent", "summary", "event"):
                continue
        elif rtype != "torrent":
            continue
        elif level == "ok" and record.get("status") != "ok":
            continue
        elif level == "fail" and record.get("status") != "fail":
            continue
        elif level == "word" and not record.get("adjusted"):
            continue
        result.append(record)
        if len(result) >= max(limit, 1):
            break
    return result
