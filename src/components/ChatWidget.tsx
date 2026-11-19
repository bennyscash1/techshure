import { Fragment, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CONTACT } from '../data/site';
import { useLang, type Lang } from '../i18n';
import { HezkiAvatar } from './HezkiAvatar';
import { Icon } from './Icon';

type Msg = { role: 'user' | 'bot'; text: string };

// Match the limits in api/chat.ts.
const MAX_CHARS = 600;
const MAX_TURNS = 20;
// Each language keeps its own conversation. The Hebrew key is unchanged, so existing chats survive.
const storeKey = (lang: Lang) => (lang === 'he' ? 'ts-chat-v1' : `ts-chat-v1-${lang}`);

type Saved = { messages: Msg[]; leadSent: boolean };

function loadSaved(lang: Lang): Saved | null {
  try {
    const raw = sessionStorage.getItem(storeKey(lang));
    if (!raw) return null;
    const data = JSON.parse(raw) as Saved;
    return Array.isArray(data.messages) && data.messages.length ? data : null;
  } catch {
    return null;
  }
}

/** Turns links and phone numbers in a bot reply into clickable links. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s,]+|\+972[-\s]?\d{1,2}[-\s]?\d{3}[-\s]?\d{4}|0\d{1,2}-?\d{3}-?\d{4})/g);
  return (
    <>
      {parts.map((part, i) => {
        if (/^https?:\/\//.test(part)) {
          const href = part.replace(/[.)]+$/, '');
          return (
            <Fragment key={i}>
              <a href={href} target="_blank" rel="noopener noreferrer" dir="ltr">{href}</a>
              {part.slice(href.length)}
            </Fragment>
          );
        }
        if (/^0\d/.test(part)) {
          return <a key={i} href={`tel:${part.replace(/\D/g, '')}`} dir="ltr">{part}</a>;
        }
        if (/^\+972/.test(part)) {
          return <a key={i} href={`tel:+${part.replace(/\D/g, '')}`} dir="ltr">{part}</a>;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

const OPEN_CHAT_EVENT = 'techshure:open-chat';

/** Opens the Hezki chat panel from anywhere on the site. */
export function openChat() {
  window.dispatchEvent(new Event(OPEN_CHAT_EVENT));
}

