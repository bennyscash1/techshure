import { Contact } from '../components/Contact';
import { Faq, Hero, Reveal, Section, SectionHead, ServiceGrid, UseCaseGrid, type Service, type UseCase } from '../components/Blocks';

const SERVICES: Service[] = [
  { icon: 'db', title: 'מערכות CRM מותאמות', en: 'Custom CRM', text: 'ניהול לקוחות, תורמים, תלמידים או עסקאות – בדיוק לפי התהליך שלכם, בלי לשלם על פיצ׳רים מיותרים.' },
  { icon: 'layout', title: 'דפי נחיתה', en: 'High-Converting Landing Pages', text: 'דפים מהירים וממוקדי המרה, מחוברים ישירות ל-CRM, ל-WhatsApp ולמערך הלידים.' },
  { icon: 'code', title: 'אתרי תדמית ואתרים עסקיים', en: 'Business Websites', text: 'אתרים דו-לשוניים, מותאמים למובייל ול-SEO, עם ניהול תוכן פשוט.' },
  { icon: 'gear', title: 'מערכות Web מורכבות', en: 'Complex Web Applications', text: 'מערכות ניהול, תהליכי עבודה רב-שלביים, הרשאות ותפקידים – בנויות לגדול.' },
  { icon: 'file', title: 'פורטלי לקוחות', en: 'Client Portals', text: 'אזור אישי ללקוח: העלאת מסמכים, מעקב סטטוס, חתימות ותשלומים.' },
  { icon: 'chart', title: 'דשבורדים ודוחות', en: 'Dashboards & Reporting', text: 'תמונת מצב בזמן אמת על הלידים, המכירות והתפעול.' },
  { icon: 'sync', title: 'אינטגרציות ו-API', en: 'APIs & Integrations', text: 'חיבור לסליקה, הנהלת חשבונות, מרכזייה וכל מערכת עם API.' },
  { icon: 'shield', title: 'אבטחה, ביצועים ובדיקות', en: 'Security · Performance · QA', text: 'הרשאות, הצפנה, גיבויים ובדיקות אוטומטיות שמבטיחות שהמערכת לא נשברת.' },
  { icon: 'chip', title: 'שילוב AI במערכת', en: 'AI Inside Your System', text: 'הפקת מסמכים, סיווג פניות, חיפוש חכם וסיכומים – בתוך המערכת שלכם.' },
];

const CASES: UseCase[] = [
  { tag: 'משרדי עורכי דין ונדל״ן', title: 'מערכת לניהול עסקאות ואיסוף מסמכים', before: 'פינג-פונג של עשרות הודעות כדי לקבל תעודות זהות ופרטי צדדים.', after: 'פורטל ללקוח עם העלאת מסמכים, תזכורות אוטומטיות וניהול סטטוסים חכם.' },
  { tag: 'כל עסק', title: 'דף נחיתה שמחובר ל-CRM', before: 'טופס נשלח למייל, מישהו מעתיק לאקסל ומתקשרים אחרי יום.', after: 'הליד נרשם ב-CRM, מקבל מענה מיידי, והצוות מקבל התראה.' },
  { tag: 'מוסדות ועמותות', title: 'CRM לניהול תורמים', before: 'רשימות באקסל, קבלות ידניות ואין תמונה של התורמים.', after: 'כרטיס תורם, היסטוריית תרומות, קבלות אוטומטיות ודוחות.' },
  { tag: 'רשתות ונותני שירות', title: 'מערכת תפעול לסניפים', before: 'כל סניף עובד אחרת ואין שליטה מרכזית.', after: 'מערכת אחת עם הרשאות לסניפים, סטטוסים ודשבורד הנהלה.' },
];

const STACK = ['TypeScript', 'React / Next.js', 'Node.js', 'C# / .NET', 'Python', 'PostgreSQL / SQL Server', 'REST & Webhooks', 'Docker', 'GitHub Actions CI/CD', 'Playwright', 'AI / LLM'];

