from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Annotated, Tuple

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session

from app import schemas
from app.chain.dashboard import DashboardChain
from app.chain.media import MediaChain
from app.chain.storage import StorageChain
from app.chain.tmdb import TmdbChain
from app.core.config import settings
from app.core.security import verify_apitoken
from app.db import get_async_db, get_db
from app.db.models.subscribe import Subscribe
from app.db.models.transferhistory import TransferHistory
from app.db.models.user import User
from app.db.user_oper import get_current_active_superuser, get_current_active_user_async
from app.helper.directory import DirectoryHelper
from app.log import logger
from app.scheduler import Scheduler
from app.schemas.types import MediaType
from app.utils.system import SystemUtils

router = APIRouter()

# 今日更新结果缓存，避免仪表板频繁刷新时重复查询订阅与 TMDB
_TODAY_UPDATE_CACHE: Dict[str, Any] = {"key": "", "expires": 0.0, "payload": None}
_TODAY_UPDATE_CACHE_SECONDS = 300


def _build_statistic(db: Session, name: Optional[str] = None) -> schemas.Statistic:
    """
    构建媒体数量统计信息。
    """
    media_statistics: Optional[List[schemas.Statistic]] = (
        DashboardChain().media_statistic(name)
    )
    if media_statistics:
        # 汇总各媒体库统计信息
        ret_statistic = schemas.Statistic()
        has_episode_count = False
        for media_statistic in media_statistics:
            ret_statistic.movie_count += media_statistic.movie_count or 0
            ret_statistic.tv_count += media_statistic.tv_count or 0
            ret_statistic.user_count += media_statistic.user_count or 0
            if media_statistic.episode_count is not None:
                ret_statistic.episode_count += media_statistic.episode_count or 0
                has_episode_count = True
        if not has_episode_count:
            # 所有媒体服务都未提供剧集统计时，返回 None 供前端展示“未获取”。
            ret_statistic.episode_count = None
    else:
        ret_statistic = schemas.Statistic()

    movie_count_month, tv_count_month, episode_count_month = TransferHistory.monthly_media_statistics(db)
    ret_statistic.movie_count_month = movie_count_month
    ret_statistic.tv_count_month = tv_count_month
    ret_statistic.episode_count_month = episode_count_month
    return ret_statistic


def _build_storage() -> schemas.Storage:
    """
    构建本地存储空间信息。
    """
    total, available = 0, 0
    dirs = DirectoryHelper().get_dirs()
    if not dirs:
        return schemas.Storage(total_storage=total, used_storage=total - available)
    storages = set([d.library_storage for d in dirs if d.library_storage])
    for _storage in storages:
        _usage = StorageChain().storage_usage(_storage)
        if _usage:
            total += _usage.total
            available += _usage.available
    return schemas.Storage(total_storage=total, used_storage=total - available)


def _build_downloader(name: Optional[str] = None) -> schemas.DownloaderInfo:
    """
    构建下载器统计信息。
    """
    # 下载目录空间
    download_dirs = DirectoryHelper().get_local_download_dirs()
    _, free_space = SystemUtils.space_usage(
        [Path(d.download_path) for d in download_dirs],
        btrfs_fsid_dedup=settings.BTRFS_FSID_DEDUP,
    )
    # 下载器信息
    downloader_info = schemas.DownloaderInfo()
    transfer_infos = DashboardChain().downloader_info(name)
    if transfer_infos:
        for transfer_info in transfer_infos:
            downloader_info.download_speed += transfer_info.download_speed
            downloader_info.upload_speed += transfer_info.upload_speed
            downloader_info.download_size += transfer_info.download_size
            downloader_info.upload_size += transfer_info.upload_size
        downloader_info.free_space = free_space
    return downloader_info


@router.get("/statistic", summary="媒体数量统计", response_model=schemas.Statistic)
def statistic(
    name: Optional[str] = None,
    db: Session = Depends(get_db),
    _: Any = Depends(get_current_active_superuser),
) -> Any:
    """
    查询媒体数量统计信息
    """
    return _build_statistic(db, name)


