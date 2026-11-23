// Per-page head tags: title, description, Open Graph, Twitter, canonical and hreflang alternates.
// The build writes one HTML file per page and language (config/og-html.ts) with the raw tags for crawlers that do not
// run JavaScript; this updates those same tags in place on every route (never appends duplicates). Titles,
// descriptions and preview images come from the same data (./og.ts) on both sides.
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_URL, basePath, localePath, useLang, type Lang } from '.';
import { HOME_OG_IMAGE, pageHead } from './og';

const OG_LOCALE: Record<Lang, string> = { he: 'he_IL', en: 'en_US' };

function absolute(path: string): string {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function removeAll(selector: string) {
  document.head.querySelectorAll(selector).forEach((el) => el.remove());
}

function upsertLink(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    document.head.appendChild(el);
  }
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
}

/**
 * Sets the head tags for the current page. `indexable: false` (not-found pages) drops canonical and
 * hreflang and asks search engines not to index the page.
 */
export function useSeo(title: string, description: string, indexable = true) {
  const { lang, t } = useLang();
  const { pathname } = useLocation();

  useEffect(() => {
    const base = basePath(pathname);
    const url = absolute(localePath(lang, base));
    const other: Lang = lang === 'he' ? 'en' : 'he';
    // The page's own preview image; pages without one (404s) use the logo image.
    const head = indexable ? pageHead(lang, base) : undefined;
    const image = head?.image ?? `${SITE_URL}${HOME_OG_IMAGE}`;

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:locale', OG_LOCALE[lang]);
    upsertMeta('property', 'og:locale:alternate', OG_LOCALE[other]);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:image:secure_url', image);
    upsertMeta('property', 'og:image:alt', head?.imageAlt ?? t.meta.ogImageAlt);
    upsertMeta('name', 'twitter:image', image);
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);

    removeAll('link[rel="alternate"][hreflang]');
    if (indexable) {
      removeAll('meta[name="robots"]');
      upsertLink('link[rel="canonical"]', { rel: 'canonical', href: url });
      for (const [hreflang, l] of [['he', 'he'], ['en', 'en'], ['x-default', 'he']] as const) {
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = hreflang;
        link.href = absolute(localePath(l, base));
        document.head.appendChild(link);
      }
    } else {
      removeAll('link[rel="canonical"]');
      upsertMeta('name', 'robots', 'noindex');
    }
  }, [lang, t, pathname, title, description, indexable]);
}
