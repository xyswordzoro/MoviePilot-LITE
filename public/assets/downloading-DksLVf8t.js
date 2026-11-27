import { b as importShared, __mp_tla as __mp_tla_0 } from "./date-DPWQ58yb.js";

const CSS = `.mp-dl{
  & { color-scheme: light dark; --r: 14px; }
  * { box-sizing: border-box; }
  .app { max-width: 1180px; margin: 0 auto; padding: 14px 14px 60px; }

  /* ---------- 顶栏：标题 + 状态胶囊 + 统计（一层） ---------- */
  .topbar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding-bottom: 8px; }
  .title { font-size: 16px; font-weight: 600; margin-right: 2px; }
  .spacer { flex: 1; }
  .hint { font-size: 12px; color: light-dark(#8a8f99, #98a0ab); }
  .stats { display: flex; align-items: center; gap: 12px; font-size: 12px; color: light-dark(#8a8f99, #98a0ab); white-space: nowrap; }
  .stats b { font-weight: 600; color: light-dark(#26282e, #e7e8eb); }
  .switch { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; cursor: pointer; user-select: none; }
  .switch input { accent-color: #7c5cff; }

  /* ---------- 状态标签（胶囊，与标题同层） ---------- */
  .tabs { display: flex; gap: 2px; flex-wrap: wrap; }
  .tab {
    border: none; background: transparent; cursor: pointer; padding: 4px 9px; font-size: 12.5px;
    color: light-dark(#6b7280, #98a0ab); border-radius: 8px; font-family: inherit;
  }
  .tab b { font-weight: 600; margin-left: 3px; font-size: 11.5px; opacity: .7; }
  .tab.on { color: light-dark(#5b3fd6, #c4b5ff); background: light-dark(#efeaff, #2b2445); font-weight: 600; }

  /* ---------- 工具条（仅批量模式出现） ---------- */
  .toolbar { display: none; gap: 8px; align-items: center; flex-wrap: wrap; padding: 0 0 10px; }
  &.batch .toolbar { display: flex; }
  .cnt { font-size: 12px; color: light-dark(#6b7280, #98a0ab); }
  .search {
    display: flex; align-items: center; gap: 6px; flex: 0 1 200px; max-width: 200px; min-width: 120px;
    border: 1px solid light-dark(#e3e5ea, #33363f); border-radius: 999px; padding: 5px 10px;
  }
  .search input { border: 0; outline: none; background: transparent; flex: 1; font: inherit; font-size: 12.5px; color: inherit; min-width: 0; }
  select, .btn {
    border: 1px solid light-dark(#e3e5ea, #33363f); background: light-dark(#fff, #1c1e24);
    color: inherit; border-radius: 10px; padding: 6px 10px; font: inherit; font-size: 13px; cursor: pointer;
  }
  .btn.primary { background: #7c5cff; border-color: #7c5cff; color: #fff; }
  .btn.danger { color: #dd4b4b; border-color: light-dark(#f3d6d6, #4a2b2b); }
  .btn:disabled { opacity: .5; cursor: default; }
  .btn.icon { padding: 5px 9px; font-size: 15px; line-height: 1; letter-spacing: 1px; }

  /* ---------- 更多菜单 ---------- */
  .menu-wrap { position: relative; }
  .menu {
    position: absolute; right: 0; top: calc(100% + 6px); z-index: 20; width: 246px; display: none;
    background: light-dark(#fff, #1c1e24); border: 1px solid light-dark(#e3e5ea, #33363f);
    border-radius: 12px; padding: 8px 10px 10px; box-shadow: 0 12px 32px rgba(0, 0, 0, .14);
  }
  .menu.on { display: block; }
  .menu .row { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 5px 0; font-size: 12.5px; }
  .menu .row .lbl { color: light-dark(#6b7280, #98a0ab); flex: none; }
  .menu .row select { flex: 1; min-width: 0; padding: 4px 6px; font-size: 12.5px; }
  .menu hr { border: 0; border-top: 1px solid light-dark(#eef0f5, #2a2d35); margin: 7px 0; }
  .menu .full { width: 100%; margin-top: 2px; }
  .menu .foot { font-size: 11.5px; color: light-dark(#9aa1ae, #7c828d); text-align: right; padding-top: 8px; }

  /* ---------- 分组 / 卡片 ---------- */
  .group { margin-top: 4px; }
  .grouphead { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin: 0 0 8px; }
  .grouphead .nm { font-weight: 600; }
  .pill {
    font-size: 11px; padding: 2px 8px; border-radius: 999px;
    background: light-dark(#eef7ee, #1e2f24); color: light-dark(#2f7d32, #7fd08a);
  }
  .pill.muted { background: light-dark(#f1f2f6, #23262d); color: light-dark(#6b7280, #98a0ab); }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 10px; }

  .card {
    position: relative; display: flex; gap: 10px; padding: 10px; border-radius: var(--r); cursor: pointer;
    background: light-dark(#fff, #1a1c22); border: 1px solid light-dark(#e6e8ee, #2a2d35);
    transition: border-color .15s, transform .15s;
  }
  .card:hover { border-color: #cfc6ff; transform: translateY(-1px); }
  .card.sel { border-color: #7c5cff; background: light-dark(#fbf9ff, #211d33); }
  .poster {
    width: 82px; min-width: 82px; height: 110px; border-radius: 10px; overflow: hidden; position: relative;
    background: linear-gradient(160deg, #8b5cf6, #ec4899); display: flex; align-items: flex-end;
  }
  .poster img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
  .poster span {
    position: relative; width: 100%; padding: 5px 6px; font-size: 11px; font-weight: 600; color: #fff;
    text-shadow: 0 1px 6px rgba(0,0,0,.5); background: linear-gradient(transparent, rgba(0,0,0,.55));
  }
  .body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
  .l1 { display: flex; align-items: baseline; gap: 6px; min-width: 0; }
  .l1 b { font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .l1 .m { font-size: 12px; color: light-dark(#8a8f99, #98a0ab); white-space: nowrap; }
  .raw { font-size: 12px; color: light-dark(#9aa1ae, #7c828d); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .badges { display: flex; gap: 4px; flex-wrap: wrap; }
  .badge {
    font-size: 11px; padding: 1px 6px; border-radius: 6px; white-space: nowrap;
    background: light-dark(#f4f5f9, #23262d); color: light-dark(#4b5160, #b9bec8);
  }
  .badge.site { background: light-dark(#eef4ff, #1c2a44); color: light-dark(#2f62c9, #8ab4ff); }
  .badge.dl { background: light-dark(#f6f1ff, #2a2340); color: light-dark(#6a45cf, #b9a4ff); }
  .st { display: flex; align-items: center; gap: 6px; font-size: 12px; color: light-dark(#6b7280, #98a0ab); min-width: 0; }
  .st .txt { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dot { width: 6px; height: 6px; border-radius: 50%; flex: none; background: #9aa1ae; }
  .dot.downloading { background: #3b82f6; }
  .dot.paused { background: #f59e0b; }
  .dot.seeding { background: #10b981; }
  .dot.error { background: #ef4444; }
  .pct { margin-left: auto; font-weight: 600; font-size: 12px; color: inherit; flex: none; }
  .bar { height: 5px; border-radius: 999px; background: light-dark(#eceef4, #2a2d35); overflow: hidden; }
  .bar i { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg,#8b6bff,#b39dff); }
  .bar i.g { background: linear-gradient(90deg,#34d399,#10b981); }
  .bar i.p { background: linear-gradient(90deg,#fbbf24,#f59e0b); }
  .bar i.r { background: linear-gradient(90deg,#f87171,#ef4444); }
  .foot { display: flex; align-items: center; gap: 10px; margin-top: 2px; }
  .spd { font-size: 12px; white-space: nowrap; color: light-dark(#3b4152, #b9bec8); }
  .spd.up { color: light-dark(#0f9d63, #6fd39c); }
  .acts { margin-left: auto; display: flex; gap: 6px; }
  .act {
    width: 27px; height: 27px; border-radius: 50%; cursor: pointer; font-size: 12px; line-height: 1;
    border: 1px solid light-dark(#e3e5ea, #33363f); background: light-dark(#fff, #20232a); color: inherit;
    display: flex; align-items: center; justify-content: center;
  }
  .act.primary { background: light-dark(#efeaff, #322a52); border-color: transparent; color: light-dark(#6640d8, #b9a4ff); }
  .act.danger { color: #dd4b4b; }
  .cbox {
    position: absolute; top: 8px; left: 8px; width: 16px; height: 16px; border-radius: 4px; display: none;
    border: 1.5px solid light-dark(#cfd4de, #4a4f5a); background: light-dark(#fff, #1a1c22); z-index: 2;
  }
  &.batch .cbox { display: block; }
  .card.sel .cbox { background: #7c5cff; border-color: #7c5cff; }
  .card.sel .cbox::after { content: "✓"; color: #fff; font-size: 11px; display: block; text-align: center; line-height: 15px; }

  .empty { padding: 40px 0; text-align: center; color: light-dark(#8a8f99, #98a0ab); font-size: 13px; }

  /* ---------- 详情对话框 ---------- */
  .detail-dlg {
    width: min(560px, 100%); max-height: 84vh; display: flex; flex-direction: column;
    padding: 0; overflow: hidden;
  }
  .detail-dlg .dhead {
    display: flex; align-items: flex-start; gap: 10px; padding: 14px 18px;
    border-bottom: 1px solid light-dark(#e6e8ee, #2a2d35);
  }
  .detail-dlg .dhead h3 { margin: 0; flex: 1; font-size: 13.5px; font-weight: 600; line-height: 1.45; word-break: break-all; }
  .detail-dlg .dbody { padding: 14px 18px 18px; overflow: auto; }
  .detail-dlg .close {
    flex: none; border: none; background: transparent; cursor: pointer; line-height: 1;
    font-size: 18px; color: light-dark(#8a8f99, #98a0ab); padding: 0 2px;
  }
  .kv { display: grid; grid-template-columns: 84px 1fr; gap: 8px 12px; font-size: 13px; }
  .kv .k { color: light-dark(#8a8f99, #98a0ab); }
  .kv .v { word-break: break-all; }
  code { font-family: ui-monospace, Consolas, monospace; font-size: 12px; background: light-dark(#f4f5f9, #23262d); border-radius: 5px; padding: 1px 5px; }

  /* ---------- 弹窗（删除确认 / 详情共用） ---------- */
  .modal {
    position: fixed; inset: 0; z-index: 40; display: none; align-items: center; justify-content: center;
    padding: 16px; background: rgba(0, 0, 0, .32);
  }
  .modal.on { display: flex; }
  .dialog {
    width: min(440px, 100%); border-radius: 16px; padding: 20px; background: light-dark(#fff, #17191e);
    border: 1px solid light-dark(#e6e8ee, #2a2d35);
  }
  .dialog h3 { margin: 0 0 6px; font-size: 15px; }
  .dialog p { margin: 0 0 14px; font-size: 13px; color: light-dark(#6b7280, #98a0ab); }
  .choice {
    display: flex; gap: 10px; align-items: flex-start; padding: 11px; margin-bottom: 8px; cursor: pointer;
    border: 1px solid light-dark(#e6e8ee, #2a2d35); border-radius: 12px;
  }
  .choice.on { border-color: #7c5cff; background: light-dark(#fbf9ff, #211d33); }
  .choice .rd { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid light-dark(#cfd4de, #4a4f5a); margin-top: 2px; flex: none; }
  .choice.on .rd { border: 5px solid #7c5cff; }
  .choice b { display: block; font-size: 13px; }
  .choice span { font-size: 12px; color: light-dark(#6b7280, #98a0ab); }
  .row { display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px; }

  /* ---------- 登录 ---------- */
  .login .err { color: #dd4b4b; font-size: 12px; min-height: 18px; }

  @media (max-width: 720px) {
    .app { padding-bottom: 80px; }
    .stats { gap: 8px; }
  }

  /* ---------- 已废弃：（?embed=1）：去掉自带的标题与外边距，填满内容区 ---------- */

}`;
const HTML = `<div class="app">
  <div class="topbar">
    <span class="title">下载管理</span>
    <div class="tabs" id="mpdl-tabs"></div>
    <span class="spacer"></span>
    <span class="stats">
      <span>↓ <b id="mpdl-s-dl">—</b></span>
      <span>↑ <b id="mpdl-s-up">—</b></span>
      <span>剩余 <b id="mpdl-s-free">—</b></span>
    </span>
    <label class="search">
      <span>🔍</span>
      <input id="mpdl-kw" placeholder="搜索…">
    </label>
    <div class="menu-wrap">
      <button class="btn icon" id="mpdl-moreBtn" title="更多设置">⋯</button>
      <div class="menu" id="mpdl-moreMenu">
        <div class="row">
          <span class="lbl">下载器</span>
          <select id="mpdl-dls"><option value="">全部</option></select>
        </div>
        <div class="row">
          <span class="lbl">排序</span>
          <select id="mpdl-sort">
            <option value="added">按进度</option>
            <option value="size">按大小</option>
            <option value="speed">按速度</option>
            <option value="name">按名称</option>
          </select>
        </div>
        <hr>
        <div class="row">
          <span class="lbl" title="按后端 TORRENT_TAG（默认 MOVIEPILOT）过滤">仅 MOVIEPILOT</span>
          <label class="switch"><input type="checkbox" id="mpdl-onlyTag"></label>
        </div>
        <div class="row">
          <span class="lbl">自动刷新</span>
          <label class="switch"><input type="checkbox" id="mpdl-auto" checked></label>
        </div>
        <hr>
        <button class="btn full" id="mpdl-batchbtn">批量操作</button>
        <div class="foot" id="mpdl-stamp">—</div>
      </div>
    </div>
  </div>

  <div class="toolbar">
    <span class="cnt" id="mpdl-selcnt">已选 0 项</span>
    <button class="btn" data-bulk="start">继续所选</button>
    <button class="btn" data-bulk="stop">暂停所选</button>
    <button class="btn danger" data-bulk="delete">删除所选</button>
    <button class="btn" id="mpdl-selself">全选当前</button>
  </div>

  <div id="mpdl-groups"></div>
  <div class="empty" id="mpdl-empty" style="display:none">没有符合条件的任务</div>
</div>
<div class="modal" id="mpdl-detail">
  <div class="dialog detail-dlg">
    <div class="dhead">
      <h3 id="mpdl-dtitle">—</h3>
      <button class="close" id="mpdl-dclose">×</button>
    </div>
    <div class="dbody" id="mpdl-dbody"></div>
  </div>
</div>
<div class="modal" id="mpdl-modal">
  <div class="dialog">
    <h3>删除下载任务</h3>
    <p id="mpdl-mtitle">—</p>
    <div class="choice on" data-del="task">
      <span class="rd"></span>
      <div><b>仅移除任务</b><span>保留已下载的文件，下载器里不再显示</span></div>
    </div>
    <div class="choice" data-del="files">
      <span class="rd"></span>
      <div><b>任务 + 文件一起删除</b><span>同时删除已下载的文件，不可恢复</span></div>
    </div>
    <div class="row">
      <button class="btn" id="mpdl-mcancel">取消</button>
      <button class="btn danger" id="mpdl-mok">确认删除</button>
    </div>
  </div>
</div>`;

