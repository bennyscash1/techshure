import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import emblem from '../assets/emblem.webp';
import { BRAND } from '../data/site';
import { PRICE_NOTE, TERMS, nis } from '../data/offer';
import { solutionPath, type Price, type Solution } from '../data/solutions';
import { Icon } from './Icon';
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

/** A card that links to a solution sub-page. Render inside a <ul>. */
export function TechCard({ solution }: { solution: Solution }) {
  return (
    <li className="card tech-card">
      <Link to={solutionPath(solution.slug)} className="tech-card-link">
        <span className="card-icon"><Icon name={solution.icon} size={24} /></span>
        <h3>{solution.shortTitle}</h3>
        <p>{solution.cardText}</p>
        <span className="tech-card-more">
          לפרטים המלאים <Icon name="arrow" size={16} />
        </span>
      </Link>
    </li>
  );
}
