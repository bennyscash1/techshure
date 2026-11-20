// English link previews. Crawlers (WhatsApp, Facebook, LinkedIn, X) do not run JavaScript, so the raw HTML served for
// /en and every /en/* path must already carry an English head. en/index.html is the English twin of index.html
// (same app entry); this plugin gives each known English page its own head (title, description, og:url, canonical,
// hreflang) in the build (dist/en/<page>/index.html) and serves the same HTML in `vite dev` and `vite preview`.
// vercel.json rewrites /en, /en/<page> and the /en/* fallback to these files. Hebrew (index.html) is untouched.
import fs from 'node:fs';
import path from 'node:path';
import type { Connect, Plugin, ViteDevServer } from 'vite';
import { en } from '../src/i18n/en';
import { SOLUTIONS_EN } from '../src/data/solutions.en';

const SITE_URL = 'https://www.tech-shure.dev';

type PageHead = { title: string; description: string };

/** Hebrew (base) path of every English page with its own head. Anything else under /en gets the /en home head. */
export const EN_PAGES: Record<string, PageHead> = {
  '/': { title: en.meta.homeTitle, description: en.meta.homeDescription },
  '/solutions': { title: en.meta.solutionsTitle, description: en.meta.solutionsDescription },
  '/modules': { title: en.meta.modulesTitle, description: en.meta.modulesDescription },
  ...Object.fromEntries(
    Object.entries(SOLUTIONS_EN).map(([slug, s]) => [`/solutions/${slug}`, { title: s.metaTitle, description: s.metaDescription }]),
  ),
};

const heUrl = (base: string) => (base === '/' ? `${SITE_URL}/` : `${SITE_URL}${base}`);
const enUrl = (base: string) => `${SITE_URL}/en${base === '/' ? '' : base}`;

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Replaces exactly one tag matched by `pattern`, failing the build if the template changed shape. */
function replaceOnce(html: string, pattern: RegExp, replacement: string): string {
  const count = html.match(new RegExp(pattern.source, 'g'))?.length ?? 0;
  if (count !== 1) throw new Error(`en-html: expected one match for ${pattern}, found ${count}`);
  return html.replace(pattern, () => replacement);
}

/** The English HTML for one page (base = Hebrew path, for example "/solutions/crm-erp"), mirroring src/i18n/seo.ts. */
export function englishHtml(template: string, base: string): string {
  const page = EN_PAGES[base] ?? EN_PAGES['/'];
  const url = EN_PAGES[base] ? base : '/';
  const title = escapeAttr(page.title);
  const description = escapeAttr(page.description);
  const meta = (attr: 'name' | 'property', key: string) => new RegExp(`<meta ${attr}="${key}" content="[^"]*" />`);
  const link = (rel: string) => new RegExp(`<link rel="${rel}" href="[^"]*" />`);
  const alt = (lang: string) => new RegExp(`<link rel="alternate" hreflang="${lang}" href="[^"]*" />`);

  let html = template;
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = replaceOnce(html, meta('name', 'description'), `<meta name="description" content="${description}" />`);
  html = replaceOnce(html, meta('property', 'og:title'), `<meta property="og:title" content="${title}" />`);
  html = replaceOnce(html, meta('property', 'og:description'), `<meta property="og:description" content="${description}" />`);
  html = replaceOnce(html, meta('property', 'og:url'), `<meta property="og:url" content="${enUrl(url)}" />`);
  html = replaceOnce(html, meta('property', 'og:image:alt'), `<meta property="og:image:alt" content="${escapeAttr(en.meta.ogImageAlt)}" />`);
  html = replaceOnce(html, meta('name', 'twitter:title'), `<meta name="twitter:title" content="${title}" />`);
  html = replaceOnce(html, meta('name', 'twitter:description'), `<meta name="twitter:description" content="${description}" />`);
  html = replaceOnce(html, link('canonical'), `<link rel="canonical" href="${enUrl(url)}" />`);
  html = replaceOnce(html, alt('he'), `<link rel="alternate" hreflang="he" href="${heUrl(url)}" />`);
  html = replaceOnce(html, alt('en'), `<link rel="alternate" hreflang="en" href="${enUrl(url)}" />`);
  html = replaceOnce(html, alt('x-default'), `<link rel="alternate" hreflang="x-default" href="${heUrl(url)}" />`);
  if (/[\u2013\u2014]/.test(html)) throw new Error(`en-html: en dash or em dash in the head of /en${base}`);
  return html;
}

