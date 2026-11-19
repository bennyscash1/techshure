import { Link } from 'react-router-dom';
import emblem from '../assets/emblem.webp';
import hezki from '../assets/hezki.webp';
import { Contact } from '../components/Contact';
import { AiEdge, SectionHead } from '../components/Blocks';
import { BidiText } from '../components/BidiText';
import { Icon, type IconName } from '../components/Icon';
import { CountUp, SplitWords, useParallax } from '../components/Motion';
import { useLang } from '../i18n';
import { useSeo } from '../i18n/seo';

// Icons for the cards; the text is in t.home, in the same order.
const PAIN_ICONS: IconName[] = ['chat', 'layout', 'phone'];
const PROMISE_ICONS: IconName[] = ['users', 'calendar', 'shield'];

export default function Home() {
  const { t, lp } = useLang();
  const h = t.home;
  useSeo(t.meta.homeTitle, t.meta.homeDescription);
  const art = useParallax<HTMLDivElement>();
  return (
    <>
      {/* 1. Hero */}
      <section className="hero">
        <div className="hero-mesh" aria-hidden="true"><span /><span /><span /></div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1 className="split-title" aria-label={`${h.heroTitleA} ${h.heroTitleB}`}>
              <SplitWords text={h.heroTitleA} />{' '}
              <SplitWords text={h.heroTitleB} start={h.heroTitleBStart} className="hl" />
            </h1>
            <p className="hero-lead">
              <BidiText text={h.heroLead} />
            </p>
            <div className="hero-actions">
              <Link to={{ hash: '#contact' }} className="btn btn-accent btn-lg">
                {h.talk}
                <Icon name="arrow" size={20} />
              </Link>
              <Link to={lp('/solutions')} className="btn btn-ghost btn-lg">{h.toSolutions}</Link>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true" ref={art}>
            <span className="hero-aura" />
            <span className="orbit orbit--1"><i className="orbit-dot" /></span>
            <span className="orbit orbit--2"><i className="orbit-dot orbit-dot--gold" /></span>
            <span className="orbit orbit--3" />
            <img src={emblem} alt="" width={360} height={360} />
            <span className="chip chip--a"><Icon name="phone" size={18} /> {h.chips.phone}</span>
            <span className="chip chip--b"><Icon name="chat" size={18} /> {h.chips.whatsapp}</span>
            <span className="chip chip--c"><Icon name="db" size={18} /> {h.chips.crm}</span>
            <span className="chip chip--d"><Icon name="layout" size={18} /> {h.chips.landing}</span>
          </div>
        </div>
      </section>

      {/* 2. The pain */}
      <section className="section">
        <div className="container">
          <SectionHead kicker={h.painKicker} title={h.painTitle}>
            {h.painLead}
          </SectionHead>
          <ul className="pain-grid">
            {h.pains.map((p, i) => (
              <li key={p.who} className="pain">
                <span className="pain-icon"><Icon name={PAIN_ICONS[i]} size={24} /></span>
                <h3>{p.who}</h3>
                <p>{p.text}</p>
                <span className="pain-bill">{h.painBill}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. The solution */}
      <section className="section section--sand">
        <div className="container">
          <SectionHead kicker={h.solutionKicker} title={h.solutionTitle}>
            {h.solutionLead}
          </SectionHead>
          <ul className="promise-grid">
            {h.promise.map((p, i) => (
              <li key={p.title} className="card">
                <span className="card-icon"><Icon name={PROMISE_ICONS[i]} size={24} /></span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>
          <p className="big-quote">
            {h.quoteBefore}
            {h.quoteNumber !== null && <CountUp value={h.quoteNumber} />}
            {h.quoteAfter}
          </p>
        </div>
      </section>

      {/* 4 + 5. Why fast and efficient (AI edge), built for you */}
      <AiEdge title={h.edgeTitle}>
        <article className="feature feature--wide edge-feature">
          <div className="feature-wide-copy">
            <span className="card-icon"><Icon name="lock" size={24} /></span>
            <h2>{h.builtTitle}</h2>
            <p>{h.builtText}</p>
          </div>
          <ul className="ticks">
            {h.builtTicks.map((tick) => (
              <li key={tick}><Icon name="check" size={18} strokeWidth={3} /> {tick}</li>
            ))}
          </ul>
        </article>
      </AiEdge>

      {/* 6. Custom build */}
      <section className="section section--sand">
        <div className="container container--narrow custom">
          <span className="kicker">{h.customKicker}</span>
          <h2>{h.customTitle}</h2>
          <p className="lead">{h.customLead}</p>
          <div className="custom-links">
            <Link to={lp('/solutions')} className="btn btn-primary">{h.customToSolutions} <Icon name="arrow" size={18} /></Link>
            <Link to={lp('/modules')} className="btn btn-ghost">{h.customToModules}</Link>
          </div>
        </div>
      </section>

      {/* 7. Refer a friend */}
      <section className="section">
        <div className="container">
          <div className="refer">
            <img src={hezki} alt={h.referAlt} className="refer-bot" loading="lazy" />
            <div className="refer-copy">
              <span className="kicker">{h.referKicker}</span>
              <h2>{h.referTitle}</h2>
              <p>{h.referLead}</p>
              <ul className="refer-gifts">
                <li><Icon name="layout" size={20} /> {h.referLanding} <small>{h.referLandingNote}</small></li>
                <li><Icon name="users" size={20} /> {h.referHour}</li>
                <li><Icon name="coins" size={20} /> {h.referCredit}</li>
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
