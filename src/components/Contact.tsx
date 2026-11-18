import { useState, type FormEvent } from 'react';
import hezki from '../assets/hezki.webp';
import { CONTACT, SERVICE_OPTIONS } from '../data/site';
import { Icon } from './Icon';

type Props = { title?: string; sub?: string; defaultService?: string };

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function Contact({
  title = 'בואו נדבר על העסק שלך',
  sub = 'שיחת היכרות בלי עלות ובלי התחייבות. מספרים לנו מה מעיק עליך, ואנחנו מציעים מה לבנות.',
  defaultService,
}: Props) {
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
        body: JSON.stringify({ ...data, page: window.location.pathname }),
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
          <span className="kicker kicker--light">צור קשר</span>
          <h2>{title}</h2>
          <p className="contact-lead">{sub}</p>
          <ul className="contact-list">
            <li>
              <Icon name="mail" size={22} />
              <a href={`mailto:${CONTACT.email}`} dir="ltr">{CONTACT.email}</a>
            </li>
            <li>
              <Icon name="phone" size={22} />
              <a href={`tel:${CONTACT.phone}`} dir="ltr">{CONTACT.phone}</a>
            </li>
            <li>
              <Icon name="chat" size={22} />
              <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer">וואטסאפ</a>
            </li>
            <li>
              <Icon name="pin" size={22} />
              <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer">{CONTACT.address}</a>
            </li>
            <li>
              <Icon name="clock" size={22} />
              <span>{CONTACT.hours}</span>
            </li>
          </ul>
        </div>

        <form className="form" aria-label="טופס יצירת קשר" onSubmit={onSubmit}>
          {status === 'sent' ? (
            <div className="form-done" role="status">
              <span className="form-done-icon"><Icon name="check" size={30} strokeWidth={3} /></span>
              <h3>תודה, קיבלנו את הפרטים</h3>
              <p>נחזור אליך תוך יום עסקים.</p>
              <button type="button" className="btn btn-ghost" onClick={() => setStatus('idle')}>שליחת פנייה נוספת</button>
            </div>
          ) : (
            <>
              <h3>השאירו פרטים ונחזור אליכם</h3>
              <div className="form-row">
                <label className="field">
                  <span>שם מלא</span>
                  <input name="name" type="text" autoComplete="name" required />
                </label>
                <label className="field">
                  <span>טלפון</span>
                  <input name="phone" type="tel" dir="ltr" autoComplete="tel" inputMode="tel" required />
                </label>
              </div>
              <label className="field">
                <span>אימייל</span>
                <input name="email" type="email" dir="ltr" autoComplete="email" />
              </label>
              <label className="field">
                <span>מה מעניין אותך?</span>
                <select name="service" defaultValue={defaultService ?? SERVICE_OPTIONS[0]}>
                  {SERVICE_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>ספרו לנו בקצרה על העסק</span>
                <textarea name="message" rows={4} />
              </label>
              <button type="submit" className="btn btn-accent btn-block btn-lg" disabled={status === 'sending'}>
                {status === 'sending' ? 'שולחים...' : 'שליחה'}
              </button>
              {status === 'error' && <p className="form-error" role="alert">השליחה נכשלה. נסו שוב, או כתבו לנו ל-{CONTACT.email}.</p>}
              <p className="form-note">הפרטים ישמשו ליצירת קשר בלבד.</p>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
