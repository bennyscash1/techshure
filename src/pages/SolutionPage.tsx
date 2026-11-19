import { Link, useParams } from 'react-router-dom';
import { Contact } from '../components/Contact';
import { OfferBlock, SectionHead, TechCard } from '../components/Blocks';
import { BidiText } from '../components/BidiText';
import { openChat } from '../components/ChatWidget';
import { Icon } from '../components/Icon';
import { SplitWords, TiltCard, useSpotlight } from '../components/Motion';
import { Tabs, type TabDef } from '../components/Tabs';
import { CONTACT } from '../data/site';
import { getSolution, getSolutions, type Solution } from '../data/solutions';
import { useLang } from '../i18n';
import { useSeo } from '../i18n/seo';

export default function SolutionPage() {
  const { slug } = useParams();
  const { lang, t } = useLang();
  const solution = getSolution(lang, slug);
  useSeo(
    solution?.metaTitle ?? t.meta.solutionNotFoundTitle,
    solution?.metaDescription ?? t.meta.notFoundDescription,
    Boolean(solution),
  );
  return solution ? <SolutionView key={solution.slug} s={solution} /> : <SolutionNotFound />;
}

function Breadcrumbs({ current }: { current: string }) {
  const { t, lp } = useLang();
  return (
    <nav className="crumbs" aria-label={t.a11y.breadcrumbs}>
      <ol>
        <li><Link to={lp('/')}>{t.nav.home}</Link></li>
        <li><Link to={lp('/solutions')}>{t.solutionPage.sectionName}</Link></li>
        <li aria-current="page">{current}</li>
      </ol>
    </nav>
  );
}

