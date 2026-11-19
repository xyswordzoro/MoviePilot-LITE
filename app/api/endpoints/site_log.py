import re
from pathlib import Path
from typing import List

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.responses import FileResponse

from app import schemas
from app.core.security import verify_token
from app.db.systemconfig_oper import SystemConfigOper
from app.helper import site_log
from app.helper.sites import SitesHelper
from app.log import logger
from app.schemas.types import SystemConfigKey

router = APIRouter()

# 合法域名格式，防止路径穿越
_DOMAIN_PATTERN = re.compile(r"^[A-Za-z0-9_.-]{1,255}$")

# 站点日志独立页面文件路径
_SITE_LOG_PAGE = Path(__file__).resolve().parents[2] / "assets" / "site_log.html"


def _get_rss_disabled_ids() -> List[int]:
    """
    读取已关闭 RSS 的站点 ID 列表。
    """
    try:
        return [int(item) for item in (SystemConfigOper().get(SystemConfigKey.RSSDisabledSites) or [])]
    except Exception as err:
        logger.warn(f"读取站点 RSS 开关配置失败：{err}")
        return []


def _set_rss_disabled_ids(disabled_ids: List[int]) -> None:
    """
    保存已关闭 RSS 的站点 ID 列表。
    """
    SystemConfigOper().set(SystemConfigKey.RSSDisabledSites, disabled_ids)


@router.get("/sites", summary="站点日志站点概览", response_model=List[dict])
def list_site_logs(_: schemas.TokenPayload = Depends(verify_token)):
    """
    获取所有站点日志概览
    :return: 站点列表，含最新汇总与最近活动时间，按最近活动倒序
    """
    return site_log.list_sites()


@router.get("/page", summary="站点日志页面", include_in_schema=False)
def site_log_page():
    """
    返回站点日志独立页面
    """
    return FileResponse(_SITE_LOG_PAGE, media_type="text/html")


@router.get("/{domain}/records", summary="站点种子识别记录", response_model=List[dict])
def read_site_log_records(domain: str, limit: int = 200, level: str = "all",
                          _: schemas.TokenPayload = Depends(verify_token)):
    """
    获取站点种子识别记录，最新在前
    :param domain: 站点域名，all 表示合并全部站点
    :param limit: 最大返回条数
    :param level: 过滤级别 all/ok/word/fail
    :return: 记录列表
    """
    if domain != "all" and not _DOMAIN_PATTERN.fullmatch(domain):
        raise HTTPException(status_code=404, detail="Not Found")
    return site_log.read_site_records(domain, limit=limit, level=level)


@router.get("/rss_sites", summary="站点 RSS 开关列表", response_model=List[dict])
def list_rss_sites(_: schemas.TokenPayload = Depends(verify_token)):
    """
    获取全部站点及 RSS 开关状态（enabled=True 表示参与 RSS 刷新）
    """
    disabled_ids = set(_get_rss_disabled_ids())
    sites = []
    for indexer in SitesHelper().get_indexers():
        sites.append({
            "id": indexer.get("id"),
            "name": indexer.get("name"),
            "icon": indexer.get("icon"),
            "domain": indexer.get("domain"),
            "has_rss": bool(indexer.get("rss")),
            "enabled": indexer.get("id") not in disabled_ids,
        })
    return sites


@router.put("/rss_sites", summary="设置站点 RSS 开关", response_model=schemas.Response)
def set_rss_sites(payload: dict = Body(...),
                  _: schemas.TokenPayload = Depends(verify_token)):
    """
    保存已关闭 RSS 的站点 ID 列表
    :param payload: {"disabled_ids": [站点ID, ...]}
    """
    disabled_ids = payload.get("disabled_ids")
    if not isinstance(disabled_ids, list):
        return schemas.Response(success=False, message="参数格式错误")
    try:
        clean_ids = sorted({int(item) for item in disabled_ids})
    except (TypeError, ValueError):
        return schemas.Response(success=False, message="站点 ID 必须为数字")
    _set_rss_disabled_ids(clean_ids)
    return schemas.Response(success=True)