@router.get(
    "/statistic2", summary="媒体数量统计（API_TOKEN）", response_model=schemas.Statistic
)
def statistic2(
    _: Annotated[str, Depends(verify_apitoken)],
    db: Session = Depends(get_db),
) -> Any:
    """
    查询媒体数量统计信息 API_TOKEN认证（?token=xxx）
    """
    return _build_statistic(db)


@router.get("/storage", summary="本地存储空间", response_model=schemas.Storage)
def storage(_: Any = Depends(get_current_active_superuser)) -> Any:
    """
    查询本地存储空间信息
    """
    return _build_storage()


@router.get(
    "/storage2", summary="本地存储空间（API_TOKEN）", response_model=schemas.Storage
)
def storage2(_: Annotated[str, Depends(verify_apitoken)]) -> Any:
    """
    查询本地存储空间信息 API_TOKEN认证（?token=xxx）
    """
    return _build_storage()


@router.get("/processes", summary="进程信息", response_model=List[schemas.ProcessInfo])
def processes(_: Any = Depends(get_current_active_superuser)) -> Any:
    """
    查询进程信息
    """
    return SystemUtils.processes()


@router.get("/system", summary="系统摘要信息", response_model=schemas.DashboardSystemInfo)
def system_info(_: Any = Depends(get_current_active_superuser)) -> Any:
    """
    查询仪表板系统摘要信息
    """
    return SystemUtils.dashboard_system_info()


@router.get("/downloader", summary="下载器信息", response_model=schemas.DownloaderInfo)
def downloader(
    name: Optional[str] = None, _: Any = Depends(get_current_active_superuser)
) -> Any:
    """
    查询下载器信息
    """
    return _build_downloader(name)


@router.get(
    "/downloader2",
    summary="下载器信息（API_TOKEN）",
    response_model=schemas.DownloaderInfo,
)
def downloader2(_: Annotated[str, Depends(verify_apitoken)]) -> Any:
    """
    查询下载器信息 API_TOKEN认证（?token=xxx）
    """
    return _build_downloader()


@router.get("/schedule", summary="后台服务", response_model=List[schemas.ScheduleInfo])
async def schedule(_: Any = Depends(get_current_active_superuser)) -> Any:
    """
    查询后台服务信息
    """
    return Scheduler().list()


@router.get(
    "/schedule/{job_id}/progress",
    summary="后台服务进度",
    response_model=schemas.Response,
)
async def schedule_progress(
    job_id: str, _: Any = Depends(get_current_active_superuser)
) -> Any:
    """
    查询指定后台服务的执行进度。
    """
    progress = Scheduler().get_progress(job_id)
    if not progress:
        return schemas.Response(success=False, message="后台服务不存在")
    return schemas.Response(success=True, data=progress.model_dump())


@router.get(
    "/schedule2",
    summary="后台服务（API_TOKEN）",
    response_model=List[schemas.ScheduleInfo],
)
async def schedule2(_: Annotated[str, Depends(verify_apitoken)]) -> Any:
    """
    查询下载器信息 API_TOKEN认证（?token=xxx）
    """
    return Scheduler().list()


@router.get(
    "/schedule2/{job_id}/progress",
    summary="后台服务进度（API_TOKEN）",
    response_model=schemas.Response,
)
async def schedule_progress2(
    job_id: str, _: Annotated[str, Depends(verify_apitoken)]
) -> Any:
    """
    查询指定后台服务的执行进度 API_TOKEN认证（?token=xxx）
    """
    progress = Scheduler().get_progress(job_id)
    if not progress:
        return schemas.Response(success=False, message="后台服务不存在")
    return schemas.Response(success=True, data=progress.model_dump())


@router.get("/transfer", summary="文件整理统计", response_model=List[int])
async def transfer(
    days: Optional[int] = 7,
    db: Session = Depends(get_db),
    _: Any = Depends(get_current_active_superuser),
) -> Any:
    """
    查询文件整理统计信息
    """
    transfer_stat = await TransferHistory.async_statistic(db, days)
    return [stat[1] for stat in transfer_stat]


