import { Link } from 'react-router-dom';
import { Contact } from '../components/Contact';
import { PriceNote, SectionHead, Terms } from '../components/Blocks';
import { Icon } from '../components/Icon';
import { ADDONS, MODULES } from '../data/offer';
import { SplitWords, useSpotlight } from '../components/Motion';

export default function Modules() {
  const modulesRef = useSpotlight<HTMLUListElement>();
  const addonsRef = useSpotlight<HTMLUListElement>();
  return (
    <>
      <section className="page-hero page-hero--modules">
        <div className="mesh" aria-hidden="true"><span /><span /><span /></div>
        <div className="container container--narrow">
          <span className="kicker">מודולים</span>
          <h1 aria-label="מה מקבלים בכל כלי, בדיוק">
            <SplitWords text="מה מקבלים בכל כלי," />{' '}
            <SplitWords text="בדיוק" start={4} className="hl" />
          </h1>
          <p className="hero-lead">
            כל כלי מגיע עם היקף מוגדר וברור, כך שאתה יודע בדיוק מה מקבלים, והאספקה מהירה. כל מערכת נבנית מלאה ומקצועית, וההיקף נקבע לפי מה שהעסק צריך ולפי התקציב.
          </p>
          <p className="callout">
            <Icon name="list" size={20} />
            <span>
              צריך יותר ממה שכתוב כאן? זה <b>מוצר מורחב</b>. המחיר וזמן הפיתוח נקבעים לפי אפיון.
            </span>
          </p>
          <p className="callout">
            <Icon name="gear" size={20} />
            <span>
              המודולים הם נקודת התחלה, לא הגבול. אנחנו מפתחים <b>כל מערכת ולכל פלטפורמה</b>, בהתאמה אישית מלאה לעסק שלך.{' '}
              <Link to="/solutions/custom-system">למערכת מותאמת אישית</Link>
            </span>
          </p>
        </div>
      </section>

      <section className="section section--flush">
        <div className="container">
          <ul className="module-grid spot-grid" ref={modulesRef}>
            {MODULES.map((m) => (
              <li key={m.id} id={m.id} className="module">
                <header>
                  <span className="card-icon"><Icon name={m.icon} size={24} /></span>
                  <h2>{m.name}</h2>
                </header>
                <ul className="ticks">
                  {m.limits.map((l) => (
                    <li key={l}><Icon name="check" size={18} strokeWidth={3} /> {l}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="center-link">
            <Link to="/solutions" className="text-link">למחירים של כל כלי <Icon name="arrow" size={16} /></Link>
          </p>
        </div>
      </section>

      <section id="addons" className="section">
        <div className="container">
          <SectionHead kicker="חבילות ותוספות" title="מחברים כמה כלים, משלמים פחות">
            ככה זה עובד כשרוצים יותר מכלי אחד, או כשצריך לחבר מערכת שכבר יש לך.
          </SectionHead>
          <ul className="addon-grid spot-grid" ref={addonsRef}>
            {ADDONS.map((a) => (
              <li key={a.title} className="card addon">
                <span className="card-icon"><Icon name={a.icon} size={24} /></span>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
                {a.example && (
                  <p className="addon-example">
                    <span>דוגמה</span>
                    {a.example}
                  </p>
                )}
                {a.note && <p className="addon-note">{a.note}</p>}
              </li>
            ))}
          </ul>
          <PriceNote />
        </div>
      </section>

      <Terms />
      <Contact title="רוצים לבדוק מה מתאים לכם?" sub="נעבור יחד על מה שהעסק צריך, ונגיד לך בדיוק מה נכנס בהיקף הסטנדרטי ומה נבנה בהרחבה." />
    </>
  );
}
