"""
构建期插件兼容补丁（LITE / 主版本）。

上游插件「动态封面工坊」(mediacovergenerator) 用
`importlib.util.find_spec("app.adapters.web.plugin.routes")` 探测新版匿名路由能力。
`app.adapters` 是 NEO 分支的模块，主版本不存在，find_spec 会抛 ModuleNotFoundError
而不是返回 None，导致插件的 get_api() 整体失败（插件 API 全部不注册）。

这里把该探测包上 try/except 兜底，使主版本退化为"不支持匿名路由"。
脚本幂等：已打过补丁或文件不存在时直接跳过。
"""
from pathlib import Path

TARGET = Path("/app/app/plugins/mediacovergenerator/__init__.py")

OLD = '        return importlib.util.find_spec("app.adapters.web.plugin.routes") is not None'
NEW = (
    "        try:\n"
    '            return importlib.util.find_spec("app.adapters.web.plugin.routes") is not None\n'
    "        except (ImportError, AttributeError, ValueError):\n"
    "            # 主版本无 app.adapters 包，退化为不支持匿名路由\n"
    "            return False"
)


def main() -> None:
    if not TARGET.exists():
        print(f"[patch_plugins] skip: {TARGET} 不存在")
        return
    source = TARGET.read_text(encoding="utf-8", errors="replace")
    if "app.adapters.web.plugin.routes" not in source:
        print("[patch_plugins] skip: 未发现 adapters 探测代码")
        return
    if "except (ImportError, AttributeError, ValueError):" in source:
        print("[patch_plugins] skip: 已打过补丁")
        return
    if OLD not in source:
        print("[patch_plugins] skip: 目标代码片段未匹配（上游可能已改）")
        return
    TARGET.write_text(source.replace(OLD, NEW, 1), encoding="utf-8")
    print("[patch_plugins] patched: mediacovergenerator 匿名路由探测已兜底")


if __name__ == "__main__":
    main()
