import { useState, type FormEvent } from 'react';
import { CONTACT, SERVICE_OPTIONS } from '../data/site';
import { Icon } from './Icon';

type Props = { title: string; sub: string; defaultService?: string };

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function Contact({ title, sub, defaultService }: Props) {
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
    <section id="contact" className="section section--dark contact">
      <div className="container contact-grid">
        <div className="contact-copy">
          <span className="kicker kicker--light mono" dir="ltr">LET'S TALK</span>
          <h2>{title}</h2>
          <p className="sub-en sub-en--light" dir="ltr">{sub}</p>
          <p className="contact-lead">
            שיחת אפיון ראשונית ללא עלות וללא התחייבות. צוות קטן עם ניסיון רב, העלויות המשתלמות ביותר בשוק ואחריות מלאה. נחזור אליכם תוך יום עסקים.
          </p>
          <ul className="contact-list">
            <li>
              <Icon name="phone" size={22} />
              {CONTACT.phone ? <a href={`tel:${CONTACT.phone}`} dir="ltr">{CONTACT.phone}</a> : <span>[מספר טלפון]</span>}
            </li>
            <li>
              <Icon name="chat" size={22} />
              {CONTACT.whatsapp ? (
                <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              ) : (
                <span>WhatsApp – [מספר וואטסאפ]</span>
              )}
            </li>
            <li>
              <Icon name="mail" size={22} />
              {CONTACT.email ? <a href={`mailto:${CONTACT.email}`} dir="ltr">{CONTACT.email}</a> : <span>[כתובת מייל]</span>}
            </li>
            <li>
              <Icon name="route" size={22} />
              <span>{CONTACT.location}</span>
            </li>
          </ul>
        </div>

        <form className="form" aria-label="טופס יצירת קשר" onSubmit={onSubmit}>
          {status === 'sent' ? (
            <div className="form-done" role="status">
              <span className="form-done-icon"><Icon name="check" size={30} strokeWidth={3} /></span>
              <h3>תודה! קיבלנו את הפרטים</h3>
              <p>נחזור אליכם תוך יום עסקים.</p>
              <button type="button" className="btn btn-ghost" onClick={() => setStatus('idle')}>שליחת פנייה נוספת</button>
            </div>
          ) : (
            <>
              <h3>השאירו פרטים</h3>
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
                <span>במה נוכל לעזור?</span>
                <select name="service" defaultValue={defaultService ?? SERVICE_OPTIONS[0]}>
                  {SERVICE_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>ספרו לנו בקצרה</span>
                <textarea name="message" rows={4} />
              </label>
              <button type="submit" className="btn btn-primary btn-block" disabled={status === 'sending'}>
                {status === 'sending' ? 'שולחים…' : 'שליחה – ונחזור אליכם'}
              </button>
              {status === 'error' && <p className="form-error" role="alert">השליחה נכשלה. נסו שוב או פנו אלינו בטלפון.</p>}
              <p className="form-note">הפרטים ישמשו ליצירת קשר בלבד, בהתאם ל<a href="#">מדיניות הפרטיות</a>.</p>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
