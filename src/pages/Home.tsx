import { Link } from 'react-router-dom';
import { Contact } from '../components/Contact';
import { Faq, Features, Hero, Reveal, Section, SectionHead } from '../components/Blocks';
import { Icon, type IconName } from '../components/Icon';

const DOMAINS: { to: string; icon: IconName; title: string; text: string; hue: string }[] = [
  { to: '/ivr', icon: 'phone', title: 'מרכזייה חכמה – IVR', text: 'IVR + CRM + AI · נגיש מכל טלפון', hue: 'voice' },
  { to: '/automation', icon: 'bot', title: 'אוטומציה עסקית ובוטים', text: 'WhatsApp · מייל · סנכרון מערכות', hue: 'flow' },
  { to: '/web', icon: 'code', title: 'אתרים, CRM ומערכות מורכבות', text: 'דפי נחיתה · פורטלים · Web Apps', hue: 'web' },
];

const SERVICES = [
  {
    to: '/ivr',
    hue: 'voice',
    icon: 'phone' as IconName,
    tag: 'Tech-Shure VOICE',
    title: 'מרכזייה חכמה – IVR',
    text: 'מערכת טלפונית עם AI שמחוברת ל-CRM – לקהל שמעדיף את הטלפון.',
    bullets: ['מענה קולי מבוסס AI', 'הודעות קוליות ותשלומים בטלפון', 'שעות פעילות וחגים אוטומטיים'],
  },
  {
    to: '/automation',
    hue: 'flow',
    icon: 'bot' as IconName,
    tag: 'Tech-Shure FLOW',
    title: 'אוטומציה עסקית ובוטים',
    text: 'בוטים ל-WhatsApp ולמייל, וזרימות שמחליפות עבודה ידנית.',
    bullets: ['בוטים ל-WhatsApp Business', 'אוטומציית מיילים', 'סנכרון בין מערכות'],
  },
  {
    to: '/web',
    hue: 'web',
    icon: 'code' as IconName,
    tag: 'Tech-Shure WEB',
    title: 'אתרים, CRM ומערכות מורכבות',
    text: 'כל עולם האינטרנט – מדף נחיתה ועד מערכת ליבה.',
    bullets: ['מערכות CRM מותאמות', 'אתרים ודפי נחיתה', 'מערכות ופורטלים מורכבים'],
  },
];

const STATS = [
  { big: '+10', text: 'שנות ניסיון רב בפיתוח, אוטומציה וטלפוניה' },
  { big: 'צוות קטן', text: 'מענה רחב – מכתובת אחת לכל הצרכים הטכנולוגיים' },
  { big: 'המחיר המשתלם', text: 'העלויות המשתלמות ביותר שתמצאו בשוק' },
  { big: 'אחריות מלאה', text: 'על כל מערכת שאנחנו בונים – גם אחרי ההשקה' },
];

const ABOUT = [
  { title: 'צוות קטן, מענה רחב', text: 'כתובת אחת לטלפוניה, AI, אוטומציה, אתרים ומערכות – בלי לרדוף אחרי כמה ספקים.' },
  { title: 'העלויות המשתלמות ביותר', text: 'בלי תקורה של חברה גדולה – הצעות מחיר הוגנות ושקופות, מהמשתלמות שתמצאו בשוק.' },
  { title: 'ניסיון רב', text: 'מעל עשור בפיתוח מערכות קריטיות, כולל מערכות תשלומים ומרכזיות טלפוניות.' },
  { title: 'אחריות מלאה', text: 'אחריות מלאה על כל מערכת שאנחנו מספקים, עם תמיכה ותחזוקה גם אחרי ההשקה.' },
  { title: 'איכות שנבדקת', text: 'רקע עמוק בבדיקות אוטומטיות – כל תהליך נבדק לפני שהוא פוגש לקוחות.' },
  { title: 'נגיש לכל קהל', text: 'מערכות שעובדות גם עבור מי שלא מחובר לאינטרנט – מכל טלפון, בשפה פשוטה וברורה.' },
];

const STEPS = [
  { title: 'אפיון', text: 'שיחה קצרה להבנת העסק והתהליכים, ומיפוי מה כדאי לבנות קודם.' },
  { title: 'הצעה שקופה', text: 'מסמך אפיון, לוח זמנים והצעת מחיר ברורה ומשתלמת – בלי הפתעות.' },
  { title: 'פיתוח ובדיקות', text: 'פיתוח באבני דרך ובדיקות אוטומטיות לפני שזה פוגש לקוחות.' },
  { title: 'השקה ואחריות', text: 'עלייה לאוויר, הדרכה, ואחריות מלאה עם תמיכה שוטפת.' },
];

const INDUSTRIES = [
  'קהילות וארגונים',
  'מוסדות חינוך',
  'גמ״חים ועמותות',
  'עורכי דין ונדל״ן',
  'קמעונאות ורשתות',
  'פיננסים ותשלומים',
  'קליניקות ונותני שירות',
  'סטארטאפים וצוותי פיתוח',
];

