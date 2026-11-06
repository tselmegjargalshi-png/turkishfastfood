/*
 * Generates the two branded QR designs in /qr (PNG + SVG source).
 * Requires: npm i -D qrcode jsqr pngjs   and Playwright with Chromium.
 * Usage: node scripts/make-qr.cjs [https://your-domain]
 */
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const BASE = (process.argv[2] || "https://turkishfastfood.vercel.app").replace(/\/$/, "");
const OUT = path.join(ROOT, "qr");
const dataUri = (f, type) => `data:${type};base64,${fs.readFileSync(path.join(ROOT, f)).toString("base64")}`;
const LOGO = dataUri("assets/logo.png", "image/png");
const ICON = dataUri("assets/icon-512.png", "image/png");

/** Styled QR as SVG: dot modules, rounded finder eyes, logo knockout in the middle. */
function qrSvg(text, { size = 600, dark = "#2b0808", eye = "#e0161d", eyeDot = "#2b0808", light = "#fff7ec", logoScale = 0.24, dotR = 0.48, roundness = 0.34 } = {}) {
  const qr = QRCode.create(text, { errorCorrectionLevel: "H" });
  const n = qr.modules.size, d = qr.modules.data;
  const quiet = 2, cells = n + quiet * 2, u = size / cells;
  const isFinder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  const lc = Math.ceil(n * logoScale / 2) * 2 + 1; // odd number of cells cleared for the logo
  const l0 = (n - lc) / 2;
  const inLogo = (r, c) => r >= l0 - 0.5 && r < l0 + lc && c >= l0 - 0.5 && c < l0 + lc;
  let dots = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (!d[r * n + c] || isFinder(r, c) || inLogo(r, c)) continue;
    const x = (c + quiet + 0.5) * u, y = (r + quiet + 0.5) * u;
    const w = u * dotR * 2;
    dots += `<rect x="${(x - w / 2).toFixed(2)}" y="${(y - w / 2).toFixed(2)}" width="${w.toFixed(2)}" height="${w.toFixed(2)}" rx="${(w * roundness).toFixed(2)}"/>`;
  }
  const eyeAt = (r, c) => {
    const x = (c + quiet) * u, y = (r + quiet) * u;
    return `<rect x="${x + u / 2}" y="${y + u / 2}" width="${u * 6}" height="${u * 6}" rx="${u * 2}" fill="none" stroke="${eye}" stroke-width="${u}"/>
      <rect x="${x + u * 2}" y="${y + u * 2}" width="${u * 3}" height="${u * 3}" rx="${u * 0.9}" fill="${eyeDot}"/>`;
  };
  const lx = (l0 + quiet) * u, lw = lc * u;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" rx="${u * 2}" fill="${light}"/>
    <g fill="${dark}">${dots}</g>
    ${eyeAt(0, 0)}${eyeAt(0, n - 7)}${eyeAt(n - 7, 0)}
    <rect x="${lx}" y="${lx}" width="${lw}" height="${lw}" rx="${lw * 0.28}" fill="${light}"/>
    <clipPath id="lg"><rect x="${lx + u * 0.6}" y="${lx + u * 0.6}" width="${lw - u * 1.2}" height="${lw - u * 1.2}" rx="${lw * 0.22}"/></clipPath>
    <image href="${ICON}" x="${lx + u * 0.6}" y="${lx + u * 0.6}" width="${lw - u * 1.2}" height="${lw - u * 1.2}" clip-path="url(#lg)" preserveAspectRatio="xMidYMid slice"/>
  </svg>`;
}

const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Lobster&family=Rubik:ital,wght@0,500;0,700;0,900;1,900&display=swap" rel="stylesheet">`;
const TILE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23ffc21a' stroke-width='1.3'%3E%3Cpath d='M40 4 50 30 76 40 50 50 40 76 30 50 4 40 30 30z'/%3E%3Ccircle cx='40' cy='40' r='9'/%3E%3C/g%3E%3C/svg%3E")`;
const MOON = `<svg viewBox="0 0 100 100"><path d="M50 14a36 36 0 1 0 0 72a44 44 0 0 1 0-72z"/><path d="m74 38 3.6 8.9 9.6.6-7.4 6.1 2.4 9.3-8.2-5.2-8.2 5.2 2.4-9.3-7.4-6.1 9.6-.6z"/></svg>`;

