"""Local backend launcher for MoviePilot-Lite.

只负责确定配置目录并启动后端；AUTH_SITE / IYUU_SIGN / API_TOKEN / PROXY_HOST
等变量由 app.env 提供，启动时由 app.utils.system.SystemUtils.load_env_file() 载入。
"""

import os
import runpy
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
DEFAULT_CONFIG_DIRS = [
    Path.home() / ".config" / "moviepilot-upstream-v2",
    REPO / "config",
]


def resolve_config_dir() -> Path:
    """确定配置目录：环境变量 > 默认目录 > 仓库 config。"""
    env_dir = os.getenv("CONFIG_DIR") or os.getenv("MOVIEPILOT_CONFIG_DIR")
    if env_dir:
        return Path(env_dir)
    for candidate in DEFAULT_CONFIG_DIRS:
        if candidate.is_dir():
            return candidate
    return REPO / "config"


def main() -> None:
    config_dir = resolve_config_dir()
    config_dir.mkdir(parents=True, exist_ok=True)
    os.environ.setdefault("CONFIG_DIR", str(config_dir))
    os.chdir(REPO)
    sys.path.insert(0, str(REPO))
    print(f"[start-lite] CONFIG_DIR={os.environ['CONFIG_DIR']}")
    print(f"[start-lite] backend = {REPO}")
    runpy.run_module("app.main", run_name="__main__")


if __name__ == "__main__":
    main()
