(() => {
  "use strict";

  const T = {
    mn: {
      searchPh: "Хоолны нэрээр хайх…",
      search: "Хайх", filter: "Харшлын шүүлтүүр", close: "Хаах", toTop: "Дээш буцах",
      picksTitle: "Тогоочийн онцлох", picksSub: "Манай хамгийн их захиалагддаг амтууд",
      legendScript: "харшил", legendTitle: "Харшлын тэмдэглэгээ",
      legendLead: "Хоол бүрийн доор харшил үүсгэгч орцыг өнгөт тэмдгээр харуулав.",
      fineprint: "Үнэ Турк лираар (₺), KDV багтсан. Бүх хоол ижил гал тогоонд бэлтгэгддэг тул бага хэмжээний харшил үүсгэгч агуулж болно. Харшилтай бол ажилтанд урьдчилан хэлнэ үү.",
      admin: "Удирдлага",
      filterTitle: "Харшлын шүүлтүүр",
      filterLead: "Танд тохирохгүй орцыг сонгоно уу. Тэдгээрийг агуулсан хоолыг нууна.",
      onlyVeg: "Зөвхөн цагаан хоол", noSpicy: "Халуун ногоогүй",
      reset: "Цэвэрлэх", show: (n) => `${n} хоол харуулах`,
      open: "Одоо нээлттэй", closed: "Одоо хаалттай",
      signature: "Онцлох", new: "Шинэ", spicy: "Халуун", veg: "Цагаан хоол", out: "Дууссан",
      kcal: "Илчлэг", price: "Үнэ", allergensH: "Харшил үүсгэгч", noAllergens: "Бүртгэгдсэн харшил үүсгэгч байхгүй",
      emptySearch: (q) => `"${q}" гэсэн хоол олдсонгүй. Өөр үгээр хайгаад үзээрэй.`,
      emptyFilter: "Сонгосон шүүлтүүрт тохирох хоол алга. Шүүлтүүрээ багасгана уу.",
      infoTitle: "Бидэнтэй холбогдох", address: "Хаяг", hours: "Цагийн хуваарь", phone: "Утас", instagram: "Instagram", wifi: "WiFi",
      mapOpen: "Газрын зураг нээх", items: "хоол",
      ribbon: ["Шарахаас шууд", "Истанбулын амт", "Döner", "Burger", "Lahmacun", "Baklava", "Ayran", "Afiyet olsun"]
    },
    tr: {
      searchPh: "Ürün ara…",
      search: "Ara", filter: "Alerjen filtresi", close: "Kapat", toTop: "Yukarı çık",
      picksTitle: "Ustanın Seçimi", picksSub: "En çok sevilen lezzetlerimiz",
      legendScript: "alerjenler", legendTitle: "Alerjen Bilgisi",
      legendLead: "Her ürünün altında içerdiği alerjenler renkli simgelerle gösterilir.",
      fineprint: "Fiyatlar Türk lirası (₺) olup KDV dahildir. Tüm ürünler aynı mutfakta hazırlandığı için eser miktarda alerjen içerebilir. Alerjiniz varsa lütfen personele bildiriniz.",
      admin: "Yönetim",
      filterTitle: "Alerjen Filtresi",
      filterLead: "Kaçınmak istediğiniz içerikleri seçin, bunları içeren ürünler gizlenir.",
      onlyVeg: "Sadece vejetaryen", noSpicy: "Acısız",
      reset: "Temizle", show: (n) => `${n} ürünü göster`,
      open: "Şu an açık", closed: "Şu an kapalı",
      signature: "İmza", new: "Yeni", spicy: "Acılı", veg: "Vejetaryen", out: "Tükendi",
      kcal: "Kalori", price: "Fiyat", allergensH: "Alerjenler", noAllergens: "Kayıtlı alerjen yok",
      emptySearch: (q) => `"${q}" için sonuç bulunamadı.`,
      emptyFilter: "Seçtiğiniz filtreye uygun ürün yok.",
      infoTitle: "Bize ulaşın", address: "Adres", hours: "Çalışma saatleri", phone: "Telefon", instagram: "Instagram", wifi: "WiFi",
      mapOpen: "Haritada aç", items: "ürün",
      ribbon: ["Ocaktan sıcak", "İstanbul lezzeti", "Döner", "Burger", "Lahmacun", "Baklava", "Ayran", "Afiyet olsun"]
    }
  };

  const ICON = {
    pin: '<svg viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>',
    ig: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/></svg>',
    wifi: '<svg viewBox="0 0 24 24"><path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r=".8" fill="currentColor"/></svg>',
    flame: '<svg viewBox="0 0 24 24"><path d="M12 2s5 4.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 1.5-4S9 11 11 11c0-4 1-9 1-9z"/></svg>'
  };

  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fold = (v) => String(v || "").toLocaleLowerCase("tr").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i");
  const fmtPrice = (n) => `${new Intl.NumberFormat("tr-TR").format(Number(n) || 0)} ₺`;
  const L = (obj) => (obj && typeof obj === "object" ? obj[state.lang] || obj.mn || obj.tr || "" : obj || "");

  const state = {
    lang: safeGet("iff_lang") || "mn",
    data: null,
    query: "",
    exclude: new Set(),
    veg: false,
    noSpicy: false
  };

  function safeGet(k) { try { return localStorage.getItem(k); } catch { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } }

  /* ---------- data ---------- */
  async function load() {
    try {
      const r = await fetch("/api/menu", { headers: { accept: "application/json" } });
      if (!r.ok) throw new Error(r.status);
      return await r.json();
    } catch {
      const r = await fetch("/data/menu.json");
      return r.json();
    }
  }

  /* ---------- helpers ---------- */
  function alBadge(key, withTitle = true) {
    const a = window.ALLERGENS[key];
    if (!a) return "";
    const name = state.lang === "tr" ? a.tr : a.mn;
    return `<span class="al" style="--al-bg:${a.color}" ${withTitle ? `title="${esc(name)}" role="img" aria-label="${esc(name)}"` : 'aria-hidden="true"'}>${a.svg}</span>`;
  }
  function tagBadges(item) {
    const t = T[state.lang];
    const out = (item.tags || []).filter((x) => t[x]).map((x) => `<span class="tag tag--${x}">${t[x]}</span>`);
    if (item.available === false) out.unshift(`<span class="tag tag--out">${t.out}</span>`);
    return out.join("");
  }
  function highlight(text) {
    const q = state.query.trim();
    if (!q) return esc(text);
    const f = fold(text), fq = fold(q);
    const i = f.indexOf(fq);
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + "<mark>" + esc(text.slice(i, i + q.length)) + "</mark>" + esc(text.slice(i + q.length));
  }
  function passes(item) {
    if (state.exclude.size && (item.allergens || []).some((a) => state.exclude.has(a))) return false;
    if (state.veg && !(item.tags || []).includes("veg")) return false;
    if (state.noSpicy && (item.tags || []).includes("spicy")) return false;
    const q = fold(state.query.trim());
    if (q) {
      const hay = fold([item.name, item.desc?.mn, item.desc?.tr].join(" "));
      if (!hay.includes(q)) return false;
    }
    return true;
  }
  function filterCount() {
    return state.data.categories.reduce((n, c) => n + c.items.filter(passes).length, 0);
  }

  /* ---------- open status ---------- */
  function openStatus() {
    const b = state.data.brand, el = $("#openStatus"), t = T[state.lang];
    if (!b.open || !b.close) { el.textContent = L(b.hours); return; }
    const toMin = (s) => { const [h, m] = s.split(":").map(Number); return h * 60 + (m || 0); };
    // Venue time is Istanbul (UTC+3, no DST).
    const now = new Date(Date.now() + (new Date().getTimezoneOffset() + 180) * 60000);
    const cur = now.getHours() * 60 + now.getMinutes();
    const o = toMin(b.open), c = toMin(b.close);
    const isOpen = o < c ? cur >= o && cur < c : cur >= o || cur < c;
    el.textContent = `${isOpen ? t.open : t.closed} · ${b.open} / ${b.close}`;
    el.className = "brand__status " + (isOpen ? "is-open" : "is-closed");
  }

  /* ---------- render ---------- */
  function renderStatic() {
    const t = T[state.lang], b = state.data.brand;
    document.documentElement.lang = state.lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => { const v = t[el.dataset.i18n]; if (typeof v === "string") el.textContent = v; });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => (el.placeholder = t[el.dataset.i18nPlaceholder]));
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t[el.dataset.i18nAria]));
    document.querySelectorAll(".lang button").forEach((bt) => bt.setAttribute("aria-pressed", String(bt.dataset.lang === state.lang)));

    if (b.logo) { $("#brandLogo").src = b.logo; $("#heroLogo").src = b.logo; }
    $("#heroSlogan").textContent = L(b.slogan);
    $("#heroTagline").textContent = L(b.tagline);
    const notice = L(b.notice);
    $("#notice").textContent = notice; $("#notice").hidden = !notice;
    $("#footerThanks").textContent = L(b.footer);
    $("#year").textContent = new Date().getFullYear();

    const chips = [];
    if (b.address) chips.push(`<a class="chip" href="${esc(b.mapUrl || "https://maps.google.com/?q=" + encodeURIComponent(b.address))}" target="_blank" rel="noopener">${ICON.pin}${esc(b.address.split(",").slice(-2).join(",").trim())}</a>`);
    if (b.instagram) chips.push(`<a class="chip" href="https://instagram.com/${esc(b.instagram)}" target="_blank" rel="noopener">${ICON.ig}@${esc(b.instagram)}</a>`);
    if (b.phone) chips.push(`<a class="chip" href="tel:${esc(b.phone.replace(/\s/g, ""))}">${ICON.phone}${esc(b.phone)}</a>`);
    $("#heroChips").innerHTML = chips.join("");

    const words = t.ribbon.concat(t.ribbon);
    $("#ribbon").innerHTML = words.concat(words).map((w) => `<span>${esc(w)}</span>`).join("");

    // promos (uploaded banner images)
    const promos = (state.data.promos || []).filter((p) => p.image && p.active !== false);
    $("#promos").hidden = !promos.length;
    $("#promos").innerHTML = promos.map((p) => `<figure class="promo"><img src="${esc(p.image)}" alt="${esc(L(p.title))}" loading="lazy">${L(p.title) || L(p.text) ? `<figcaption><b>${esc(L(p.title))}</b><span>${esc(L(p.text))}</span></figcaption>` : ""}</figure>`).join("");

    // legend
    $("#legendGrid").innerHTML = window.ALLERGEN_ORDER.map((k) => { const a = window.ALLERGENS[k]; return `<li>${alBadge(k, false)}<span>${esc(state.lang === "tr" ? a.tr : a.mn)}</span></li>`; }).join("");

    // info card
    const rows = [];
    if (b.address) rows.push(`<a class="inforow" href="${esc(b.mapUrl || "#")}" target="_blank" rel="noopener">${ICON.pin}<span><small>${t.address}</small><b>${esc(b.address)}</b></span></a>`);
    if (L(b.hours)) rows.push(`<div class="inforow">${ICON.clock}<span><small>${t.hours}</small><b>${esc(L(b.hours))}</b></span></div>`);
    if (b.phone) rows.push(`<a class="inforow" href="tel:${esc(b.phone.replace(/\s/g, ""))}">${ICON.phone}<span><small>${t.phone}</small><b>${esc(b.phone)}</b></span></a>`);
    if (b.instagram) rows.push(`<a class="inforow" href="https://instagram.com/${esc(b.instagram)}" target="_blank" rel="noopener">${ICON.ig}<span><small>${t.instagram}</small><b>@${esc(b.instagram)}</b></span></a>`);
    if (b.wifi) rows.push(`<div class="inforow">${ICON.wifi}<span><small>${t.wifi}</small><b>${esc(b.wifi)}</b></span></div>`);
    $("#info").innerHTML = `<div class="card"><h3>${t.infoTitle}</h3>${rows.join("")}</div>`;

    renderFilterGrid();
    openStatus();
  }

  function itemCard(item, catId) {
    const t = T[state.lang];
    const als = (item.allergens || []).map((a) => alBadge(a)).join("");
    return `<li><button type="button" class="item${item.available === false ? " item--out" : ""}" data-item="${esc(catId)}/${esc(item.id)}">
      <span class="item__top"><h3 class="item__name">${highlight(item.name)}</h3><span class="item__tags">${tagBadges(item)}</span></span>
      <p class="item__desc">${highlight(L(item.desc))}</p>
      <span class="item__foot">
        <span class="kcal">${ICON.flame.replace("<svg", '<svg aria-hidden="true"')}${esc(item.kcal ?? "")} kcal</span>
        <span class="als">${als}</span>
        <span class="price" aria-label="${t.price} ${fmtPrice(item.price)}">${fmtPrice(item.price)}</span>
      </span>
    </button></li>`;
  }

  function renderMenu() {
    const t = T[state.lang];
    const cats = state.data.categories.filter((c) => c.visible !== false);
    let html = "", total = 0;
    for (const c of cats) {
      const items = c.items.filter(passes);
      total += items.length;
      if (!items.length) continue;
      html += `<section class="cat" id="cat-${esc(c.id)}" aria-labelledby="h-${esc(c.id)}">
        <div class="sechead"><h2 id="h-${esc(c.id)}">${esc(c.name)}<span class="count">${items.length} ${t.items}</span></h2>${L(c.subtitle) ? `<p class="script">${esc(L(c.subtitle))}</p>` : ""}</div>
        <ul class="items">${items.map((i) => itemCard(i, c.id)).join("")}</ul></section>`;
    }
    $("#menu").innerHTML = html;
    const empty = $("#empty");
    empty.hidden = total > 0;
    if (!total) empty.textContent = state.query.trim() ? t.emptySearch(state.query.trim()) : t.emptyFilter;

    // tabs
    const visible = cats.filter((c) => c.items.some(passes));
    $("#tabs").innerHTML = visible.map((c, i) => `<button type="button" class="tab" role="tab" aria-selected="${i === 0}" data-target="cat-${esc(c.id)}">${esc(c.name)}</button>`).join("");

    // chef picks (hidden while searching or filtering)
    const filtering = state.query.trim() || state.exclude.size || state.veg || state.noSpicy;
    const picks = [];
    cats.forEach((c) => c.items.forEach((i) => { if ((i.tags || []).includes("signature") && i.available !== false) picks.push([c, i]); }));
    $("#picks").hidden = !!filtering || !picks.length;
    $("#picksRail").innerHTML = picks.map(([c, i]) => `<button type="button" class="pick" data-item="${esc(c.id)}/${esc(i.id)}">
      <span class="pick__badge">${t.signature}</span>
      <span class="pick__name">${esc(i.name)}</span>
      <span class="pick__desc">${esc(L(i.desc))}</span>
      <span class="pick__foot"><span class="pick__kcal">${esc(i.kcal)} kcal</span><span class="pick__price">${fmtPrice(i.price)}</span></span>
    </button>`).join("");

    $("#filterDot").hidden = !(state.exclude.size || state.veg || state.noSpicy);
    $("#filterApply").textContent = t.show(filterCount());
    observeSections();
  }

  function renderFilterGrid() {
    $("#filterGrid").innerHTML = window.ALLERGEN_ORDER.map((k) => {
      const a = window.ALLERGENS[k];
      return `<button type="button" class="fchip" data-al="${k}" aria-pressed="${state.exclude.has(k)}">${alBadge(k, false)}<span>${esc(state.lang === "tr" ? a.tr : a.mn)}</span></button>`;
    }).join("");
    $("#fVeg").checked = state.veg;
    $("#fNoSpicy").checked = state.noSpicy;
    $("#filterApply").textContent = T[state.lang].show(filterCount());
  }

  /* ---------- scrollspy ---------- */
  let io;
  function observeSections() {
    io?.disconnect();
    const offset = $("#topbar").offsetHeight + $("#catbar").offsetHeight;
    io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActiveTab(e.target.id); });
    }, { rootMargin: `-${offset + 10}px 0px -60% 0px` });
    document.querySelectorAll(".cat").forEach((s) => io.observe(s));
  }
  function setActiveTab(id) {
    document.querySelectorAll(".tab").forEach((tb) => {
      const on = tb.dataset.target === id;
      tb.setAttribute("aria-selected", String(on));
      if (on) tb.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    });
  }

  /* ---------- sheets ---------- */
  let lastFocus = null;
  function openSheet(el) {
    lastFocus = document.activeElement;
    el.hidden = false; document.body.classList.add("lock");
    const f = el.querySelector("button, [href], input"); f?.focus({ preventScroll: true });
  }
  function closeSheet(el) {
    el.hidden = true;
    if (!document.querySelector(".sheet:not([hidden])")) document.body.classList.remove("lock");
    lastFocus?.focus?.({ preventScroll: true });
  }
  function showItem(ref) {
    const [cid, iid] = ref.split("/");
    const cat = state.data.categories.find((c) => c.id === cid);
    const item = cat?.items.find((i) => i.id === iid);
    if (!item) return;
    const t = T[state.lang];
    const als = item.allergens || [];
    $("#itemPanel").innerHTML = `
      <div class="ihead"><div class="sheet__grip" aria-hidden="true"></div>
        <small>${esc(cat.name)}</small>
        <h2 id="itemTitle">${esc(item.name)}</h2>
        <div class="tags">${tagBadges(item)}</div>
      </div>
      <div class="ibody">
        <p>${esc(L(item.desc))}</p>
        <div class="istats">
          <div class="stat stat--price"><small>${t.price}</small><b>${fmtPrice(item.price)}</b></div>
          <div class="stat"><small>${t.kcal}</small><b>${esc(item.kcal)} kcal</b></div>
        </div>
        <h3>${t.allergensH}</h3>
        ${als.length ? `<ul class="ialist">${als.map((a) => `<li>${alBadge(a, false)}${esc(state.lang === "tr" ? window.ALLERGENS[a]?.tr : window.ALLERGENS[a]?.mn)}</li>`).join("")}</ul>` : `<p class="inone">${t.noAllergens}</p>`}
        <button type="button" class="btn btn--gold" data-close style="width:100%">${t.close}</button>
      </div>`;
    openSheet($("#itemSheet"));
  }

  /* ---------- events ---------- */
  function bind() {
    document.addEventListener("click", (e) => {
      const it = e.target.closest("[data-item]");
      if (it) return showItem(it.dataset.item);
      const tab = e.target.closest(".tab");
      if (tab) {
        const sec = document.getElementById(tab.dataset.target);
        if (sec) { setActiveTab(tab.dataset.target); window.scrollTo({ top: sec.getBoundingClientRect().top + window.scrollY - $("#topbar").offsetHeight - $("#catbar").offsetHeight + 1, behavior: "smooth" }); }
        return;
      }
      const close = e.target.closest("[data-close]");
      if (close) return closeSheet(close.closest(".sheet"));
      const fc = e.target.closest(".fchip");
      if (fc) {
        const k = fc.dataset.al;
        state.exclude.has(k) ? state.exclude.delete(k) : state.exclude.add(k);
        fc.setAttribute("aria-pressed", String(state.exclude.has(k)));
        renderMenu();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const open = document.querySelector(".sheet:not([hidden])");
        if (open) closeSheet(open); else if (!$("#searchWrap").hidden) closeSearch();
      }
    });
    document.querySelectorAll(".lang button").forEach((b) => b.addEventListener("click", () => {
      state.lang = b.dataset.lang; safeSet("iff_lang", state.lang); renderStatic(); renderMenu();
    }));
    $("#filterBtn").addEventListener("click", () => { renderFilterGrid(); openSheet($("#filterSheet")); });
    $("#fVeg").addEventListener("change", (e) => { state.veg = e.target.checked; renderMenu(); });
    $("#fNoSpicy").addEventListener("change", (e) => { state.noSpicy = e.target.checked; renderMenu(); });
    $("#filterReset").addEventListener("click", () => { state.exclude.clear(); state.veg = state.noSpicy = false; renderFilterGrid(); renderMenu(); });

    $("#searchBtn").addEventListener("click", () => {
      $("#tabs").hidden = true; $("#searchWrap").hidden = false; $("#searchBtn").hidden = true;
      $("#searchInput").focus();
      const m = $("#menu"); window.scrollTo({ top: Math.max(0, m.getBoundingClientRect().top + window.scrollY - 200), behavior: "smooth" });
    });
    $("#searchClose").addEventListener("click", closeSearch);
    let tmr;
    $("#searchInput").addEventListener("input", (e) => { clearTimeout(tmr); tmr = setTimeout(() => { state.query = e.target.value; renderMenu(); }, 120); });

    const toTop = $("#toTop");
    window.addEventListener("scroll", () => { toTop.hidden = window.scrollY < 900; }, { passive: true });
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    setInterval(openStatus, 60000);
  }
  function closeSearch() {
    $("#searchInput").value = ""; state.query = "";
    $("#searchWrap").hidden = true; $("#tabs").hidden = false; $("#searchBtn").hidden = false;
    renderMenu(); $("#searchBtn").focus();
  }

  /* ---------- boot ---------- */
  load().then((data) => {
    state.data = data;
    renderStatic();
    renderMenu();
    bind();
  }).catch(() => {
    $("#menu").innerHTML = '<p class="empty">Цэс ачаалж чадсангүй. Хуудсаа дахин ачаална уу.</p>';
  });
})();
