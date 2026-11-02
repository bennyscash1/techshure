import { Link } from 'react-router-dom';
import { CONTACT, NAV } from '../data/site';
import { Icon } from './Icon';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">
              <img src="/logo.png?v=2" alt="Tech-Shure טק-שור" width={381} height={130} loading="lazy" />
            </span>
            <span className="brand-badge brand-badge--dark">
              <Icon name="grid" size={14} strokeWidth={2.2} />
              <span dir="ltr" className="mono">Tech-Shure GROUP</span>
              <span aria-hidden="true" className="brand-sep">|</span>
              <span>Web · Flow · Voice</span>
            </span>
            <p>מערכות טכנולוגיה וייעוץ תוכנה · Technology Systems &amp; Software Consulting</p>
          </div>
          <nav aria-label="ניווט תחתון" className="footer-nav">
            {NAV.map((item) => (
              <Link key={item.key} to={item.path}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} טק-שור · שור בנימין חיים · עוסק פטור {CONTACT.businessId}</span>
          <span className="footer-legal">
            <a href="#">מדיניות פרטיות</a>
            <a href="#">הצהרת נגישות</a>
            <a href="#">תנאי שימוש</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
