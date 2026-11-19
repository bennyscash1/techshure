// Business details. Keep in sync with rebrand/business-model.md.
// Shared by the site and by api/_chat-prompt.ts, so this file stays free of React and browser code.
export const CONTACT = {
  phone: '074-7054942',
  /** The same number for visitors abroad (English pages, English chat). */
  phoneIntl: '+972-74-705-4942',
  phoneTel: '+972747054942',
  whatsapp: '972526565024',
  email: 'info@tech-shure.dev',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('ז׳בוטינסקי 9 בני ברק מגדל הכשרת היישוב'),
};

type ContactText = { phone: string; address: string; hours: string; legalName: string; legalType: string; businessId: string };

/** Displayed phone (international on English pages), address, hours and the legal line, per language. Same days and hours in both. */
export const CONTACT_TEXT: Record<'he' | 'en', ContactText> = {
  he: {
    phone: '074-7054942',
    address: 'מגדל הכשרת היישוב, ז׳בוטינסקי 9, בני ברק',
    hours: 'שעות פעילות: 9:00 עד 17:00',
    legalName: 'שור בנימין חיים',
    legalType: 'עוסק פטור',
    businessId: '[מס׳ עוסק]',
  },
  en: {
    phone: '+972-74-705-4942',
    address: 'Migdal Hachsharat HaYishuv, 9 Jabotinsky St., Bnei Brak',
    hours: 'Business hours: 9:00 to 17:00',
    legalName: 'Binyamin Chaim Shor',
    legalType: 'Licensed sole proprietor',
    businessId: '[business no.]',
  },
};

export const BRAND = {
  en: 'Tech-shure',
  slogan: 'טכנולוגיה. על בטוח.',
  sloganEn: 'Technology. For sure.',
};

export type PageKey = 'home' | 'solutions' | 'modules';

/** Main navigation. Paths are the Hebrew (base) paths; labels come from the dictionary (t.nav). */
export const NAV: { key: PageKey; path: string }[] = [
  { key: 'home', path: '/' },
  { key: 'solutions', path: '/solutions' },
  { key: 'modules', path: '/modules' },
];
