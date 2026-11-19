// Language support. Hebrew is the default and lives at the existing paths; English mirrors every page under /en.
// The language comes from the URL only (no browser language detection, no redirects).
import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { he, type Dict } from './he';
import { en } from './en';

export type Lang = 'he' | 'en';

export const LANGS: Lang[] = ['he', 'en'];
export const EN_PREFIX = '/en';
export const SITE_URL = 'https://www.tech-shure.dev';

const DICTS: Record<Lang, Dict> = { he, en };

/** "en" for /en and anything under /en/, otherwise "he". */
export function langFromPath(pathname: string): Lang {
  return pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`) ? 'en' : 'he';
}

/** The Hebrew (unprefixed) form of a path: "/en/solutions" becomes "/solutions", "/en" becomes "/". */
export function basePath(pathname: string): string {
  if (langFromPath(pathname) === 'he') return pathname || '/';
  return pathname.slice(EN_PREFIX.length) || '/';
}

/**
 * The same path in the given language. Accepts a base (Hebrew) path, optionally with ?query and #hash,
 * for example localePath('en', '/modules#addons') gives "/en/modules#addons".
 */
export function localePath(lang: Lang, path: string): string {
  if (lang === 'he') return path;
  const cut = path.search(/[?#]/);
  const pathname = cut < 0 ? path : path.slice(0, cut);
  const rest = cut < 0 ? '' : path.slice(cut);
  return `${EN_PREFIX}${pathname === '/' ? '' : pathname}${rest}`;
}

/** Address of the current page in the other language, keeping the ?query and #hash. */
export function switchPath(pathname: string, search = '', hash = ''): string {
  const target: Lang = langFromPath(pathname) === 'he' ? 'en' : 'he';
  return localePath(target, `${basePath(pathname)}${search}${hash}`);
}

type LangContext = {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  t: Dict;
  /** Localizes a base (Hebrew) path for the current language. */
  lp: (path: string) => string;
};

const Ctx = createContext<LangContext | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  const value = useMemo<LangContext>(
    () => ({ lang, dir: lang === 'he' ? 'rtl' : 'ltr', t: DICTS[lang], lp: (path: string) => localePath(lang, path) }),
    [lang],
  );

  // <html lang dir> follow the route (index.html also sets them before first paint).
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = value.dir;
  }, [lang, value.dir]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}