@router.get("/cpu", summary="获取当前CPU使用率", response_model=float)
def cpu(_: Any = Depends(get_current_active_superuser)) -> Any:
    """
    获取当前CPU使用率
    """
    return SystemUtils.cpu_usage()


@router.get("/cpu2", summary="获取当前CPU使用率（API_TOKEN）", response_model=float)
def cpu2(_: Annotated[str, Depends(verify_apitoken)]) -> Any:
    """
    获取当前CPU使用率 API_TOKEN认证（?token=xxx）
    """
    return SystemUtils.cpu_usage()


@router.get(
    "/memory",
    summary="获取当前应用与系统内存信息",
    response_model=schemas.DashboardMemoryInfo,
)
def memory(_: Any = Depends(get_current_active_superuser)) -> Any:
    """
    获取当前应用与系统内存信息
    """
    return SystemUtils.memory_usage()


@router.get(
    "/memory2",
    summary="获取当前应用与系统内存信息（API_TOKEN）",
    response_model=schemas.DashboardMemoryInfo,
)
def memory2(_: Annotated[str, Depends(verify_apitoken)]) -> Any:
    """
    获取当前应用与系统内存信息 API_TOKEN认证（?token=xxx）
    """
    return SystemUtils.memory_usage()


@router.get("/network", summary="获取当前网络流量", response_model=List[int])
def network(_: Any = Depends(get_current_active_superuser)) -> Any:
    """
    获取当前网络流量（上行和下行流量，单位：bytes/s）
    """
    return SystemUtils.network_usage()


@router.get(
    "/network2", summary="获取当前网络流量（API_TOKEN）", response_model=List[int]
)
def network2(_: Annotated[str, Depends(verify_apitoken)]) -> Any:
    """
    获取当前网络流量 API_TOKEN认证（?token=xxx）
    """
    return SystemUtils.network_usage()


def _format_episode_subtitle(episodes: List[int]) -> str:
    """
    将集号列表格式化为“第1集”“第1-3集”“第1,3集”形式。
    """
    numbers = sorted({number for number in episodes if number and number > 0})
    if not numbers:
        return ""
    if numbers == list(range(numbers[0], numbers[-1] + 1)):
        if numbers[0] == numbers[-1]:
            return f"第{numbers[0]}集"
        return f"第{numbers[0]}-{numbers[-1]}集"
    return "第" + ",".join(str(number) for number in numbers) + "集"


def _library_episode_numbers(subscribe: Subscribe) -> List[int]:
    """
    获取订阅已入库的具体集号，规则与订阅日历保持一致：
    洗版订阅看 episode_priority 中优先级为 100 的集，普通订阅看 note。
    """
    if subscribe.best_version in (True, 1, "1"):
        priorities = subscribe.episode_priority or {}
        return sorted(
            int(episode)
            for episode, priority in priorities.items()
            if str(episode).lstrip("-").isdigit() and priority == 100
        )
    note = subscribe.note or []
    if isinstance(note, list):
        return sorted(
            int(episode) for episode in note if str(episode).lstrip("-").isdigit()
        )
    return []


def _library_state(subscribe: Subscribe, episode_numbers: List[int]) -> Tuple[str, int]:
    """
    计算指定集号的入库状态：complete（全部已入库）、partial（部分入库）、none。
    """
    total_episode = subscribe.total_episode or 0
    numbers = [number for number in episode_numbers if number and number > 0]
    if not total_episode or not numbers:
        return "none", 0
    lack_episode = subscribe.lack_episode
    library_episode = total_episode - lack_episode if isinstance(lack_episode, int) else 0
    library_episode = max(0, min(int(library_episode), total_episode))
    if not library_episode:
        return "none", library_episode
    library_numbers = _library_episode_numbers(subscribe)
    matched = (
        len([number for number in numbers if number in library_numbers])
        if library_numbers
        else len([number for number in numbers if number <= library_episode])
    )
    if not matched:
        return "none", library_episode
    return ("complete" if matched == len(numbers) else "partial"), library_episode


