import { Contact } from '../components/Contact';
import { Faq, Features, FlowCard, Hero, Reveal, Section, SectionHead, ServiceGrid, UseCaseGrid, type Service, type UseCase } from '../components/Blocks';

const CAPABILITIES: Service[] = [
  { icon: 'chip', title: 'מענה קולי מבוסס AI', text: 'עוזר קולי שמבין עברית מדוברת, עונה על שאלות נפוצות ומנתב לנציג הנכון.' },
  { icon: 'db', title: 'חיבור מלא ל-CRM', text: 'זיהוי מתקשר, כרטיס לקוח מתעדכן, תמלול וסיכום שיחה ופתיחת משימה.' },
  { icon: 'bell', title: 'הודעות קוליות יזומות', text: 'הודעות לרשימות תפוצה – עדכונים, תזכורות, הזמנות וסקרים.' },
  { icon: 'card', title: 'גביית תשלומים ותרומות', text: 'קו תשלומים ותרומות, הוראות קבע וקבלה – מתועד ב-CRM.' },
  { icon: 'calendar', title: 'שעות פעילות וחגים אוטומטיים', text: 'סגירה ופתיחה לפי לוח שעות, חגים וימים מיוחדים – עם הודעות מותאמות.' },
  { icon: 'mic', title: 'קווי תוכן ומידע', text: 'קווי הרצאות, עדכונים ותוכן מוקלט, עם דוחות האזנה.' },
  { icon: 'route', title: 'ניתוב חכם', text: 'לפי שעות, מחלקות, עומס ושפה (עברית, אנגלית, רוסית ועוד), כולל שיחה חוזרת.' },
  { icon: 'list', title: 'הרשמה וטפסים בטלפון', text: 'הרשמה לאירועים ולשירותים בהקשה או בקול – ישר למערכת.' },
  { icon: 'chart', title: 'דוחות וניהול', text: 'כמה התקשרו, על מה, כמה נענו – דשבורד ברור למנהלים.' },
];

const AUDIENCE = [
  'מוסדות חינוך',
  'עמותות וגמ״חים',
  'קהילות וארגונים',
  'קווי מידע ופניות ציבור',
  'קהל מבוגר ואוכלוסיות ותיקות',
  'עסקים וחנויות',
  'מוקדי שירות ומכירות',
];

const AI_POINTS = [
  'תמלול וסיכום אוטומטיים של כל שיחה',
  'זיהוי כוונת המתקשר וניתוב לפי נושא',
  'מענה על שאלות מתוך מאגר הידע של הארגון',
  'ניתוח פניות ודוחות מגמות למנהלים',
  'חיבור AI גם ל-WhatsApp, למייל ולמערכות פנימיות',
];

const CASES: UseCase[] = [
  { tag: 'מוסדות ועמותות', title: 'קו תרומות טלפוני שמחובר ל-CRM', before: 'תרומות נרשמות ידנית, קבלות באיחור, אין תמונה של התורמים.', after: 'תרומה בהקשה או בקול, קבלה אוטומטית, כרטיס תורם מתעדכן והודעת תודה קולית.' },
  { tag: 'ארגונים וקווי מידע', title: 'מענה קולי חכם לשאלות ופניות', before: 'הטלפון לא מפסיק לצלצל והודעות הולכות לאיבוד.', after: 'AI עונה על שאלות נפוצות, מסנן ומנתב, ופניות שדורשות מענה אישי נרשמות בתור מסודר.' },
  { tag: 'בתי ספר ומוסדות חינוך', title: 'עדכונים להורים בהודעה קולית', before: 'הודעות לא מגיעות להורים בלי סמארטפון או אינטרנט.', after: 'הודעה קולית לכל ההורים, עם אישור קבלה ודוח על מי ששמע.' },
  { tag: 'עסקים ונותני שירות', title: 'שיחה שלא נענתה הופכת ללקוח', before: 'שיחות מחוץ לשעות הפעילות הולכות לאיבוד.', after: 'IVR מנתב, שולח הודעה חוזרת ופותח משימה ב-CRM לנציג.' },
];

