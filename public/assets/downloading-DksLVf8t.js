import { b as importShared, __mp_tla as __mp_tla_0 } from "./date-DPWQ58yb.js";

let DownloadingPage;

let __mp_tla = Promise.all([
  (() => { try { return __mp_tla_0; } catch (e) { return undefined; } })(),
]).then(async () => {
  const { defineComponent, createElementVNode } = await importShared("vue");

  // 下载管理页改为嵌入后端独立页面，状态分栏、筛选、详情与批量操作都由页面自身实现。
  // 下载历史入口已移除：相关记录统一在「媒体整理」中查看。
  DownloadingPage = defineComponent({
    name: "DownloadingPage",
    setup() {
      return () =>
        createElementVNode("iframe", {
          src: "/api/v1/download/page?embed=1",
          title: "下载管理",
          style: "display:block;width:100%;border:0;height:calc(100vh - 152px);min-height:420px",
        });
    },
  });
});

export { DownloadingPage as default, __mp_tla };