async def _collect_today_updates(
    subscribes: List[Subscribe], target_date: str
) -> Tuple[List[dict], int]:
    """
    汇总订阅在指定日期播出的内容，与订阅日历保持一致。
    """
    items: List[dict] = []
    episode_count = 0
    for subscribe in subscribes or []:
        if not subscribe.name:
            continue
        try:
            if subscribe.type == MediaType.MOVIE.value:
                if not subscribe.tmdbid:
                    continue
                mediainfo = await MediaChain().async_recognize_media(
                    mtype=MediaType.MOVIE, tmdbid=subscribe.tmdbid
                )
                if not mediainfo or (mediainfo.release_date or "") != target_date:
                    continue
                episode_count += 1
                items.append(
                    {
                        "id": subscribe.id,
                        "title": subscribe.name,
                        "type": subscribe.type,
                        "season": None,
                        "year": subscribe.year,
                        "tmdbid": subscribe.tmdbid,
                        "image": subscribe.poster or mediainfo.get_poster_image(),
                        "episodes": [],
                        "subtitle": "今日上映",
                        "library_state": "none",
                        "in_library": False,
                        "library_episode": 0,
                        "total_episode": 0,
                    }
                )
                continue
            if not subscribe.tmdbid:
                continue
            episodes = await TmdbChain().async_tmdb_episodes(
                tmdbid=subscribe.tmdbid,
                season=subscribe.season or 1,
                episode_group=subscribe.episode_group,
            )
            today_episodes = [
                episode
                for episode in episodes or []
                if (episode.air_date or "") == target_date
            ]
            if not today_episodes:
                continue
            numbers = sorted(
                {
                    episode.episode_number
                    for episode in today_episodes
                    if episode.episode_number
                }
            )
            episode_count += len(today_episodes)
            library_state, library_episode = _library_state(subscribe, numbers)
            items.append(
                {
                    "id": subscribe.id,
                    "title": subscribe.name,
                    "type": subscribe.type,
                    "season": subscribe.season,
                    "year": subscribe.year,
                    "tmdbid": subscribe.tmdbid,
                    "image": subscribe.poster or "",
                    "episodes": numbers,
                    "subtitle": _format_episode_subtitle(numbers),
                    "library_state": library_state,
                    "in_library": library_state == "complete",
                    "library_episode": library_episode,
                    "total_episode": subscribe.total_episode or 0,
                }
            )
        except Exception as err:
            logger.warning(f"查询订阅 {subscribe.name} 的今日更新失败：{err}")
    items.sort(key=lambda item: item.get("title") or "")
    return items, episode_count


@router.get("/today", summary="今日订阅更新")
async def today_updates(
    date: Optional[str] = None,
    refresh: Optional[bool] = False,
    db: AsyncSession = Depends(get_async_db),
    current_user: User = Depends(get_current_active_user_async),
) -> Any:
    """
    查询订阅在今天更新的内容（对接订阅日历）。
    """
    target_date = (date or "").strip() or datetime.now().strftime("%Y-%m-%d")
    try:
        datetime.strptime(target_date, "%Y-%m-%d")
    except ValueError:
        target_date = datetime.now().strftime("%Y-%m-%d")

    now = datetime.now().timestamp()
    if (
        not refresh
        and _TODAY_UPDATE_CACHE.get("key") == target_date
        and _TODAY_UPDATE_CACHE.get("expires", 0) > now
    ):
        return _TODAY_UPDATE_CACHE["payload"]

    if current_user.is_superuser:
        subscribes = await Subscribe.async_list(db)
    else:
        subscribes = await Subscribe.async_list_by_username(db, current_user.name)
    items, episode_count = await _collect_today_updates(subscribes, target_date)
    payload = {
        "date": target_date,
        "episode_count": episode_count,
        "items": items,
    }
    _TODAY_UPDATE_CACHE.update(
        {
            "key": target_date,
            "expires": now + _TODAY_UPDATE_CACHE_SECONDS,
            "payload": payload,
        }
    )
    return payload
