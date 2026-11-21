# MoviePilot-Lite

[![Docker Image](https://img.shields.io/badge/ghcr.io-moviepilot--lite-blue?style=for-the-badge&logo=github)](https://github.com/xyswordzoro/MoviePilot-LITE/pkgs/container/moviepilot-lite)
[![License](https://img.shields.io/github/license/xyswordzoro/MoviePilot-LITE?style=for-the-badge)](LICENSE)

简体中文 | 基于 [MoviePilot](https://github.com/jxxghp/MoviePilot) v2 的精简定制版。

聚焦订阅、搜索、下载、整理、刮削、媒体库刷新与消息通知等核心流程，移除 AI Agent / LLM 子系统与分享上报；并针对高频使用场景重做了搜索结果、站点管理、订阅日历、媒体整理和侧栏，加入站点日志、日志分类标签与今日更新等轻量增强。

> 仅用于学习交流使用，请勿在任何国内平台宣传该项目。

## 界面预览

| | |
| --- | --- |
| ![仪表盘](docs/screenshots/dashboard.jpg) | ![搜索结果](docs/screenshots/search.jpg) |
| **仪表盘**：媒体统计、今日更新、最新入库 | **搜索结果**：中文标题优先，紧凑卡片与高密度列表可切换 |
| ![电视剧订阅](docs/screenshots/subscribe.jpg) | ![站点管理](docs/screenshots/site.jpg) |
| **订阅分组**：按分类自动分组，进度与状态一目了然 | **站点管理**：站点状态、上传下载、分享率与顶部汇总 |
| ![站点日志](docs/screenshots/site-log.jpg) | ![实时日志](docs/screenshots/logging.jpg) |
| **站点日志**：按站点记录 RSS 刷新与识别明细 | **实时日志**：紧凑三列、级别与分类筛选、跨天分隔 |
| ![订阅日历](docs/screenshots/calendar.jpg) | ![媒体整理](docs/screenshots/history.jpg) |
| **订阅日历**：月 / 周视图、分类筛选、今日更新与本周待播 | **媒体整理**：剧集封面卡片，站点图标、转移详情一目了然 |

## 主要特性

- 前后端一体：后端 FastAPI，前端 Vue 3 + Vuetify，构建产物随仓库分发
- 订阅 / 搜索 / 下载 / 整理 / 刮削 / 媒体库刷新 / 消息通知完整保留
- 下载器、媒体服务器、元数据源、消息渠道、插件与工作流能力保持兼容
- **搜索结果页**：中文标题优先，紧凑卡片与高密度表格一键切换；支持排序、仅免费、分辨率等筛选
- **站点管理**：状态徽章、上传/下载进度、分享率卡片化展示，顶部汇总与快捷新增/导入
- **媒体整理**：卡片式布局带剧集封面，站点图标、转移方式、源/目标路径一目了然；选择模式支持批量整理/删除
- **订阅日历**：月 / 周视图与本月总集数 / 已入库 / 待入库汇总；支持电影 / 电视剧、仅未入库、隐藏过期与剧名筛选，右侧展示今日更新和本周待播
- **侧栏**：整体缩小约 10%，分组分割线，左下角单张今日海报（刷新轮换、每 30 分钟自动切换），支持透明度调节
- **站点日志**：按站点记录每次 RSS 刷新的种子名称与识别结果，支持站点切换、分页与自动刷新
- **日志分类标签**：下载 / 消息 / 刮削 / 整理 / 其他分类着色与筛选；订阅刷新、媒体库同步等明细降为 DEBUG
- **今日更新**：仪表盘卡片直接对接订阅日历，展示当天更新的剧集与集数，已入库条目显示绿点
- **LITE 轻量界面**：扁平化亮 / 暗色皮肤，细边卡片、紧凑顶栏，主题强调色全站跟随
- **登录页壁纸**：支持 Bing 每日壁纸（`WALLPAPER=bing`）、媒体服务器海报、TMDB 趋势与自定义接口
- **图片签名稳定**：资源签名密钥持久化，容器重启后图片代理 URL 不失效（登录会话密钥按安全设计不持久化，重启后需重新登录）

## 与上游的差异

**移除**

- AI Agent / LLM / MCP 全部代码与接口
- 推荐 / 探索模块及对应前端入口
- 订阅分享、热门分享、工作流分享，以及统计上报开关
- 玻璃主题入口（旧偏好自动回退浅色）

**新增**

- `app/helper/site_log.py` 与 `app/assets/site_log.html`：站点日志系统
- `GET /api/v1/dashboard/today`：今日更新数据（含入库状态）
- 搜索结果页重做：中文标题提取、紧凑卡片 / 表格视图、仅免费快捷筛选
- 站点管理改版：状态徽章、上传下载进度、分享率与顶部汇总
- 媒体整理卡片式改版：剧集封面卡片、站点图标、卡片/表格双视图与选择模式批量操作
- 订阅日历：月 / 周视图、分类与未入库筛选、今日 / 本周议程与移动端折叠时间线
- 侧栏增强：紧凑布局、分组分割线、单张今日海报（刷新/半小时轮换）与透明度设置
- 日志分类标签与筛选（下载 / 消息 / 刮削 / 整理 / 其他）
- 订阅列表媒体分类（动漫 / 电视剧）与分组卡片视图
- 仪表盘「今日更新」卡片与前端 LITE 皮肤
- RSS 日志静默范围与单行汇总（`RSS_LOG_ENABLE` 开关控制）
- `start-lite.cmd` / `scripts/start_lite.py`：本地启动脚本，固定配置目录并载入 `app.env`

## 快速开始

### Docker

```bash
docker run -d \
  --name moviepilot-lite \
  -p 3000:3000 \
  -p 3001:3001 \
  -v /path/to/config:/config \
  --restart unless-stopped \
  ghcr.io/xyswordzoro/moviepilot-lite:latest
```

首次启动后访问 `http://<ip>:3000`，默认账号 `admin`，密码见容器日志或通过 `SUPERUSER_PASSWORD` 指定。

站点认证等变量写入 `config/app.env`，启动时自动载入进程环境：

```ini
AUTH_SITE="iyuu"
IYUU_SIGN="your-iyuu-sign"
API_TOKEN="your-api-token"
PROXY_HOST=""   # 可选，按需填写代理地址
WALLPAPER="bing"   # 登录页壁纸：bing / mediaserver / tmdb / customize
```

### 本地运行

Windows：

```bat
venv\Scripts\python -m pip install -r requirements.in
start-lite.cmd
```

Linux / macOS：

```bash
venv/bin/python -m pip install -r requirements.in
./scripts/start-local.sh backend
```

本地启动脚本会固定 `CONFIG_DIR`（默认 `~/.config/moviepilot-upstream-v2`），避免误建空配置库。

## 构建镜像

```bash
docker build -f docker/Dockerfile -t moviepilot-lite:latest .
```

- 镜像构建优先使用仓库内置的 `public/`（LITE 前端产物），缺失时回退下载官方前端
- 推送 `main` 分支或手动触发 `MoviePilot-LITE Image` 工作流，会自动构建并推送到 `ghcr.io/<owner>/moviepilot-lite`

## 目录说明

| 目录 | 说明 |
| --- | --- |
| `app/` | 后端主程序（FastAPI） |
| `app/assets/site_log.html` | 站点日志独立页面 |
| `docs/screenshots/` | README 界面截图 |
| `public/` | 构建好的 LITE 前端产物 |
| `docker/` | Dockerfile 与容器启动脚本 |
| `scripts/` | 本地启动、站点适配采集等工具 |
| `tests/` | 后端单元测试 |

更多开发文档见 [docs/](docs/)：本地环境、测试、CLI、站点适配采集等。

## 相关项目

- [MoviePilot](https://github.com/jxxghp/MoviePilot)
- [MoviePilot-Frontend](https://github.com/jxxghp/MoviePilot-Frontend)
- [MoviePilot-Plugins](https://github.com/jxxghp/MoviePilot-Plugins)
- [MoviePilot-Resources](https://github.com/jxxghp/MoviePilot-Resources)

## 免责申明

- 本软件仅供学习交流使用，任何人不得将本软件用于商业用途，任何人不得将本软件用于违法犯罪活动，软件对用户行为不知情，一切责任由使用者承担。
- 本软件基于开源代码修改，因修改、分发、传播造成的责任由修改发布者承担，不建议对用户认证机制进行规避或修改并公开发布。
- 本项目不接受捐赠，软件本身不收费也不提供任何收费相关服务，请仔细辨别避免误导。

## License

[GPL-3.0](LICENSE)
