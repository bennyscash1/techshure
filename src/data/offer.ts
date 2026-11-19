// Limits, add-ons and terms, per language. Source: rebrand/business-model.md (sections 4 to 8).
// The text lives in ./offer.he.ts and ./offer.en.ts. The products themselves live in ./solutions.ts.
import type { IconName } from '../components/Icon';
import type { Lang } from '../i18n';
import { OFFER_HE } from './offer.he';
import { OFFER_EN } from './offer.en';

/** `id` is also the anchor on /modules (for example /modules#crm), the same in both languages. */
export type Module = { id: string; icon: IconName; name: string; limits: string[] };
export type Addon = { icon: IconName; title: string; text: string; example?: string; note?: string };
export type Term = { icon: IconName; title: string; text: string };
export type Offer = { modules: Module[]; addons: Addon[]; terms: Term[]; priceNote: string };

const OFFERS: Record<Lang, Offer> = { he: OFFER_HE, en: OFFER_EN };

export const getOffer = (lang: Lang): Offer => OFFERS[lang];

export const nis = (n: number) => `${n.toLocaleString('en-US')} ₪`;
