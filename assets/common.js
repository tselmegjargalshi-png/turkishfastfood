// Хуваалцсан өгөгдөл ба туслах функцүүд
window.IFF = (function () {
  // Харшлын 14 төрөл. Дүрс нь 24x24 хэмжээтэй, --ib хувьсагч нь дүрсний дэвсгэр өнгө
  const ALLERGENS = [
    { id: 'pn', name: 'Газрын самар', bg: '#f2b84b', svg: '<circle cx="12" cy="7.5" r="4"/><circle cx="12" cy="16" r="4.6"/>' },
    { id: 'tn', name: 'Мод самар', bg: '#ee9a3f', svg: '<path d="M6 10h12c0 5-3 9.5-6 9.5S6 15 6 10z"/><path d="M5 9.5C5 6.5 8 5 12 5s7 1.5 7 4.5z"/>' },
    { id: 'cr', name: 'Хавч хэлбэрт', bg: '#2f7bd6', svg: '<ellipse cx="12" cy="13" rx="6" ry="4.4"/><path d="M4 6.5l4 4M20 6.5l-4 4M5 19l3-3.4M19 19l-3-3.4" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>' },
    { id: 'mo', name: 'Нялцгай биет', bg: '#34b3a4', svg: '<path d="M12 20.5L3.8 10C5 5.6 8 3.8 12 3.8s7 1.8 8.2 6.2z"/><path d="M12 6v12M8 8l2 9M16 8l-2 9" stroke="var(--ib)" stroke-width="1.2" fill="none"/>' },
    { id: 'fi', name: 'Загас', bg: '#1fa0e0', svg: '<path d="M2.5 12c4-6.5 11-6.5 14.5 0-3.5 6.5-10.500 6.5-14.500 0z"/><path d="M16.5 12l5-4.500v9z"/><circle cx="7.5" cy="11" r="1" fill="var(--ib)"/>' },
    { id: 'eg', name: 'Өндөг', bg: '#e7cc00', svg: '<path d="M12 2.8c3.500 0 6 1.800 7.500 4.600 1.500 3 .3 6.200-1.500 8.700-2 2.800-5 5-8 4.200-3.200-.8-5.500-3.800-5.500-7.200 0-5.500 3.200-10.300 7.500-10.300z"/><circle cx="12" cy="12" r="3.400" fill="var(--ib)"/>' },
    { id: 'mi', name: 'Сүү', bg: '#d9a7d3', svg: '<rect x="4.500" y="9.500" width="6" height="11" rx="1.200"/><rect x="6" y="4.500" width="3" height="4"/><rect x="13" y="12" width="6.500" height="8.500" rx="1.200"/>' },
    { id: 'gl', name: 'Глютен', bg: '#a8562f', svg: '<path d="M12 21V8" stroke="#fff" stroke-width="1.800" fill="none" stroke-linecap="round"/><ellipse cx="9" cy="9.500" rx="1.700" ry="3" transform="rotate(-30 9 9.500)"/><ellipse cx="15" cy="9.500" rx="1.700" ry="3" transform="rotate(30 15 9.500)"/><ellipse cx="9" cy="15" rx="1.700" ry="3" transform="rotate(-30 9 15)"/><ellipse cx="15" cy="15" rx="1.700" ry="3" transform="rotate(30 15 15)"/><ellipse cx="12" cy="5" rx="1.600" ry="2.800"/>' },
    { id: 'so', name: 'Шар буурцаг', bg: '#2fa64a', svg: '<path d="M4.500 17.500C2.500 9.500 9 3.500 19.500 4.500c1 8.500-5.500 14.500-15 13z"/><circle cx="9.500" cy="12.500" r="1.400" fill="var(--ib)"/><circle cx="13" cy="9.500" r="1.400" fill="var(--ib)"/><circle cx="14.500" cy="13.500" r="1.400" fill="var(--ib)"/>' },
    { id: 'se', name: 'Кунжут', bg: '#ef8a2a', svg: '<ellipse cx="12" cy="6" rx="2" ry="3.200"/><ellipse cx="12" cy="18" rx="2" ry="3.200"/><ellipse cx="6" cy="12" rx="3.200" ry="2"/><ellipse cx="18" cy="12" rx="3.200" ry="2"/><circle cx="12" cy="12" r="1.600"/>' },
    { id: 'ce', name: 'Сэлэри', bg: '#8fcf7a', svg: '<path d="M7.500 21L10 5M12 21V3.500M16.500 21L14 5" fill="none" stroke="#fff" stroke-width="2.200" stroke-linecap="round"/>' },
    { id: 'mu', name: 'Гич', bg: '#cf9b3d', svg: '<rect x="7.500" y="9" width="9" height="12" rx="2.200"/><rect x="9.500" y="4" width="5" height="4.500" rx="1"/><circle cx="12" cy="15" r="2" fill="var(--ib)"/>' },
    { id: 'lu', name: 'Люпин', bg: '#9a86c9', svg: '<path d="M12 21V9" stroke="#fff" stroke-width="1.800" fill="none"/><circle cx="12" cy="5" r="2"/><circle cx="9" cy="9" r="2"/><circle cx="15" cy="9" r="2"/><circle cx="9" cy="13.500" r="2"/><circle cx="15" cy="13.500" r="2"/>' },
    { id: 'su', name: 'Сульфит', bg: '#8e1c24', svg: '<path d="M6.500 3h11c0 6.500-2.500 9.500-5.500 9.500S6.500 9.500 6.500 3z"/><path d="M12 12.500V20M8 21h8" fill="none" stroke="#fff" stroke-width="1.800" stroke-linecap="round"/>' }
  ];

  const AMAP = {};
  ALLERGENS.forEach(a => (AMAP[a.id] = a));

  function icon(id, size) {
    const a = AMAP[id];
    if (!a) return '';
    const s = size || 28;
    return '<span class="aic" title="' + a.name + '" style="--ib:' + a.bg + ';background:' + a.bg + ';width:' + s + 'px;height:' + s + 'px">' +
      '<svg viewBox="0 0 24 24" width="' + (s * 0.72) + '" height="' + (s * 0.72) + '" fill="#fff">' + a.svg + '</svg></span>';
  }

  const fmtPrice = n => new Intl.NumberFormat('tr-TR').format(Number(n) || 0) + ' ₺';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  async function loadBase() {
    const r = await fetch('/data/menu.json?v=' + Date.now());
    return r.json();
  }
  async function load() {
    try {
      const r = await fetch('/api/menu', { cache: 'no-store' });
      if (r.ok) { const j = await r.json(); if (j && j.items && j.categories && j.settings) return j; }
    } catch (e) {}
    return loadBase();
  }

  return { ALLERGENS, AMAP, icon, fmtPrice, esc, load, loadBase };
})();
