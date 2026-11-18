import { Link } from 'react-router-dom';
import emblem from '../assets/emblem.webp';
import hezki from '../assets/hezki.webp';
import { Contact } from '../components/Contact';
import { SectionHead } from '../components/Blocks';
import { Icon, type IconName } from '../components/Icon';
import { CountUp, SplitWords, useParallax } from '../components/Motion';

const PAINS: { icon: IconName; who: string; text: string }[] = [
  { icon: 'chat', who: 'ספק לוואטסאפ', text: 'עוד חשבונית בכל חודש' },
  { icon: 'layout', who: 'ספק לאתר', text: 'עוד מספר שצריך לרדוף אחריו' },
  { icon: 'phone', who: 'ספק לטלפון', text: 'עוד מערכת שלא מדברת עם האחרות' },
];

const PROMISE: { icon: IconName; title: string; text: string }[] = [
  { icon: 'users', title: 'כתובת אחת', text: 'יש שאלה, תקלה או שינוי? פונים אלינו. לא מחפשים מי אחראי על מה.' },
  { icon: 'calendar', title: 'מנוי חודשי קבוע', text: 'הקמה פעם אחת, ואחר כך תשלום חודשי ידוע מראש. בלי הפתעות.' },
  { icon: 'shield', title: 'שקט מלא', text: 'תפעול, תקלות ותחזוקה עלינו. אתה מתעסק בעסק שלך.' },
];

