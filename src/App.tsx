import { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Icon } from './components/Icon';
import { CONTACT, type PageKey } from './data/site';
import Home from './pages/Home';
import Web from './pages/Web';
import Automation from './pages/Automation';
import Ivr from './pages/Ivr';
import Consulting from './pages/Consulting';

const TITLES: Record<PageKey, string> = {
  home: 'Tech-Shure טק-שור – מערכות טכנולוגיה וייעוץ תוכנה',
  web: 'אתרים, CRM ומערכות מורכבות | Tech-Shure טק-שור',
  automation: 'אוטומציה עסקית ובוטים | Tech-Shure טק-שור',
  ivr: 'מרכזייה חכמה IVR + CRM + AI | Tech-Shure טק-שור',
  consulting: 'ייעוץ ענן ומעבר לפרודקשן | Tech-Shure טק-שור',
};

function pageFromPath(pathname: string): PageKey {
  const seg = pathname.split('/')[1];
  return seg === 'web' || seg === 'automation' || seg === 'ivr' || seg === 'consulting' ? seg : 'home';
}

/** Scrolls to the hash target on navigation, or to the top on a page change. */
function useScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
}

function NotFound() {
  return (
    <section className="section">
      <div className="container container--narrow not-found">
        <span className="kicker mono" dir="ltr">404</span>
        <h1>העמוד לא נמצא</h1>
        <Link to="/" className="btn btn-primary btn-lg">חזרה לעמוד הראשי</Link>
      </div>
    </section>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const page = pageFromPath(pathname);
  useScrollManager();

  useEffect(() => {
    document.title = TITLES[page];
  }, [page]);

  return (
    <div className={`site theme--${page}`}>
      <a href="#main" className="skip-link">דלג לתוכן</a>
      <Header page={page} />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/web" element={<Web />} />
          <Route path="/automation" element={<Automation />} />
          <Route path="/ivr" element={<Ivr />} />
          <Route path="/consulting" element={<Consulting />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      {CONTACT.whatsapp && (
        <a className="wa-fab" href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="שיחה ב-WhatsApp">
          <Icon name="chat" size={26} />
        </a>
      )}
    </div>
  );
}
