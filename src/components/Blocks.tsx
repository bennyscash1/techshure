import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import emblem from '../assets/emblem.webp';
import { BRAND } from '../data/site';
import { PRICE_NOTE, TERMS, nis } from '../data/offer';
import { solutionPath, type DayOffer, type Price, type Solution } from '../data/solutions';
import { Icon, type IconName } from './Icon';
import { CountUp } from './Motion';

export function Brand({ size = 'md' }: { size?: 'md' | 'lg' }) {
  return (
    <span className={`brand brand--${size}`}>
      <img src={emblem} alt="" className="brand-emblem" width={360} height={360} />
      <span className="brand-text">
        <span className="brand-name" dir="ltr">
          Tech-<span>shure</span>
        </span>
        <span className="brand-slogan">{BRAND.slogan}</span>
      </span>
    </span>
  );
}

export function SectionHead({ kicker, title, children, center }: { kicker?: string; title: ReactNode; children?: ReactNode; center?: boolean }) {
  return (
    <header className={`section-head${center ? ' section-head--center' : ''}`}>
      {kicker && <span className="kicker">{kicker}</span>}
      <h2>{title}</h2>
      {children && <p className="lead">{children}</p>}
    </header>
  );
}

export function PriceBox({ price }: { price: Price }) {
  return (
    <div className="price-box">
      <span className="price-flag">מחיר השקה לזמן מוגבל</span>
      <div className="price-rows">
        <div className="price-row">
          <span className="price-label">הקמה, תשלום אחד</span>
          <span className="price-now"><CountUp value={price.setup} format={nis} /></span>
        </div>
        <div className="price-row">
          <span className="price-label">בכל חודש</span>
          <span className="price-now"><CountUp value={price.monthly} format={nis} /></span>
        </div>
      </div>
    </div>
  );
}

export function PriceNote() {
  return (
    <p className="price-note">
      <Icon name="file" size={18} />
      <span>{PRICE_NOTE}</span>
    </p>
  );
}

export function Terms() {
  return (
    <section id="terms" className="section section--sand">
      <div className="container">
        <SectionHead kicker="האותיות הקטנות, בגדול" title="התנאים, בלי הפתעות">
          כל מה שכדאי לדעת לפני שמתחילים. קצר וברור.
        </SectionHead>
        <ul className="terms-grid">
          {TERMS.map((t) => (
            <li key={t.title} className="term">
              <span className="term-icon"><Icon name={t.icon} size={20} /></span>
              <div>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <PriceNote />
      </div>
    </section>
  );
}

/** A fixed offer with its price and a clear "what is included / what is not" block. No small print. */
export function OfferBlock({ offer, compact }: { offer: DayOffer; compact?: boolean }) {
  return (
    <div className={`offer${compact ? ' offer--compact' : ''}`}>
      <div className="offer-head">
        {!compact && (
          <div className="offer-copy">
            <h3>{offer.title}</h3>
            <p>{offer.summary}</p>
          </div>
        )}
        <div className="offer-price">
          <strong dir="ltr">{offer.price}</strong>
          <span>{offer.priceLabel}</span>
        </div>
      </div>
      <div className="compare offer-compare">
        <div className="compare-col compare-col--after">
          <h4>מה כלול</h4>
          <ul>
            {offer.included.map((t) => (
              <li key={t}><Icon name="check" size={18} strokeWidth={3} /> {t}</li>
            ))}
          </ul>
        </div>
        <div className="compare-col compare-col--before">
          <h4>מה לא כלול</h4>
          <ul>
            {offer.excluded.map((t) => (
              <li key={t}><Icon name="close" size={18} strokeWidth={2.5} /> {t}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="offer-note">
        <Icon name="code" size={18} />
        <span>{offer.note}</span>
      </p>
    </div>
  );
}

/** A card that links to a solution sub-page. Render inside a <ul>. */
export function TechCard({ solution }: { solution: Solution }) {
  return (
    <li className="card tech-card">
      <Link to={solutionPath(solution.slug)} className="tech-card-link">
        <span className="card-icon"><Icon name={solution.icon} size={24} /></span>
        {solution.category && <span className="tech-card-cat">{solution.category}</span>}
        <h3>{solution.shortTitle}</h3>
        <p>{solution.cardText}</p>
        <span className="tech-card-more">
          לפרטים המלאים <Icon name="arrow" size={16} />
        </span>
      </Link>
    </li>
  );
}

const AI_EDGE: { icon: IconName; title: string; text: string; gold?: boolean }[] = [
  { icon: 'sparkle', title: 'AI בכל שלב בפיתוח', text: 'כותבים קוד מהר מאוד עם כלי ה-AI המתקדמים ביותר, ואתם מקבלים מערכת מוכנה הרבה יותר מוקדם.' },
  { icon: 'users', title: 'צוות מנוסה, למעלה מעשור', text: 'צוות קטן של מפתחי תוכנה ותיקים, שיודעים בדיוק מה לבנות ואיך. כל מערכת נבנית נכון מהיום הראשון.' },
  { icon: 'coins', title: 'מחיר נמוך משמעותית', text: 'החיסכון בזמן הפיתוח עובר אליכם. מערכות מלאות ומורכבות, בהתאמה לתקציב שלכם.', gold: true },
  { icon: 'shield', title: 'בלי אותיות קטנות', text: 'המחיר נמוך כי אנחנו עובדים חכם, לא כי חסר משהו. מה שסיכמנו, זה מה שמקבלים.', gold: true },
];

/** "Why we are fast and efficient": the AI edge, on the home page and on /solutions. Extra content goes in children. */
export function AiEdge({ title, sand, children }: { title: string; sand?: boolean; children?: ReactNode }) {
  return (
    <section id="ai-edge" className={`section${sand ? ' section--sand' : ''}`}>
      <div className="container">
        <SectionHead kicker="למה אנחנו מהירים ויעילים" title={title}>
          אנחנו בונים עם כלי ה-AI המתקדמים ביותר, ולכן הפיתוח מהיר מאוד והמחיר שלנו נמוך משמעותית. צוות קטן של מפתחי תוכנה מנוסים, למעלה מעשור. אין פה אותיות קטנות: פשוט יודעים לעשות הכל מהר ויעיל, ואתם מקבלים מערכות מלאות ומורכבות, בהתאמה לתקציב שלכם.
        </SectionHead>
        <ul className="edge-grid">
          {AI_EDGE.map((e) => (
            <li key={e.title} className="card">
              <span className={`card-icon${e.gold ? ' card-icon--gold' : ''}`}><Icon name={e.icon} size={24} /></span>
              <h3>{e.title}</h3>
              <p>{e.text}</p>
            </li>
          ))}
        </ul>
        {children}
      </div>
    </section>
  );
}
