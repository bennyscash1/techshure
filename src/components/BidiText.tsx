import { Fragment } from 'react';
import { useLang } from '../i18n';

// Latin-only phrase in brackets inside Hebrew text, e.g. "(CRM / ERP)".
const LATIN_IN_BRACKETS = /\(([A-Za-z0-9][A-Za-z0-9 /.&+-]*)\)/g;

/**
 * Renders Hebrew text and keeps every Latin-only phrase in brackets on one
 * line, in the right order. The brackets stay outside the isolated span so
 * they mirror with the Hebrew around them. On English pages the text is
 * already left to right, so it renders as is.
 */
export function BidiText({ text }: { text: string }) {
  const { lang } = useLang();
  if (lang !== 'he') return <>{text}</>;
  const parts: (string | JSX.Element)[] = [];
  let last = 0;
  for (const m of text.matchAll(LATIN_IN_BRACKETS)) {
    const at = m.index ?? 0;
    parts.push(text.slice(last, at), '(', <bdi key={at} className="ltr-chunk" dir="ltr">{m[1]}</bdi>, ')');
    last = at + m[0].length;
  }
  parts.push(text.slice(last));
  return <>{parts.map((p, i) => (typeof p === 'string' ? <Fragment key={`t${i}`}>{p}</Fragment> : p))}</>;
}
