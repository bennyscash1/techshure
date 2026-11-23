// Generates the 1200x630 link-preview images (public/og-*.jpg) from the existing site assets (src/assets/*.webp).
// Each picture is placed so its subject sits in the middle 630x630 square (WhatsApp crops previews to a square), and
// the sides are padded with the picture's own edge colors, blurred, so the padding looks seamless. Labels are set in
// Heebo (the site font) by the browser, never drawn by an image model.
//
// Playwright is NOT a dependency of the site. Run with a Playwright install elsewhere, for example:
//   npm i --prefix "%TEMP%\pw" playwright && npx --prefix "%TEMP%\pw" playwright install chromium
//   set PLAYWRIGHT_DIR=%TEMP%\pw && node scripts/og/generate.mjs
// The home image (public/og-tech-shure-2026b.jpg) is the official logo image and is not generated here.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const ASSETS = path.join(ROOT, 'src', 'assets');
const OUT = path.join(ROOT, 'public');
const W = 1200;
const H = 630;
const MAX_BYTES = 300 * 1024;

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch {
    const dir = process.env.PLAYWRIGHT_DIR;
    if (!dir) throw new Error('Playwright not found. Set PLAYWRIGHT_DIR to a folder with node_modules/playwright.');
    return createRequire(path.join(path.resolve(dir), 'package.json'))('playwright');
  }
}

const dataUrl = (file) => `data:image/webp;base64,${fs.readFileSync(path.join(ASSETS, file)).toString('base64')}`;

/**
 * One picture, scaled to `height` (default the full 630) and shifted by `dx` from the center, so the subject lands in
 * the middle square. Anything outside the picture is filled with its own edge columns, blurred.
 */
const photo = (file, { height = H, dx = 0 } = {}) => ({ kind: 'photo', src: dataUrl(file), height, dx });

// Brand word mark as on the site header: "Tech-" in navy and "shure" in blue, always in English letters.
const wordmark = (color = '#16295a', accent = '#2a6cc4') =>
  `<span dir="ltr" style="font-weight:800;letter-spacing:-0.01em;color:${color}">Tech-<span style="color:${accent}">shure</span></span>`;

/** All six solutions: four tiles in the middle square, the custom system and AI day on the wings. */
function solutionsHtml() {
  const tile = (file, size, pos = 'center') =>
    `<div style="width:${size}px;height:${size}px;border-radius:28px;overflow:hidden;box-shadow:0 18px 40px -18px rgba(22,41,90,.45);background:#fff">
       <img src="${dataUrl(file)}" style="width:100%;height:100%;object-fit:cover;object-position:${pos}"></div>`;
  return `<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 45%,#e8f4fc 0,#f4f8fc 55%,#eef3f9 100%)"></div>
    <div style="position:absolute;left:${(W - 590) / 2}px;top:${(H - 590) / 2}px;display:grid;grid-template-columns:285px 285px;gap:20px">
      ${tile('phone.webp', 285, '50% 30%')}${tile('whatsapp.webp', 285, '50% 35%')}
      ${tile('crm.webp', 285, '22% 50%')}${tile('landing.webp', 285, '18% 30%')}
    </div>
    <div style="position:absolute;left:40px;top:${(H - 215) / 2}px">${tile('hezki.webp', 215, '50% 30%')}</div>
    <div style="position:absolute;right:40px;top:${(H - 215) / 2}px;width:215px;height:215px;border-radius:28px;background:#fff;box-shadow:0 18px 40px -18px rgba(22,41,90,.45);display:grid;place-items:center">
      <img src="${dataUrl('emblem.webp')}" style="width:185px;height:185px"></div>`;
}

/** The modules page: the emblem, the word mark and the page name, on navy (distinct from the light home image). */
function modulesHtml(label, dir) {
  return `<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 38%,#24408a 0,#16295a 52%,#0e1c40 100%)"></div>
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px">
      <div style="width:270px;height:270px;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:0 0 0 10px rgba(25,195,230,.18),0 24px 60px -20px rgba(0,0,0,.6)">
        <img src="${dataUrl('emblem.webp')}" style="width:236px;height:236px"></div>
      <div style="font-size:64px;line-height:1">${wordmark('#ffffff', '#19c3e6')}</div>
      <div dir="${dir}" style="font-size:40px;font-weight:700;color:#d8f3f9;line-height:1.2">${label}</div>
    </div>`;
}

/** The custom system: the emblem on a soft cyan field with circuit rings. */
function customHtml() {
  return `<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,#ffffff 0,#e3f5fb 38%,#bfe3f4 75%,#9fd0ec 100%)"></div>
    ${[560, 700, 860, 1040].map((d, i) => `<div style="position:absolute;left:${(W - d) / 2}px;top:${(H - d) / 2}px;width:${d}px;height:${d}px;border-radius:50%;border:${i % 2 ? 2 : 3}px ${i % 2 ? 'dashed' : 'solid'} rgba(42,108,196,${0.28 - i * 0.05})"></div>`).join('')}
    <img src="${dataUrl('emblem.webp')}" style="position:absolute;left:${(W - 520) / 2}px;top:${(H - 520) / 2}px;width:520px;height:520px">`;
}

