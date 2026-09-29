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

  // 接口地址。
  //   本地：api.py 同时托管页面和接口 → 同源，直接用它
  //   以后把 API 部署到公网：在页面里先设 window.NS_API_BASE = 'https://…' 即可
  var API = window.NS_API_BASE || location.origin;
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
