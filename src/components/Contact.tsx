import { useState, type FormEvent } from 'react';
import hezki from '../assets/hezki.webp';
import { CONTACT } from '../data/site';
import { useLang } from '../i18n';
import { Icon } from './Icon';

type Props = { title?: string; sub?: string; defaultService?: string };

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function Contact({ title, sub, defaultService }: Props) {
  const { lang, t } = useLang();
  const c = t.contact;
  const info = t.contactInfo;
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, page: window.location.pathname, lang }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="section section--navy contact">
      <div className="container contact-grid">
        <div className="contact-copy">
          <img src={hezki} alt="" className="contact-bot" width={640} height={640} loading="lazy" />
          <span className="kicker kicker--light">{c.kicker}</span>
          <h2>{title ?? c.title}</h2>
          <p className="contact-lead">{sub ?? c.sub}</p>
          <ul className="contact-list">
            <li>
              <Icon name="mail" size={22} />
              <a href={`mailto:${CONTACT.email}`} dir="ltr">{CONTACT.email}</a>
            </li>
            <li>
              <Icon name="phone" size={22} />
              <a href={`tel:${CONTACT.phoneTel}`} dir="ltr">{info.phone}</a>
            </li>
            <li>
              <Icon name="chat" size={22} />
              <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer">{c.whatsapp}</a>
            </li>
            <li>
              <Icon name="pin" size={22} />
              <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer">{info.address}</a>
            </li>
            <li>
              <Icon name="clock" size={22} />
              <span>{info.hours}</span>
            </li>
          </ul>
        </div>

        <form className="form" aria-label={c.formLabel} onSubmit={onSubmit}>
          {status === 'sent' ? (
            <div className="form-done" role="status">
              <span className="form-done-icon"><Icon name="check" size={30} strokeWidth={3} /></span>
              <h3>{c.doneTitle}</h3>
              <p>{c.doneText}</p>
              <button type="button" className="btn btn-ghost" onClick={() => setStatus('idle')}>{c.again}</button>
            </div>
          ) : (
            <>
              <h3>{c.formTitle}</h3>
              <div className="form-row">
                <label className="field">
                  <span>{c.name}</span>
                  <input name="name" type="text" autoComplete="name" required />
                </label>
                <label className="field">
                  <span>{c.phone}</span>
                  <input name="phone" type="tel" dir="ltr" autoComplete="tel" inputMode="tel" required />
                </label>
              </div>
              <label className="field">
                <span>{c.email}</span>
                <input name="email" type="email" dir="ltr" autoComplete="email" />
              </label>
              <label className="field">
                <span>{c.service}</span>
                <select name="service" defaultValue={defaultService ?? c.serviceOptions[0]}>
                  {c.serviceOptions.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>{c.message}</span>
                <textarea name="message" rows={4} />
              </label>
              <button type="submit" className="btn btn-accent btn-block btn-lg" disabled={status === 'sending'}>
                {status === 'sending' ? c.sending : c.send}
              </button>
              {status === 'error' && <p className="form-error" role="alert">{c.error(CONTACT.email)}</p>}
              <p className="form-note">{c.note}</p>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
