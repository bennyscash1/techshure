import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { NAV } from '../data/site';
import { Brand } from './Blocks';
import { Icon } from './Icon';
import { useScrollProgress } from './Motion';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
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
        <Link to="/" className="brand-link" aria-label="Tech-shure טק-שור, דף הבית">
          <Brand />
        </Link>

        <nav aria-label="ניווט ראשי" className={`main-nav${open ? ' is-open' : ''}`} id="main-nav">
          {NAV.map((item) => (
            <NavLink key={item.key} to={item.path} end={item.path === '/'} className="nav-link">
              {item.label}
            </NavLink>
          ))}
          <Link to={{ pathname, hash: '#contact' }} className="btn btn-primary nav-cta-mobile">
            צור קשר
          </Link>
        </nav>

        <div className="header-actions">
          <Link to={{ pathname, hash: '#contact' }} className="btn btn-primary btn-sm header-cta">
            צור קשר
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
      <span className="scroll-progress" ref={progress} aria-hidden="true" />
    </header>
  );
}
