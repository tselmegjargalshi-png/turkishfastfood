(async function () {
  const { ALLERGENS, icon, fmtPrice, esc, load, loadBase } = IFF;
  const $ = s => document.querySelector(s);
  const SESSION = 'iff_admin_pw';
  let PW = '';
  let D = await load();

  function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2200); }
  let timer = null, pendingMsg = '';
  function persist(msg) {
    pendingMsg = msg || pendingMsg;
    clearTimeout(timer);
    timer = setTimeout(save, 500);
    return true;
  }
  async function save() {
    const msg = pendingMsg; pendingMsg = '';
    try {
      const r = await fetch('/api/menu', { method: 'PUT', headers: { 'content-type': 'application/json', 'x-admin-password': PW }, body: JSON.stringify(D) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { toast(j.error || 'Хадгалж чадсангүй'); return false; }
      toast(msg || 'Хадгалагдлаа ✓'); return true;
    } catch (e) { toast('Сүлжээний алдаа. Дахин оролдоно уу'); return false; }
  }
  const uid = () => 'x' + Math.random().toString(36).slice(2, 8);

  // Нэвтрэх
  function enter() { $('#lock').style.display = 'none'; $('#app').style.display = 'block'; renderAll(); }
  async function tryLogin(pw) {
    try {
      const r = await fetch('/api/login', { method: 'POST', headers: { 'x-admin-password': pw } });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { $('#err').textContent = j.error || 'Нууц үг буруу байна'; return false; }
      PW = pw; try { sessionStorage.setItem(SESSION, pw); } catch (e) {}
      if (j.storage === false) toast('Анхаар: Vercel Blob холбогдоогүй тул хадгалах боломжгүй');
      enter(); return true;
    } catch (e) { $('#err').textContent = 'Сүлжээний алдаа'; return false; }
  }
  $('#login').onclick = () => tryLogin($('#pw').value);
  $('#pw').onkeydown = e => { if (e.key === 'Enter') tryLogin($('#pw').value); };
  $('#logout').onclick = () => { try { sessionStorage.removeItem(SESSION); } catch (e) {} location.reload(); };
  try { const t = sessionStorage.getItem(SESSION); if (t) tryLogin(t); } catch (e) {}

  // Табууд
  document.querySelectorAll('.tab').forEach(b => b.onclick = () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.toggle('act', x === b));
    ['items', 'cats', 'set', 'data'].forEach(t => $('#t_' + t).style.display = t === b.dataset.t ? 'block' : 'none');
    renderAll();
  });

  function catName(id) { const c = D.categories.find(c => c.id === id); return c ? c.name : ''; }
  function catIcon(id) { const c = D.categories.find(c => c.id === id); return c ? c.icon : '🍽'; }

  function renderAll() { renderStats(); renderFilters(); renderList(); renderCats(); renderSettings(); }

  function renderStats() {
    const n = D.items.length, out = D.items.filter(i => i.available === false).length, im = D.items.filter(i => i.img).length;
    $('#stats').innerHTML =
      '<div class="stat"><b>' + n + '</b><span>Нийт хоол</span></div>' +
      '<div class="stat"><b>' + out + '</b><span>Дууссан</span></div>' +
      '<div class="stat"><b>' + im + '</b><span>Зурагтай</span></div>';
  }

  function renderFilters() {
    const cur = $('#acat').value;
    $('#acat').innerHTML = '<option value="">Бүх ангилал</option>' + D.categories.map(c => '<option value="' + c.id + '">' + esc(c.name) + '</option>').join('');
    $('#acat').value = cur;
  }
  $('#aq').oninput = renderList; $('#acat').onchange = renderList;

  function renderList() {
    const q = $('#aq').value.trim().toLowerCase(), c = $('#acat').value;
    const items = D.items.filter(i => (!c || i.cat === c) && (!q || i.name.toLowerCase().includes(q)));
    $('#list').innerHTML = items.map(i =>
      '<div class="irow" data-id="' + i.id + '">' +
      '<div class="th">' + (i.img ? '<img src="' + esc(i.img) + '" alt="">' : catIcon(i.cat)) + '</div>' +
      '<div class="m"><b>' + esc(i.name) + '</b><small>' + esc(catName(i.cat)) + ' · ' + fmtPrice(i.price) + ' · ' + (i.kcal || 0) + ' ккал</small></div>' +
      '<label class="sw" title="Байгаа эсэх"><input type="checkbox" data-a="av" ' + (i.available !== false ? 'checked' : '') + '><i></i></label>' +
      '<button class="btn sm sec2" data-a="ed">Засах</button></div>').join('') || '<p class="empty">Хоол олдсонгүй</p>';
  }
  $('#list').addEventListener('click', e => {
    const row = e.target.closest('.irow'); if (!row) return;
    if (e.target.dataset.a === 'ed') openItem(row.dataset.id);
  });
  $('#list').addEventListener('change', e => {
    if (e.target.dataset.a !== 'av') return;
    const it = D.items.find(i => i.id === e.target.closest('.irow').dataset.id);
    it.available = e.target.checked; persist(it.name + (it.available ? ' байгаа' : ' дууссан гэж тэмдэглэлээ')); renderStats();
  });
  $('#addItem').onclick = () => openItem(null);

  // Хоол засах цонх
  function openItem(id) {
    const isNew = !id;
    const it = isNew ? { id: uid(), cat: ($('#acat').value || D.categories[0].id), name: '', desc: '', kcal: 0, price: 0, allergens: [], signature: false, available: true, img: '' }
                     : JSON.parse(JSON.stringify(D.items.find(i => i.id === id)));
    $('#mb').innerHTML =
      '<h3>' + (isNew ? 'Шинэ хоол нэмэх' : 'Хоол засах') + '</h3>' +
      '<div class="upl"><div id="pv">' + (it.img ? '<img src="' + esc(it.img) + '">' : '<div style="font-size:38px">📷</div><div style="color:var(--muted);font-size:13.5px;margin-bottom:8px">Зураг оруулаагүй байна</div>') + '</div>' +
      '<label class="btn sm" style="cursor:pointer">Зураг сонгох<input type="file" id="fimg" accept="image/*" style="display:none"></label> ' +
      '<button class="btn sm danger" id="rimg" ' + (it.img ? '' : 'style="display:none"') + '>Зураг устгах</button></div>' +
      '<label class="lbl">Нэр (Турк хэлээр)</label><input class="inp" id="f_name" value="' + esc(it.name) + '">' +
      '<label class="lbl">Тайлбар (найрлага)</label><textarea class="inp" id="f_desc">' + esc(it.desc) + '</textarea>' +
      '<div class="g2"><div><label class="lbl">Үнэ (₺)</label><input class="inp" id="f_price" type="number" min="0" value="' + it.price + '"></div>' +
      '<div><label class="lbl">Калори (ккал)</label><input class="inp" id="f_kcal" type="number" min="0" value="' + it.kcal + '"></div></div>' +
      '<label class="lbl">Ангилал</label><select class="inp" id="f_cat">' + D.categories.map(c => '<option value="' + c.id + '"' + (c.id === it.cat ? ' selected' : '') + '>' + esc(c.name) + '</option>').join('') + '</select>' +
      '<label class="lbl">Харшил үүсгэгч</label><div class="ach" id="f_al">' + ALLERGENS.map(a => '<label class="' + (it.allergens.includes(a.id) ? 'on' : '') + '"><input type="checkbox" value="' + a.id + '" ' + (it.allergens.includes(a.id) ? 'checked' : '') + '>' + icon(a.id, 26) + a.name + '</label>').join('') + '</div>' +
      '<label class="ach" style="display:flex;margin-bottom:12px"><span class="lbl" style="margin:0;flex:1">★ Онцлох хоол болгох</span><input type="checkbox" id="f_sig" ' + (it.signature ? 'checked' : '') + ' style="display:block"></label>' +
      '<div class="mact">' + (isNew ? '' : '<button class="btn danger" id="del">Устгах</button>') + '<button class="btn sec2" id="cancel">Болих</button><button class="btn" id="save">Хадгалах</button></div>';
    $('#modal').classList.add('open');

    $('#f_al').onchange = e => e.target.closest('label').classList.toggle('on', e.target.checked);
    $('#cancel').onclick = closeModal;
    $('#fimg').onchange = async e => {
      const f = e.target.files[0]; if (!f) return;
      $('#pv').innerHTML = '<div style="padding:16px;color:var(--muted)">Оруулж байна...</div>';
      try {
        it.img = await uploadImage(f);
        $('#pv').innerHTML = '<img src="' + esc(it.img) + '">'; $('#rimg').style.display = '';
      } catch (err) { toast(err.message || 'Алдаа'); $('#pv').innerHTML = it.img ? '<img src="' + esc(it.img) + '">' : '<div style="font-size:38px">📷</div>'; }
    };
    $('#rimg').onclick = () => { it.img = ''; $('#pv').innerHTML = '<div style="font-size:38px">📷</div>'; $('#rimg').style.display = 'none'; };
    if (!isNew) $('#del').onclick = () => {
      if (!confirm('«' + it.name + '» хоолыг устгах уу?')) return;
      D.items = D.items.filter(i => i.id !== it.id); persist('Устгалаа'); closeModal(); renderAll();
    };
    $('#save').onclick = () => {
      it.name = $('#f_name').value.trim();
      if (!it.name) { toast('Нэр оруулна уу'); return; }
      it.desc = $('#f_desc').value.trim();
      it.price = Number($('#f_price').value) || 0;
      it.kcal = Number($('#f_kcal').value) || 0;
      it.cat = $('#f_cat').value;
      it.allergens = [...document.querySelectorAll('#f_al input:checked')].map(x => x.value);
      it.signature = $('#f_sig').checked;
      const idx = D.items.findIndex(i => i.id === it.id);
      if (idx >= 0) D.items[idx] = it; else D.items.push(it);
      persist('Хадгаллаа ✓'); closeModal(); renderAll();
    };
  }
  function closeModal() { $('#modal').classList.remove('open'); }
  $('#modal').onclick = e => { if (e.target.id === 'modal') closeModal(); };

  // Зургийг жижигрүүлж Blob руу оруулах
  function shrink(file, max) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => {
        const im = new Image();
        im.onload = () => {
          const k = Math.min(1, max / Math.max(im.width, im.height));
          const c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
          c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
          c.toBlob(b => b ? res(b) : rej(), 'image/jpeg', 0.82);
        };
        im.onerror = rej; im.src = r.result;
      };
      r.readAsDataURL(file);
    });
  }
  async function uploadImage(file) {
    const blob = await shrink(file, 1200);
    const r = await fetch('/api/upload?name=' + encodeURIComponent(file.name), { method: 'POST', headers: { 'content-type': 'image/jpeg', 'x-admin-password': PW }, body: blob });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || 'Зураг оруулж чадсангүй');
    return j.url;
  }

  // Ангилал
  function renderCats() {
    $('#catList').innerHTML = D.categories.map((c, i) =>
      '<div class="card2" data-i="' + i + '"><div class="g2"><div><label class="lbl">Дүрс</label><input class="inp" data-k="icon" value="' + esc(c.icon) + '"></div>' +
      '<div><label class="lbl">Нэр (Турк хэлээр)</label><input class="inp" data-k="name" value="' + esc(c.name) + '"></div></div>' +
      '<label class="lbl">Дэд тайлбар</label><input class="inp" data-k="sub" value="' + esc(c.sub) + '">' +
      '<div class="mact" style="justify-content:flex-start"><button class="btn sm sec2" data-a="up">↑</button><button class="btn sm sec2" data-a="dn">↓</button><button class="btn sm danger" data-a="rm">Устгах</button></div></div>').join('');
  }
  $('#catList').addEventListener('input', e => {
    const i = Number(e.target.closest('.card2').dataset.i); D.categories[i][e.target.dataset.k] = e.target.value; persist();
  });
  $('#catList').addEventListener('click', e => {
    const a = e.target.dataset.a; if (!a) return;
    const i = Number(e.target.closest('.card2').dataset.i), cs = D.categories;
    if (a === 'up' && i > 0) [cs[i - 1], cs[i]] = [cs[i], cs[i - 1]];
    if (a === 'dn' && i < cs.length - 1) [cs[i + 1], cs[i]] = [cs[i], cs[i + 1]];
    if (a === 'rm') {
      if (D.items.some(x => x.cat === cs[i].id)) { toast('Эхлээд энэ ангилалын хоолуудыг зөөх эсвэл устгана уу'); return; }
      if (!confirm('Ангилал устгах уу?')) return; cs.splice(i, 1);
    }
    persist(); renderAll();
  });
  $('#addCat').onclick = () => { D.categories.push({ id: uid(), name: 'Шинэ ангилал', sub: '', icon: '🍽' }); persist(); renderAll(); };

  // Тохиргоо
  const FIELDS = [
    ['brand', 'Брэндийн нэр'], ['slogan', 'Уриа үг'], ['subSlogan', 'Уриа үгийн тайлбар'], ['notice', 'Анхааруулга мөр'],
    ['location', 'Байршил'], ['hours', 'Ажиллах цаг'], ['instagram', 'Instagram хаяг'], ['phone', 'Утасны дугаар']
  ];
  function renderSettings() {
    $('#setForm').innerHTML = FIELDS.map(([k, l]) => '<label class="lbl">' + l + '</label><input class="inp" data-k="' + k + '" value="' + esc(D.settings[k]) + '">').join('') +
      '<label class="lbl">Хоолны картууд (таслалаар тусга)</label><input class="inp" data-k="mealCards" value="' + esc((D.settings.mealCards || []).join(', ')) + '">';
  }
  $('#saveSet').onclick = () => {
    document.querySelectorAll('#setForm input').forEach(inp => {
      const k = inp.dataset.k;
      D.settings[k] = k === 'mealCards' ? inp.value.split(',').map(s => s.trim()).filter(Boolean) : inp.value.trim();
    });
    persist('Тохиргоо хадгалагдлаа');
  };

  // Өгөгдөл
  $('#exp').onclick = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(D, null, 2)], { type: 'application/json' }));
    a.download = 'menu.json'; a.click();
  };
  $('#imp').onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const j = JSON.parse(r.result);
        if (!j.items || !j.categories || !j.settings) throw 0;
        D = j; renderAll(); persist('Оруулж дууслаа ✓');
      } catch (x) { toast('Файл буруу байна'); }
    };
    r.readAsText(f);
  };
  $('#reset').onclick = async () => {
    if (!confirm('Бүх өөрчлөлт устаж, репод байгаа анхны цэс сэргээгдэнэ. Үргэлжлүүлэх үү?')) return;
    D = await loadBase(); renderAll(); await save(); toast('Анхны цэс сэргээгдлээ');
  };
})();
