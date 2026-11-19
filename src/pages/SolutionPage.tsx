import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Contact } from '../components/Contact';
import { SectionHead, TechCard } from '../components/Blocks';
import { openChat } from '../components/ChatWidget';
import { Icon } from '../components/Icon';
import { SplitWords, TiltCard, useSpotlight } from '../components/Motion';
import { Tabs, type TabDef } from '../components/Tabs';
import { CONTACT } from '../data/site';
import { SOLUTIONS, getSolution, type Solution } from '../data/solutions';

const SECTION_NAME = 'הטכנולוגיות שלנו';

/** Sets the document title and meta description while the page is shown, and restores them on leave. */
function useDocumentMeta(title: string, description?: string) {
  useEffect(() => {
    const prevTitle = document.title;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDescription = meta?.getAttribute('content') ?? null;
    document.title = title;
    if (meta && description) meta.setAttribute('content', description);
    return () => {
      document.title = prevTitle;
      if (meta && prevDescription !== null) meta.setAttribute('content', prevDescription);
    };
  }, [title, description]);
}

export default function SolutionPage() {
  const { slug } = useParams();
  const solution = getSolution(slug);
  useDocumentMeta(
    solution?.metaTitle ?? `הטכנולוגיה לא נמצאה | ${SECTION_NAME} | Tech-shure טק-שור`,
    solution?.metaDescription,
  );
  return solution ? <SolutionView key={solution.slug} s={solution} /> : <SolutionNotFound />;
}

function Breadcrumbs({ current }: { current: string }) {
  return (
    <nav className="crumbs" aria-label="מיקום באתר">
      <ol>
        <li><Link to="/">דף הבית</Link></li>
        <li><Link to="/solutions">{SECTION_NAME}</Link></li>
        <li aria-current="page">{current}</li>
      </ol>
    </nav>
  );
}