const FAQ = [
  { q: 'כמה זמן לוקח לבנות דף נחיתה?', a: 'דף נחיתה ממוקד עולה לאוויר בדרך כלל תוך ימים ספורים; מערכות מורכבות נבנות באבני דרך לפי לוח זמנים שנקבע באפיון.' },
  { q: 'למה CRM מותאם ולא מערכת מדף?', a: 'מערכת מדף מחייבת אתכם להתאים את העסק אליה. CRM מותאם עושה בדיוק מה שאתם צריכים – ובלי דמי מנוי לכל משתמש.' },
  { q: 'האתר יהיה שלי?', a: 'כן. הקוד, הדומיין והנתונים בבעלותכם המלאה.' },
  { q: 'יש אחריות ותחזוקה?', a: 'כן – אחריות מלאה על המערכת, עם אפשרות לתחזוקה ופיתוח המשך.' },
];

const ROWS = [
  { name: 'משרד כהן', status: 'ממתין למסמכים' },
  { name: 'לוי נכסים', status: 'הצעה נשלחה' },
  { name: 'מרכז אור', status: 'פגישה נקבעה' },
];

function CrmMock() {
  return (
    <div className="panel">
      <div className="window-dots" aria-hidden="true">
        <span /><span /><span />
      </div>
      <div className="kpis">
        {[
          { l: 'לידים חדשים', v: '128' },
          { l: 'בטיפול', v: '42' },
          { l: 'נסגרו', v: '87' },
        ].map((k) => (
          <div key={k.l} className="kpi">
            <div className="kpi-label">{k.l}</div>
            <div className="kpi-value">{k.v}</div>
          </div>
        ))}
      </div>
      <div className="mock-table">
        <div className="mock-row mock-row--head"><span>לקוח</span><span>סטטוס</span></div>
        {ROWS.map((r) => (
          <div key={r.name} className="mock-row"><span>{r.name}</span><span className="mock-status">{r.status}</span></div>
        ))}
      </div>
      <span className="mono panel-label" dir="ltr">custom-crm / dashboard (illustration)</span>
    </div>
  );
}

export default function Web() {
  return (
    <>
      <Hero
        tag="Web · CRM · Complex Systems"
        title="מערכות CRM, אתרים"
        accent="ומערכות מורכבות."
        sub="From landing pages to full-scale platforms."
        lead="כל עולם האינטרנט תחת קורת גג אחת: מערכות CRM מותאמות בדיוק לתהליכים שלכם, אתרים ודפי נחיתה שממירים, פורטלי לקוחות ומערכות Web מורכבות – בנויים על טכנולוגיות מודרניות, עם אחריות מלאה ובעלויות המשתלמות ביותר."
        cta="קבעו שיחת אפיון חינם"
        checks={['CRM מותאם אישית', 'מהיר ומותאם למובייל', 'עברית ואנגלית', 'אחריות מלאה']}
        visual={<CrmMock />}
      />

      <Section id="services">
        <SectionHead kicker="WHAT WE BUILD" title="מה אנחנו בונים" lead="צוות קטן עם מענה רחב – כל שכבה של המערכת, מהעיצוב ועד השרת." />
        <ServiceGrid items={SERVICES} />
      </Section>

      <Section tone="white">
        <SectionHead kicker="USE CASES" title="דוגמאות מהשטח" />
        <UseCaseGrid items={CASES} />
      </Section>

      <Section id="stack">
        <div className="split">
          <SectionHead
            kicker="TECH STACK"
            title="טכנולוגיות מודרניות, קוד נקי"
            sub="Production-ready. Tested. Built to scale."
            lead="קוד מתועד, מאובטח וניתן לתחזוקה – המערכת והקוד נשארים בבעלותכם."
          />
          <Reveal className="stack" >
            <div dir="ltr" className="stack-list mono">
              {STACK.map((s) => (
                <span key={s} className="stack-item">{s}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <Faq items={FAQ} />
      <Contact title="בואו נבנה את המערכת שלכם" sub="Your system, your way." defaultService="אתר או דף נחיתה" />
    </>
  );
}
