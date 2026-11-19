import { useEffect } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Icon } from './components/Icon';
import { ChatWidget } from './components/ChatWidget';
import { useScrollReveal } from './components/Motion';
import { CONTACT } from './data/site';
import { EN_PREFIX, useLang } from './i18n';
import { useSeo } from './i18n/seo';
import Home from './pages/Home';
import Solutions from './pages/Solutions';
import Modules from './pages/Modules';
import SolutionPage from './pages/SolutionPage';

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
  const { t, lp } = useLang();
  useSeo(t.meta.notFoundTitle, t.meta.notFoundDescription, false);
  return (
    <section className="section">
      <div className="container container--narrow not-found">
        <span className="kicker" dir="ltr">404</span>
        <h1>{t.notFound.title}</h1>
        <Link to={lp('/')} className="btn btn-primary btn-lg">{t.notFound.back}</Link>
      </div>
    </section>
  );
}

/**
 * The same pages in both languages: Hebrew at the root, English under /en.
 * Old addresses from the previous site are kept so shared links still work, in both languages.
 */
function pageRoutes(prefix: '' | typeof EN_PREFIX) {
  const p = (path: string) => `${prefix}${path}`;
  return [
    <Route key={p('/')} path={prefix || '/'} element={<Home />} />,
    <Route key={p('/solutions')} path={p('/solutions')} element={<Solutions />} />,
    <Route key={p('/solutions/:slug')} path={p('/solutions/:slug')} element={<SolutionPage />} />,
    <Route key={p('/modules')} path={p('/modules')} element={<Modules />} />,
    <Route key={p('/ivr')} path={p('/ivr')} element={<Navigate to={p('/solutions/phone-answering')} replace />} />,
    <Route key={p('/automation')} path={p('/automation')} element={<Navigate to={p('/solutions/whatsapp-bot')} replace />} />,
    <Route key={p('/web')} path={p('/web')} element={<Navigate to={p('/solutions/crm-erp')} replace />} />,
    <Route key={p('/consulting')} path={p('/consulting')} element={<Navigate to={prefix || '/'} replace />} />,
    <Route key={p('/*')} path={prefix ? `${prefix}/*` : '*'} element={<NotFound />} />,
  ];
}

export default function App() {
  const { pathname } = useLocation();
  const { lang, t } = useLang();
  useScrollManager();
  useScrollReveal(pathname);

  return (
    <div className="site">
      <a href="#main" className="skip-link">{t.a11y.skip}</a>
      <Header />
      <main id="main">
        <Routes>
          {pageRoutes('')}
          {pageRoutes(EN_PREFIX)}
        </Routes>
      </main>
      <Footer />
      <a className="wa-fab" href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label={t.a11y.whatsapp}>
        <Icon name="chat" size={26} />
      </a>
      {/* Remounts per language, so each language keeps its own conversation and greeting. */}
      <ChatWidget key={lang} />
    </div>
  );
}
