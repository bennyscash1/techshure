import { useEffect } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Icon } from './components/Icon';
import { ChatWidget } from './components/ChatWidget';
import { useScrollReveal } from './components/Motion';
import { CONTACT, type PageKey } from './data/site';
import Home from './pages/Home';
import Solutions from './pages/Solutions';
import Modules from './pages/Modules';

const TITLES: Record<PageKey, string> = {
  home: 'Tech-shure טק-שור | טכנולוגיה. על בטוח.',
  solutions: 'פתרונות תוכנה ומחירים | Tech-shure טק-שור',
  modules: 'מודולים, חבילות ותנאים | Tech-shure טק-שור',
};

function pageFromPath(pathname: string): PageKey {
  const seg = pathname.split('/')[1];
  return seg === 'solutions' || seg === 'modules' ? seg : 'home';
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
        <span className="kicker" dir="ltr">404</span>
        <h1>העמוד לא נמצא</h1>
        <Link to="/" className="btn btn-primary btn-lg">חזרה לדף הבית</Link>
      </div>
    </section>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const page = pageFromPath(pathname);
  useScrollManager();
  useScrollReveal(pathname);

  useEffect(() => {
    document.title = TITLES[page];
  }, [page]);

  return (
    <div className="site">
      <a href="#main" className="skip-link">דלג לתוכן</a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/modules" element={<Modules />} />
          {/* Old addresses from the previous site, kept so shared links still work. */}
          <Route path="/ivr" element={<Navigate to="/solutions#phone" replace />} />
          <Route path="/automation" element={<Navigate to="/solutions#whatsapp" replace />} />
          <Route path="/web" element={<Navigate to="/solutions#crm" replace />} />
          <Route path="/consulting" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <a className="wa-fab" href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="שיחה בוואטסאפ">
        <Icon name="chat" size={26} />
      </a>
      <ChatWidget />
    </div>
  );
}
