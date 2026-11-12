import { Contact } from '../components/Contact';
import { ContactLink, Faq, FlowCard, Hero, Reveal, Section, SectionHead, ServiceGrid, UseCaseGrid, type Service, type UseCase } from '../components/Blocks';

const PROBLEMS = [
  { title: 'פניות שנשכחות', text: 'לידים מוואטסאפ, טלפון ומייל מתפזרים ולא מקבלים מענה בזמן.' },
  { title: 'פינג-פונג מול לקוחות', text: 'איסוף פרטים ומסמכים בעשרות הודעות.' },
  { title: 'מערכות שלא מדברות', text: 'CRM, הנהלת חשבונות ואתר – כל אחד באי משלו.' },
  { title: 'עבודה ידנית חוזרת', text: 'העתקות, דוחות ותזכורות שגוזלים שעות כל שבוע.' },
];

const AGENTS: Service[] = [
  { icon: 'mail', title: 'סוכן AI למייל', en: 'AI Email Agent', text: 'מתחבר לתיבת המייל, קורא כל פנייה, מסווג לפי נושא ודחיפות, מנסח תשובה ומחלץ נתונים ישר למערכת.' },
  { icon: 'chat', title: 'סוכן AI ל-WhatsApp', en: 'AI WhatsApp Agent', text: 'מבין שאלות חופשיות – לא רק תפריט. עונה ללקוחות 24/7 על בסיס המידע של העסק, ומעביר לנציג כשצריך.' },
  { icon: 'bell', title: 'סוכן לידים', en: 'AI Lead Agent', text: 'מזהה פנייה חמה, שואל את שאלות הסינון, מתעדף ומעדכן אתכם מיד – לפני שהלקוח פונה למתחרה.' },
  { icon: 'chart', title: 'סוכן סיכומים ודוחות', en: 'AI Daily Brief', text: 'מסכם בסוף היום מה נכנס, מה טופל ומה מחכה לכם – ושולח למייל או ל-WhatsApp של המנהל.' },
];

const SERVICES: Service[] = [
  { icon: 'bot', title: 'בוטים ל-WhatsApp Business', en: 'WhatsApp Business API', text: 'בוט שעונה ללקוחות, קובע תורים, מקבל הזמנות ושולח עדכונים – 24/7, דרך הממשק הרשמי.' },
  { icon: 'chat', title: 'הודעות ועדכוני סטטוס', en: 'WhatsApp Notifications', text: 'אישורי הזמנה, "ההזמנה מוכנה", תזכורות לתורים ולתשלומים – אוטומטית.' },
  { icon: 'mail', title: 'אוטומציית מיילים', en: 'Email Sequences & Parsing', text: 'רצפי מיילים, קליטה וניתוח מיילים נכנסים, שליחת מסמכים ללקוחות ולספקים.' },
  { icon: 'sync', title: 'סנכרון בין מערכות', en: 'CRM Sync · Webhooks', text: 'נתונים זורמים לבד בין CRM, אתר, סליקה והנהלת חשבונות.' },
  { icon: 'file', title: 'הפקת מסמכים אוטומטית', en: 'Document Automation', text: 'הצעות מחיר, חוזים וקבלות שנוצרים ונשלחים אוטומטית.' },
  { icon: 'chip', title: 'סוכני AI מותאמים', en: 'Custom AI Agents', text: 'סוכן שמחובר למייל, ל-WhatsApp ולמערכות שלכם – עם הידע, הכללים והטון של העסק.' },
  { icon: 'chart', title: 'דוחות אוטומטיים', en: 'Scheduled Reports', text: 'דוח יומי או שבועי שמגיע למייל או לוואטסאפ של המנהל.' },
  { icon: 'gear', title: 'ייעול תהליכים', en: 'Process Optimization', text: 'מיפוי צווארי בקבוק והחלפתם בתהליכים מהירים ועמידים.' },
  { icon: 'shield', title: 'אוטומציה שנבדקת', en: 'Tested & Monitored', text: 'ניטור, התראות ובדיקות אוטומטיות – כדי שהאוטומציה לא תיעצר בשקט.' },
];

const CASES: UseCase[] = [
  { tag: 'חנויות ונותני שירות', title: '"ההזמנה שלך מוכנה" – אוטומטית', before: 'עובד מתקשר ללקוחות אחד-אחד.', after: 'שינוי סטטוס במערכת שולח WhatsApp עם פרטי איסוף ותשלום.' },
  { tag: 'כל עסק', title: 'ליד – מטופל תוך שניות', before: 'מתקשרים לליד אחרי יום.', after: 'מענה WhatsApp מיידי, רישום ב-CRM והתראה לצוות.' },
  { tag: 'משרדים', title: 'קליטת מיילים ומסמכים', before: 'מישהו פותח כל מייל ומעתיק נתונים.', after: 'AI קורא את המייל, מחלץ נתונים ופותח רשומה במערכת.' },
  { tag: 'קליניקות ונותני שירות', title: 'תזכורות ואישורי הגעה', before: 'ביטולים של הרגע האחרון ותורים ריקים.', after: 'תזכורת WhatsApp עם אישור/ביטול, ושחרור התור אוטומטית.' },
];