function SolutionView({ s }: { s: Solution }) {
  const featuresRef = useSpotlight<HTMLUListElement>();
  const fitRef = useSpotlight<HTMLUListElement>();
  const relatedRef = useSpotlight<HTMLUListElement>();
  const related = s.related.map((r) => SOLUTIONS.find((x) => x.slug === r)).filter((x): x is Solution => Boolean(x));

  const tabs: TabDef[] = [
    {
      id: 'overview',
      label: 'סקירה כללית',
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
              <h3>היום, בלי המערכת</h3>
              <ul>
                {s.overview.before.map((b) => (
                  <li key={b}><Icon name="close" size={18} strokeWidth={2.5} /> {b}</li>
                ))}
              </ul>
            </div>
            <div className="compare-col compare-col--after">
              <h3>מחר, עם Tech-shure</h3>
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
      label: 'מה כלול',
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
              {s.price
                ? 'כל מערכת נבנית מלאה ומקצועית, בהיקף שמתאים לעסק ולתקציב. צריך יותר מההיקף הסטנדרטי? זה מוצר מורחב, שנבנה לפי אפיון.'
                : 'ההיקף נקבע יחד איתך בשיחת האפיון, לפי מה שהעסק צריך ולפי התקציב.'}{' '}
              <Link to={s.modulesLink}>לפרטים בעמוד המודולים</Link>
            </span>
          </p>
        </>
      ),
    },
    {
      id: 'process',
      label: 'איך זה עובד',
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
      label: 'למי זה מתאים',
      icon: 'users',
      content: (
        <>
          <p className="lead panel-lead">
            מתאים לכל עסק קטן ובינוני, ובכל גודל. הנה כמה דוגמאות לשימוש, לפי סוג העסק:
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
              העסק שלך לא ברשימה? זה בדיוק המקום לשיחה. כל מערכת נבנית לפי העסק, לא לפי תבנית.
            </span>
          </p>
        </>
      ),
    },
    {
      id: 'integrations',
      label: 'מודולים וחיבורים',
      icon: 'sync',
      content: (
        <>
          <p className="lead panel-lead">
            כל טכנולוגיה עובדת מצוין לבד, וחזקה עוד יותר כשהיא מחוברת לשאר המערכות של העסק. כך זה נראה:
          </p>
          <ul className="integration-grid">
            {s.integrations.map((it) => (
              <li key={it.title}>
                {it.to ? (
                  <Link to={it.to} className="integration">
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
            <Link to="/modules" className="text-link">לכל המודולים, החבילות והתנאים <Icon name="arrow" size={16} /></Link>
          </p>
        </>
      ),
    },
    {
      id: 'faq',
      label: 'שאלות נפוצות',
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
            <div className="hero-copy">
              <h1 aria-label={s.title}>
                <SplitWords text={s.title} />
              </h1>
              <p className="sol-tagline">{s.tagline}</p>
              <p className="hero-lead">{s.pitch}</p>
              <ul className="ticks sol-benefits">
                {s.benefits.map((b) => (
                  <li key={b}><Icon name="check" size={18} strokeWidth={3} /> {b}</li>
                ))}
              </ul>
              <div className="sol-hero-foot">
                <span className="launch-badge"><Icon name="bell" size={18} /> מחיר השקה לזמן מוגבל</span>
                <div className="hero-actions">
                  <a href="#contact" className="btn btn-accent btn-lg">
                    בואו נדבר <Icon name="arrow" size={20} />
                  </a>
                  <button type="button" className="btn btn-ghost btn-lg" onClick={openChat}>
                    <Icon name="bot" size={20} /> שאלו את חזקי
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

      <section className="section sol-details" id="details">
        <div className="container">
          <SectionHead kicker={s.shortTitle} title="כל מה שצריך לדעת, במקום אחד" center>
            בחר נושא, וקרא בדיוק את מה שמעניין אותך.
          </SectionHead>
          <Tabs tabs={tabs} label={`מידע על ${s.shortTitle}`} />
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="cta-band sol-cta">
            <div>
              <h2>רוצה לראות איך זה ייראה אצלך?</h2>
              <p>שיחת היכרות בלי עלות ובלי התחייבות. מספרים לנו על העסק, ואנחנו מראים מה אפשר לבנות.</p>
            </div>
            <div className="sol-cta-actions">
              <a href="#contact" className="btn btn-accent">השארת פרטים <Icon name="arrow" size={18} /></a>
              <button type="button" className="btn btn-light" onClick={openChat}>
                <Icon name="bot" size={18} /> צ׳אט עם חזקי
              </button>
              <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-light">
                <Icon name="chat" size={18} /> וואטסאפ
              </a>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--sand">
          <div className="container">
            <SectionHead kicker="עוד מ-Tech-shure" title="פתרונות נוספים שיכולים להתאים לך">
              הכוח האמיתי הוא בחיבור. כל טכנולוגיה מתחברת לשאר, למעטפת אחת שמכסה את העסק מכל הכיוונים.
            </SectionHead>
            <ul className="tech-grid spot-grid" ref={relatedRef}>
              {related.map((r) => (
                <TechCard key={r.slug} solution={r} />
              ))}
            </ul>
            <p className="center-link">
              <Link to="/solutions" className="text-link">לכל {SECTION_NAME} <Icon name="arrow" size={16} /></Link>
            </p>
          </div>
        </section>
      )}

      <Contact
        title={`בואו נדבר על ${s.shortTitle} לעסק שלך`}
        sub="ספרו לנו בקצרה על העסק ומה מעיק עליכם היום. נחזור אליכם עם הצעה שמתאימה בדיוק."
        defaultService={s.service}
      />
    </>
  );
}

function SolutionNotFound() {
  const gridRef = useSpotlight<HTMLUListElement>();
  return (
    <section className="section">
      <div className="container">
        <div className="container--narrow not-found sol-not-found">
          <span className="kicker">{SECTION_NAME}</span>
          <h1>הטכנולוגיה הזו לא נמצאה</h1>
          <p className="lead">ייתכן שהקישור השתנה. הנה כל הטכנולוגיות שלנו, בחר את מה שמתאים לך:</p>
        </div>
        <ul className="tech-grid spot-grid" ref={gridRef}>
          {SOLUTIONS.map((s) => (
            <TechCard key={s.slug} solution={s} />
          ))}
        </ul>
        <p className="center-link">
          <Link to="/solutions" className="btn btn-primary btn-lg">חזרה לכל הטכנולוגיות</Link>
        </p>
      </div>
    </section>
  );
}
