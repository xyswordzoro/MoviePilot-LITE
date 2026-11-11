# 站点日志

站点日志是独立于实时日志的种子识别记录系统：RSS/爬虫刷新每个站点时，把种子的识别结果
（原始种子名、识别后的媒体名、状态）与每轮汇总按站点落盘，供前端弹窗按站点分类查看。

## 使用入口

- 主界面右上角工具栏的「站点日志」图标（RSS 图标，位于「词表」与「日志」之间），
  打开方式与「实时日志」弹窗一致。
- 独立页面：`/api/v1/site_log/page`，可直接在浏览器打开；支持 `?token=<API_TOKEN>`
  或登录后使用。

## 页面功能

- 顶部横向列出全部站点（按最近活动倒序），红色徽标为该站点未识别数量，点击切换站点。
- 每条种子固定两行：第一行原始种子名，第二行识别后的媒体名、年份与 TMDB/豆瓣/BG 编号、
  状态标签（识别成功 / 未识别 / 识别词调整），时间与站点名后置显示。
- 轮次汇总仅在「新种子」大于 0 时显示；筛选（全部 / 未识别 / 识别词调整）、关键字搜索、
  每页 100 条分页、15 秒自动刷新。

## 数据落盘

站点日志以 JSONL 格式写在配置目录 `logs/rss/<域名>.log`，每行一条记录：

- `type=torrent`：种子识别结果（`raw` 原始种子名、`title` 识别后的媒体名、
  `status` ok/fail、`adjusted` 识别词是否调整过名称、`tmdb_id`/`douban_id`/`bangumi_id` 等）。
- `type=summary`：一轮站点刷新汇总（抓取数、新种子数、识别成功/失败数、耗时）。
- `type=event`：处理过程事件（如 RSS 获取失败），`level=error`。

单文件超过 10MB 自动轮转保留最新尾部；域名仅允许字母、数字、点、下划线、连字符。

## API

均需登录令牌（Bearer JWT 或 `?token=<API_TOKEN>`）：

| 接口 | 说明 |
| --- | --- |
| `GET /api/v1/site_log/sites` | 站点概览列表：站点名、域名、文件大小、最近活动时间与最新一条汇总 |
| `GET /api/v1/site_log/{domain}/records?limit=&level=` | 站点识别记录，最新在前；`domain=all` 合并全部站点；`level` 支持 `all/ok/word/fail` |
| `GET /api/v1/site_log/page` | 站点日志独立页面 |

## 清理

删除配置目录 `logs/rss/` 下的对应文件即可清除该站点历史记录，不影响主程序运行；
真实记录会在下一轮站点刷新时自动重新产生。

## 实现

- 后端：`app/helper/site_log.py`（contextvars 站点上下文 + JSONL 读写），
  由 `app/chain/torrents.py` 的 `refresh()` 站点循环写入，RSS 与爬虫模式均覆盖。
- 接口：`app/api/endpoints/site_log.py`。
- 前端：弹窗 `SiteLogDialog.vue`（iframe 内嵌独立页面），注册于 `useShortcutTools.ts` 固定捷径。
