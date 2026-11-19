import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Contact } from '../components/Contact';
import { AiEdge, PriceBox, PriceNote, TechCard, Terms } from '../components/Blocks';
import { Icon } from '../components/Icon';
import { RotatingWords, SplitWords, TiltCard, useSpotlight } from '../components/Motion';
import { SOLUTIONS, solutionPath } from '../data/solutions';
import { CONTACT } from '../data/site';

const FOR_WHOM = ['העסק שלך', 'הלקוחות שלך', 'הצוות שלך', 'הצמיחה שלך', 'השקט שלך'];

export default function Solutions() {
  const gridRef = useSpotlight<HTMLUListElement>();
  return (
    <>
      <section className="page-hero page-hero--solutions">
        <div className="container container--narrow">
          <span className="kicker">טכנולוגיות לעסק שלך</span>
          <h1 className="choose-title" aria-label="בחר את הטכנולוגיה הבטוחה עבורך">
            <SplitWords text="בחר את הטכנולוגיה" />{' '}
            <SplitWords text="הבטוחה" start={3} className="hl" />
            <span className="choose-line">
              <span className="word" style={{ '--i': 4 } as CSSProperties}>עבור:</span>{' '}
              <span className="word" style={{ '--i': 5 } as CSSProperties}>
                <RotatingWords words={FOR_WHOM} />
              </span>
            </span>
          </h1>
          <p className="hero-lead">
            <b>טכנולוגיה. על בטוח.</b> זה לא רק הסלוגן שלנו, זו שיטת העבודה. כל מערכת נבנית אישית לעסק שלך, מלאה ומקצועית, בהיקף שמתאים לעסק ולתקציב, ומתוחזקת על ידינו. בוחרים טכנולוגיה אחת, או מחברים כמה למעטפת אחת.
          </p>
          <p className="callout">
            <Icon name="gear" size={20} />
            <span>
              הטכנולוגיות כאן הן דוגמאות, לא הגבול. אנחנו מפתחים <b>כל מערכת ולכל פלטפורמה</b>, בהתאמה אישית מלאה לעסק שלך.
            </span>
          </p>
          <div className="launch-banner">
            <strong>מחיר השקה לזמן מוגבל</strong>
          </div>
        </div>
      </section>

      <section className="section section--flush">
        <div className="container">
          <ul className="tech-grid spot-grid" ref={gridRef} aria-label="טכנולוגיות לעסק שלך">
            {SOLUTIONS.map((s) => (
              <TechCard key={s.slug} solution={s} />
            ))}
          </ul>

          {SOLUTIONS.map((s, i) => (
            <article key={s.slug} id={s.anchor} className={`product-row${i % 2 ? ' product-row--flip' : ''}`}>
              <TiltCard className="product-row-media">
                <img src={s.image} alt={s.imageAlt} loading={i ? 'lazy' : 'eager'} />
              </TiltCard>
              <div className="product-row-copy">
                <span className="card-icon"><Icon name={s.icon} size={24} /></span>
                {s.category && <span className="kicker kicker--gold product-row-cat">{s.category}</span>}
                <h2>{s.title}</h2>
                <p className="product-tagline">{s.tagline}</p>
                <p>{s.pitch}</p>
                <ul className="ticks">
                  {s.points.map((pt) => (
                    <li key={pt}><Icon name="check" size={18} strokeWidth={3} /> {pt}</li>
                  ))}
                  {s.allWeek && (
                    <li><Icon name="clock" size={18} strokeWidth={2.5} /> פעיל 24/7</li>
                  )}
                </ul>
                {s.price ? (
                  <PriceBox price={s.price} />
                ) : (
                  <p className="custom-price">
                    <Icon name="phone" size={18} />
                    <span>{s.priceNote}</span>
                  </p>
                )}
                <div className="custom-cta">
                  <Link to={solutionPath(s.slug)} className="btn btn-primary">
                    לפרטים המלאים <Icon name="arrow" size={18} />
                  </Link>
                  {s.price ? (
                    <Link to={s.modulesLink} className="text-link">
                      מה בדיוק כלול? לגבולות המוצר <Icon name="arrow" size={16} />
                    </Link>
                  ) : (
                    CONTACT.phone && (
                      <a href={`tel:${CONTACT.phoneTel}`} className="text-link" dir="ltr">
                        {CONTACT.phone}
                      </a>
                    )
                  )}
                </div>
              </div>
            </article>
          ))}

          <p className="bundle-note">
            מחירים מיוחדים בבחירת כמה חבילות
          </p>
          <PriceNote />
        </div>
      </section>

      <Terms />
      <AiEdge title="למה זה כל כך משתלם? כי אנחנו בונים עם AI." />
      <Contact title="איזו טכנולוגיה מתאימה לעסק שלך?" sub="ספרו לנו מה מעיק עליכם היום. נציע את הטכנולוגיה הנכונה, או את החבילה הנכונה." />
    </>
  );
}
