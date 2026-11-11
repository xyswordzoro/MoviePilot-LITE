import re
from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse

from app import schemas
from app.core.security import verify_token
from app.helper import site_log

router = APIRouter()

# 合法域名格式，防止路径穿越
_DOMAIN_PATTERN = re.compile(r"^[A-Za-z0-9_.-]{1,255}$")

# 站点日志独立页面文件路径
_SITE_LOG_PAGE = Path(__file__).resolve().parents[2] / "assets" / "site_log.html"


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
