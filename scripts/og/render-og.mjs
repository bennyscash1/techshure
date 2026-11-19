// Renders scripts/og/og-template.html to public/og-tech-shure-2026.jpg (1200x630).
// Usage: node scripts/og/render-og.mjs
// Needs the Playwright Chromium browser: npx playwright install chromium
import { chromium } from 'playwright';
import { statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const template = pathToFileURL(path.join(here, 'og-template.html')).href;
const out = path.resolve(here, '../../public/og-tech-shure-2026.jpg');
const MAX_BYTES = 300 * 1024;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(template, { waitUntil: 'networkidle' });
await page.evaluate(async () => {
  await document.fonts.ready;
  await Promise.all([...document.images].map((img) => img.decode()));
});
const heebo = await page.evaluate(() => document.fonts.check('800 84px Heebo') && document.fonts.check('700 50px "Heebo"', 'טכנולוגיה'));
if (!heebo) throw new Error('Heebo font did not load, check the network connection');

let quality = 92;
let size = Infinity;
while (quality >= 60) {
  await page.screenshot({ path: out, type: 'jpeg', quality, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  size = statSync(out).size;
  if (size <= MAX_BYTES) break;
  quality -= 4;
}
await browser.close();
console.log(`Wrote ${out} (1200x630, quality ${quality}, ${(size / 1024).toFixed(1)} KB)`);