function SolutionView({ s }: { s: Solution }) {
  const { lang, t, lp } = useLang();
  const c = t.solutionPage;
  const featuresRef = useSpotlight<HTMLUListElement>();
  const fitRef = useSpotlight<HTMLUListElement>();
  const relatedRef = useSpotlight<HTMLUListElement>();
  const related = s.related.map((r) => getSolutions(lang).find((x) => x.slug === r)).filter((x): x is Solution => Boolean(x));

  const tabs: TabDef[] = [
    {
      id: 'overview',
      label: c.tabOverview,
      icon: 'file',
      content: (
        <div className="sol-overview">
          <div className="sol-overview-text">
            {s.overview.intro.map((p) => (
              <p key={p} className="lead">{p}</p>
            ))}
          </div>
          <div className="compare">
            <div className="compare-col compare-col--before">
              <h3>{c.before}</h3>
              <ul>
                {s.overview.before.map((b) => (
                  <li key={b}><Icon name="close" size={18} strokeWidth={2.5} /> {b}</li>
                ))}
              </ul>
            </div>
            <div className="compare-col compare-col--after">
              <h3>{c.after}</h3>
              <ul>
                {s.overview.after.map((a) => (
                  <li key={a}><Icon name="check" size={18} strokeWidth={3} /> {a}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'features',
      label: c.tabFeatures,
      icon: 'check',
      content: (
        <>
          <ul className="feature-grid spot-grid" ref={featuresRef}>
            {s.features.map((f) => (
              <li key={f.title} className="card">
                <span className="card-icon"><Icon name={f.icon} size={24} /></span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </li>
            ))}
          </ul>
          <p className="price-note">
            <Icon name="file" size={18} />
            <span>
              {s.scopeNote ?? (s.price
                ? c.scopeModules
                : c.scopeCall)}
              {!s.scopeNote && (
                <>
                  {' '}
                  <Link to={lp(s.modulesLink)}>{c.scopeLink}</Link>
                </>
              )}
            </span>
          </p>
        </>
      ),
    },
    {
      id: 'process',
      label: c.tabProcess,
      icon: 'route',
      content: (
        <ol className="steps">
          {s.steps.map((st, i) => (
            <li key={st.title} className="step">
              <span className="step-num" aria-hidden="true">{i + 1}</span>
              <div>
                <h3>{st.title}</h3>
                <p>{st.text}</p>
              </div>
            </li>
          ))}
        </ol>
      ),
    },
    {
      id: 'fit',
      label: c.tabFit,
      icon: 'users',
      content: (
        <>
          <p className="lead panel-lead">
            {c.fitLead}
          </p>
          <ul className="usecase-grid spot-grid" ref={fitRef}>
            {s.useCases.map((u) => (
              <li key={u.who} className="card usecase">
                <span className="card-icon card-icon--gold"><Icon name={u.icon} size={24} /></span>
                <h3>{u.who}</h3>
                <p>{u.text}</p>
              </li>
            ))}
          </ul>
          <p className="callout">
            <Icon name="chat" size={20} />
            <span>
              {c.fitCallout}
            </span>
          </p>
        </>
      ),
    },
    {
      id: 'integrations',
      label: c.tabIntegrations,
      icon: 'sync',
      content: (
        <>
          <p className="lead panel-lead">
            {c.integrationsLead}
          </p>
          <ul className="integration-grid">
            {s.integrations.map((it) => (
              <li key={it.title}>
                {it.to ? (
                  <Link to={lp(it.to)} className="integration">
                    <span className="card-icon"><Icon name={it.icon} size={22} /></span>
                    <span className="integration-copy">
                      <strong>{it.title}</strong>
                      <span>{it.text}</span>
                    </span>
                    <Icon name="arrow" size={18} className="integration-arrow" />
                  </Link>
                ) : (
                  <div className="integration">
                    <span className="card-icon"><Icon name={it.icon} size={22} /></span>
                    <span className="integration-copy">
                      <strong>{it.title}</strong>
                      <span>{it.text}</span>
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <p className="center-link">
            <Link to={lp('/modules')} className="text-link">{c.allModules} <Icon name="arrow" size={16} /></Link>
          </p>
        </>
      ),
    },
    {
      id: 'faq',
      label: c.tabFaq,
      icon: 'list',
      content: (
        <div className="faq">
          {s.faq.map((f, i) => (
            <details key={f.q} className="faq-item" open={i === 0}>
              <summary>
                <span>{f.q}</span>
                <Icon name="plus" size={20} strokeWidth={2.5} className="faq-icon" />
              </summary>
              <div className="faq-a">
                <p>{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      ),
    },
  ];

  return (
    <>
      <section className="sol-hero">
        <div className="hero-mesh" aria-hidden="true"><span /><span /><span /></div>
        <div className="container">
          <Breadcrumbs current={s.shortTitle} />
          <div className="sol-hero-grid">
            <div className={`hero-copy${s.category ? ' has-kicker' : ''}`}>
              {s.category && <span className="kicker kicker--gold">{s.category}</span>}
              <h1 aria-label={s.title}>
                <SplitWords text={s.title} />
              </h1>
              <p className="sol-tagline">{s.tagline}</p>
              <p className="hero-lead"><BidiText text={s.pitch} /></p>
              <ul className="ticks sol-benefits">
                {s.benefits.map((b) => (
                  <li key={b}><Icon name="check" size={18} strokeWidth={3} /> {b}</li>
                ))}
              </ul>
              <div className="sol-hero-foot">
                {s.offer ? (
                  <a href="#offer" className="launch-badge">
                    <Icon name="coins" size={18} /> {c.offerBadge} <span dir="ltr">{s.offer.price}</span>
                  </a>
                ) : (
                  <span className="launch-badge"><Icon name="bell" size={18} /> {c.launchBadge}</span>
                )}
                {s.addonNote && (
                  <p className="sol-addon-note">
                    {s.addonNote} <Link to={lp('/modules#addons')}>{c.addonsLink}</Link>
                  </p>
                )}
                <div className="hero-actions">
                  <a href="#contact" className="btn btn-accent btn-lg">
                    {c.talk} <Icon name="arrow" size={20} />
                  </a>
                  <button type="button" className="btn btn-ghost btn-lg" onClick={openChat}>
                    <Icon name="bot" size={20} /> {c.askHezki}
                  </button>
                </div>
              </div>
            </div>
            <TiltCard className="sol-hero-art">
              <img src={s.image} alt={s.imageAlt} width={640} height={640} />
            </TiltCard>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <ul className="sol-strip">
            {s.highlights.map((h) => (
              <li key={h.value} className="sol-stat">
                <span className="card-icon"><Icon name={h.icon} size={22} /></span>
                <span className="sol-stat-copy">
                  <strong>{h.value}</strong>
                  <span>{h.label}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {s.offer && (
        <section className="section section--tight" id="offer">
          <div className="container">
            <SectionHead kicker={c.offerKicker} title={c.offerTitle} center>
              {c.offerLead}
            </SectionHead>
            <OfferBlock offer={s.offer} />
          </div>
        </section>
      )}

      <section className="section sol-details" id="details">
        <div className="container">
          <SectionHead kicker={s.shortTitle} title={c.detailsTitle} center>
            {c.detailsLead}
          </SectionHead>
          <Tabs tabs={tabs} label={c.tabsLabel(s.shortTitle)} />
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="cta-band sol-cta">
            <div>
              <h2>{c.ctaTitle}</h2>
              <p>{c.ctaText}</p>
            </div>
            <div className="sol-cta-actions">
              <a href="#contact" className="btn btn-accent">{c.ctaLeave} <Icon name="arrow" size={18} /></a>
              <button type="button" className="btn btn-light" onClick={openChat}>
                <Icon name="bot" size={18} /> {c.ctaChat}
              </button>
              <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-light">
                <Icon name="chat" size={18} /> {c.ctaWhatsapp}
              </a>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--sand">
          <div className="container">
            <SectionHead kicker={c.relatedKicker} title={c.relatedTitle}>
              {c.relatedLead}
            </SectionHead>
            <ul className="tech-grid spot-grid" ref={relatedRef}>
              {related.map((r) => (
                <TechCard key={r.slug} solution={r} />
              ))}
            </ul>
            <p className="center-link">
              <Link to={lp('/solutions')} className="text-link">{c.allSolutions} <Icon name="arrow" size={16} /></Link>
            </p>
          </div>
        </section>
      )}

      <Contact
        title={c.contactTitle(s.shortTitle)}
        sub={c.contactSub}
        defaultService={s.service}
      />
    </>
  );
}

function SolutionNotFound() {
  const { lang, t, lp } = useLang();
  const c = t.solutionPage;
  const gridRef = useSpotlight<HTMLUListElement>();
  return (
    <section className="section">
      <div className="container">
        <div className="container--narrow not-found sol-not-found">
          <span className="kicker">{c.sectionName}</span>
          <h1>{c.notFoundTitle}</h1>
          <p className="lead">{c.notFoundLead}</p>
        </div>
        <ul className="tech-grid spot-grid" ref={gridRef}>
          {getSolutions(lang).map((s) => (
            <TechCard key={s.slug} solution={s} />
          ))}
        </ul>
        <p className="center-link">
          <Link to={lp('/solutions')} className="btn btn-primary btn-lg">{c.notFoundBack}</Link>
        </p>
      </div>
    </section>
  );
}
