"""下载接口参数透传测试：状态/标签范围/删除范围应原样交给 chain。"""
from unittest.mock import patch

from app.api.endpoints import download as download_endpoint
from app import schemas


def test_list_endpoint_forwards_query_params():
    """查询接口应把 status 与 include_all_tags 透传给 chain。"""
    with patch.object(download_endpoint, "DownloadChain") as chain_cls:
        chain_cls.return_value.downloading.return_value = []

        result = download_endpoint.current(
            name="qb-main",
            status="all",
            include_all_tags=True,
            _=schemas.TokenPayload(),
        )

        assert result == []
        chain_cls.return_value.downloading.assert_called_once_with(
            "qb-main", status="all", include_all_tags=True
        )


def test_list_endpoint_keeps_defaults():
    """不传参数时应保持原有默认行为。"""
    with patch.object(download_endpoint, "DownloadChain") as chain_cls:
        chain_cls.return_value.downloading.return_value = []

        download_endpoint.current(_=schemas.TokenPayload())

        chain_cls.return_value.downloading.assert_called_once_with(
            None, status=None, include_all_tags=False
        )


def test_delete_endpoint_forwards_delete_file():
    """删除接口应透传 delete_file，允许调用方只移除任务。"""
    with patch.object(download_endpoint, "DownloadChain") as chain_cls:
        chain_cls.return_value.remove_downloading.return_value = True

        response = download_endpoint.delete(
            "hash-1",
            name="qb-main",
            delete_file=False,
            _=schemas.TokenPayload(),
        )

        assert response.success is True
        chain_cls.return_value.remove_downloading.assert_called_once_with(
            "hash-1", name="qb-main", delete_file=False
        )