const WHY = [
  { title: 'ניסיון בטלפוניה', text: 'ניסיון מעשי בבניית מרכזיות ו-IVR למוסדות, ארגונים ועסקים.' },
  { title: 'העלויות המשתלמות ביותר', text: 'צוות קטן בלי תקורה – מרכזייה חכמה במחיר שלא תמצאו בשוק.' },
  { title: 'אחריות מלאה', text: 'אחריות מלאה ותמיכה שוטפת – גם מחוץ לשעות הפעילות.' },
];

const FAQ = [
  { q: 'המרכזייה עובדת גם עם טלפון פשוט, בלי אינטרנט?', a: 'כן. המערכת קולית לחלוטין ועובדת מכל טלפון – פשוט, קווי או נייד – בלי אינטרנט או אפליקציה אצל המתקשר.' },
  { q: 'איזה CRM אפשר לחבר?', a: 'כל CRM עם API, או מערכת ייעודית שנבנה עבורכם לניהול לקוחות, תורמים או תלמידים.' },
  { q: 'אפשר לשמור על המספר הקיים?', a: 'ברוב המקרים כן – מעבירים את המספר הקיים או מנתבים ממנו למערכת החדשה.' },
  { q: 'יש אחריות?', a: 'כן – אחריות מלאה על המערכת, כולל תיקון תקלות ותמיכה לאחר ההשקה.' },
];

export default function Ivr() {
  return (
    <>
      <Hero
        tag="Smart IVR · CRM · AI"
        title="מרכזייה חכמה"
        accent="שמגיעה לכל מתקשר."
        sub="Voice-first systems for people who live on the phone."
        lead="לא כל הלקוחות, התורמים וההורים מחוברים לאינטרנט – רבים זמינים רק בטלפון פשוט. עבורם, הטלפון הוא הערוץ הדיגיטלי המרכזי. אנחנו בונים מערכות IVR שמדברות בשפה של הקהל, מחוברות ישירות ל-CRM ומשתמשות בבינה מלאכותית כדי לענות, לנתב, לתעד ולגבות."
        cta="אני רוצה הדגמה חיה"
        checks={['עובד מכל טלפון – גם בלי אינטרנט', 'מחובר ל-CRM', 'שעות וחגים אוטומטיים', 'אחריות מלאה']}
        visual={
          <FlowCard
            label="workflow: smart-ivr.flow"
            steps={[
              { icon: 'phone', title: 'שיחה נכנסת – מכל טלפון', text: 'זיהוי מתקשר אוטומטי לפי מספר' },
              { icon: 'chip', title: 'מענה קולי חכם מבוסס AI', text: 'מבין עברית מדוברת ומנתב לפי הצורך' },
              { icon: 'db', title: 'תיעוד וסנכרון ל-CRM', text: 'תמלול, סיכום שיחה ופתיחת משימה' },
              { icon: 'chat', title: 'מענה חוזר אוטומטי', text: 'SMS, הודעה קולית או נציג' },
            ]}
          />
        }
      />

      <Section id="capabilities" tone="deep">
        <SectionHead kicker="CAPABILITIES" title="מה המרכזייה יודעת לעשות" />
        <ServiceGrid items={CAPABILITIES} dark />
      </Section>

      <Section>
        <div className="grid grid--wide">
          <Reveal>
            <div className="card card--info">
              <span className="kicker mono" dir="ltr">WHO IT IS FOR</span>
              <h2>למי זה מתאים</h2>
              <p className="card-text">לכל ארגון שחלק מהקהל שלו לא נגיש דרך אינטרנט, אפליקציות או סמארטפון.</p>
              <div className="chips">
                {AUDIENCE.map((a) => (
                  <span key={a} className="chip">{a}</span>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="card card--info">
              <span className="kicker mono" dir="ltr">AI EVERYWHERE</span>
              <h2>AI למגוון תחומים</h2>
              <ul className="bullets bullets--lg">
                {AI_POINTS.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="white">
        <SectionHead kicker="USE CASES" title="דוגמאות מהשטח" />
        <UseCaseGrid items={CASES} />
      </Section>

      <Section>
        <SectionHead kicker="WHY Tech-Shure" title="למה לבחור בנו למרכזייה" />
        <Features items={WHY} />
      </Section>

      <Faq items={FAQ} />
      <Contact title="בואו נבנה לכם מרכזייה חכמה" sub="A smart line for your audience." defaultService="מרכזייה חכמה / IVR + CRM + AI" />
    </>
  );
}
