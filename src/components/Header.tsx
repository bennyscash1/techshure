import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { NAV } from '../data/site';
import { switchPath, useLang } from '../i18n';
import { Brand } from './Blocks';
import { Icon } from './Icon';
import { useScrollProgress } from './Motion';

/** Link to the same page in the other language (same slug, ?tab= and #hash). */
function LangSwitch({ className }: { className: string }) {
  const { t } = useLang();
  const { pathname, search, hash } = useLocation();
  const code = t.langSwitch.langCode;
  return (
    <Link to={switchPath(pathname, search, hash)} className={`lang-switch ${className}`} lang={code} hrefLang={code} title={t.langSwitch.title}>
      <Icon name="globe" size={18} />
      <span>{t.langSwitch.label}</span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { t, lp } = useLang();
  const progress = useScrollProgress<HTMLSpanElement>();

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
        <Link to={lp('/')} className="brand-link" aria-label={t.a11y.homeLink}>
          <Brand />
        </Link>

        <nav aria-label={t.a11y.mainNav} className={`main-nav${open ? ' is-open' : ''}`} id="main-nav">
          {NAV.map((item) => (
            <NavLink key={item.key} to={lp(item.path)} end={item.path === '/'} className="nav-link">
              {t.nav[item.key]}
            </NavLink>
          ))}
          <LangSwitch className="nav-lang-mobile" />
          <Link to={{ pathname, hash: '#contact' }} className="btn btn-primary nav-cta-mobile">
            {t.nav.contact}
          </Link>
        </nav>

        <div className="header-actions">
          <LangSwitch className="header-lang" />
          <Link to={{ pathname, hash: '#contact' }} className="btn btn-primary btn-sm header-cta">
            {t.nav.contact}
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="main-nav"
            aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </div>
      <span className="scroll-progress" ref={progress} aria-hidden="true" />
    </header>
  );
}
