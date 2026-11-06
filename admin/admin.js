(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const TAGS = { signature: "Онцлох", new: "Шинэ", spicy: "Халуун ногоотой", veg: "Цагаан хоол" };
  const PW_KEY = "iff_admin_pw";

  const st = {
    pw: sess("get") || "",
    data: null,
    storage: false,
    dirty: false,
    tab: "menu",
    openCats: new Set(),
    openItems: new Set()
  };

  function sess(op, v) { try { return op === "get" ? sessionStorage.getItem(PW_KEY) : op === "set" ? sessionStorage.setItem(PW_KEY, v) : sessionStorage.removeItem(PW_KEY); } catch { return null; } }
  function toast(msg, err = false) {
    const t = $("#toast"); t.textContent = msg; t.className = "toast" + (err ? " err" : ""); t.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(() => (t.hidden = true), err ? 6000 : 2600);
  }
  const slug = (s) => (String(s || "").toLocaleLowerCase("tr").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "x") + "_" + Math.random().toString(36).slice(2, 6);

  async function api(path, opts = {}) {
    const r = await fetch(path, { ...opts, headers: { "x-admin-password": st.pw, ...(opts.headers || {}) } });
    let body = null; try { body = await r.json(); } catch { /* ignore */ }
    if (!r.ok) throw new Error(body?.error || `Алдаа (${r.status})`);
    return body;
  }

  /* ---------- auth ---------- */
  async function login(pw) {
    st.pw = pw;
    const res = await api("/api/login", { method: "POST" });
    sess("set", pw);
    st.storage = !!res.storage;
    $("#login").hidden = true; $("#app").hidden = false;
    $("#storageWarn").hidden = st.storage;
    await loadData();
  }
  $("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    $("#loginErr").textContent = "";
    try { await login($("#pw").value); } catch (err) { $("#loginErr").textContent = err.message; }
  });
  $("#logout").addEventListener("click", () => {
    if (st.dirty && !confirm("Хадгалаагүй өөрчлөлт байна. Гарах уу?")) return;
    sess("del"); location.reload();
  });
  if (st.pw) login(st.pw).catch(() => sess("del"));

  async function loadData() {
    let data = null;
    try { const r = await fetch("/api/menu?fresh=" + Date.now(), { cache: "no-store" }); if (r.ok) data = await r.json(); } catch { /* ignore */ }
    if (!data) data = await (await fetch("/data/menu.json", { cache: "no-store" })).json();
    data.promos ||= []; data.media ||= [];
    st.data = data;
    if (data.categories[0]) st.openCats.add(data.categories[0].id);
    renderAll();
  }

  /* ---------- dirty / save ---------- */
  function markDirty() {
    st.dirty = true;
    $("#savebar").classList.add("dirty");
    $("#saveState").textContent = "Хадгалаагүй өөрчлөлт байна";
    $("#saveBtn").disabled = !st.storage;
  }
  async function save() {
    $("#saveBtn").disabled = true; $("#saveState").textContent = "Хадгалж байна…";
    try {
      const res = await api("/api/menu", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(st.data) });
      st.data.updatedAt = res.updatedAt; st.dirty = false;
      $("#savebar").classList.remove("dirty");
      $("#saveState").textContent = "Хадгалагдлаа. Цэс 1 минутын дотор шинэчлэгдэнэ.";
      toast("Амжилттай хадгалагдлаа");
    } catch (err) {
      $("#saveBtn").disabled = false; $("#saveState").textContent = "Хадгалж чадсангүй"; toast(err.message, true);
    }
  }
  $("#saveBtn").addEventListener("click", save);
  window.addEventListener("beforeunload", (e) => { if (st.dirty) { e.preventDefault(); e.returnValue = ""; } });
  document.addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); if (st.dirty && st.storage) save(); } });

  /* ---------- path binding ---------- */
  function getPath(path) { return path.split(".").reduce((o, k) => (o == null ? o : o[k]), st.data); }
  function setPath(path, value) {
    const keys = path.split("."); const last = keys.pop();
    let o = st.data;
    for (const k of keys) { if (o[k] == null || typeof o[k] !== "object") o[k] = {}; o = o[k]; }
    o[last] = value;
  }
  document.addEventListener("input", (e) => {
    const el = e.target.closest("[data-bind]"); if (!el) return;
    let v = el.type === "checkbox" ? el.checked : el.value;
    if (el.dataset.type === "number") v = el.value === "" ? 0 : Number(el.value);
    setPath(el.dataset.bind, v);
    markDirty();
    if (el.dataset.live) { const t = document.getElementById(el.dataset.live); if (t) t.textContent = v; }
    if (el.type === "checkbox" && el.closest(".item")) el.closest(".item").classList.toggle("off", !v);
  });

  const input = (label, path, { type = "text", textarea = false, live = "", ph = "", cls = "" } = {}) => {
    const v = getPath(path) ?? "";
    const common = `data-bind="${path}" ${type === "number" ? 'data-type="number" inputmode="numeric" min="0"' : ""} ${live ? `data-live="${live}"` : ""} placeholder="${esc(ph)}"`;
    return `<label class="field ${cls}"><span>${label}</span>${textarea ? `<textarea ${common}>${esc(v)}</textarea>` : `<input type="${type}" value="${esc(v)}" ${common}>`}</label>`;
  };
  const toggle = (label, path, def = true) => {
    const v = getPath(path); const on = v === undefined ? def : !!v;
    return `<label class="toggle"><input type="checkbox" data-bind="${path}" ${on ? "checked" : ""}><span></span>${label}</label>`;
  };
  const alIcon = (k) => { const a = window.ALLERGENS[k]; return `<span class="al" style="--al-bg:${a.color}" aria-hidden="true">${a.svg}</span>`; };
  const CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';

  /* ---------- render ---------- */
  function renderAll() { renderMenu(); renderMedia(); renderBrand(); renderBackup(); }

  function renderMenu() {
    const cats = st.data.categories;
    const count = cats.reduce((n, c) => n + c.items.length, 0);
    $("#panelMenu").innerHTML = `
      <div class="h"><div><h2>Цэс</h2><p>${cats.length} ангилал, ${count} хоол. Нэр дээр дарж засна.</p></div>
        <button class="btn btn--gold" data-act="addCat" type="button">+ Ангилал нэмэх</button></div>
      ${cats.map((c, ci) => catBlock(c, ci)).join("")}`;
  }

  function catBlock(c, ci) {
    const p = `categories.${ci}`;
    const open = st.openCats.has(c.id);
    return `<article class="cat ${open ? "open" : ""}" data-cat="${esc(c.id)}">
      <div class="cat__head">
        <button class="cat__title" type="button" data-act="toggleCat" data-ci="${ci}" aria-expanded="${open}">${CHEV}<b id="cn_${ci}">${esc(c.name)}</b><small>${c.items.length} хоол</small></button>
        ${toggle("Харагдах", `${p}.visible`)}
        <button class="btn btn--sm icon" type="button" data-act="moveCat" data-ci="${ci}" data-d="-1" aria-label="Дээш">↑</button>
        <button class="btn btn--sm icon" type="button" data-act="moveCat" data-ci="${ci}" data-d="1" aria-label="Доош">↓</button>
        <button class="btn btn--sm btn--danger" type="button" data-act="delCat" data-ci="${ci}">Устгах</button>
      </div>
      <div class="cat__body">
        <div class="cat__meta">
          ${input("Ангиллын нэр (Турк хэлээр)", `${p}.name`, { live: `cn_${ci}` })}
          <div class="grid2">${input("Дэд гарчиг (Монгол)", `${p}.subtitle.mn`)}${input("Дэд гарчиг (Турк)", `${p}.subtitle.tr`)}</div>
        </div>
        ${c.items.map((it, ii) => itemBlock(it, ci, ii)).join("")}
        <button class="btn btn--gold" type="button" data-act="addItem" data-ci="${ci}">+ Хоол нэмэх</button>
      </div>
    </article>`;
  }

  function itemBlock(it, ci, ii) {
    const p = `categories.${ci}.items.${ii}`;
    const open = st.openItems.has(it.id);
    const al = new Set(it.allergens || []); const tg = new Set(it.tags || []);
    return `<div class="item ${open ? "open" : ""} ${it.available === false ? "off" : ""}">
      <div class="item__row">
        <button class="item__name" type="button" data-act="toggleItem" data-id="${esc(it.id)}" aria-expanded="${open}"><span id="in_${ci}_${ii}">${esc(it.name)}</span><small>${(it.allergens || []).length} харшил · ${esc(it.kcal)} kcal</small></button>
        <label class="field mini"><span>Үнэ ₺</span><input type="number" min="0" inputmode="numeric" data-type="number" data-bind="${p}.price" value="${esc(it.price)}"></label>
        <label class="field mini"><span>kcal</span><input type="number" min="0" inputmode="numeric" data-type="number" data-bind="${p}.kcal" value="${esc(it.kcal)}"></label>
        ${toggle("Байгаа", `${p}.available`)}
      </div>
      <div class="item__edit">
        ${input("Хоолны нэр (Турк хэлээр)", `${p}.name`, { live: `in_${ci}_${ii}` })}
        <div class="grid2">${input("Тайлбар (Монгол)", `${p}.desc.mn`, { textarea: true })}${input("Тайлбар (Турк)", `${p}.desc.tr`, { textarea: true })}</div>
        <div class="field"><span>Харшил үүсгэгч</span><div class="chips">
          ${window.ALLERGEN_ORDER.map((k) => `<button type="button" class="achip" data-act="al" data-ci="${ci}" data-ii="${ii}" data-k="${k}" aria-pressed="${al.has(k)}">${alIcon(k)}${esc(window.ALLERGENS[k].mn)}</button>`).join("")}
        </div></div>
        <div class="field"><span>Тэмдэглэгээ</span><div class="chips">
          ${Object.entries(TAGS).map(([k, v]) => `<button type="button" class="achip tchip" data-act="tag" data-ci="${ci}" data-ii="${ii}" data-k="${k}" aria-pressed="${tg.has(k)}">${v}</button>`).join("")}
        </div></div>
        <div class="row-actions">
          <button class="btn btn--sm" type="button" data-act="moveItem" data-ci="${ci}" data-ii="${ii}" data-d="-1">↑ Дээш</button>
          <button class="btn btn--sm" type="button" data-act="moveItem" data-ci="${ci}" data-ii="${ii}" data-d="1">↓ Доош</button>
          <button class="btn btn--sm" type="button" data-act="dupItem" data-ci="${ci}" data-ii="${ii}">Хуулбарлах</button>
          <button class="btn btn--sm btn--danger" type="button" data-act="delItem" data-ci="${ci}" data-ii="${ii}">Устгах</button>
        </div>
      </div>
    </div>`;
  }

  function renderMedia() {
    const d = st.data;
    $("#panelMedia").innerHTML = `
      <div class="h"><div><h2>Зураг</h2><p>Лого, сурталчилгааны баннер зэрэг зургаа энд оруулна. Цэсэнд бүтээгдэхүүний зураг харагдахгүй.</p></div></div>
      <div class="panel">
        <label class="drop" id="drop" tabindex="0">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-8 8"/></svg>
          <b>Зураг сонгох эсвэл энд чирж оруулах</b>
          <small>JPG, PNG, WEBP. Том зургийг автоматаар 1600px болгон шахна.</small>
          <input type="file" id="file" accept="image/*" multiple hidden>
        </label>
        <div class="uploads" id="uploads"></div>
        ${st.storage ? "" : '<p class="muted">Зураг оруулахын тулд Vercel Blob холбогдсон байх шаардлагатай.</p>'}
      </div>
      <div class="panel">
        <h3>Сурталчилгааны баннер (${d.promos.length})</h3>
        <p class="muted">Цэсийн дээд хэсэгт гүйдэг баннер болж харагдана. Доорх зургуудаас "Баннер болгох" дарж нэмнэ.</p>
        ${d.promos.map((pr, i) => `<div class="promo">
          <img src="${esc(pr.image)}" alt="">
          <div>
            <div class="grid2">${input("Гарчиг (Монгол)", `promos.${i}.title.mn`)}${input("Гарчиг (Турк)", `promos.${i}.title.tr`)}${input("Текст (Монгол)", `promos.${i}.text.mn`)}${input("Текст (Турк)", `promos.${i}.text.tr`)}</div>
            <div class="row-actions">${toggle("Идэвхтэй", `promos.${i}.active`)}
              <button class="btn btn--sm" type="button" data-act="movePromo" data-i="${i}" data-d="-1">↑</button>
              <button class="btn btn--sm" type="button" data-act="movePromo" data-i="${i}" data-d="1">↓</button>
              <button class="btn btn--sm btn--danger" type="button" data-act="delPromo" data-i="${i}">Хасах</button></div>
          </div></div>`).join("") || '<p class="muted">Одоогоор баннер алга.</p>'}
      </div>
      <div class="panel">
        <h3>Зургийн сан (${d.media.length})</h3>
        <div class="gallery">${d.media.map((m, i) => `<div class="tile ${d.brand.logo === m.url ? "is-logo" : ""}">
          <img src="${esc(m.url)}" alt="${esc(m.name)}" loading="lazy">
          <div class="tile__body"><small title="${esc(m.name)}">${esc(m.name)}</small>
            <button class="btn btn--sm btn--gold" type="button" data-act="asPromo" data-i="${i}">Баннер болгох</button>
            <button class="btn btn--sm" type="button" data-act="asLogo" data-i="${i}">${d.brand.logo === m.url ? "Одоогийн лого" : "Лого болгох"}</button>
            <button class="btn btn--sm" type="button" data-act="copyUrl" data-i="${i}">Холбоос хуулах</button>
            <button class="btn btn--sm btn--danger" type="button" data-act="delMedia" data-i="${i}">Устгах</button>
          </div></div>`).join("") || '<p class="muted">Зураг ороогүй байна.</p>'}</div>
        ${d.brand.logo !== "/assets/logo.webp" ? '<div class="row-actions"><button class="btn btn--sm" type="button" data-act="resetLogo">Анхны лого руу буцаах</button></div>' : ""}
      </div>`;
    bindDrop();
  }

  function renderBrand() {
    const b = "brand";
    $("#panelBrand").innerHTML = `
      <div class="h"><div><h2>Мэдээлэл</h2><p>Уриа үг, хаяг, холбоо барих мэдээлэл.</p></div></div>
      <div class="panel"><h3>Уриа ба зар</h3>
        <div class="grid2">
          ${input("Уриа үг (Монгол)", `${b}.slogan.mn`)}${input("Уриа үг (Турк)", `${b}.slogan.tr`)}
          ${input("Товч танилцуулга (Монгол)", `${b}.tagline.mn`, { textarea: true })}${input("Товч танилцуулга (Турк)", `${b}.tagline.tr`, { textarea: true })}
          ${input("Анхааруулга зурвас (Монгол)", `${b}.notice.mn`)}${input("Анхааруулга зурвас (Турк)", `${b}.notice.tr`)}
          ${input("Төгсгөлийн мэндчилгээ (Монгол)", `${b}.footer.mn`)}${input("Төгсгөлийн мэндчилгээ (Турк)", `${b}.footer.tr`)}
        </div></div>
      <div class="panel"><h3>Холбоо барих</h3>
        <div class="grid2">
          ${input("Хаяг", `${b}.address`)}${input("Газрын зургийн холбоос", `${b}.mapUrl`, { type: "url" })}
          ${input("Утас", `${b}.phone`, { type: "tel" })}${input("Instagram (@ тэмдэггүй)", `${b}.instagram`)}
          ${input("WiFi нэр", `${b}.wifi`)}${input("Цагийн хуваарь (Монгол)", `${b}.hours.mn`)}
          ${input("Цагийн хуваарь (Турк)", `${b}.hours.tr`)}
          <div class="grid2">${input("Нээх цаг", `${b}.open`, { type: "time" })}${input("Хаах цаг", `${b}.close`, { type: "time" })}</div>
        </div></div>`;
  }

  function renderBackup() {
    $("#panelBackup").innerHTML = `
      <div class="h"><div><h2>Нөөц</h2><p>Сүүлд хадгалсан: ${esc(st.data.updatedAt ? new Date(st.data.updatedAt).toLocaleString("mn-MN") : "тодорхойгүй")}</p></div></div>
      <div class="panel"><h3>JSON файл</h3>
        <p class="muted">Бүх цэсийг нэг файлаар татаж авах эсвэл өмнөх нөөцөөс сэргээх боломжтой. Хадгалах сан холбогдоогүй үед татаж авсан файлаа GitHub репогийн data/menu.json файлтай сольж болно.</p>
        <div class="row-actions">
          <button class="btn btn--gold" type="button" data-act="export">JSON татах</button>
          <label class="btn">JSON оруулах<input type="file" id="importFile" accept="application/json,.json" hidden></label>
          <button class="btn btn--danger" type="button" data-act="resetDefault">Анхны цэс рүү буцаах</button>
        </div></div>
      <div class="panel"><h3>QR кодууд</h3>
        <p class="muted">Хэвлэхэд бэлэн хоёр загвар. Хоёулаа ${esc(location.origin)} хаяг руу заана.</p>
        <div class="gallery">
          <div class="tile"><img src="/qr/qr_table_card.png" alt="Ширээний QR карт"><div class="tile__body"><small>Ширээний карт (10x15 см)</small><a class="btn btn--sm btn--gold" href="/qr/qr_table_card.png" download>PNG татах</a></div></div>
          <div class="tile"><img src="/qr/qr_sticker.png" alt="Дугуй QR наалт"><div class="tile__body"><small>Дугуй наалт / цонхны постер</small><a class="btn btn--sm btn--gold" href="/qr/qr_sticker.png" download>PNG татах</a></div></div>
        </div></div>`;
    $("#importFile").addEventListener("change", async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try {
        const d = JSON.parse(await f.text());
        if (!Array.isArray(d.categories) || !d.brand) throw new Error("Цэсний бүтэц буруу байна.");
        d.promos ||= []; d.media ||= [];
        st.data = d; renderAll(); markDirty(); toast("Файл орлоо. Хадгалах товч дарна уу.");
      } catch (err) { toast(err.message || "Файл уншиж чадсангүй", true); }
    });
  }

  /* ---------- actions ---------- */
  const move = (arr, i, d) => { const j = i + d; if (j < 0 || j >= arr.length) return false; [arr[i], arr[j]] = [arr[j], arr[i]]; return true; };
  document.addEventListener("click", async (e) => {
    const tabBtn = e.target.closest("[data-tab]");
    if (tabBtn) {
      st.tab = tabBtn.dataset.tab;
      document.querySelectorAll("[data-tab]").forEach((b) => b.setAttribute("aria-selected", String(b === tabBtn)));
      document.querySelectorAll("[data-panel]").forEach((p) => (p.hidden = p.dataset.panel !== st.tab));
      if (st.tab === "backup") renderBackup();
      window.scrollTo({ top: 0 });
      return;
    }
    const el = e.target.closest("[data-act]"); if (!el) return;
    const d = st.data, ci = +el.dataset.ci, ii = +el.dataset.ii, i = +el.dataset.i, dir = +el.dataset.d;
    const cat = d.categories[ci];
    switch (el.dataset.act) {
      case "toggleCat": { const id = cat.id; st.openCats.has(id) ? st.openCats.delete(id) : st.openCats.add(id); el.closest(".cat").classList.toggle("open"); el.setAttribute("aria-expanded", String(st.openCats.has(id))); return; }
      case "toggleItem": { const id = el.dataset.id; st.openItems.has(id) ? st.openItems.delete(id) : st.openItems.add(id); el.closest(".item").classList.toggle("open"); el.setAttribute("aria-expanded", String(st.openItems.has(id))); return; }
      case "addCat": { const c = { id: slug("angilal"), name: "Yeni Kategori", subtitle: { mn: "", tr: "" }, items: [] }; d.categories.push(c); st.openCats.add(c.id); break; }
      case "moveCat": if (!move(d.categories, ci, dir)) return; break;
      case "delCat": if (!confirm(`"${cat.name}" ангиллыг доторх ${cat.items.length} хоолтой нь устгах уу?`)) return; d.categories.splice(ci, 1); break;
      case "addItem": { const it = { id: slug("urun"), name: "Yeni Ürün", desc: { mn: "", tr: "" }, price: 0, kcal: 0, allergens: [], tags: [], available: true }; cat.items.push(it); st.openItems.add(it.id); break; }
      case "moveItem": if (!move(cat.items, ii, dir)) return; break;
      case "dupItem": { const c = JSON.parse(JSON.stringify(cat.items[ii])); c.id = slug(c.name); c.name += " 2"; cat.items.splice(ii + 1, 0, c); st.openItems.add(c.id); break; }
      case "delItem": if (!confirm(`"${cat.items[ii].name}" устгах уу?`)) return; cat.items.splice(ii, 1); break;
      case "al": case "tag": {
        const key = el.dataset.act === "al" ? "allergens" : "tags";
        const it = cat.items[ii]; const s = new Set(it[key] || []); const k = el.dataset.k;
        s.has(k) ? s.delete(k) : s.add(k);
        it[key] = key === "allergens" ? window.ALLERGEN_ORDER.filter((x) => s.has(x)) : [...s];
        el.setAttribute("aria-pressed", String(s.has(k)));
        markDirty(); return;
      }
      case "asPromo": d.promos.push({ image: d.media[i].url, title: { mn: "", tr: "" }, text: { mn: "", tr: "" }, active: true }); toast("Баннер нэмэгдлээ"); break;
      case "movePromo": if (!move(d.promos, i, dir)) return; break;
      case "delPromo": d.promos.splice(i, 1); break;
      case "asLogo": d.brand.logo = d.media[i].url; toast("Лого солигдлоо"); break;
      case "resetLogo": d.brand.logo = "/assets/logo.webp"; break;
      case "copyUrl": try { await navigator.clipboard.writeText(d.media[i].url); toast("Холбоос хуулагдлаа"); } catch { prompt("Холбоос:", d.media[i].url); } return;
      case "delMedia": {
        const m = d.media[i];
        if (!confirm("Энэ зургийг бүрмөсөн устгах уу?")) return;
        try { await api("/api/upload", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: m.url }) }); } catch (err) { toast(err.message, true); return; }
        d.media.splice(i, 1);
        d.promos = d.promos.filter((p) => p.image !== m.url);
        if (d.brand.logo === m.url) d.brand.logo = "/assets/logo.webp";
        markDirty(); renderMedia(); save(); return;
      }
      case "export": {
        const blob = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `menu_${new Date().toISOString().slice(0, 10)}.json`; a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000); return;
      }
      case "resetDefault": {
        if (!confirm("Бүх өөрчлөлтийг арилгаж анхны цэс рүү буцах уу? (Хадгалах дарснаар баталгаажна)")) return;
        const def = await (await fetch("/data/menu.json", { cache: "no-store" })).json();
        def.media = d.media; def.promos = []; st.data = def; renderAll(); markDirty(); return;
      }
      default: return;
    }
    markDirty();
    if (["asPromo", "movePromo", "delPromo", "asLogo", "resetLogo"].includes(el.dataset.act)) renderMedia(); else renderMenu();
  });

  /* ---------- uploads ---------- */
  function bindDrop() {
    const drop = $("#drop"), file = $("#file");
    if (!drop) return;
    drop.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); file.click(); } });
    ["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("over"); }));
    ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("over"); }));
    drop.addEventListener("drop", (e) => uploadFiles(e.dataTransfer.files));
    file.addEventListener("change", () => uploadFiles(file.files));
  }

  async function shrink(f) {
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) return f;
    const bmp = await createImageBitmap(f).catch(() => null);
    if (!bmp) return f;
    const max = 1600, k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    if (k === 1 && f.size < 900_000) return f;
    const c = document.createElement("canvas"); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    const out = await new Promise((r) => c.toBlob(r, "image/webp", 0.85));
    return out && out.size < f.size ? new File([out], f.name.replace(/\.\w+$/, ".webp"), { type: "image/webp" }) : f;
  }

  async function uploadFiles(list) {
    if (!st.storage) { toast("Хадгалах сан холбогдоогүй тул зураг оруулах боломжгүй.", true); return; }
    const box = $("#uploads");
    for (const orig of [...list]) {
      if (!orig.type.startsWith("image/")) { toast(`${orig.name}: зураг биш байна`, true); continue; }
      const row = document.createElement("div"); row.className = "up";
      row.innerHTML = `<span>${esc(orig.name)}</span><progress></progress>`; box.append(row);
      try {
        const f = await shrink(orig);
        const res = await api(`/api/upload?name=${encodeURIComponent(f.name)}`, { method: "POST", headers: { "content-type": f.type }, body: f });
        st.data.media.unshift({ url: res.url, name: orig.name, size: res.size, uploadedAt: new Date().toISOString() });
        row.innerHTML = `<span>✓ ${esc(orig.name)}</span>`;
      } catch (err) {
        row.innerHTML = `<span>✕ ${esc(orig.name)}: ${esc(err.message)}</span>`;
      }
    }
    renderMedia(); markDirty(); save();
  }
})();
