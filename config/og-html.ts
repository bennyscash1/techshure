// Link previews for every page, in both languages. Crawlers (WhatsApp, Facebook, LinkedIn, X) do not run JavaScript,
// so the raw HTML served for each page must already carry that page's head: title, description, og:url, og:image,
// canonical and hreflang. index.html (Hebrew) and en/index.html (English) are the two templates (same app entry);
// this plugin writes one HTML file per page and language in the build:
//   dist/index.html (Hebrew home, left exactly as index.html), dist/solutions/index.html, dist/modules/index.html,
//   dist/solutions/<slug>/index.html, and the same under dist/en/...
// and serves the same HTML in `vite dev` and `vite preview`. vercel.json rewrites every page to its file; Hebrew 404s
// fall back to index.html and English 404s to en/index.html (the home heads). The page data lives in src/i18n/og.ts,
// shared with the client (src/i18n/seo.ts).
import fs from 'node:fs';
import path from 'node:path';
import type { Connect, Plugin, ViteDevServer } from 'vite';
import { OG_SITE_URL, PAGE_HEADS, type PageHead } from '../src/i18n/og';

type Lang = 'he' | 'en';
const LANGS: Lang[] = ['he', 'en'];

/** Address of a base (Hebrew) path in a language: ("en", "/") gives "/en", ("he", "/modules") gives "/modules". */
const localePath = (lang: Lang, base: string) => (lang === 'he' ? base : `/en${base === '/' ? '' : base}`);
const absolute = (p: string) => (p === '/' ? `${OG_SITE_URL}/` : `${OG_SITE_URL}${p}`);

/** HTML template of a language, relative to the project root (source) or dist (built). */
const templateFile = (lang: Lang) => (lang === 'he' ? 'index.html' : path.join('en', 'index.html'));

/** Output file of a page, relative to dist: ("he", "/modules") gives modules/index.html. */
const outFile = (lang: Lang, base: string) =>
  path.join(lang === 'he' ? '' : 'en', base === '/' ? '' : base.slice(1), 'index.html');

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Replaces exactly one tag matched by `pattern`, failing the build if the template changed shape. */
function replaceOnce(html: string, pattern: RegExp, replacement: string): string {
  const count = html.match(new RegExp(pattern.source, 'g'))?.length ?? 0;
  if (count !== 1) throw new Error(`og-html: expected one match for ${pattern}, found ${count}`);
  return html.replace(pattern, () => replacement);
}

/** En dash (U+2013) and em dash (U+2014), built from their code points so this file itself stays free of them. */
const DASHES = new RegExp(`[${String.fromCharCode(0x2013, 0x2014)}]`);

function assertNoDashes(html: string, where: string) {
  if (DASHES.test(html)) throw new Error(`og-html: en dash or em dash in the HTML of ${where}`);
}

/**
 * The HTML of one page (base = Hebrew path, for example "/solutions/crm-erp"), mirroring src/i18n/seo.ts.
 * The Hebrew home is index.html as it is. Unknown English paths get the English home head.
 */
export function pageHtml(template: string, lang: Lang, base: string): string {
  const known = Boolean(PAGE_HEADS[lang][base]);
  const page: PageHead = PAGE_HEADS[lang][known ? base : '/'];
  const url = localePath(lang, known ? base : '/');
  if (lang === 'he' && url === '/') {
    assertNoDashes(template, '/');
    return template;
  }
  const title = escapeAttr(page.title);
  const description = escapeAttr(page.description);
  const image = escapeAttr(page.image);
  const meta = (attr: 'name' | 'property', key: string) => new RegExp(`<meta ${attr}="${key}" content="[^"]*" />`);
  const link = (rel: string) => new RegExp(`<link rel="${rel}" href="[^"]*" />`);
  const alt = (hreflang: string) => new RegExp(`<link rel="alternate" hreflang="${hreflang}" href="[^"]*" />`);
  const baseOf = known ? base : '/';

  let html = template;
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = replaceOnce(html, meta('name', 'description'), `<meta name="description" content="${description}" />`);
  html = replaceOnce(html, meta('property', 'og:title'), `<meta property="og:title" content="${title}" />`);
  html = replaceOnce(html, meta('property', 'og:description'), `<meta property="og:description" content="${description}" />`);
  html = replaceOnce(html, meta('property', 'og:url'), `<meta property="og:url" content="${absolute(url)}" />`);
  html = replaceOnce(html, meta('property', 'og:image'), `<meta property="og:image" content="${image}" />`);
  html = replaceOnce(html, meta('property', 'og:image:secure_url'), `<meta property="og:image:secure_url" content="${image}" />`);
  html = replaceOnce(html, meta('property', 'og:image:alt'), `<meta property="og:image:alt" content="${escapeAttr(page.imageAlt)}" />`);
  html = replaceOnce(html, meta('name', 'twitter:image'), `<meta name="twitter:image" content="${image}" />`);
  html = replaceOnce(html, meta('name', 'twitter:title'), `<meta name="twitter:title" content="${title}" />`);
  html = replaceOnce(html, meta('name', 'twitter:description'), `<meta name="twitter:description" content="${description}" />`);
  html = replaceOnce(html, link('canonical'), `<link rel="canonical" href="${absolute(url)}" />`);
  html = replaceOnce(html, alt('he'), `<link rel="alternate" hreflang="he" href="${absolute(localePath('he', baseOf))}" />`);
  html = replaceOnce(html, alt('en'), `<link rel="alternate" hreflang="en" href="${absolute(localePath('en', baseOf))}" />`);
  html = replaceOnce(html, alt('x-default'), `<link rel="alternate" hreflang="x-default" href="${absolute(localePath('he', baseOf))}" />`);
  assertNoDashes(html, url);
  return html;
}

