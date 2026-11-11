(async function () {
  const { ALLERGENS, icon, fmtPrice, esc, load } = IFF;
  const $ = s => document.querySelector(s);
  let D;
  try { D = await load(); } catch (e) { $('#menu').innerHTML = '<p class="empty">Цэс ачаалж чадсангүй. Дахин оролдоно уу.</p>'; return; }

  const S = D.settings;
  let activeCat = null, query = '', avoid = new Set();

  // Ерөнхий текст
  document.title = S.brand + ' · Дижитал цэс';
  $('#brandName').textContent = 'İstanbul';
  $('#slogan').textContent = S.slogan;
  $('#subSlogan').textContent = S.subSlogan;
  $('#notice').textContent = S.notice;
  const words = ['Шинэхэн', 'Халуун', 'Хурдан', 'Истанбулын амт', 'Босфорын сэвшээ', 'Гал дээр шарсан'];
  const mq = words.map(w => '<span style="margin:0 22px">' + w + '</span><span>✦</span>').join('');
  $('#marq').innerHTML = mq + mq + mq + mq;

  // Ангилал
  const cats = D.categories;
  $('#chips').innerHTML = cats.map(c => '<button class="chip" data-c="' + c.id + '">' + c.icon + ' ' + esc(c.name) + '</button>').join('');
  $('#chips').addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    const el = document.getElementById('cat_' + b.dataset.c);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });

  function visible(it) {
    if (avoid.size && it.allergens.some(a => avoid.has(a))) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!(it.name.toLowerCase().includes(q) || (it.desc || '').toLowerCase().includes(q))) return false;
    }
    return true;
  }

  function card(it) {
    const ph = it.img ? '<img class="ph" src="' + esc(it.img) + '" alt="' + esc(it.name) + '" loading="lazy">' : '';
    const tag = it.available === false ? '<span class="tag">ДУУССАН</span>' : (it.signature ? '<span class="tag">★ ОНЦЛОХ</span>' : '');
    return '<article class="card ' + (it.img ? '' : 'noimg') + (it.available === false ? ' out' : '') + '">' + tag +
      '<div class="body"><h3>' + esc(it.name) + '</h3><div class="d">' + esc(it.desc) + '</div>' +
      '<div class="foot"><span class="kcal">' + (it.kcal || 0) + ' ккал</span>' + it.allergens.map(a => icon(a, 28)).join('') +
      '<span class="price">' + fmtPrice(it.price) + '</span></div></div>' + ph + '</article>';
  }

  function render() {
    let html = '', total = 0;
    cats.forEach(c => {
      const list = D.items.filter(i => i.cat === c.id && visible(i));
      if (!list.length) return;
      total += list.length;
      html += '<section class="sec" id="cat_' + c.id + '" data-c="' + c.id + '"><h2><i>' + c.icon + '</i>' + esc(c.name) + '</h2><div class="sub">' + esc(c.sub) + '</div>' + list.map(card).join('') + '</section>';
    });
    $('#menu').innerHTML = total ? html : '<div class="empty"><div style="font-size:48px">🔎</div><p>Тохирох хоол олдсонгүй. Хайлт эсвэл шүүлтүүрээ өөрчилнө үү.</p></div>';
    observe();
  }

  // Гүйлгэх үед идэвхтэй ангилал тодрох
  let io;
  function observe() {
    if (io) io.disconnect();
    io = new IntersectionObserver(es => {
      es.forEach(en => { if (en.isIntersecting) setAct(en.target.dataset.c); });
    }, { rootMargin: '-30% 0px -65% 0px' });
    document.querySelectorAll('.sec').forEach(s => io.observe(s));
  }
  function setAct(id) {
    activeCat = id;
    document.querySelectorAll('.chip').forEach(c => {
      const on = c.dataset.c === id; c.classList.toggle('act', on);
      if (on) c.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    });
  }

  // Хайлт
  $('#btnSearch').onclick = () => {
    const sb = $('#searchbar'); sb.classList.toggle('open'); $('#btnSearch').classList.toggle('on');
    if (sb.classList.contains('open')) $('#q').focus(); else { $('#q').value = ''; query = ''; render(); }
  };
  $('#q').oninput = e => { query = e.target.value.trim(); render(); };

  // Харшлын шүүлтүүр
  $('#agrid').innerHTML = ALLERGENS.map(a => '<button class="ab" data-a="' + a.id + '">' + icon(a.id, 46) + '<div>' + a.name + '</div></button>').join('');
  $('#agrid').addEventListener('click', e => {
    const b = e.target.closest('.ab'); if (!b) return;
    const id = b.dataset.a; avoid.has(id) ? avoid.delete(id) : avoid.add(id);
    b.classList.toggle('sel'); $('#btnFilter').classList.toggle('on', avoid.size > 0); render();
  });
  $('#btnFilter').onclick = () => $('#sheetF').classList.add('open');
  $('#fGo').onclick = () => $('#sheetF').classList.remove('open');
  $('#sheetF').onclick = e => { if (e.target.id === 'sheetF') e.currentTarget.classList.remove('open'); };

  // Рулетк
  function roll() {
    const pool = D.items.filter(i => i.available !== false && visible(i) && i.cat !== 'icecek');
    if (!pool.length) { $('#rName').textContent = 'Хоол олдсонгүй'; return; }
    const faces = ['🎲', '🍔', '🥙', '🍟', '🍗', '🫓', '🍯'];
    let n = 0; const dieEl = $('#rDie');
    const t = setInterval(() => {
      const it = pool[Math.floor(Math.random() * pool.length)];
      $('#rName').textContent = it.name; $('#rDesc').textContent = '';
      dieEl.textContent = faces[n++ % faces.length];
      if (n > 14) {
        clearInterval(t);
        $('#rDesc').innerHTML = esc(it.desc) + '<br><b style="color:var(--red)">' + fmtPrice(it.price) + '</b> · ' + (it.kcal || 0) + ' ккал';
        dieEl.textContent = '🎉';
      }
    }, 90);
  }
  $('#btnRoll').onclick = () => { $('#sheetR').classList.add('open'); roll(); };
  $('#rAgain').onclick = roll;
  $('#rClose').onclick = () => $('#sheetR').classList.remove('open');
  $('#sheetR').onclick = e => { if (e.target.id === 'sheetR') e.currentTarget.classList.remove('open'); };

  // Хөл
  $('#legend').innerHTML = ALLERGENS.map(a => '<div>' + icon(a.id, 46) + '<div>' + a.name + '</div></div>').join('');
  const ig = String(S.instagram || '').replace(/^@/, '');
  $('#contact').innerHTML =
    '<div class="l">📍 <span>' + esc(S.location) + '</span></div>' +
    '<div class="l">🕙 <span>' + esc(S.hours) + '</span></div>' +
    '<a class="pill" href="https://instagram.com/' + encodeURIComponent(ig) + '" target="_blank" rel="noopener">📸 @' + esc(ig) + '</a>' +
    '<a class="pill" href="tel:' + esc(String(S.phone).replace(/\s/g, '')) + '">📞 ' + esc(S.phone) + '</a>';
  $('#cards').innerHTML = (S.mealCards || []).map(c => '<span class="pill">' + esc(c) + '</span>').join('');
  $('#copy').innerHTML = esc(S.brand) + ' · ' + new Date().getFullYear() + '<br><a href="/admin/">Удирдлага</a>';

  render();
})();
