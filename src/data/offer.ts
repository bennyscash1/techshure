// Products, prices, limits and terms. Source: rebrand/business-model.md (sections 4 to 8).
import phoneImg from '../assets/phone.webp';
import whatsappImg from '../assets/whatsapp.webp';
import crmImg from '../assets/crm.webp';
import landingImg from '../assets/landing.webp';
import emblemImg from '../assets/emblem.webp';
import type { IconName } from '../components/Icon';

export type Product = {
  id: 'phone' | 'whatsapp' | 'crm' | 'light';
  icon: IconName;
  name: string;
  tagline: string;
  pitch: string;
  points: string[];
  image: string;
  imageAlt: string;
  setup: number;
  monthly: number;
  allWeek?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: 'phone',
    icon: 'phone',
    name: 'מענה טלפוני חכם',
    tagline: 'תפריט הקשות ובוט AI שעונה ללקוחות',
    pitch: 'כל שיחה נענית. הלקוח מקבל מענה מסודר, ואתה מקבל סיכום של השיחה במייל.',
    points: ['עונה גם כשאתה עסוק', 'מנתב לפי שעות הפעילות', 'סיכום כל שיחה ישירות למייל'],
    image: phoneImg,
    imageAlt: 'רובוט עם אוזניות עונה לשיחות טלפון',
    setup: 2500,
    monthly: 250,
    allWeek: true,
  },
  {
    id: 'whatsapp',
    icon: 'chat',
    name: 'בוט וואטסאפ',
    tagline: 'עונה ללקוחות בוואטסאפ, מסנן ומעביר לידים',
    pitch: 'הלקוח שואל, הבוט עונה מיד. כשיש ליד אמיתי, הוא מגיע אליך.',
    points: ['תשובות לשאלות נפוצות', 'תפריט פשוט ללקוח', 'כל ליד מגיע אליך למייל או לוואטסאפ'],
    image: whatsappImg,
    imageAlt: 'רובוט לצד טלפון עם שיחת וואטסאפ',
    setup: 2500,
    monthly: 250,
    allWeek: true,
  },
  {
    id: 'crm',
    icon: 'db',
    name: 'CRM בסיסי + סליקה פשוטה',
    tagline: 'לקוחות, לידים ותשלומים במקום אחד',
    pitch: 'במקום אקסלים ופתקים: מסך אחד שמראה לך מה קורה בעסק, וגם גובה תשלום.',
    points: ['לקוחות, לידים, תורים או הזמנות', 'דשבורד אחד ברור', 'גבייה דרך ספק סליקה פשוט'],
    image: crmImg,
    imageAlt: 'רובוט מציג מסך CRM עם לקוחות ולידים',
    setup: 2500,
    monthly: 250,
  },
  {
    id: 'light',
    icon: 'layout',
    name: 'דף נחיתה ואיסוף לידים, אוטומציית מיילים',
    tagline: 'נוכחות ברשת ומיילים שיוצאים לבד',
    pitch: 'דף אחד שמציג את העסק ואוסף פניות, או מיילים שנשלחים אוטומטית בזמן הנכון.',
    points: ['דף נחיתה מותאם למובייל', 'טופס יצירת קשר', 'מיילים אוטומטיים ללקוחות'],
    image: landingImg,
    imageAlt: 'רובוט מעל דף נחיתה ומיילים שנשלחים',
    setup: 1250,
    monthly: 125,
  },
];

export type Module = { id: string; icon: IconName; name: string; limits: string[] };

export const MODULES: Module[] = [
  {
    id: 'phone',
    icon: 'phone',
    name: 'מענה טלפוני',
    limits: [
      'מספר טלפון אחד',
      'עד 5 ענפים (תפריט הקשות או נושאים שהבוט מזהה)',
      'תסריט ומידע לבוט: עד עמוד אחד',
      'ניתוב לפי שעות פעילות',
      'סיכום שיחה במייל לכתובת אחת',
      'ללא חיבור למערכת חיצונית (חיבור הוא תוספת)',
    ],
  },
  {
    id: 'whatsapp',
    icon: 'chat',
    name: 'וואטסאפ',
    limits: [
      'מספר אחד, לא רשמי',
      'עד 5 זרימות או אפשרויות בתפריט',
      'עד 20 שאלות ותשובות נפוצות',
      'העברת ליד למייל או לוואטסאפ של בעל העסק',
    ],
  },
  {
    id: 'crm',
    icon: 'db',
    name: 'CRM בסיסי',
    limits: [
      'עד 3 ישויות (למשל: לקוחות, לידים, תורים או הזמנות)',
      'עד 15 שדות לכל ישות',
      'עד 5 מסכים, עד 3 משתמשים, דשבורד אחד',
      'סליקה דרך ספק פשוט מהרשימה של טק-שור',
      'ספק אחר שהלקוח בוחר, עם אינטגרציה מורכבת, כרוך בתוספת תשלום',
    ],
  },
  {
    id: 'landing',
    icon: 'layout',
    name: 'דף נחיתה',
    limits: ['עמוד אחד', 'עד 6 אזורי תוכן', 'טופס יצירת קשר', 'מותאם למובייל'],
  },
  {
    id: 'email',
    icon: 'mail',
    name: 'אוטומציית מיילים',
    limits: ['עד 3 טריגרים או תבניות'],
  },
];