let DownloadingPage;

let __mp_tla = Promise.all([
  (() => { try { return __mp_tla_0; } catch (e) { return undefined; } })(),
]).then(async () => {
  const { defineComponent, createElementVNode } = await importShared("vue");

  // 内联挂载：组件只提供一个宿主节点，界面由 download.html 生成的 DOM 与逻辑驱动，
  // 与 SPA 同文档渲染，沿用路由自身的加载过渡，不额外套页面。
  function mount(root) {

  (function () {
    'use strict';
    var TOKEN_KEY = '__MP_Download_Token__';
    var ONLY_TAG_KEY = '__MP_Download_OnlyTag__';
    var REFRESH_MS = 5000;
    var authMode = '';
    var token = '';
    var onlyTag = false;
    var state = 'all';
    var keyword = '';
    var downloader = '';
    var sortBy = 'added';
    var items = [];
    var groups = {};
    var selected = {};
    var pendingDel = null;
    var delMode = 'task';
    var timer = null;
    var lastPayload = '';
    var hoverHold = false;

    /* ---------- 鉴权（与站点日志页同源策略） ---------- */
    function getToken() {
      var q = new URLSearchParams(location.search);
      var t = q.get('token');
      if (t) { authMode = t.split('.').length === 3 ? 'jwt' : 'api'; return t; }
      // 优先复用同源已登录令牌（SPA 主应用会写入 localStorage.auth 等）
      try {
        for (var i = 0; i < localStorage.length; i++) {
          var key = localStorage.key(i);
          var val = localStorage.getItem(key) || '';
          if (/token/i.test(key) && val.length > 50 && val.indexOf('.') > 0) { authMode = 'jwt'; return val; }
          if (val.charAt(0) === '{') {
            var obj = null;
            try { obj = JSON.parse(val); } catch (e2) { obj = null; }
            if (obj && typeof obj.token === 'string' && obj.token.length > 50 && obj.token.indexOf('.') > 0) {
              authMode = 'jwt'; return obj.token;
            }
          }
        }
      } catch (e) { /* 忽略非法 JSON，回退本页缓存 */ }
      t = localStorage.getItem(TOKEN_KEY);
      if (t) { authMode = 'jwt'; return t; }
      return '';
    }

    function apiUrl(path, params) {
      var qs = params ? '?' + params : '';
      if (authMode === 'api') qs = (params ? qs + '&' : '?') + 'token=' + encodeURIComponent(token);
      return '/api/v1' + path + qs;
    }

    function apiFetch(path, params, options) {
      var headers = {};
      if (authMode === 'jwt') headers['Authorization'] = 'Bearer ' + token;
      var opts = options || {};
      if (opts.headers) Object.keys(opts.headers).forEach(function (k) { headers[k] = opts.headers[k]; });
      return fetch(apiUrl(path, params), Object.assign({}, opts, { headers: headers }));
    }

    function showLogin(on) { /* SPA 内登录由主应用负责 */ }

    // 令牌失效统一处理：后端对无效 JWT 返回 403，API_TOKEN 校验失败返回 401，两种都要重新登录
    var authRetried = false;

    function handleAuthFailure(res) {
      if (res.status !== 401 && res.status !== 403) return false;
      localStorage.removeItem(TOKEN_KEY);
      var fresh = getToken();
      if (fresh && !authRetried) {
        // 本页缓存令牌失效时，回退到同源主应用令牌重试一次
        authRetried = true;
        token = fresh;
        lastPayload = '';
        loadAll();
        return true;
      }
      token = '';
      stopAuto();
      showLogin(true);
      return true;
    }


    /* ---------- 工具 ---------- */
    function esc(s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function fmtSize(bytes) {
      var n = Number(bytes) || 0;
      if (n <= 0) return '0 B';
      var u = ['B', 'KB', 'MB', 'GB', 'TB'], i = 0;
      while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
      return (n >= 100 ? n.toFixed(0) : n.toFixed(i === 0 ? 0 : 1)) + ' ' + u[i];
    }

    function parseSpeed(text) {
      var m = /^([\d.]+)\s*([KMGTP]?)B/i.exec(String(text || ''));
      if (!m) return 0;
      var mul = { '': 1, K: 1024, M: 1048576, G: 1073741824, T: 1099511627776, P: 1125899906842624 };
      return parseFloat(m[1]) * (mul[(m[2] || '').toUpperCase()] || 1);
    }

    // 后端只有 downloading/paused/completed 三种归一状态，
    // 做种中需要靠「100% + 有上传速度」再细分，避免把已完成但未做种的算成做种中
    function bucket(it) {
      var st = String(it.state || '').toLowerCase();
      if (st === 'paused') return 'paused';
      if ((it.progress || 0) >= 99.9) {
        return parseSpeed(it.upspeed) > 0 ? 'seeding' : 'done';
      }
      if (st === 'completed') return 'done';
      if (st === 'downloading') return 'downloading';
      return 'done';
    }

    var STATE_LABEL = { downloading: '下载中', paused: '暂停', seeding: '做种中', done: '已完成', error: '错误' };
    var STATE_TABS = [
      { key: 'all', label: '全部' },
      { key: 'downloading', label: '下载中' },
      { key: 'paused', label: '暂停' },
      { key: 'seeding', label: '做种中' },
      { key: 'done', label: '已完成' }
    ];

    /* ---------- 渲染 ---------- */
    function renderTabs() {
      var counts = { all: items.length };
      STATE_TABS.forEach(function (t) { if (t.key !== 'all') counts[t.key] = 0; });
      items.forEach(function (it) {
        var b = bucket(it);
        counts[b] = (counts[b] || 0) + 1;
      });
      root.querySelector('#mpdl-tabs').innerHTML = STATE_TABS.map(function (t) {
        return '<button class="tab' + (state === t.key ? ' on' : '') + '" data-state="' + t.key + '" type="button">'
          + t.label + '<b>' + (counts[t.key] || 0) + '</b></button>';
      }).join('');
    }

    function visibleItems() {
      var kw = keyword.toLowerCase();
      var out = items.filter(function (it) {
        if (state !== 'all' && bucket(it) !== state) return false;
        if (downloader && it.downloader !== downloader) return false;
        if (!kw) return true;
        var hay = [it.title, it.name, it.site_name, it.hash, it.downloader].join(' ').toLowerCase();
        return hay.indexOf(kw) >= 0;
      });
      out.sort(function (a, b) {
        if (sortBy === 'size') return (b.size || 0) - (a.size || 0);
        if (sortBy === 'speed') return parseSpeed(b.dlspeed) - parseSpeed(a.dlspeed);
        if (sortBy === 'name') return String(a.name || a.title).localeCompare(String(b.name || b.title), 'zh');
        return (b.progress || 0) - (a.progress || 0);
      });
      return out;
    }

    function cardHtml(it) {
      var b = bucket(it);
      var media = it.media || {};
      var poster = media.poster || media.image || '';
      var title = media.title || it.name || it.title || '';
      var sub = [it.year || media.year, it.season_episode].filter(Boolean).join(' · ');
      var badges = [];
      if (media.type) badges.push('<span class="badge">' + esc(media.type) + '</span>');
      else badges.push('<span class="badge">未绑定媒体</span>');
      if (it.size) badges.push('<span class="badge">' + fmtSize(it.size) + '</span>');
      if (it.site_name) badges.push('<span class="badge site">' + esc(it.site_name) + '</span>');
      if (it.downloader) badges.push('<span class="badge dl">' + esc(it.downloader) + '</span>');

      var progress = Math.max(0, Math.min(100, Number(it.progress) || 0));
      var barCls = b === 'seeding' || b === 'done' ? 'g' : (b === 'paused' ? 'p' : '');
      var statusText = STATE_LABEL[b] || b;
      if (it.left_time) statusText += ' · 剩余 ' + it.left_time;

      var mainAct = b === 'paused'
        ? '<button class="act primary" data-act="start" title="继续">▶</button>'
        : '<button class="act" data-act="stop" title="暂停">||</button>';

      return '<article class="card' + (selected[it.hash] ? ' sel' : '') + '" data-hash="' + esc(it.hash) + '">'
        + '<div class="cbox"></div>'
        + '<div class="poster" title="' + esc(title) + '">' + (poster ? '<img src="' + esc(poster) + '" alt="" loading="lazy" onerror="this.remove()">' : '')
        + '<span>' + esc(String(title || '').slice(0, 6)) + '</span></div>'
        + '<div class="body">'
        + '<div class="l1"><b>' + esc(title || '未识别') + '</b><span class="m">' + esc(sub) + '</span></div>'
        + '<div class="raw" title="' + esc(it.title) + '">' + esc(it.title) + '</div>'
        + '<div class="badges">' + badges.join('') + '</div>'
        + '<div class="st"><span class="dot ' + b + '"></span><span class="txt">' + esc(statusText)
        + '</span><span class="pct">' + progress.toFixed(0) + '%</span></div>'
        + '<div class="bar"><i class="' + barCls + '" style="width:' + progress + '%"></i></div>'
        + '<div class="foot">'
        + '<span class="spd">↓ <b>' + esc(it.dlspeed || '0B') + '/s</b></span>'
        + '<span class="spd up">↑ <b>' + esc(it.upspeed || '0B') + '/s</b></span>'
        + '<span class="acts">' + mainAct
        + '<button class="act danger" data-act="delete" title="删除">🗑</button>'
        + '</span></div></div></article>';
    }

    function render() {
      renderTabs();
      var list = visibleItems();
      groups = {};
      list.forEach(function (it) {
        var key = it.downloader || '默认下载器';
        (groups[key] = groups[key] || []).push(it);
      });
      var html = Object.keys(groups).map(function (name) {
        var arr = groups[name];
        // 只有一个下载器时不额外占一行分组头，减少层级
        var head = Object.keys(groups).length > 1
          ? '<div class="grouphead"><span class="nm">' + esc(name) + '</span>'
            + '<span class="pill">在线</span>'
            + '<span class="pill muted">' + arr.length + ' 个任务</span></div>'
          : '';
        return '<div class="group">' + head + '<div class="grid">' + arr.map(cardHtml).join('') + '</div></div>';
      }).join('');
      root.querySelector('#mpdl-groups').innerHTML = html;
      root.querySelector('#mpdl-empty').style.display = list.length ? 'none' : 'block';
      root.querySelector('#mpdl-selcnt').textContent = '已选 ' + Object.keys(selected).length + ' 项';
      root.querySelector('#mpdl-stamp').textContent = '更新于 ' + new Date().toLocaleTimeString('zh-CN', { hour12: false });
    }

    function renderSummary() {
      apiFetch('/dashboard/downloader').then(function (r) {
        if (handleAuthFailure(r)) return null;
        return r.json();
      }).then(function (d) {
        if (!d) return;
        root.querySelector('#mpdl-s-dl').textContent = fmtSize(d.download_speed) + '/s';
        root.querySelector('#mpdl-s-up').textContent = fmtSize(d.upload_speed) + '/s';
        root.querySelector('#mpdl-s-free').textContent = fmtSize(d.free_space);
      }).catch(function () { /* 汇总失败不影响列表 */ });
    }

    function loadClients() {
      apiFetch('/download/clients').then(function (r) {
        if (handleAuthFailure(r)) return null;
        return r.json();
      }).then(function (list) {
        if (!list) return;
        var sel = root.querySelector('#mpdl-dls');
        sel.innerHTML = '<option value="">全部下载器</option>' + list.map(function (d) {
          return '<option value="' + esc(d.name) + '">' + esc(d.name) + ' · ' + esc(d.type || '') + '</option>';
        }).join('');
      }).catch(function () { /* 无下载器时保持默认项 */ });
    }

    function loadAll() {
      // 面板打开或鼠标停在列表上时暂停刷新，避免重绘吃掉点击
      if (hoverHold
        || root.querySelector('#mpdl-detail').classList.contains('on')
        || root.querySelector('#mpdl-modal').classList.contains('on')) return;
      // status=all + include_all_tags 需要后端支持；旧版后端会忽略未知参数，退化为仅本系统任务
      // include_all_tags=false 时由后端按 TORRENT_TAG（默认 MOVIEPILOT）过滤
      apiFetch('/download/', 'status=all&include_all_tags=' + (onlyTag ? 'false' : 'true'))
        .then(function (r) {
          if (handleAuthFailure(r)) return null;
          return r.json();
        })
        .then(function (data) {
          if (data === null) return;
          renderSummary();
          var payload = JSON.stringify(data);
          // 内容没变化就不重绘，避免整块 innerHTML 替换导致交互被打断
          if (payload === lastPayload) {
            root.querySelector('#mpdl-stamp').textContent =
              '更新于 ' + new Date().toLocaleTimeString('zh-CN', { hour12: false });
            return;
          }
          lastPayload = payload;
          items = Array.isArray(data) ? data : [];
          render();
        })
        .catch(function (e) { console.error('[下载管理] 加载失败', e); });
    }

    function startAuto() {
      stopAuto();
      if (root.querySelector('#mpdl-auto').checked) timer = setInterval(loadAll, REFRESH_MS);
    }
    function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }

    /* ---------- 交互 ---------- */
    function act(hash, name, action) {
      var path, opts;
      if (action === 'delete') {
        return apiFetch('/download/' + encodeURIComponent(hash) + '?delete_file=false&name=' + encodeURIComponent(name || ''),
          null, { method: 'DELETE' });
      }
      opts = 'name=' + encodeURIComponent(name || '');
      path = '/download/' + action + '/' + encodeURIComponent(hash) + '?' + opts;
      return apiFetch(path, null, {});
    }

    function openDrawer(it) {
      var media = it.media || {};
      var rows = [
        ['媒体', media.tmdbid ? ((media.title || it.name || '') + ' · ' + (media.type || '') + ' · TMDB ' + media.tmdbid
          + (it.season_episode ? ' · ' + it.season_episode : '')) : '未绑定'],
        ['状态', (STATE_LABEL[bucket(it)] || bucket(it)) + ' · 进度 ' + (Number(it.progress) || 0).toFixed(2) + '%'],
        ['下载器', (it.downloader || '') + (it.tags ? ' · 标签 ' + it.tags : '')],
        ['大小', fmtSize(it.size)],
        ['保存路径', '<code>' + esc(it.save_path || '') + '</code>'],
        ['内容路径', '<code>' + esc(it.content_path || it.path || '') + '</code>'],
        ['速度', '↓ ' + esc(it.dlspeed || '0B') + '/s · ↑ ' + esc(it.upspeed || '0B') + '/s' + (it.left_time ? ' · 剩余 ' + esc(it.left_time) : '')],
        ['限速', '下载 ' + (it.download_limit ? it.download_limit + ' KB/s' : '不限')
          + ' · 上传 ' + (it.upload_limit ? it.upload_limit + ' KB/s' : '不限')
          + ' · 分享率 ' + (it.ratio_limit >= 0 ? it.ratio_limit : '不限')],
        ['标签', esc(it.tags || '—')],
        ['Hash', '<code>' + esc(it.hash) + '</code>']
      ];
      var trackers = (it.trackers || []).map(function (t) {
        return '<div style="font-size:12px;word-break:break-all">• ' + esc(t) + '</div>';
      }).join('') || '<span class="k">无</span>';
      root.querySelector('#mpdl-dtitle').textContent = it.title;
      root.querySelector('#mpdl-dbody').innerHTML = '<div class="kv">' + rows.map(function (r) {
        return '<div class="k">' + r[0] + '</div><div class="v">' + (r[0].match(/路径|Hash/) ? r[1] : esc(r[1])) + '</div>';
      }).join('') + '</div>'
        + '<div class="kv" style="margin-top:14px"><div class="k">Tracker</div><div class="v">' + trackers + '</div></div>';
      root.querySelector('#mpdl-detail').classList.add('on');
    }

    function closeDrawer() {
      root.querySelector('#mpdl-detail').classList.remove('on');
    }

    function openDelete(it) {
      pendingDel = it;
      delMode = 'task';
      root.querySelector('#mpdl-mtitle').textContent = (it.name || it.title) + '（' + fmtSize(it.size) + '）';
      Array.prototype.forEach.call(root.querySelectorAll('.choice'), function (c) {
        c.classList.toggle('on', c.dataset.del === 'task');
      });
      root.querySelector('#mpdl-modal').classList.add('on');
    }

    function findItem(hash) {
      for (var i = 0; i < items.length; i++) if (items[i].hash === hash) return items[i];
      return null;
    }

    /* ---------- 事件 ---------- */
    root.querySelector('#mpdl-auto').addEventListener('change', startAuto);
    root.querySelector('#mpdl-onlyTag').addEventListener('change', function (e) {
      onlyTag = e.target.checked;
      localStorage.setItem(ONLY_TAG_KEY, onlyTag ? '1' : '0');
      selected = {};
      lastPayload = ''; // 切换数据范围后强制重绘
      render();
      loadAll();
    });
    root.querySelector('#mpdl-kw').addEventListener('input', function (e) { keyword = e.target.value.trim(); render(); });
    root.querySelector('#mpdl-dls').addEventListener('change', function (e) { downloader = e.target.value; render(); });
    root.querySelector('#mpdl-sort').addEventListener('change', function (e) { sortBy = e.target.value; render(); });
    root.querySelector('#mpdl-batchbtn').addEventListener('click', function () {
      root.classList.toggle('batch');
      this.classList.toggle('solid');
      if (!root.classList.contains('batch')) { selected = {}; render(); }
      closeMenu();
    });
    root.querySelector('#mpdl-selself').addEventListener('click', function () {
      var list = visibleItems();
      var allIn = list.every(function (it) { return selected[it.hash]; });
      list.forEach(function (it) { if (allIn) delete selected[it.hash]; else selected[it.hash] = true; });
      render();
    });
    root.querySelector('#mpdl-tabs').addEventListener('click', function (e) {
      var btn = e.target.closest('.tab');
      if (!btn) return;
      state = btn.dataset.state;
      render();
    });
    root.querySelector('#mpdl-groups').addEventListener('click', function (e) {
      var card = e.target.closest('.card');
      if (!card) return;
      var it = findItem(card.dataset.hash);
      if (!it) return;
      if (e.target.closest('.cbox') || root.classList.contains('batch')) {
        if (selected[it.hash]) delete selected[it.hash]; else selected[it.hash] = true;
        render();
        return;
      }
      var actBtn = e.target.closest('.act');
      if (actBtn) {
        e.stopPropagation();
        var action = actBtn.dataset.act;
        if (action === 'delete') { openDelete(it); return; }
        act(it.hash, it.downloader, action === 'start' ? 'start' : 'stop')
          .then(function () { setTimeout(loadAll, 800); });
        return;
      }
      openDrawer(it);
    });
    // 更多菜单：点按钮开关，点外面或 Esc 关闭
    function closeMenu() { root.querySelector('#mpdl-moreMenu').classList.remove('on'); }
    root.querySelector('#mpdl-moreBtn').addEventListener('click', function (e) {
      e.stopPropagation();
      root.querySelector('#mpdl-moreMenu').classList.toggle('on');
    });
    root.querySelector('#mpdl-moreMenu').addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', closeMenu);

    root.querySelector('.toolbar').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-bulk]');
      if (!btn) return;
      var mode = btn.dataset.bulk;
      var hashes = Object.keys(selected);
      if (!hashes.length) return;
      if (mode === 'delete') {
        if (!confirm('确认删除所选 ' + hashes.length + ' 个任务（仅移除任务，不删文件）？')) return;
        Promise.all(hashes.map(function (h) {
          var it = findItem(h);
          return act(h, it && it.downloader, 'delete');
        })).then(function () { selected = {}; setTimeout(loadAll, 800); });
        return;
      }
      Promise.all(hashes.map(function (h) {
        var it = findItem(h);
        return act(h, it && it.downloader, mode);
      })).then(function () { setTimeout(loadAll, 800); });
    });
    var gridHost = root.querySelector('#mpdl-groups');
    gridHost.addEventListener('mouseenter', function () { hoverHold = true; });
    gridHost.addEventListener('mouseleave', function () { hoverHold = false; });
    root.querySelector('#mpdl-dclose').addEventListener('click', closeDrawer);
    // 点遮罩空白处或按 Esc 关闭详情
    root.querySelector('#mpdl-detail').addEventListener('click', function (e) {
      if (e.target === this) closeDrawer();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeDrawer(); closeMenu(); }
    });
    root.querySelector('#mpdl-mcancel').addEventListener('click', function () {
      root.querySelector('#mpdl-modal').classList.remove('on');
      pendingDel = null;
    });
    root.querySelector('#mpdl-modal .dialog').addEventListener('click', function (e) {
      var c = e.target.closest('.choice');
      if (!c) return;
      delMode = c.dataset.del;
      Array.prototype.forEach.call(root.querySelectorAll('.choice'), function (x) {
        x.classList.toggle('on', x === c);
      });
    });
    root.querySelector('#mpdl-mok').addEventListener('click', function () {
      if (!pendingDel) return;
      var it = pendingDel;
      var deleteFile = delMode === 'files';
      root.querySelector('#mpdl-modal').classList.remove('on');
      apiFetch('/download/' + encodeURIComponent(it.hash)
        + '?delete_file=' + deleteFile + '&name=' + encodeURIComponent(it.downloader || ''),
        null, { method: 'DELETE' })
        .then(function () { pendingDel = null; setTimeout(loadAll, 600); });
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopAuto(); else { loadAll(); startAuto(); }
    });

    /* ---------- 启动 ---------- */
    // 被 SPA 的下载管理页以 iframe 嵌入时隐藏自有标题，避免与侧栏标题重复
    onlyTag = localStorage.getItem(ONLY_TAG_KEY) === '1';
    root.querySelector('#mpdl-onlyTag').checked = onlyTag;
    // SPA 内复用主应用登录态；拿不到令牌时由主应用负责跳转登录
    token = getToken();
    if (token) {
      loadClients();
      loadAll();
      startAuto();
    } else {
      console.warn('[下载管理] 未找到登录令牌');
    }
  })();
    return function unmount() {
      stopAuto();
      if (root) root.innerHTML = "";
    };
  }

  DownloadingPage = defineComponent({
    name: "DownloadingPage",
    setup() {
      let root = null;
      let styleEl = null;
      let cleanup = null;
      return () =>
        createElementVNode("div", {
          class: "mp-dl",
          ref: (el) => {
            if (!el) {
              if (cleanup) { cleanup(); cleanup = null; }
              if (styleEl) { styleEl.remove(); styleEl = null; }
              root = null;
              return;
            }
            if (root === el) return;
            root = el;
            styleEl = document.createElement("style");
            styleEl.setAttribute("data-mp-dl", "1");
            styleEl.textContent = CSS;
            document.head.appendChild(styleEl);
            root.innerHTML = HTML;
            cleanup = mount(root);
          },
        });
    },
  });
});

export { DownloadingPage as default, __mp_tla };
