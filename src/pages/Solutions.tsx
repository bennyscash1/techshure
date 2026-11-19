import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Contact } from '../components/Contact';
import { AiEdge, PriceBox, PriceNote, TechCard, Terms } from '../components/Blocks';
import { BidiText } from '../components/BidiText';
import { Icon } from '../components/Icon';
import { RotatingWords, SplitWords, TiltCard, useSpotlight } from '../components/Motion';
import { getSolutions, solutionPath } from '../data/solutions';
import { CONTACT } from '../data/site';
import { useLang } from '../i18n';
import { useSeo } from '../i18n/seo';

export default function Solutions() {
  const { lang, t, lp } = useLang();
  const c = t.solutions;
  const solutions = getSolutions(lang);
  useSeo(t.meta.solutionsTitle, t.meta.solutionsDescription);
  const gridRef = useSpotlight<HTMLUListElement>();
  return (
    <>
      <section className="page-hero page-hero--solutions">
        <div className="container container--narrow">
          <span className="kicker">{c.kicker}</span>
          <h1 className="choose-title" aria-label={c.chooseLabel}>
            <SplitWords text={c.chooseA} />{' '}
            <SplitWords text={c.chooseB} start={c.chooseBStart} className="hl" />
            <span className="choose-line">
              <span className="word" style={{ '--i': 4 } as CSSProperties}>{c.chooseFor}</span>{' '}
              <span className="word" style={{ '--i': 5 } as CSSProperties}>
                <RotatingWords words={c.forWhom} />
              </span>
            </span>
          </h1>
          <p className="hero-lead">
            <b>{c.leadStrong}</b>{c.lead}
          </p>
          <p className="callout">
            <Icon name="gear" size={20} />
            <span>
              {c.calloutA}<b>{c.calloutB}</b>{c.calloutC}
            </span>
          </p>
          <div className="launch-banner">
            <strong>{c.launch}</strong>
          </div>
        </div>
      </section>

      <section className="section section--flush">
        <div className="container">
          <ul className="tech-grid spot-grid" ref={gridRef} aria-label={c.gridLabel}>
            {solutions.map((s) => (
              <TechCard key={s.slug} solution={s} />
            ))}
          </ul>

          {solutions.map((s, i) => (
            <article key={s.slug} id={s.anchor} className={`product-row${i % 2 ? ' product-row--flip' : ''}`}>
              <TiltCard className="product-row-media">
                <img src={s.image} alt={s.imageAlt} loading={i ? 'lazy' : 'eager'} />
              </TiltCard>
              <div className="product-row-copy">
                <span className="card-icon"><Icon name={s.icon} size={24} /></span>
                {s.category && <span className="kicker kicker--gold product-row-cat">{s.category}</span>}
                <h2>{s.title}</h2>
                <p className="product-tagline">{s.tagline}</p>
                <p><BidiText text={s.pitch} /></p>
                <ul className="ticks">
                  {s.points.map((pt) => (
                    <li key={pt}><Icon name="check" size={18} strokeWidth={3} /> {pt}</li>
                  ))}
                  {s.allWeek && (
                    <li><Icon name="clock" size={18} strokeWidth={2.5} /> {c.allWeek}</li>
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
                  <Link to={lp(solutionPath(s.slug))} className="btn btn-primary">
                    {c.details} <Icon name="arrow" size={18} />
                  </Link>
                  {s.price ? (
                    <Link to={lp(s.modulesLink)} className="text-link">
                      {c.limits} <Icon name="arrow" size={16} />
                    </Link>
                  ) : (
                    CONTACT.phone && (
                      <a href={`tel:${CONTACT.phoneTel}`} className="text-link" dir="ltr">
                        {t.contactInfo.phone}
                      </a>
                    )
                  )}
                </div>
              </div>
            </article>
          ))}

          <p className="bundle-note">{c.bundle}</p>
          <PriceNote />
        </div>
      </section>

      <Terms />
      <AiEdge title={c.edgeTitle} />
      <Contact title={c.contactTitle} sub={c.contactSub} />
    </>
  );
}