/** The Hezki chat. Render with key={lang}: the language is fixed for the life of the widget. */
export function ChatWidget() {
  const { lang, t } = useLang();
  const ui = t.chat;
  const greeting: Msg = { role: 'bot', text: ui.greeting };
  const errorText = (code: string) =>
    code === 'too-long'
      ? ui.errors.tooLong(MAX_CHARS)
      : code === 'turn-limit'
        ? ui.errors.turnLimit
        : code === 'rate-limit'
          ? ui.errors.rateLimit
          : ui.errors.default;
  const saved = useRef(loadSaved(lang));
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<Msg[]>(saved.current?.messages ?? [greeting]);
  const [leadSent, setLeadSent] = useState(saved.current?.leadSent ?? false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();

  // Any page can open the chat, for example the call to action on a solution page.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, []);

  const userTurns = messages.filter((m) => m.role === 'user').length;
  const atLimit = userTurns >= MAX_TURNS;

  // Check once, on first open, whether the server has a model key.
  useEffect(() => {
    if (!open || enabled !== null) return;
    let cancelled = false;
    fetch('/api/chat', { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : { enabled: false }))
      .then((d: { enabled?: boolean }) => !cancelled && setEnabled(Boolean(d.enabled)))
      .catch(() => !cancelled && setEnabled(false));
    return () => {
      cancelled = true;
    };
  }, [open, enabled]);

  useEffect(() => {
    try {
      sessionStorage.setItem(storeKey(lang), JSON.stringify({ messages, leadSent }));
    } catch {
      /* private mode: chat still works, just not across reloads */
    }
  }, [messages, leadSent, lang]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' });
  }, [messages, sending, open, error]);

  useEffect(() => {
    if (open && enabled) inputRef.current?.focus({ preventScroll: true });
  }, [open, enabled]);

  function close() {
    setOpen(false);
    fabRef.current?.focus();
  }

  async function send(text: string) {
    const clean = text.trim().slice(0, MAX_CHARS);
    if (!clean || sending || atLimit) return;
    const next: Msg[] = [...messages, { role: 'user', text: clean }];
    setMessages(next);
    setInput('');
    setError('');
    setSending(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ messages: next, leadSent, page: pathname, lang }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; reply?: string; leadSent?: boolean; error?: string };
      if (data.error === 'disabled') {
        setEnabled(false);
        return;
      }
      if (!res.ok || !data.ok || !data.reply) {
        setError(errorText(data.error ?? ''));
        return;
      }
      setMessages((m) => [...m, { role: 'bot', text: data.reply as string }]);
      if (data.leadSent) setLeadSent(true);
    } catch {
      setError(ui.errors.default);
    } finally {
      setSending(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void send(input);
    }
  }

  function reset() {
    setMessages([greeting]);
    setLeadSent(false);
    setError('');
  }

  const contactLinks = (
    <div className="chat-contact">
      <a className="btn btn-accent btn-sm" href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer">
        <Icon name="chat" size={16} /> {ui.whatsapp}
      </a>
      <a className="btn btn-ghost btn-sm" href={`tel:${CONTACT.phoneTel}`}>
        <Icon name="phone" size={16} /> <span dir="ltr">{t.contactInfo.phone}</span>
      </a>
      <Link className="btn btn-ghost btn-sm" to={{ pathname, hash: '#contact' }} onClick={() => setOpen(false)}>
        <Icon name="mail" size={16} /> {ui.leaveDetails}
      </Link>
    </div>
  );

  return (
    <>
      <button
        ref={fabRef}
        type="button"
        className={`chat-fab${open ? ' is-open' : ''}`}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? ui.fabClose : ui.fabOpen}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <HezkiAvatar size={50} typing={sending} />
        {!open && <span className="chat-fab-tip" aria-hidden="true">{ui.tip}</span>}
      </button>

      {open && (
        <div
          id="chat-panel"
          className="chat-panel"
          role="dialog"
          aria-label={ui.dialog}
          onKeyDown={(e) => e.key === 'Escape' && close()}
        >
          <header className="chat-head">
            <HezkiAvatar size={46} typing={sending} />
            <div className="chat-head-text">
              <strong>{ui.name}</strong>
              <span>{sending ? ui.typing : ui.status}</span>
            </div>
            {enabled && messages.length > 1 && (
              <button type="button" className="chat-icon-btn" onClick={reset} aria-label={ui.newChat} title={ui.newChat}>
                <Icon name="sync" size={18} />
              </button>
            )}
            <button type="button" className="chat-icon-btn" onClick={close} aria-label={ui.close}>
              <Icon name="close" size={20} />
            </button>
          </header>

          {enabled === false ? (
            <div className="chat-fallback">
              <HezkiAvatar size={96} />
              <p>
                <b>{ui.fallbackHi}</b>{ui.fallbackText}
              </p>
              {contactLinks}
            </div>
          ) : (
            <>
              <div className="chat-log" ref={logRef} aria-live="polite" aria-busy={sending}>
                {messages.map((m, i) => (
                  <div key={i} className={`chat-msg chat-msg--${m.role}`}>
                    <p><RichText text={m.text} /></p>
                  </div>
                ))}
                {messages.length === 1 && enabled && (
                  <div className="chat-quick">
                    {ui.quick.map((q) => (
                      <button key={q} type="button" onClick={() => void send(q)}>{q}</button>
                    ))}
                  </div>
                )}
                {(sending || enabled === null) && (
                  <div className="chat-msg chat-msg--bot chat-typing" aria-label={ui.typingLabel}>
                    <span /><span /><span />
                  </div>
                )}
                {error && (
                  <div className="chat-error" role="alert">
                    <p>{error}</p>
                    {contactLinks}
                  </div>
                )}
                {atLimit && !error && (
                  <div className="chat-error">
                    <p>{ui.errors.turnLimit}</p>
                    {contactLinks}
                  </div>
                )}
              </div>

              <form className="chat-form" onSubmit={onSubmit}>
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  maxLength={MAX_CHARS}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={atLimit ? ui.ended : ui.placeholder}
                  aria-label={ui.inputLabel}
                  disabled={!enabled || atLimit}
                />
                <button type="submit" className="chat-send" disabled={!enabled || sending || atLimit || !input.trim()} aria-label={ui.send}>
                  <Icon name="arrow" size={20} />
                </button>
              </form>
              {input.length > MAX_CHARS - 100 && (
                <p className="chat-count" aria-live="polite">{input.length}/{MAX_CHARS}</p>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
