// Head data of every shareable page, in both languages: title, description and link-preview image.
// Shared by the raw HTML built for crawlers (config/og-html.ts) and the client (./seo.ts), so both always agree.
// Imports text only (no images or React), so it also runs in the Vite config.
import { he } from './he';
import { en } from './en';
import { SOLUTIONS_HE } from '../data/solutions.he';
import { SOLUTIONS_EN } from '../data/solutions.en';
import type { SolutionSlug } from '../data/solutions';

type Lang = 'he' | 'en';

export const OG_SITE_URL = 'https://www.tech-shure.dev';

/** The official logo image: home page and any page without its own image (404s). */
export const HOME_OG_IMAGE = '/og-tech-shure-2026b.jpg';

export type PageHead = {
  title: string;
  description: string;
  /** Absolute URL of the 1200x630 JPG (public/og-*.jpg, made by scripts/og/generate.mjs). */
  image: string;
  imageAlt: string;
};

const SLUGS: SolutionSlug[] = ['phone-answering', 'whatsapp-bot', 'crm-erp', 'landing-page', 'custom-system', 'ai-consulting'];
const DICT = { he, en };
const SOLUTIONS = { he: SOLUTIONS_HE, en: SOLUTIONS_EN };

const abs = (file: string) => `${OG_SITE_URL}${file}`;
/** "Modules, packages and terms | Tech-shure" gives "Tech-shure: Modules, packages and terms". */
const altFromTitle = (title: string) => `Tech-shure: ${title.replace(/\s*\|\s*Tech-shure$/, '')}`;

function pages(lang: Lang): Record<string, PageHead> {
  const m = DICT[lang].meta;
  return {
    '/': { title: m.homeTitle, description: m.homeDescription, image: abs(HOME_OG_IMAGE), imageAlt: m.ogImageAlt },
    '/solutions': {
      title: m.solutionsTitle,
      description: m.solutionsDescription,
      image: abs('/og-solutions.jpg'),
      imageAlt: altFromTitle(m.solutionsTitle),
    },
    '/modules': {
      title: m.modulesTitle,
      description: m.modulesDescription,
      image: abs(`/og-modules-${lang}.jpg`),
      imageAlt: altFromTitle(m.modulesTitle),
    },
    ...Object.fromEntries(
      SLUGS.map((slug) => {
        const s = SOLUTIONS[lang][slug];
        // Same image in both languages; the alt follows the page language.
        return [`/solutions/${slug}`, { title: s.metaTitle, description: s.metaDescription, image: abs(`/og-${slug}.jpg`), imageAlt: `Tech-shure: ${s.title}` }];
      }),
    ),
  };
}

/** Base (Hebrew) path of every page with its own head, for example "/solutions/crm-erp", per language. */
export const PAGE_HEADS: Record<Lang, Record<string, PageHead>> = { he: pages('he'), en: pages('en') };

/** Head data of a base path, or undefined for paths without their own head (404s). */
export const pageHead = (lang: Lang, base: string): PageHead | undefined => PAGE_HEADS[lang][base];
