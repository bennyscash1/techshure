// Business details – replace the placeholders before going live.
export const CONTACT = {
  phone: '074-727-0313',
  whatsapp: '972526565024',
  email: 'hq360auto@gmail.com',
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