/**
 * The page an address should be served as, or null to leave it to Vite. English: /en and anything under it (unknown
 * paths get the English home head). Hebrew: only the known pages other than the home (index.html covers the rest).
 */
function routeOf(url: string | undefined): { lang: Lang; base: string } | null {
  const pathname = (url ?? '').split(/[?#]/)[0];
  if (/\.[^/]*$/.test(pathname)) return null; // files (index.html itself, assets, images) are served as they are
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const base = pathname.slice(3).replace(/\/+$/, '') || '/';
    return { lang: 'en', base: PAGE_HEADS.en[base] ? base : '/' };
  }
  const base = pathname.replace(/\/+$/, '') || '/';
  return base !== '/' && PAGE_HEADS.he[base] ? { lang: 'he', base } : null;
}

/** Browsers send Accept: text/html; curl and some crawlers send * / * or nothing. */
function wantsHtml(req: Connect.IncomingMessage): boolean {
  const accept = req.headers.accept ?? '*/*';
  return (req.method === 'GET' || req.method === 'HEAD') && (accept.includes('text/html') || accept.includes('*/*'));
}

function sendHtml(res: import('node:http').ServerResponse, html: string | Buffer) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html);
}

export function ogHtmlPlugin(): Plugin {
  let outDir = 'dist';
  let root = process.cwd();
  let isBuild = false;
  return {
    name: 'og-html',
    configResolved(config) {
      root = config.root;
      isBuild = config.command === 'build';
      outDir = path.resolve(config.root, config.build.outDir);
    },
    // Dev: each page gets its language's template with the page's head, run through Vite's HTML transforms.
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const route = routeOf(req.url);
        if (!route || !wantsHtml(req)) return next();
        try {
          const template = fs.readFileSync(path.join(root, templateFile(route.lang)), 'utf8');
          sendHtml(res, await server.transformIndexHtml(req.url ?? '/', pageHtml(template, route.lang, route.base)));
        } catch (err) {
          next(err);
        }
      });
    },
    // Preview: serve the built files the way vercel.json does.
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const route = routeOf(req.url);
        if (!route || !wantsHtml(req)) return next();
        sendHtml(res, fs.readFileSync(path.join(outDir, outFile(route.lang, route.base))));
      });
    },
    // Build: Vite has written dist/index.html and dist/en/index.html (with the hashed assets); write every page.
    closeBundle() {
      if (!isBuild) return;
      for (const lang of LANGS) {
        const built = path.join(outDir, templateFile(lang));
        if (!fs.existsSync(built)) throw new Error(`og-html: ${built} was not built`);
        const template = fs.readFileSync(built, 'utf8');
        for (const base of Object.keys(PAGE_HEADS[lang])) {
          const file = path.join(outDir, outFile(lang, base));
          fs.mkdirSync(path.dirname(file), { recursive: true });
          fs.writeFileSync(file, pageHtml(template, lang, base));
        }
      }
      checkVercelRewrites(path.join(root, 'vercel.json'));
    },
  };
}

/**
 * Fails the build if vercel.json does not send every page to its own file (for example a new solution slug missing
 * from the rewrite list), or 404s to the wrong language. Rewrites are tried in order, like Vercel does.
 */
function checkVercelRewrites(file: string) {
  const { rewrites = [] } = JSON.parse(fs.readFileSync(file, 'utf8')) as {
    rewrites?: { source: string; destination: string }[];
  };
  const expected: [string, string][] = [];
  for (const lang of LANGS) {
    for (const base of Object.keys(PAGE_HEADS[lang])) {
      if (lang === 'he' && base === '/') continue; // the Hebrew home is served as a file
      expected.push([localePath(lang, base), `/${outFile(lang, base).split(path.sep).join('/')}`]);
    }
  }
  expected.push(['/no-such-page', '/index.html'], ['/ivr', '/index.html'], ['/en/no-such-page', '/en/index.html'], ['/en/ivr', '/en/index.html']);
  for (const [url, want] of expected) {
    let got: string | undefined;
    for (const r of rewrites) {
      const m = url.match(new RegExp(`^${r.source}$`));
      if (m) {
        got = r.destination.replace(/\$(\d)/g, (_, i: string) => m[Number(i)] ?? '');
        break;
      }
    }
    if (got !== want) throw new Error(`og-html: vercel.json rewrites ${url} to ${got ?? 'nothing'}, expected ${want}`);
  }
}
