import { Link } from 'react-router-dom';
import { CONTACT, NAV } from '../data/site';
import { Brand } from './Blocks';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand />
            <p>מערכות מלאות ומורכבות לניהול העסק, לכל עסק ובכל גודל. מקום אחד, מנוי חודשי, שקט מלא.</p>
          </div>
          <nav aria-label="ניווט תחתון" className="footer-nav">
            {NAV.map((item) => (
              <Link key={item.key} to={item.path}>
                {item.label}
              </Link>
            ))}
            <Link to="/modules#terms">תנאים מסחריים</Link>
            <Link to={{ hash: '#contact' }}>צור קשר</Link>
          </nav>
          <div className="footer-contact">
            <a href={`mailto:${CONTACT.email}`} dir="ltr">{CONTACT.email}</a>
            <a href={`tel:${CONTACT.phoneTel}`} dir="ltr">{CONTACT.phone}</a>
            <span>{CONTACT.hours}</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Tech-shure · שור בנימין חיים · עוסק פטור {CONTACT.businessId}</span>
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