export default function Home() {
  const art = useParallax<HTMLDivElement>();
  return (
    <>
      {/* 1. Hero */}
      <section className="hero">
        <div className="hero-mesh" aria-hidden="true"><span /><span /><span /></div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1 className="split-title" aria-label="כל הטכנולוגיה של העסק, במקום אחד. על בטוח.">
              <SplitWords text="כל הטכנולוגיה של העסק, במקום אחד." />{' '}
              <SplitWords text="על בטוח." start={7} className="hl" />
            </h1>
            <p className="hero-lead">
              אנחנו בונים לעסק שלך מעטפת כלים שלמה: מענה טלפוני, וואטסאפ, מערכת מלאה לניהול לקוחות ולניהול העסק (CRM / ERP) ודף נחיתה. הכל אצלנו, הכל מתוחזק, ואתה מקבל שקט מלא.
            </p>
            <div className="hero-actions">
              <Link to={{ hash: '#contact' }} className="btn btn-accent btn-lg">
                בואו נדבר
                <Icon name="arrow" size={20} />
              </Link>
              <Link to="/solutions" className="btn btn-ghost btn-lg">פתרונות ומחירים</Link>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true" ref={art}>
            <span className="hero-aura" />
            <span className="orbit orbit--1"><i className="orbit-dot" /></span>
            <span className="orbit orbit--2"><i className="orbit-dot orbit-dot--gold" /></span>
            <span className="orbit orbit--3" />
            <img src={emblem} alt="" width={360} height={360} />
            <span className="chip chip--a"><Icon name="phone" size={18} /> מענה טלפוני</span>
            <span className="chip chip--b"><Icon name="chat" size={18} /> וואטסאפ</span>
            <span className="chip chip--c"><Icon name="db" size={18} /> CRM / ERP</span>
            <span className="chip chip--d"><Icon name="layout" size={18} /> דף נחיתה</span>
          </div>
        </div>
      </section>

      {/* 2. The pain */}
      <section className="section">
        <div className="container">
          <SectionHead kicker="מכירים את זה?" title="ספק לכל דבר. בלאגן בכל מקום.">
            המערכות שהיו אמורות לעשות סדר, עושות בלאגן. כל אחד גובה בנפרד, ואף אחד לא רואה את התמונה המלאה.
          </SectionHead>
          <ul className="pain-grid">
            {PAINS.map((p) => (
              <li key={p.who} className="pain">
                <span className="pain-icon"><Icon name={p.icon} size={24} /></span>
                <h3>{p.who}</h3>
                <p>{p.text}</p>
                <span className="pain-bill">חשבון נפרד</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. The solution */}
      <section className="section section--sand">
        <div className="container">
          <SectionHead kicker="הפתרון" title="מקום אחד שתופס הכל">
            Tech-shure בונה, מחברת ומתחזקת את כל הכלים של העסק. מנוי חודשי אחד, אחריות אחת.
          </SectionHead>
          <ul className="promise-grid">
            {PROMISE.map((p) => (
              <li key={p.title} className="card">
                <span className="card-icon"><Icon name={p.icon} size={24} /></span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>
          <p className="big-quote">"<CountUp value={250} /> ₪ בחודש, ויש לך מערכת שמכסה אותך מכל הכיוונים."</p>
        </div>
      </section>

      {/* 4 + 5. Why fast and cheap, built for you */}
      <section className="section">
        <div className="container split">
          <article className="feature">
            <span className="card-icon card-icon--gold"><Icon name="bolt" size={24} /></span>
            <h2>למה זה מהיר וזול?</h2>
            <p>
              הבינה המלאכותית שינתה את כללי המשחק. אנחנו צוות מקצועי שעובד עם כלי ה-AI החכמים ביותר בשוק, ולכן בונים מערכות מלאות ומורכבות, מהר ובעלות נמוכה.
            </p>
            <p>זו הדרך החדשנית ביותר לבנות תוכנה בעידן ה-AI: אתה משלם פחות, ואנחנו נשארים כאן לטווח ארוך.</p>
          </article>
          <article className="feature">
            <span className="card-icon"><Icon name="lock" size={24} /></span>
            <h2>נבנה אישית בשבילך</h2>
            <p>
              לא תבנית גנרית. קוד שנכתב במיוחד לעסק שלך, לפי איך שאתה עובד, ורץ על שרת מאובטח.
            </p>
            <ul className="ticks">
              <li><Icon name="check" size={18} strokeWidth={3} /> קוד מותאם לעסק שלך</li>
              <li><Icon name="check" size={18} strokeWidth={3} /> שרת מאובטח</li>
              <li><Icon name="check" size={18} strokeWidth={3} /> מתחזקים ומשפרים לאורך הדרך</li>
            </ul>
          </article>
        </div>
      </section>

      {/* 6. Custom build */}
      <section className="section section--sand">
        <div className="container container--narrow custom">
          <span className="kicker">פיתוח בהתאמה אישית</span>
          <h2>כל מערכת. כל פלטפורמה. בנויה בשבילך.</h2>
          <p className="lead">
            אנחנו מפתחים כל מערכת שהעסק צריך, בהתאמה אישית מלאה, מתוך מודולים מוכנים, ולכל פלטפורמה. מענה טלפוני, וואטסאפ, מערכות CRM / ERP לניהול העסק, סליקה, דפי נחיתה ואוטומציית מיילים הם רק דוגמאות, לא הגבול. והמערכת פעילה 24/7.
          </p>
          <div className="custom-links">
            <Link to="/solutions" className="btn btn-primary">לפתרונות התוכנה <Icon name="arrow" size={18} /></Link>
            <Link to="/modules" className="btn btn-ghost">למודולים ולתנאים</Link>
          </div>
        </div>
      </section>

      {/* 7. Refer a friend */}
      <section className="section">
        <div className="container">
          <div className="refer">
            <img src={hezki} alt="רובוט מנופף לשלום" className="refer-bot" loading="lazy" />
            <div className="refer-copy">
              <span className="kicker">חבר מביא חבר</span>
              <h2>ממליץ עלינו? מקבל מתנה.</h2>
              <p>אחרי שהחבר שלך חתם על חוזה ושילם הקמה, אתה בוחר אחת:</p>
              <ul className="refer-gifts">
                <li><Icon name="layout" size={20} /> דף נחיתה לעסק שלך <small>(אחסון ושימוש עליך)</small></li>
                <li><Icon name="users" size={20} /> שעת ייעוץ</li>
                <li><Icon name="coins" size={20} /> זיכוי של 250 ₪</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Contact */}
      <Contact />
    </>
  );
}