const IMAGES = [
  { file: 'og-phone-answering.jpg', layout: photo('phone.webp') },
  { file: 'og-whatsapp-bot.jpg', layout: photo('whatsapp.webp') },
  { file: 'og-crm-erp.jpg', layout: photo('crm.webp', { dx: 100 }) },
  { file: 'og-landing-page.jpg', layout: photo('landing.webp', { dx: 60 }) },
  { file: 'og-custom-system.jpg', layout: { kind: 'html', html: customHtml() } },
  { file: 'og-ai-consulting.jpg', layout: photo('hezki.webp') },
  { file: 'og-solutions.jpg', layout: { kind: 'html', html: solutionsHtml() } },
  // Page names exactly as in the page titles (src/i18n/he.ts and en.ts, meta.modulesTitle without the brand).
  { file: 'og-modules-he.jpg', layout: { kind: 'html', html: modulesHtml('מודולים, חבילות ותנאים', 'rtl') } },
  { file: 'og-modules-en.jpg', layout: { kind: 'html', html: modulesHtml('Modules, packages and terms', 'ltr') } },
];

const PAGE = (body) => `<!doctype html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@500;700;800&display=block" rel="stylesheet">
  <style>html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;font-family:Heebo,sans-serif}</style></head>
  <body><div id="stage" style="position:relative;width:${W}px;height:${H}px;overflow:hidden">${body}</div></body></html>`;

/** Draws a photo layout on a canvas: blurred edge-column padding, then the picture with feathered sides. */
async function drawPhoto(page, layout) {
  await page.setContent(PAGE('<canvas id="c" width="1200" height="630"></canvas>'));
  await page.evaluate(async ({ src, height, dx, W, H }) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const scale = height / img.naturalHeight;
    const w = Math.round(img.naturalWidth * scale);
    const x = Math.round((W - w) / 2 + dx);
    const y = Math.round((H - height) / 2);
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    // Padding: stretch the outermost columns (and rows) of the picture, then blur so there are no streaks.
    const pad = document.createElement('canvas');
    pad.width = W;
    pad.height = H;
    const p = pad.getContext('2d');
    const n = 6; // source columns to sample at each side
    p.drawImage(img, 0, 0, n, img.naturalHeight, -40, y, Math.max(x + 80, 1), height);
    p.drawImage(img, img.naturalWidth - n, 0, n, img.naturalHeight, x + w - 40, y, Math.max(W - (x + w) + 80, 1), height);
    if (y > 0) {
      p.drawImage(img, 0, 0, img.naturalWidth, n, x, -40, w, y + 80);
      p.drawImage(img, 0, img.naturalHeight - n, img.naturalWidth, n, x, y + height - 40, w, H - (y + height) + 80);
    }
    ctx.filter = 'blur(28px)';
    ctx.drawImage(pad, 0, 0);
    ctx.drawImage(pad, 0, 0); // a second pass fills the blur's faded border
    ctx.filter = 'none';
    // The picture, with its left and right edges faded into the padding.
    const layer = document.createElement('canvas');
    layer.width = W;
    layer.height = H;
    const l = layer.getContext('2d');
    l.drawImage(img, x, y, w, height);
    l.globalCompositeOperation = 'destination-in';
    const fade = 48;
    const g = l.createLinearGradient(x, 0, x + w, 0);
    const f = fade / w;
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(f, 'rgba(0,0,0,1)');
    g.addColorStop(1 - f, 'rgba(0,0,0,1)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    l.fillStyle = g;
    l.fillRect(0, 0, W, H);
    ctx.drawImage(layer, 0, 0);
  }, { src: layout.src, height: layout.height, dx: layout.dx, W, H });
}

const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const only = process.argv.slice(2);
for (const { file, layout } of IMAGES) {
  if (only.length && !only.includes(file)) continue;
  if (layout.kind === 'photo') await drawPhoto(page, layout);
  else {
    await page.setContent(PAGE(layout.html));
    await page.evaluate(() => document.fonts.ready);
  }
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode())));
  let quality = 88;
  let buf = await page.locator('#stage, #c').first().screenshot({ type: 'jpeg', quality });
  while (buf.length > MAX_BYTES && quality > 60) {
    quality -= 6;
    buf = await page.locator('#stage, #c').first().screenshot({ type: 'jpeg', quality });
  }
  fs.writeFileSync(path.join(OUT, file), buf);
  console.log(`${file}  ${(buf.length / 1024).toFixed(0)} KB  q${quality}`);
}
await browser.close();