/** Output file of an English page, relative to dist: "/" gives en/index.html, "/modules" gives en/modules/index.html. */
const outFile = (base: string) => path.join('en', base === '/' ? '' : base.slice(1), 'index.html');

/** Hebrew (base) path of an /en address that should get the English HTML, or null for anything else. */
function englishBase(url: string | undefined): string | null {
  const pathname = (url ?? '').split(/[?#]/)[0];
  if (pathname !== '/en' && !pathname.startsWith('/en/')) return null;
  if (/\.[^/]*$/.test(pathname)) return null; // files (en/index.html itself, assets) are served as they are
  const base = pathname.slice(3).replace(/\/+$/, '');
  return base || '/';
}

function wantsHtml(req: Connect.IncomingMessage): boolean {
  return (req.method === 'GET' || req.method === 'HEAD') && (req.headers.accept ?? '').includes('text/html');
}

export function englishHtmlPlugin(): Plugin {
  let outDir = 'dist';
  let root = process.cwd();
  let isBuild = false;
  return {
    name: 'en-html',
    configResolved(config) {
      root = config.root;
      isBuild = config.command === 'build';
      outDir = path.resolve(config.root, config.build.outDir);
    },
    // Dev: /en and /en/* get en/index.html with the page's English head, run through Vite's HTML transforms.
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const base = englishBase(req.url);
        if (base === null || !wantsHtml(req)) return next();
        try {
          const template = fs.readFileSync(path.join(root, 'en', 'index.html'), 'utf8');
          const html = await server.transformIndexHtml(req.url ?? '/en', englishHtml(template, base));
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(html);
        } catch (err) {
          next(err);
        }
      });
    },
    // Preview: serve the built files the way vercel.json does.
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const base = englishBase(req.url);
        if (base === null) return next();
        const file = path.join(outDir, outFile(EN_PAGES[base] ? base : '/'));
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(fs.readFileSync(file));
      });
    },
    // Build: Vite has written dist/en/index.html (with the hashed assets); write one HTML file per English page.
    closeBundle() {
      if (!isBuild) return;
      const built = path.join(outDir, 'en', 'index.html');
      if (!fs.existsSync(built)) throw new Error('en-html: dist/en/index.html was not built');
      const template = fs.readFileSync(built, 'utf8');
      for (const base of Object.keys(EN_PAGES)) {
        const file = path.join(outDir, outFile(base));
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, englishHtml(template, base));
      }
      checkVercelRewrites(path.join(root, 'vercel.json'));
    },
  };
}

/**
 * Fails the build if vercel.json does not send every English page to its own file (for example a new solution slug
 * missing from the rewrite list). Rewrites are tried in order, like Vercel does.
 */
function checkVercelRewrites(file: string) {
  const { rewrites = [] } = JSON.parse(fs.readFileSync(file, 'utf8')) as {
    rewrites?: { source: string; destination: string }[];
  };
  for (const base of Object.keys(EN_PAGES)) {
    const url = base === '/' ? '/en' : `/en${base}`;
    const want = `/${outFile(base).split(path.sep).join('/')}`;
    let got: string | undefined;
    for (const r of rewrites) {
      const m = url.match(new RegExp(`^${r.source}$`));
      if (m) {
        got = r.destination.replace(/\$(\d)/g, (_, i: string) => m[Number(i)] ?? '');
        break;
      }
    }
    if (got !== want) throw new Error(`en-html: vercel.json rewrites ${url} to ${got ?? 'nothing'}, expected ${want}`);
  }
}
