import { Link } from 'react-router-dom';
import { Contact } from '../components/Contact';
import { PriceNote, SectionHead, Terms } from '../components/Blocks';
import { Icon } from '../components/Icon';
import { getOffer } from '../data/offer';
import { SplitWords, useSpotlight } from '../components/Motion';
import { useLang } from '../i18n';
import { useSeo } from '../i18n/seo';

export default function Modules() {
  const { lang, t, lp } = useLang();
  const c = t.modules;
  const { modules, addons } = getOffer(lang);
  useSeo(t.meta.modulesTitle, t.meta.modulesDescription);
  const modulesRef = useSpotlight<HTMLUListElement>();
  const addonsRef = useSpotlight<HTMLUListElement>();
  return (
    <>
      <section className="page-hero page-hero--modules">
        <div className="mesh" aria-hidden="true"><span /><span /><span /></div>
        <div className="container container--narrow">
          <span className="kicker">{c.kicker}</span>
          <h1 aria-label={c.titleLabel}>
            <SplitWords text={c.titleA} />{' '}
            <SplitWords text={c.titleB} start={c.titleBStart} className="hl" />
          </h1>
          <p className="hero-lead">{c.lead}</p>
          <p className="callout">
            <Icon name="list" size={20} />
            <span>
              {c.extendedA}<b>{c.extendedB}</b>{c.extendedC}
            </span>
          </p>
          <p className="callout">
            <Icon name="gear" size={20} />
            <span>
              {c.customA}<b>{c.customB}</b>{c.customC}{' '}
              <Link to={lp('/solutions/custom-system')}>{c.customLink}</Link>
            </span>
          </p>
        </div>
      </section>

      <section className="section section--flush">
        <div className="container">
          <ul className="module-grid spot-grid" ref={modulesRef}>
            {modules.map((m) => (
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
            <Link to={lp('/solutions')} className="text-link">{c.toPrices} <Icon name="arrow" size={16} /></Link>
          </p>
        </div>
      </section>

      <section id="addons" className="section">
        <div className="container">
          <SectionHead kicker={c.addonsKicker} title={c.addonsTitle}>
            {c.addonsLead}
          </SectionHead>
          <ul className="addon-grid spot-grid" ref={addonsRef}>
            {addons.map((a) => (
              <li key={a.title} className="card addon">
                <span className="card-icon"><Icon name={a.icon} size={24} /></span>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
                {a.example && (
                  <p className="addon-example">
                    <span>{c.example}</span>
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
      <Contact title={c.contactTitle} sub={c.contactSub} />
    </>
  );
}
