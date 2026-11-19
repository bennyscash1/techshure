import { Link } from 'react-router-dom';
import { CONTACT, NAV } from '../data/site';
import { useLang } from '../i18n';
import { Brand } from './Blocks';

export function Footer() {
  const { t, lp } = useLang();
  const info = t.contactInfo;
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand />
            <p>{t.footer.blurb}</p>
          </div>
          <nav aria-label={t.a11y.footerNav} className="footer-nav">
            {NAV.map((item) => (
              <Link key={item.key} to={lp(item.path)}>
                {t.nav[item.key]}
              </Link>
            ))}
            <Link to={lp('/modules#terms')}>{t.nav.terms}</Link>
            <Link to={{ hash: '#contact' }}>{t.nav.contact}</Link>
          </nav>
          <div className="footer-contact">
            <a href={`mailto:${CONTACT.email}`} dir="ltr">{CONTACT.email}</a>
            <a href={`tel:${CONTACT.phoneTel}`} dir="ltr">{info.phone}</a>
            <span>{info.hours}</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Tech-shure · {info.legalName} · {info.legalType} {info.businessId}</span>
          <span className="footer-legal">
            <a href="#">{t.footer.privacy}</a>
            <a href="#">{t.footer.accessibility}</a>
            <a href="#">{t.footer.terms}</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
