import type { ReactNode } from 'react';
import emblem from '../assets/emblem.webp';
import { BRAND } from '../data/site';
import { PRICE_NOTE, TERMS, nis, type Product } from '../data/offer';
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

export function PriceBox({ product }: { product: Product }) {
  return (
    <div className="price-box">
      <span className="price-flag">מחיר השקה לזמן מוגבל</span>
      <div className="price-rows">
        <div className="price-row">
          <span className="price-label">הקמה, תשלום אחד</span>
          <span className="price-now"><CountUp value={product.setup} format={nis} /></span>
        </div>
        <div className="price-row">
          <span className="price-label">בכל חודש</span>
          <span className="price-now"><CountUp value={product.monthly} format={nis} /></span>
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
