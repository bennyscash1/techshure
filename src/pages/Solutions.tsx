import { Link } from 'react-router-dom';
import { Contact } from '../components/Contact';
import { PriceBox, PriceNote, Terms } from '../components/Blocks';
import { Icon } from '../components/Icon';
import { SplitWords, TiltCard } from '../components/Motion';
import { CUSTOM, PRODUCTS } from '../data/offer';
import { CONTACT } from '../data/site';

export default function Solutions() {
  return (
    <>
      <section className="page-hero page-hero--solutions">
        <div className="container container--narrow">
          <span className="kicker">פתרונות תוכנה</span>
          <h1 aria-label="מערכות מלאות שעושות לעסק סדר">
            <SplitWords text="מערכות מלאות שעושות לעסק" />{' '}
            <SplitWords text="סדר" start={4} className="hl" />
          </h1>
          <p className="hero-lead">
            כל מערכת נבנית אישית לעסק שלך, מלאה ומקצועית, בהיקף שמתאים לעסק ולתקציב. מתוחזקת על ידינו, ובמנוי חודשי קבוע. בוחרים מערכת אחת, או מחברים כמה למעטפת אחת.
          </p>
          <p className="callout">
            <Icon name="gear" size={20} />
            <span>
              הכלים כאן הם דוגמאות, לא הגבול. אנחנו מפתחים <b>כל מערכת ולכל פלטפורמה</b>, בהתאמה אישית מלאה לעסק שלך.
            </span>
          </p>
          <div className="launch-banner">
            <strong>מחיר השקה לזמן מוגבל</strong>
          </div>
        </div>
      </section>

      <section className="section section--flush">
        <div className="container">
          <nav className="jump" aria-label="קפיצה למוצר">
            {PRODUCTS.map((p) => (
              <a key={p.id} href={`#${p.id}`}>
                <Icon name={p.icon} size={18} /> {p.name}
              </a>
            ))}
            <a href={`#${CUSTOM.id}`}>
              <Icon name={CUSTOM.icon} size={18} /> {CUSTOM.name}
            </a>
          </nav>

          {PRODUCTS.map((p, i) => (
            <article key={p.id} id={p.id} className={`product-row${i % 2 ? ' product-row--flip' : ''}`}>
              <TiltCard className="product-row-media">
                <img src={p.image} alt={p.imageAlt} loading={i ? 'lazy' : 'eager'} />
              </TiltCard>
              <div className="product-row-copy">
                <span className="card-icon"><Icon name={p.icon} size={24} /></span>
                <h2>{p.name}</h2>
                <p className="product-tagline">{p.tagline}</p>
                <p>{p.pitch}</p>
                <ul className="ticks">
                  {p.points.map((pt) => (
                    <li key={pt}><Icon name="check" size={18} strokeWidth={3} /> {pt}</li>
                  ))}
                  {p.allWeek && (
                    <li><Icon name="clock" size={18} strokeWidth={2.5} /> פעיל 24/7</li>
                  )}
                </ul>
                <PriceBox product={p} />
                <Link to={`/modules#${p.id === 'light' ? 'landing' : p.id}`} className="text-link">
                  מה בדיוק כלול? לגבולות המוצר <Icon name="arrow" size={16} />
                </Link>
              </div>
            </article>
          ))}

          <article id={CUSTOM.id} className="product-row">
            <TiltCard className="product-row-media">
              <img src={CUSTOM.image} alt={CUSTOM.imageAlt} loading="lazy" />
            </TiltCard>
            <div className="product-row-copy">
              <span className="card-icon"><Icon name={CUSTOM.icon} size={24} /></span>
              <h2>{CUSTOM.name}</h2>
              <p className="product-tagline">{CUSTOM.tagline}</p>
              <p>{CUSTOM.pitch}</p>
              <ul className="ticks">
                {CUSTOM.points.map((pt) => (
                  <li key={pt}><Icon name="check" size={18} strokeWidth={3} /> {pt}</li>
                ))}
              </ul>
              <p className="custom-price">
                <Icon name="phone" size={18} />
                <span>{CUSTOM.priceNote}</span>
              </p>
              <div className="custom-cta">
                <a href="#contact" className="btn btn-accent btn-lg">
                  לתיאום שיחת אפיון <Icon name="arrow" size={18} />
                </a>
                {CONTACT.phone && (
                  <a href={`tel:${CONTACT.phone.replace(/\D/g, '')}`} className="text-link" dir="ltr">
                    {CONTACT.phone}
                  </a>
                )}
              </div>
            </div>
          </article>

          <p className="bundle-note">
            המוצר השני בחבילה בחצי מחיר. חיבור למערכת קיימת, וואטסאפ רשמי ושאר התוספות מפורטים <Link to="/modules#addons">בעמוד המודולים</Link>.
          </p>
          <PriceNote />
        </div>
      </section>

      <Terms />
      <Contact title="איזה כלי מתאים לעסק שלך?" sub="ספרו לנו מה מעיק עליכם היום. נציע את הכלי הנכון, או את החבילה הנכונה." />
    </>
  );
}
