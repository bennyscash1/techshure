// Our technologies: one entry per solution. Drives the /solutions list and every /solutions/<slug> sub-page,
// in both languages. Shared fields (slug, icon, image, prices, links) live here; the text lives in
// ./solutions.he.ts and ./solutions.en.ts, typed so both languages cover every slug and every field.
// Prices come from ./prices.ts (shared by both languages and the chat bot) and are shown on the /solutions list
// in both languages; the sub-pages show the launch badge only.
import phoneImg from '../assets/phone.webp';
import whatsappImg from '../assets/whatsapp.webp';
import crmImg from '../assets/crm.webp';
import landingImg from '../assets/landing.webp';
import emblemImg from '../assets/emblem.webp';
import hezkiImg from '../assets/hezki.webp';
import type { IconName } from '../components/Icon';
import type { Lang } from '../i18n';
import { SOLUTIONS_HE } from './solutions.he';
import { SOLUTIONS_EN } from './solutions.en';
import { PRODUCT_PRICES, type Price } from './prices';

export type SolutionSlug = 'phone-answering' | 'whatsapp-bot' | 'crm-erp' | 'landing-page' | 'custom-system' | 'ai-consulting';

export type { Price };
type IconItem = { icon: IconName; title: string; text: string };

export type Solution = {
  slug: SolutionSlug;
  /** Anchor id of the row on /solutions, kept so old links like /solutions#crm still work. */
  anchor: string;
  icon: IconName;
  /** Small category label on the card, the /solutions row and the sub-page hero, for example "ייעוץ לעסקים". */
  category?: string;
  image: string;
  imageAlt: string;
  title: string;
  shortTitle: string;
  tagline: string;
  /** One line for the cards on /solutions and in "related". */
  cardText: string;
  pitch: string;
  points: string[];
  allWeek?: boolean;
  /** Launch price for the list page. Missing for the custom system (priced in a call) and the AI consulting (a fixed day, see offer). */
  price?: Price;
  priceNote?: string;
  /** Small print on the sub-page about relevant add-ons (official WhatsApp, connecting an existing system). */
  addonNote?: string;
  /** Replaces the scope note under the features tab, for services that are not built from modules. */
  scopeNote?: string;
  /** A fixed, transparent offer with "what is included / not included" (the AI consulting day only). */
  offer?: DayOffer;
  /** Key benefits in the sub-page hero. */
  benefits: string[];
  /** Short benefit strip under the hero. */
  highlights: { icon: IconName; value: string; label: string }[];
  overview: { intro: string[]; before: string[]; after: string[] };
  features: IconItem[];
  steps: { title: string; text: string }[];
  useCases: { icon: IconName; who: string; text: string }[];
  /** `to` is a base (Hebrew) path; components localize it with lp(). */
  integrations: (IconItem & { to?: string })[];
  /** Base (Hebrew) path, localized at render. */
  modulesLink: string;
  faq: { q: string; a: string }[];
  related: SolutionSlug[];
  /** Pre-selected option in the contact form. Must match one of t.contact.serviceOptions in the same language. */
  service: string;
  metaTitle: string;
  metaDescription: string;
};

type BaseKey = 'slug' | 'anchor' | 'icon' | 'image' | 'price' | 'allWeek' | 'related' | 'modulesLink';
type SolutionBase = Pick<Solution, BaseKey>;
/** The per-language part of a solution. */
export type SolutionText = Omit<Solution, BaseKey>;

export type DayOffer = {
  /** Shown as is, for example "1,000 ₪". */
  price: string;
  priceLabel: string;
  title: string;
  summary: string;
  included: string[];
  excluded: string[];
  note: string;
};

/** Display order and the fields both languages share. */
const BASE: SolutionBase[] = [
  { slug: 'phone-answering', anchor: 'phone', icon: 'phone', image: phoneImg, allWeek: true, price: PRODUCT_PRICES.phone, related: ['whatsapp-bot', 'crm-erp', 'custom-system'], modulesLink: '/modules#phone' },
  { slug: 'whatsapp-bot', anchor: 'whatsapp', icon: 'chat', image: whatsappImg, allWeek: true, price: PRODUCT_PRICES.whatsapp, related: ['phone-answering', 'crm-erp', 'landing-page', 'ai-consulting'], modulesLink: '/modules#whatsapp' },
  { slug: 'crm-erp', anchor: 'crm', icon: 'db', image: crmImg, price: PRODUCT_PRICES.crm, related: ['phone-answering', 'whatsapp-bot', 'custom-system', 'ai-consulting'], modulesLink: '/modules#crm' },
  { slug: 'landing-page', anchor: 'light', icon: 'layout', image: landingImg, price: PRODUCT_PRICES.landing, related: ['whatsapp-bot', 'crm-erp', 'custom-system'], modulesLink: '/modules#landing' },
  { slug: 'custom-system', anchor: 'custom', icon: 'code', image: emblemImg, related: ['crm-erp', 'ai-consulting', 'phone-answering', 'whatsapp-bot'], modulesLink: '/modules' },
  { slug: 'ai-consulting', anchor: 'ai', icon: 'sparkle', image: hezkiImg, related: ['custom-system', 'crm-erp', 'whatsapp-bot'], modulesLink: '/modules' },
];

const TEXT: Record<Lang, Record<SolutionSlug, SolutionText>> = { he: SOLUTIONS_HE, en: SOLUTIONS_EN };

const BY_LANG: Record<Lang, Solution[]> = {
  he: BASE.map((b) => ({ ...b, ...TEXT.he[b.slug] })),
  en: BASE.map((b) => ({ ...b, ...TEXT.en[b.slug] })),
};

/** All solutions, in display order, in the given language. */
export const getSolutions = (lang: Lang): Solution[] => BY_LANG[lang];

export const getSolution = (lang: Lang, slug: string | undefined) => BY_LANG[lang].find((s) => s.slug === slug);

/** Base (Hebrew) path of a sub-page; localize with lp(). */
export const solutionPath = (slug: SolutionSlug) => `/solutions/${slug}`;