const FAQ = [
  { q: 'איך זה עובד מול WhatsApp?', a: 'אנחנו עובדים עם WhatsApp Business API הרשמי, כולל תבניות הודעה מאושרות – בלי סיכון לחסימת המספר.' },
  { q: 'צריך להחליף את המערכות הקיימות?', a: 'ברוב המקרים לא. אנחנו מתחברים למה שכבר עובד אצלכם ומחברים בין המערכות.' },
  { q: 'כמה זמן לוקח?', a: 'אוטומציה ממוקדת יכולה לעלות לאוויר תוך ימים ספורים.' },
  { q: 'מה אם ה-AI יענה ללקוח תשובה לא נכונה?', a: 'הסוכן עונה רק על בסיס המידע והכללים שהגדרנו יחד. אפשר להתחיל במצב שבו הוא רק מנסח טיוטה ואתם מאשרים לפני שליחה, ובכל שאלה שהוא לא בטוח בה – הוא מעביר לנציג.' },
  { q: 'מה עם פרטיות המידע?', a: 'החיבור למייל ול-WhatsApp נעשה בהרשאות מוגבלות, רק למה שהסוכן צריך, והמידע לא משמש לשום מטרה אחרת.' },
  { q: 'מה קורה אם משהו נתקע?', a: 'יש ניטור והתראות, ואחריות מלאה – אנחנו מטפלים בזה.' },
];

export default function Automation() {
  return (
    <>
      <Hero
        tag="Business Automation · AI Agents"
        title="אוטומציה וסוכני AI"
        accent="שעובדת גם כשאתם לא."
        sub="Automate the routine. Engineer the growth."
        lead="סוכני AI שמחוברים למייל ול-WhatsApp, עונים ללקוחות, מסננים לידים ומעדכנים את המערכות – לצד בוטים, סנכרון בין מערכות ותהליכים שרצים לבד – כדי שהצוות שלכם יתעסק בעבודה האמיתית ולא בהעתק-הדבק. צוות קטן, ניסיון רב, העלויות המשתלמות ביותר ואחריות מלאה."
        cta="קבעו שיחת אפיון חינם"
        checks={['סוכני AI למייל', 'סוכני AI ל-WhatsApp', 'בוטים וזרימות', 'סנכרון מערכות']}
        visual={
          <FlowCard
            label="agent: inbox-ai.flow"
            steps={[
              { icon: 'mail', title: 'מייל או הודעת WhatsApp נכנסים', text: 'שאלה, הזמנה, ליד או מסמך' },
              { icon: 'chip', title: 'סוכן ה-AI מבין ומסווג', text: 'נושא, דחיפות ופרטי הלקוח' },
              { icon: 'chat', title: 'תשובה מותאמת תוך שניות', text: 'בטון של העסק, או טיוטה לאישורכם' },
              { icon: 'db', title: 'עדכון CRM + התראה לצוות', text: 'שום פנייה לא נופלת בין הכיסאות' },
            ]}
          />
        }
      />

      <Section>
        <SectionHead kicker="THE PROBLEM" title="העסק גדל – והעבודה הידנית גדלה איתו" lead="רוב העסקים לא צריכים עוד עובד. הם צריכים שהתהליכים הקיימים ירוצו לבד." />
        <div className="grid grid--steps">
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.title} delay={i * 80} className="problem">
              <div className="problem-title">{p.title}</div>
              <div className="problem-text">{p.text}</div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="ai-agents" tone="dark">
        <SectionHead kicker="AI AGENTS" title="סוכני AI שעובדים בשבילכם – במייל וב-WhatsApp" lead="לא עוד בוט עם תפריט. סוכן שמבין מה הלקוח כותב, עונה על בסיס הידע של העסק ויודע מתי להעביר אליכם." />
        <ServiceGrid items={AGENTS} dark />
      </Section>

      <Section id="services" tone="white">
        <SectionHead kicker="AUTOMATION SERVICES" title="מה אנחנו מאטמטים" lead="מאוטומציה קטנה שחוסכת שעה ביום ועד מערך שלם." />
        <ServiceGrid items={SERVICES} />
      </Section>

      <Section>
        <SectionHead kicker="USE CASES" title="דוגמאות למה שאפשר להפוך לאוטומטי" />
        <UseCaseGrid items={CASES} />
      </Section>

      <section className="cta-band">
        <div className="container cta-band-inner">
          <h2>יש לכם תהליך שחוזר על עצמו? כנראה שאפשר לאטמט אותו.</h2>
          <ContactLink className="btn btn-dark btn-lg">בדיקת היתכנות חינם</ContactLink>
        </div>
      </section>

      <Faq items={FAQ} />
      <Contact title="בואו נאטמט את התהליך הבא" sub="Every manual step is a bottleneck." defaultService="סוכני AI למייל ול-WhatsApp" />
    </>
  );
}