const FAQ = [
  { q: 'כמה זה עולה?', a: 'לאחר שיחת האפיון מקבלים הצעת מחיר מפורטת ושקופה. כצוות קטן בלי תקורה, העלויות שלנו הן מהמשתלמות בשוק.' },
  { q: 'יש אחריות?', a: 'כן – אחריות מלאה על כל מה שאנחנו בונים, כולל תיקון תקלות ותמיכה לאחר ההשקה.' },
  { q: 'צוות קטן יכול להתמודד עם פרויקט גדול?', a: 'כן. אנחנו בונים באבני דרך, עם ארכיטקטורה מסודרת ובדיקות אוטומטיות – וכשצריך, מצרפים מומחים נוספים.' },
  { q: 'Do you work with clients outside Israel?', a: 'Yes. We work in English and Hebrew, remotely, with businesses in Israel and abroad.' },
];

export default function Home() {
  return (
    <>
      <Hero
        tag="Tech-Shure · Technology Systems & Software"
        title="טכנולוגיה שעובדת בשבילכם."
        accent="במחיר שלא תמצאו בשוק."
        sub="Small team. Big solutions. Full warranty."
        lead="טק-שור היא צוות פיתוח קטן ומנוסה שנותן מענה רחב לכל הצרכים הטכנולוגיים של העסק: מרכזיות חכמות, אוטומציה עסקית ובוטים, אתרים, מערכות CRM ומערכות מורכבות – עם העלויות המשתלמות ביותר בשוק ואחריות מלאה."
        cta="קבעו שיחת אפיון חינם"
        checks={['10+ שנות ניסיון', 'צוות קטן, מענה רחב', 'העלויות המשתלמות בשוק', 'אחריות מלאה']}
        visual={
          <div className="panel">
            <span className="mono panel-label" dir="ltr">Tech-Shure / what we deliver</span>
            <div className="domain-list">
              {DOMAINS.map((d, i) => (
                <Link key={d.to} to={d.to} className={`domain domain--${d.hue}`} style={{ animationDelay: `${200 + i * 140}ms` }}>
                  <span className="icon-box icon-box--solid">
                    <Icon name={d.icon} size={22} />
                  </span>
                  <span className="domain-copy">
                    <span className="domain-title">{d.title}</span>
                    <span className="domain-text">{d.text}</span>
                  </span>
                  <Icon name="arrow" size={18} className="domain-arrow" />
                </Link>
              ))}
            </div>
          </div>
        }
      />

      <section className="stats">
        <div className="container stats-grid">
          {STATS.map((s) => (
            <div key={s.big} className="stat">
              <div className="stat-big">{s.big}</div>
              <div className="stat-text">{s.text}</div>
            </div>
          ))}
        </div>
      </section>

      <Section id="about">
        <SectionHead
          kicker="ABOUT US"
          title="מי אנחנו"
          sub="Engineering-grade software, without the agency overhead."
          lead="טק-שור (Tech-Shure) נוסדה על ידי מפתחים עם ניסיון של מעל עשור בפיתוח תוכנה, מערכות תשלומים, בדיקות אוטומטיות ומערכות IVR. צוות קטן בכוונה: בלי שכבות ניהול ובלי תקורה של חברה גדולה – אתם מדברים ישירות עם מי שבונה, מקבלים תוצאות מהר ומשלמים פחות."
        />
        <Features items={ABOUT} />
      </Section>

      <Section id="services" tone="white">
        <SectionHead kicker="WHAT WE DO" title="שלושה תחומים. צוות אחד." lead="בחרו את התחום שמעניין אתכם – בכל עמוד תמצאו פירוט מלא, דוגמאות ושאלות נפוצות." />
        <div className="grid grid--cards">
          {SERVICES.map((s, i) => (
            <Reveal key={s.to} delay={i * 90}>
              <Link to={s.to} className={`card card--domain hue--${s.hue}`}>
                <span className="icon-box icon-box--hue">
                  <Icon name={s.icon} size={28} />
                </span>
                <span className="mono card-tag" dir="ltr">{s.tag}</span>
                <span className="card-title">{s.title}</span>
                <span className="card-text">{s.text}</span>
                <ul className="bullets">
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <span className="more">
                  לפרטים נוספים <Icon name="arrow" size={18} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="process">
        <SectionHead kicker="HOW WE WORK" title="מהרעיון למערכת עובדת – בארבעה שלבים" />
        <ol className="grid grid--steps">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 90} className="step">
                <span className="step-num mono">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="dark">
        <SectionHead kicker="INDUSTRIES" title="עובדים עם עסקים ומוסדות מכל התחומים" />
        <Reveal className="chips">
          {INDUSTRIES.map((x) => (
            <span key={x} className="chip chip--dark">{x}</span>
          ))}
        </Reveal>
      </Section>

      <Section>
        <SectionHead kicker="SELECTED WORK" title="פרויקטים נבחרים" />
        <div className="grid grid--projects">
          {[1, 2, 3].map((n) => (
            <Reveal key={n} delay={(n - 1) * 80}>
              <article className="card card--project">
                <div className="project-shot mono">[צילום מסך פרויקט]</div>
                <div className="project-body">
                  <h3>[שם הפרויקט {n}]</h3>
                  <p>[תיאור קצר: האתגר, הפתרון והתוצאה]</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Faq items={FAQ} />
      <Contact title="בואו נדבר על העסק שלכם" sub="Tell us what slows you down – we'll fix it." />
    </>
  );
}
