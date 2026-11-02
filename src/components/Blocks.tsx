import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon, type IconName } from './Icon';

/** Fades children in when they enter the viewport. */
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal${shown ? ' is-shown' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

type SectionProps = {
  id?: string;
  tone?: 'plain' | 'white' | 'dark' | 'deep' | 'tint';
  narrow?: boolean;
  children: ReactNode;
};

export function Section({ id, tone = 'plain', narrow, children }: SectionProps) {
  return (
    <section id={id} className={`section section--${tone}`}>
      <div className={`container${narrow ? ' container--narrow' : ''}`}>{children}</div>
    </section>
  );
}

export function SectionHead({ kicker, title, sub, lead }: { kicker: string; title: string; sub?: string; lead?: string }) {
  return (
    <Reveal className="section-head">
      <span className="kicker mono" dir="ltr">{kicker}</span>
      <h2>{title}</h2>
      {sub && <p className="sub-en" dir="ltr">{sub}</p>}
      {lead && <p className="lead">{lead}</p>}
    </Reveal>
  );
}

export function ContactLink({ children, className = 'btn btn-primary btn-lg' }: { children: ReactNode; className?: string }) {
  const { pathname } = useLocation();
  return (
    <Link to={{ pathname, hash: '#contact' }} className={className}>
      {children}
    </Link>
  );
}

type HeroProps = {
  tag: string;
  title: ReactNode;
  accent: string;
  sub: string;
  lead: string;
  cta: string;
  checks: string[];
  visual: ReactNode;
};

export function Hero({ tag, title, accent, sub, lead, cta, checks, visual }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-glow" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="pill mono" dir="ltr">{tag}</span>
          <h1>
            {title}
            <br />
            <span className="hero-accent">{accent}</span>
          </h1>
          <p className="sub-en hero-sub" dir="ltr">{sub}</p>
          <p className="hero-lead">{lead}</p>
          <div className="hero-ctas">
            <ContactLink>{cta}</ContactLink>
          </div>
          <ul className="checks">
            {checks.map((c) => (
              <li key={c}>
                <Icon name="check" size={16} strokeWidth={3} />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="hero-visual">{visual}</div>
      </div>
    </section>
  );
}

export type FlowStep = { icon: IconName; title: string; text: string };

export function FlowCard({ label, steps }: { label: string; steps: FlowStep[] }) {
  return (
    <div className="panel">
      <div className="panel-top">
        <span className="mono panel-label" dir="ltr">{label}</span>
        <span className="panel-chip">דוגמה לזרימה</span>
      </div>
      <ol className="flow">
        {steps.map((s, i) => (
          <li key={s.title} className="flow-step" style={{ animationDelay: `${200 + i * 160}ms` }}>
            <span className="icon-box icon-box--solid">
              <Icon name={s.icon} size={22} />
            </span>
            <div>
              <div className="flow-title">{s.title}</div>
              <div className="flow-text">{s.text}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export type Service = { icon: IconName; title: string; en?: string; text: string };

export function ServiceGrid({ items, dark }: { items: Service[]; dark?: boolean }) {
  return (
    <div className="grid grid--cards">
      {items.map((s, i) => (
        <Reveal key={s.title} delay={(i % 3) * 80}>
          <article className={`card card--service${dark ? ' card--dark' : ''}`}>
            <span className={`icon-box${dark ? ' icon-box--solid' : ''}`}>
              <Icon name={s.icon} size={24} />
            </span>
            <h3>{s.title}</h3>
            {s.en && <p className="mono card-en" dir="ltr">{s.en}</p>}
            <p className="card-text">{s.text}</p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export type UseCase = { tag: string; title: string; before: string; after: string };

export function UseCaseGrid({ items }: { items: UseCase[] }) {
  return (
    <div className="grid grid--wide">
      {items.map((u, i) => (
        <Reveal key={u.title} delay={(i % 2) * 80}>
          <article className="card card--case">
            <span className="tag">{u.tag}</span>
            <h3>{u.title}</h3>
            <div className="before-after">
              <div className="ba ba--before">
                <div className="ba-label">לפני</div>
                <div>{u.before}</div>
              </div>
              <div className="ba ba--after">
                <div className="ba-label">אחרי</div>
                <div>{u.after}</div>
              </div>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <Section tone="white" narrow>
      <SectionHead kicker="FAQ" title="שאלות נפוצות" />
      <div className="faq">
        {items.map((f) => (
          <details key={f.q} className="faq-item">
            <summary>
              {f.q}
              <span className="faq-plus" aria-hidden="true" />
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

export function Features({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="grid grid--features">
      {items.map((f, i) => (
        <Reveal key={f.title} delay={(i % 3) * 80}>
          <div className="feature">
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