export type Addon = { icon: IconName; title: string; text: string; example?: string; note?: string };

export const ADDONS: Addon[] = [
  {
    icon: 'grid',
    title: 'מוצר שני בחבילה: חצי מחיר',
    text: 'המוצר השני בחבילה בחצי מחיר, גם בהקמה וגם בתשלום החודשי.',
    example: 'וואטסאפ + CRM = 3,750 ₪ הקמה, 375 ₪ בחודש',
  },
  {
    icon: 'sync',
    title: 'חיבור בין מערכות',
    text: 'תוספת של 50% מערך המוצר היקר מביניהם, בהקמה ובחודשי.',
    example: 'מענה טלפוני + חיבור ל-CRM קיים = 3,750 ₪ הקמה, 375 ₪ בחודש',
    note: 'תנאי: למערכת הקיימת יש API מתועד. בלי API מתועד, המחיר נקבע לפי אפיון.',
  },
  {
    icon: 'shield',
    title: 'וואטסאפ רשמי (API של Meta)',
    text: 'הלקוח מספק API דרך חברה מורשית, או משלם תוספת של 2,000 ₪.',
    note: 'טק-שור אינה אחראית לחסימת מספר על ידי Meta, מכל סיבה שהיא.',
  },
];

export const TERMS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'clock',
    title: 'שעת שינוי בכל חודש',
    text: 'התשלום החודשי כולל שעת שינוי אחת בחודש. השעה לא נצברת לחודש הבא.',
  },
  { icon: 'gear', title: 'שעת עבודה נוספת', text: '250 ₪ לשעה.' },
  {
    icon: 'check',
    title: 'מה כולל התשלום החודשי',
    text: 'תפעול, טיפול בתקלות, תחזוקת שרתים ואינטגרציות, ושעת שינוי אחת.',
  },
  {
    icon: 'bell',
    title: 'מחיר השקה לזמן מוגבל',
    text: 'המחירים המוצגים באתר תקפים לתקופה מוגבלת.',
  },
  {
    icon: 'card',
    title: 'תשלום',
    text: '100% מעלות ההקמה משולמים מראש. העבודה לא מתחילה לפני התשלום.',
  },
  {
    icon: 'calendar',
    title: 'זמן אספקה',
    text: 'מוצר רזה: עד 30 יום מהתשלום ומאישור האפיון, ולפעמים מוקדם יותר. מוצר מורחב: לפי האפיון.',
  },
  {
    icon: 'file',
    title: 'התחייבות',
    text: 'מינימום 12 חודשים. ביציאה מוקדמת אין החזר על ההקמה.',
  },
  {
    icon: 'chip',
    title: 'עלויות צד שלישי',
    text: 'שרתים, כלי AI ודקות שיחה לא כלולים במחיר. הם מחויבים ישירות מכרטיס האשראי שלך, ותקבל הערכה מראש. אם עלויות AI או טוקנים עולות בעולם, העלות עולה בהתאם.',
  },
  {
    icon: 'list',
    title: 'שינויים מעבר לאפיון',
    text: 'שינוי שלא היה באפיון יתומחר מחדש.',
  },
  {
    icon: 'signal',
    title: 'סיום התקשרות',
    text: 'טק-שור רשאית לכבות את המערכת בהודעה מוקדמת של 30 יום. המערכת, הקוד והתשתית בבעלות טק-שור.',
  },
  {
    icon: 'gift',
    title: 'חבר מביא חבר',
    text: 'אחרי שהחבר חתם על חוזה ושילם הקמה, אתה בוחר אחת: דף נחיתה (עלויות האחסון והשימוש עליך), שעת ייעוץ, או זיכוי של 250 ₪.',
  },
];

export const PRICE_NOTE = 'המחירים לעסק קטן בינוני ובהתאם לאפיון. מוצר רחב יותר יתומחר בהתאם';

export const nis = (n: number) => `${n.toLocaleString('en-US')} ₪`;

// Custom system: no fixed price, scoped and priced in a discovery call.
export const CUSTOM = {
  id: 'custom',
  icon: 'code' as IconName,
  name: 'מערכת מותאמת אישית',
  tagline: 'כל מערכת, לכל פלטפורמה, מורכבת כמה שהעסק שלך צריך',
  pitch:
    'יש לך תהליך שאף כלי מוכן לא פותר? נבנה לך מערכת משלך. אנחנו מרכיבים אותה מהמודולים שלנו ומקוד שנכתב במיוחד בשבילך, כך שמקבלים בדיוק את מה שהעסק צריך.',
  points: [
    'כל מערכת ולכל פלטפורמה: אתר, אפליקציה, מערכת פנימית או חיבור בין מערכות',
    'פיתוח מהיר ועבודה יעילה',
    'צוות קטן שעובד עם כלי ה-AI החכמים ביותר',
    'במחיר ללא מתחרים',
  ],
  priceNote: 'המחיר נקבע בשיחת אפיון קצרה, לפי מה שהעסק שלך צריך.',
  image: emblemImg,
  imageAlt: 'רובוט במרכז מערכות שמתחברות זו לזו',
};