/* Design 1: table tent card, 1200 x 1800 */
function tableCard(url) {
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
  *{box-sizing:border-box;margin:0}
  body{width:1200px;height:1800px;font-family:Rubik,sans-serif;background:#1f0505;color:#fff7ec;overflow:hidden}
  .card{position:absolute;inset:0;padding:70px;background:radial-gradient(90% 55% at 50% 0%,rgba(224,22,29,.75),transparent 70%),radial-gradient(70% 40% at 50% 100%,rgba(255,194,26,.18),transparent 70%),#1f0505}
  .card::before{content:"";position:absolute;inset:0;background-image:${TILE};opacity:.13}
  .frame{position:absolute;inset:34px;border:6px solid #ffc21a;border-radius:56px}
  .frame::after{content:"";position:absolute;inset:14px;border:2px solid rgba(255,194,26,.55);border-radius:44px}
  .moon svg{width:100%;height:auto;display:block}.moon{position:absolute;width:190px;right:90px;top:120px;fill:#ffc21a;opacity:.22;transform:rotate(-14deg)}
  .in{position:relative;height:100%;display:flex;flex-direction:column;align-items:center;text-align:center}
  .logo{width:470px;margin-top:10px;-webkit-mask-image:radial-gradient(closest-side,#000 80%,transparent);filter:drop-shadow(0 20px 40px rgba(224,22,29,.6))}
  h1{font-family:Lobster;font-weight:400;font-size:108px;line-height:1;color:#ffc21a;text-shadow:0 6px 0 #95090f;margin-top:4px}
  .sub{font-size:40px;font-weight:500;opacity:.92;margin-top:18px}
  .qrbox{margin-top:48px;padding:26px;background:#fff7ec;border-radius:52px;box-shadow:0 0 0 12px #e0161d,0 0 0 20px #ffc21a,0 40px 80px -20px rgba(0,0,0,.8);position:relative}
  .qrbox svg{display:block;width:600px;height:600px}
  .tag{position:absolute;left:50%;top:-34px;transform:translateX(-50%);background:#ffc21a;color:#2a0b0b;font-weight:900;font-size:30px;letter-spacing:3px;padding:12px 30px;border-radius:999px;white-space:nowrap}
  .feat{display:flex;gap:16px;margin-top:62px}
  .feat span{background:rgba(255,255,255,.09);border:2px solid rgba(255,255,255,.18);border-radius:999px;padding:14px 26px;font-size:30px;font-weight:500}
  .url{margin-top:auto;font-size:34px;font-weight:700;color:#ffc21a;letter-spacing:.5px}
  .bye{font-family:Lobster;font-size:52px;margin-top:6px}
  </style></head><body><div class="card"><div class="frame"></div><div class="moon">${MOON}</div><div class="in">
  <img class="logo" src="${LOGO}">
  <h1>Цэсээ уншуулаарай</h1>
  <p class="sub">Камераа чиглүүлээд Истанбулын амтыг нээ</p>
  <div class="qrbox"><span class="tag">ЦАХИМ ЦЭС</span>${qrSvg(url)}</div>
  <div class="feat"><span>Үнэ ₺</span><span>Илчлэг kcal</span><span>Харшлын тэмдэг</span></div>
  <p class="url">${url.replace(/^https:\/\//, "").replace(/\/?\?.*$/, "")}</p>
  <p class="bye">Afiyet olsun!</p>
  </div></div></body></html>`;
}

/* Design 2: round sticker / window poster, 1600 x 1600 */
function sticker(url) {
  const ring = "İSTANBUL FAST FOOD ★ ЦАХИМ ЦЭС ★ БОСФОРЫН АМТ, ТАНЫ ГАРТ ★ ";
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
  *{box-sizing:border-box;margin:0}
  body{width:1600px;height:1600px;background:transparent;font-family:Rubik,sans-serif;overflow:hidden}
  .disc{position:absolute;inset:20px;border-radius:50%;background:radial-gradient(circle at 50% 30%,#ff2a2f,#c10f16 55%,#7a0509);box-shadow:inset 0 0 0 18px #ffc21a,inset 0 0 0 26px #2b0808,inset 0 0 0 32px #ffc21a,0 30px 60px rgba(0,0,0,.35);overflow:hidden}
  .disc::before{content:"";position:absolute;inset:0;background-image:${TILE};opacity:.16}
  svg.ring{position:absolute;inset:20px;width:1560px;height:1560px}
  .ring text{font-family:Rubik;font-weight:900;font-size:50px;letter-spacing:3px;fill:#fff7ec;white-space:pre}
  .center{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:900px;height:900px;border-radius:50%;background:#fff7ec;box-shadow:0 0 0 14px #2b0808,0 0 0 24px #ffc21a,0 30px 60px -10px rgba(0,0,0,.6);display:flex;flex-direction:column;align-items:center;justify-content:center}
  .center .qr svg{display:block;width:560px;height:560px}
  .center h2{font-family:Lobster;font-weight:400;font-size:64px;color:#e0161d;line-height:1;margin-bottom:8px}
  .center p{font-weight:700;font-size:30px;color:#2a0b0b;letter-spacing:4px;margin-top:12px}
  .moon{position:absolute;width:130px;fill:#ffc21a}.moon svg{width:100%;height:auto;display:block}
  .m1{left:170px;top:50%;transform:translateY(-50%) rotate(-20deg)} .m2{right:170px;top:50%;transform:translateY(-50%) scaleX(-1) rotate(-20deg)}
  </style></head><body>
  <div class="disc"></div>
  <svg class="ring" viewBox="0 0 1560 1560"><defs><path id="c" d="M780,780 m-640,0 a640,640 0 1,1 1280,0 a640,640 0 1,1 -1280,0"/></defs>
    <text xml:space="preserve"><textPath href="#c" startOffset="0" textLength="3990" lengthAdjust="spacing">${ring}${ring}</textPath></text></svg>
  <div class="moon m1">${MOON}</div><div class="moon m2">${MOON}</div>
  <div class="center"><h2>Уншуул, амтал!</h2><div class="qr">${qrSvg(url, { size: 560, light: "#fff7ec" })}</div><p>ЦЭСЭЭ НЭЭ</p></div>
  </body></html>`;
}

async function verify(file, expected) {
  const png = PNG.sync.read(fs.readFileSync(file));
  const res = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  if (!res || res.data !== expected) throw new Error(`QR check failed for ${file}: ${res ? res.data : "not decoded"}`);
  console.log(`✓ ${path.basename(file)} decodes to ${res.data}`);
}

module.exports = { qrSvg };
if (require.main === module) (async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const jobs = [
    { name: "qr_table_card", url: `${BASE}/?src=table`, html: tableCard, sel: ".qrbox svg", w: 1200, h: 1800, bg: false },
    { name: "qr_sticker", url: `${BASE}/?src=sticker`, html: sticker, sel: ".center .qr svg", w: 1600, h: 1600, bg: true }
  ];
  const browser = await chromium.launch();
  for (const j of jobs) {
    const page = await browser.newPage({ viewport: { width: j.w, height: j.h }, deviceScaleFactor: 1 });
    await page.setContent(j.html(j.url), { waitUntil: "load", timeout: 60000 }).catch(() => {});
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    const file = path.join(OUT, `${j.name}.png`);
    await page.screenshot({ path: file, omitBackground: j.bg });
    // Decode the full design and the QR area alone (with a white margin) to be sure it scans.
    const crop = path.join(OUT, `.${j.name}_check.png`);
    const box = await page.locator(j.sel).boundingBox();
    await page.screenshot({ path: crop, clip: { x: box.x - 40, y: box.y - 40, width: box.width + 80, height: box.height + 80 } });
    try { await verify(file, j.url); } catch (e) { console.log("  (full design not decoded by jsQR, checking QR area)"); }
    await verify(crop, j.url);
    fs.unlinkSync(crop);
    fs.writeFileSync(path.join(OUT, `${j.name}_code.svg`), qrSvg(j.url, { size: 1000 }));
    await page.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
