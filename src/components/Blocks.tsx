import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import emblem from '../assets/emblem.webp';
import { BRAND } from '../data/site';
import { getOffer } from '../data/offer';
import { money, type Price } from '../data/prices';
import { solutionPath, type DayOffer, type Solution } from '../data/solutions';
import { useLang } from '../i18n';
import { Icon, type IconName } from './Icon';
import { CountUp } from './Motion';

export function Brand({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const { lang } = useLang();
  return (
    <span className={`brand brand--${size}`}>
      <img src={emblem} alt="" className="brand-emblem" width={360} height={360} />
      <span className="brand-text">
        <span className="brand-name" dir="ltr">
          Tech-<span>shure</span>
        </span>
        <span className="brand-slogan">{lang === 'he' ? BRAND.slogan : BRAND.sloganEn}</span>
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

/** Price box (monthly payment only, change request 31) on the /solutions list. The same shekel amounts in both languages, formatted per language. */
export function PriceBox({ price }: { price: Price }) {
  const { lang, t } = useLang();
  const b = t.blocks;
  const format = (n: number) => money(n, lang);
  return (
    <div className="price-box">
      <span className="price-flag">{b.priceFlag}</span>
      <div className="price-rows">
        <div className="price-row">
          <span className="price-now"><CountUp value={price.monthly} format={format} /></span>
          <span className="price-label">{b.priceMonthly}</span>
        </div>
      </div>
      <PriceScaleNote />
    </div>
  );
}

/** "The price depends on the product type; a large, complex system changes the price." Shown wherever a price is. */
export function PriceScaleNote({ className = 'price-scale' }: { className?: string }) {
  const { t } = useLang();
  return <p className={className}>{t.blocks.priceScale}</p>;
}

export function PriceNote() {
  const { lang } = useLang();
  return (
    <p className="price-note">
      <Icon name="file" size={18} />
      <span>{getOffer(lang).priceNote}</span>
    </p>
  );
}

export function Terms() {
  const { lang, t: dict } = useLang();
  return (
    <section id="terms" className="section section--sand">
      <div className="container">
        <SectionHead kicker={dict.blocks.termsKicker} title={dict.blocks.termsTitle}>
          {dict.blocks.termsLead}
        </SectionHead>
        <ul className="terms-grid">
          {getOffer(lang).terms.map((t) => (
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
export function OfferBlock({ offer }: { offer: DayOffer }) {
  const { t } = useLang();
  return (
    <div className="offer">
      <div className="offer-head">
        <div className="offer-copy">
          <h3>{offer.title}</h3>
          <p>{offer.summary}</p>
        </div>
        <div className="offer-price">
          <strong dir="ltr">{offer.price}</strong>
          <span>{offer.priceLabel}</span>
        </div>
      </div>
      <div className="compare offer-compare">
        <div className="compare-col compare-col--after">
          <h4>{t.blocks.offerIncluded}</h4>
          <ul>
            {offer.included.map((t) => (
              <li key={t}><Icon name="check" size={18} strokeWidth={3} /> {t}</li>
            ))}
          </ul>
        </div>
        <div className="compare-col compare-col--before">
          <h4>{t.blocks.offerExcluded}</h4>
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
  const { t, lp } = useLang();
  return (
    <li className="card tech-card">
      <Link to={lp(solutionPath(solution.slug))} className="tech-card-link">
        <span className="card-icon"><Icon name={solution.icon} size={24} /></span>
        {solution.category && <span className="tech-card-cat">{solution.category}</span>}
        <h3>{solution.shortTitle}</h3>
        <p>{solution.cardText}</p>
        <span className="tech-card-more">
          {t.blocks.cardMore} <Icon name="arrow" size={16} />
        </span>
      </Link>
    </li>
  );
}

/** Icons and accents of the four AI edge cards; the text is in t.blocks.edge, in the same order. */
const AI_EDGE: { icon: IconName; gold?: boolean }[] = [{ icon: 'sparkle' }, { icon: 'users' }, { icon: 'coins', gold: true }, { icon: 'shield', gold: true }];

/** "Why we are fast and efficient": the AI edge, on the home page and on /solutions. Extra content goes in children. */
export function AiEdge({ title, sand, children }: { title: string; sand?: boolean; children?: ReactNode }) {
  const { t } = useLang();
  return (
    <section id="ai-edge" className={`section${sand ? ' section--sand' : ''}`}>
      <div className="container">
        <SectionHead kicker={t.blocks.edgeKicker} title={title}>
          {t.blocks.edgeLead}
        </SectionHead>
        <ul className="edge-grid">
          {t.blocks.edge.map((e, i) => (
            <li key={e.title} className="card">
              <span className={`card-icon${AI_EDGE[i].gold ? ' card-icon--gold' : ''}`}><Icon name={AI_EDGE[i].icon} size={24} /></span>
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
