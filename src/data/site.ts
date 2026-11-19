// Business details. Keep in sync with rebrand/business-model.md.
export const CONTACT = {
  phone: '074-7054942',
  phoneTel: '+972747054942',
  whatsapp: '972526565024',
  email: 'info@tech-shure.dev',
  address: 'מגדל הכשרת היישוב, ז׳בוטינסקי 9, בני ברק',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('ז׳בוטינסקי 9 בני ברק מגדל הכשרת היישוב'),
  hours: 'שעות פעילות: 9:00 עד 17:00',
  businessId: '[מס׳ עוסק]',
};

export const BRAND = {
  en: 'Tech-shure',
  he: 'טק-שור',
  slogan: 'טכנולוגיה. על בטוח.',
};

export type PageKey = 'home' | 'solutions' | 'modules';

export const NAV: { key: PageKey; path: string; label: string }[] = [
  { key: 'home', path: '/', label: 'דף הבית' },
  { key: 'solutions', path: '/solutions', label: 'הטכנולוגיות שלנו' },
  { key: 'modules', path: '/modules', label: 'מודולים ותנאים' },
];

export const SERVICE_OPTIONS = [
  'מענה טלפוני חכם',
  'בוט וואטסאפ',
  'מערכת CRM / ERP לניהול העסק + סליקה',
  'דף נחיתה',
  'אוטומציית מיילים',
  'מערכת מותאמת אישית',
  'הטמעת AI בעסק (ייעוץ לעסקים)',
  'חבילה של כמה מוצרים',
  'עוד לא בטוח, רוצה להתייעץ',
];
