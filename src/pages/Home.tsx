import { Link } from 'react-router-dom';
import { Contact } from '../components/Contact';
import { HeroOrder } from '../components/HeroOrder';
import { getSolutions, solutionPath } from '../data/solutions';
import { useLang } from '../i18n';
import { useSeo } from '../i18n/seo';

// Change request 34: a calm, orderly home page. Hero, how we work, what we build, contact. Each idea once.
// The home sections skip the scroll reveal (no-reveal): few animations, nothing in the way of the text.
export default function Home() {
  const { t, lang, lp } = useLang();
  const h = t.home;
  useSeo(t.meta.homeTitle, t.meta.homeDescription);
  return (
    <>
      {/* 1. Hero: the Tech-shure robot turns tangled lines into 3 clean ones (HeroOrder), no text or icons on it. */}
      <section className="home-hero no-reveal">
        <div className="container home-hero-copy">
          <h1>{h.heroTitle}</h1>
          <p className="home-hero-lead">{h.heroLead}</p>
          <Link to={{ hash: '#contact' }} className="btn btn-primary btn-lg">{h.talk}</Link>
        </div>
        <div className="container home-hero-media">
          <HeroOrder />
        </div>
      </section>

      {/* 2. How we work: three steps, in plain words. */}
      <section className="section home-steps no-reveal">
        <div className="container container--narrow">
          <h2>{h.stepsTitle}</h2>
          <ol className="steps">
            {h.steps.map((s, i) => (
              <li key={s.title}>
                <span className="steps-num" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3. What we build: a short list, each line links to its page. */}
      <section className="section section--sand home-services no-reveal">
        <div className="container container--narrow">
          <h2>{h.servicesTitle}</h2>
          <ul className="services-list">
            {getSolutions(lang).map((s) => (
              <li key={s.slug}>
                <Link to={lp(solutionPath(s.slug))}>
                  <strong>{s.shortTitle}</strong>
                  <span>{h.services[s.slug]}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link to={lp('/solutions')} className="services-more">{h.servicesMore}</Link>
        </div>
      </section>

      {/* 4. Contact: the target of the hero button. */}
      <Contact />
    </>
  );
}
