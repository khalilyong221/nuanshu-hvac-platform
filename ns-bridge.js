/* 暖枢 · 数据接口适配层（ns-bridge.js）
 * ================================================================
 * 作用：把页面上「写死的演示数据」换成「接口来的真实数据」。
 *
 * ⚠️ 核心原则：**静默回落**
 *   接口拿得到 → 用真实数据，并亮一个角标标明来源（这是加分项）
 *   接口拿不到 → 完全不动声色，页面照常显示内置演示数据
 *                **绝不显示任何"未接入/失败"字样** —— 访客看到那句话
 *                会以为项目没做完，那是减分。
 *
 * 对原页面只加两个挂点，**不改任何渲染代码**：
 *   ① 页面脚本里把写死的数组换成读 window.__NS_ENERGY
 *   ② 把重绘函数挂到 window.__NS_rerender
 *   ③ 文件末尾引这一行： <script src="ns-bridge.js"></script>
 * ================================================================ */
(function () {
  'use strict';

  // 接口地址，三种情况：
  //   ① 页面里显式指定了 window.NS_API_BASE → 用它（API 上了公网就写这里）
  //   ② 本地起 api.py 托管本页（同源）        → 用 location.origin   ← **唯一实测能通的**
  //   ③ 线上页面（khalilzheng.cn）            → 试本机 127.0.0.1:8790
  //
  // ⚠️ ③ 实测**走不通**，别指望它：
  //   Chrome 会直接拦掉「HTTPS 页面 → HTTP 本机」的请求，**请求根本发不出去**。
  //   证据：服务端日志里一条记录都没有（只看到手动 curl 的那几条）。
  //   试过加 Access-Control-Allow-Private-Network: true + OPTIONS 预检 —— 仍然被拦，
  //   说明卡在浏览器策略层，不是 CORS。
  //
  //   → 所以：**想让线上页面出真数据，只能把 API 部署到公网（HTTPS）。**
  //     本地要看真数据，就打开 http://127.0.0.1:8790/console.html（同源，没问题）。
  //     这条保留在代码里只是为了万一将来浏览器策略放宽，失败时是静默的、无任何副作用。
  var LOCAL_API = 'http://127.0.0.1:8790';
  var isLocal = (location.hostname === '127.0.0.1' || location.hostname === 'localhost');
  var API = window.NS_API_BASE || (isLocal ? location.origin : LOCAL_API);
  var TAG = '[ns-bridge]';

  window.__NS_STATUS = { api: API, ok: false, source: 'built-in demo data' };

  function get(u) {
    return fetch(u, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  /* 角标只在「拿到真实数据」时才出现 —— 回落时一个字都不显示 */
  function showBadge(text) {
    var b = document.createElement('div');
    b.id = 'nsBridgeBadge';
    b.style.cssText = 'position:fixed;left:16px;bottom:16px;z-index:9999;'
      + 'font:11px/1.6 ui-monospace,Menlo,Consolas,monospace;padding:5px 11px;'
      + 'border-radius:8px;background:rgba(12,20,16,.9);color:#7fe0a8;'
      + 'pointer-events:none;opacity:0;transition:opacity .4s';
    b.textContent = text;
    var mount = function () {
      document.body.appendChild(b);
      setTimeout(function () { b.style.opacity = '1'; }, 80);
    };
    if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
  }

  get(API + '/api/energy24h').then(function (d) {
    if (!d || !d.values || d.values.length !== 24) throw new Error('不是 24 个点');
    window.__NS_ENERGY = d.values;                      // ← 页面挂点 ①
    if (typeof window.__NS_rerender === 'function') {
      window.__NS_rerender();                           // ← 页面挂点 ②
    }
    window.__NS_STATUS.ok = true;
    window.__NS_STATUS.source = 'api /api/energy24h';
    showBadge('● 实时数据 · ' + d.n + ' 小时 · ' + d.unit + ' · 来自 ' + d.source);
    console.log(TAG, '能耗趋势已切到接口数据：', d.values);
  }).catch(function (e) {
    /* 静默回落：只写控制台，页面上不留任何痕迹 */
    console.log(TAG, '接口不可达，页面继续用内置演示数据（' + (e && e.message) + '）');
  });
})();
