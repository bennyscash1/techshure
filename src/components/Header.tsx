import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { NAV, type PageKey } from '../data/site';
import { Icon, type IconName } from './Icon';

const BADGES: Record<PageKey, { icon: IconName; tag: string; label: string }> = {
  home: { icon: 'grid', tag: 'Tech-Shure GROUP', label: 'Web · Flow · Voice' },
  web: { icon: 'code', tag: 'Tech-Shure WEB', label: 'אתרים, CRM ומערכות' },
  automation: { icon: 'bot', tag: 'Tech-Shure FLOW', label: 'אוטומציה עסקית' },
  ivr: { icon: 'phone', tag: 'Tech-Shure VOICE', label: 'מרכזייה חכמה' },
};

export function Header({ page }: { page: PageKey }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const badge = BADGES[page];

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
  }, [open]);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container header-row">
        <div className="brand">
          <Link to="/" aria-label="Tech-Shure טק-שור – עמוד ראשי">
            <img src="/logo.png?v=2" alt="Tech-Shure טק-שור – מערכות טכנולוגיה וייעוץ תוכנה" className="brand-logo" width={381} height={130} />
          </Link>
          <span className="brand-badge">
            <Icon name={badge.icon} size={14} strokeWidth={2.2} />
            <span dir="ltr" className="mono">{badge.tag}</span>
            <span aria-hidden="true" className="brand-sep">|</span>
            <span>{badge.label}</span>
          </span>
        </div>

        <nav aria-label="ניווט ראשי" className={`main-nav${open ? ' is-open' : ''}`} id="main-nav">
          {NAV.map((item) => (
            <NavLink key={item.key} to={item.path} end className="nav-link">
              {item.label}
            </NavLink>
          ))}
          <Link to={{ pathname, hash: '#contact' }} className="btn btn-dark nav-cta-mobile">
            לשיחת ייעוץ
          </Link>
        </nav>

        <div className="header-actions">
          <Link to={{ pathname, hash: '#contact' }} className="btn btn-dark btn-sm header-cta">
            לשיחת ייעוץ
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="main-nav"
            aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
