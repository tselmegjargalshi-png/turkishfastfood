/* 14 EU allergens. Shared by the public menu and the admin dashboard. */
(function (global) {
  const s = (body) =>
    `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

  const ALLERGENS = {
    gluten: {
      mn: "Цавуулаг", tr: "Gluten", color: "#a0522d",
      svg: s('<path d="M12 22V8"/><path d="M12 12c-2.6 0-4-1.6-4-4 2.6 0 4 1.6 4 4zM12 12c2.6 0 4-1.6 4-4-2.6 0-4 1.6-4 4zM12 16.5c-2.6 0-4-1.6-4-4 2.6 0 4 1.6 4 4zM12 16.5c2.6 0 4-1.6 4-4-2.6 0-4 1.6-4 4z" fill="currentColor"/><path d="M12 8c-1.2-1-1.2-3 0-5 1.2 2 1.2 4 0 5z" fill="currentColor"/>')
    },
    crustaceans: {
      mn: "Хавч хэлбэртэн", tr: "Kabuklular", color: "#2f6fd6",
      svg: s('<ellipse cx="12" cy="14" rx="5" ry="3.6" fill="currentColor"/><path d="M7.5 12.5 4 9.5M4 9.5 3 6.5M4 9.5l3-1.5M16.5 12.5 20 9.5M20 9.5l1-3M20 9.5l-3-1.5M8 16.5 5 19M16 16.5l3 2.5M9.5 17.5 8 20.5M14.5 17.5l1.5 3"/>')
    },
    eggs: {
      mn: "Өндөг", tr: "Yumurta", color: "#e2b400",
      svg: s('<path d="M12 3.5c3.5 0 6.5 2.3 6.5 5.6 0 2 1.9 3 1.9 5.4 0 3.6-3.6 6-8.4 6s-8.4-2.4-8.4-6c0-3 3-3.8 3-6.3C6.6 5.4 8.9 3.5 12 3.5z" fill="currentColor" stroke="none"/><circle cx="12" cy="12.6" r="3.2" fill="var(--al-bg,#e2b400)" stroke="none"/>')
    },
    fish: {
      mn: "Загас", tr: "Balık", color: "#1593d6",
      svg: s('<path d="M2.5 12c3-4.5 8.5-6 13-3.2L21 5.5v13l-5.5-3.3C11 18 5.5 16.5 2.5 12z" fill="currentColor" stroke="none"/><circle cx="7.4" cy="11.2" r="1.3" fill="var(--al-bg,#1593d6)" stroke="none"/>')
    },
    peanuts: {
      mn: "Газрын самар", tr: "Yer fıstığı", color: "#e8a93a",
      svg: s('<path d="M12 2.8c3 0 4.6 2.3 4.6 4.6 0 2-1.4 2.9-1.4 4.6s1.6 2.5 1.6 4.7c0 2.7-2.1 4.5-4.8 4.5s-4.8-1.8-4.8-4.5c0-2.2 1.6-3 1.6-4.7S7.4 9.4 7.4 7.4c0-2.3 1.6-4.6 4.6-4.6z" fill="currentColor" stroke="none"/><circle cx="10.6" cy="7" r=".8" fill="var(--al-bg,#e8a93a)" stroke="none"/><circle cx="13.2" cy="9.2" r=".8" fill="var(--al-bg,#e8a93a)" stroke="none"/><circle cx="11" cy="15.6" r=".8" fill="var(--al-bg,#e8a93a)" stroke="none"/><circle cx="13.4" cy="17.6" r=".8" fill="var(--al-bg,#e8a93a)" stroke="none"/>')
    },
    soy: {
      mn: "Шар буурцаг", tr: "Soya", color: "#2e9b47",
      svg: s('<path d="M4 19.5C3 14 9.5 4 19.5 4c.8 6-6.5 16.5-15.5 15.5z" fill="currentColor" stroke="none"/><circle cx="9" cy="15" r="1.7" fill="var(--al-bg,#2e9b47)" stroke="none"/><circle cx="12.5" cy="11.2" r="1.7" fill="var(--al-bg,#2e9b47)" stroke="none"/><circle cx="16" cy="7.6" r="1.6" fill="var(--al-bg,#2e9b47)" stroke="none"/>')
    },
    milk: {
      mn: "Сүү", tr: "Süt", color: "#c77dba",
      svg: s('<path d="M7 2.5h4M7.5 2.5v3L5 9v12.5h8.5V9L11 5.5v-3" fill="currentColor"/><path d="M15 11.5h5v10h-5z" fill="currentColor"/><path d="M15 14.5h5" stroke="var(--al-bg,#c77dba)"/>')
    },
    nuts: {
      mn: "Модны самар", tr: "Sert kabuklu yemişler", color: "#e57f2e",
      svg: s('<path d="M12 3v2.2" /><path d="M4.5 9.5c0-2.6 3.4-4.3 7.5-4.3s7.5 1.7 7.5 4.3v.8h-15z" fill="currentColor"/><path d="M6 11.5h12c0 5-2.8 9-6 9.8-3.2-.8-6-4.8-6-9.8z" fill="currentColor" stroke="none"/>')
    },
    celery: {
      mn: "Селдерей", tr: "Kereviz", color: "#6fae4a",
      svg: s('<path d="M5 21 14 6M9 21l8-13.5M13 21l6-10.5"/><path d="M14 6c-.5-2 .6-3.2 2.2-3.5.4 1.7-.4 3-2.2 3.5zM17 7.5c.2-2 1.6-2.8 3.3-2.6-.1 1.8-1.3 2.8-3.3 2.6z" fill="currentColor"/>')
    },
    mustard: {
      mn: "Гич", tr: "Hardal", color: "#c9952b",
      svg: s('<path d="M11 2.5h2l.5 3h-3z" fill="currentColor"/><path d="M9 5.5h6l1 4.5v10.5c0 .6-.4 1-1 1H9c-.6 0-1-.4-1-1V10z" fill="currentColor" stroke="none"/><path d="M10.5 12.5h3" stroke="var(--al-bg,#c9952b)"/><circle cx="19" cy="18" r="1.4" fill="currentColor" stroke="none"/>')
    },
    sesame: {
      mn: "Кунжут", tr: "Susam", color: "#ef7d22",
      svg: s('<ellipse cx="12" cy="6" rx="1.9" ry="3" fill="currentColor" stroke="none"/><ellipse cx="12" cy="18" rx="1.9" ry="3" fill="currentColor" stroke="none"/><ellipse cx="6" cy="12" rx="3" ry="1.9" fill="currentColor" stroke="none"/><ellipse cx="18" cy="12" rx="3" ry="1.9" fill="currentColor" stroke="none"/><ellipse cx="7.8" cy="7.8" rx="1.6" ry="2.6" transform="rotate(-45 7.8 7.8)" fill="currentColor" stroke="none"/><ellipse cx="16.2" cy="16.2" rx="1.6" ry="2.6" transform="rotate(-45 16.2 16.2)" fill="currentColor" stroke="none"/>')
    },
    sulphites: {
      mn: "Сульфит", tr: "Sülfitler", color: "#9b2230",
      svg: s('<path d="M7 3h10c.4 4.8-1.6 8.4-5 8.6C8.6 11.4 6.6 7.8 7 3z" fill="currentColor"/><path d="M12 11.6V20M8 21h8"/>')
    },
    lupin: {
      mn: "Люпин", tr: "Acı bakla", color: "#8f6fc4",
      svg: s('<path d="M12 22V5"/><path d="M12 4.5c-1-.4-1-2 0-2.5 1 .5 1 2.1 0 2.5zM12 8c-2.3 0-3.2-1.2-3.4-2.6 1.9 0 3.1.8 3.4 2.6zM12 8c2.3 0 3.2-1.2 3.4-2.6-1.9 0-3.1.8-3.4 2.6zM12 12c-2.7 0-3.8-1.4-4-3 2.2 0 3.6 1 4 3zM12 12c2.7 0 3.8-1.4 4-3-2.2 0-3.6 1-4 3zM12 16c-3 0-4.2-1.5-4.4-3.3 2.4 0 4 1.1 4.4 3.3zM12 16c3 0 4.2-1.5 4.4-3.3-2.4 0-4 1.1-4.4 3.3z" fill="currentColor"/>')
    },
    molluscs: {
      mn: "Нялцгай биет", tr: "Yumuşakçalar", color: "#1fa79a",
      svg: s('<path d="M12 20.5 3 9.5C5 5.5 8.3 3.5 12 3.5s7 2 9 6z" fill="currentColor" stroke="none"/><path d="M12 20.5V5M12 20.5 7 6.2M12 20.5 17 6.2M12 20.5 4.4 8.6M12 20.5l7.6-11.9" stroke="var(--al-bg,#1fa79a)" stroke-width="1.2"/><path d="M10 20.5h4" />')
    }
  };

  const ORDER = ["gluten", "crustaceans", "eggs", "fish", "peanuts", "soy", "milk", "nuts", "celery", "mustard", "sesame", "sulphites", "lupin", "molluscs"];

  global.ALLERGENS = ALLERGENS;
  global.ALLERGEN_ORDER = ORDER;
})(window);
