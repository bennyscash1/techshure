// Business details – replace the placeholders before going live.
export const CONTACT = {
  phone: '', // e.g. '050-000-0000'
  whatsapp: '', // international format, digits only, e.g. '972500000000'
  email: '', // e.g. 'info@tech-shure.co.il'
  location: 'בית שמש, ישראל · שירות בכל הארץ ובחו״ל',
  businessId: '[מס׳ עוסק]',
};

export type PageKey = 'home' | 'web' | 'automation' | 'ivr' | 'consulting';

export const NAV: { key: PageKey; path: string; label: string }[] = [
  { key: 'home', path: '/', label: 'ראשי' },
  { key: 'web', path: '/web', label: 'אתרים, CRM ומערכות' },
  { key: 'automation', path: '/automation', label: 'אוטומציה עסקית' },
  { key: 'ivr', path: '/ivr', label: 'מרכזייה חכמה – IVR' },
  { key: 'consulting', path: '/consulting', label: 'ייעוץ ו-QA' },
];

export const SERVICE_OPTIONS = [
  'מרכזייה חכמה / IVR + CRM + AI',
  'אוטומציית WhatsApp / מייל / בוטים',
  'CRM ואינטגרציות',
  'אתר או דף נחיתה',
  'מערכת / אפליקציה מותאמת',
  'שילוב בינה מלאכותית',
  'ייעוץ ענן / מעבר לפרודקשן',
  'אחר',
];
