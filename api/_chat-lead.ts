// Parsing and lead helpers for /api/chat. Kept apart so the model's output is never trusted as is.
// The underscore prefix keeps Vercel from deploying this file as its own function.
import { isEmail, oneLine } from './_mail.js';

export type Role = 'user' | 'bot';
export type ChatMessage = { role: Role; text: string };
export type Lead = {
  name: string;
  phone: string;
  email: string;
  need: string;
  summary: string;
  // Discovery notes so the rep arrives prepared. Optional: the model fills what came up.
  businessType: string;
  size: string;
  currentTools: string;
  pains: string;
  recommended: string;
};

export const NOT_GIVEN = 'לא צוין';

/** Per-field length caps. The same numbers go into the schema descriptions as hints for the model. */
export const LEAD_LIMITS = {
  name: 60,
  phone: 20,
  email: 120,
  need: 200,
  businessType: 120,
  size: 120,
  currentTools: 200,
  pains: 300,
  recommended: 400,
  summary: 600,
} as const satisfies Record<keyof Lead, number>;

const LEAD_KEYS = Object.keys(LEAD_LIMITS) as (keyof Lead)[];

// ---------- Model output parsing ----------

/** Returns the first balanced {...} object in the text (string aware), or null if it never closes. */
function firstObject(text: string): string | null {
  const start = text.indexOf('{');
  if (start < 0) return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === '{') depth++;
    else if (ch === '}' && --depth === 0) return text.slice(start, i + 1);
  }
  return null;
}

/** Reads one complete JSON string value for `key` out of possibly broken JSON text. */
function extractString(text: string, key: string): string | null {
  const match = new RegExp(`"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`).exec(text);
  if (!match) return null;
  try {
    return JSON.parse(`"${match[1]}"`) as string;
  } catch {
    return null;
  }
}

export type ParsedOutput = {
  reply: string;
  lead: Record<string, unknown> | null;
  /** How the output was read, for the server log. */
  mode: 'json' | 'object' | 'regex' | 'text' | 'empty';
};

/** Tolerant reader for the model output: strict JSON, then the first complete object, then field regexes. */
export function parseModelOutput(raw: string): ParsedOutput {
  const text = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  if (!text) return { reply: '', lead: null, mode: 'empty' };

  const fromObject = (value: unknown, mode: ParsedOutput['mode']): ParsedOutput | null => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const v = value as { reply?: unknown; lead?: unknown };
    const lead = v.lead && typeof v.lead === 'object' && !Array.isArray(v.lead) ? (v.lead as Record<string, unknown>) : null;
    return { reply: typeof v.reply === 'string' ? v.reply : '', lead, mode };
  };

  try {
    const result = fromObject(JSON.parse(text), 'json');
    if (result) return result;
  } catch {
    // fall through
  }

  const obj = firstObject(text);
  if (obj) {
    try {
      const result = fromObject(JSON.parse(obj), 'object');
      if (result) return result;
    } catch {
      // fall through
    }
  }

  if (/"reply"\s*:|"lead"\s*:/.test(text) || text.startsWith('{')) {
    // Truncated or runaway JSON. Keep whatever complete fields survived.
    const lead: Record<string, unknown> = {};
    for (const key of LEAD_KEYS) {
      const value = extractString(text, key);
      if (value !== null) lead[key] = value;
    }
    return { reply: extractString(text, 'reply') ?? '', lead: Object.keys(lead).length ? lead : null, mode: 'regex' };
  }

  // The model ignored the JSON format and wrote plain text.
  return { reply: text, lead: null, mode: 'text' };
}

/** True if the text must never reach the visitor (raw JSON, or the schema keys). */
export function looksLikeJson(text: string): boolean {
  return /^\s*[{[]/.test(text) || /"reply"|"lead"|\{\s*"/.test(text);
}

// ---------- Field sanitizing ----------

/** Runaway output: the same 2 to 6 char pattern 6+ times in a row, or a long run of Latin letters with no spaces. */
export function isRunaway(value: string): boolean {
  return /(.{2,6}?)\1{5,}/s.test(value) || /[A-Za-z]{25,}/.test(value);
}

/** Israeli phone as plain digits starting with 0 (9 or 10 digits), or '' if not valid. */
export function normalizePhone(value: string): string {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('972')) digits = `0${digits.slice(3)}`;
  if (digits.length === 8 || digits.length === 9) {
    if (!digits.startsWith('0')) digits = `0${digits}`;
  }
  return /^0\d{8,9}$/.test(digits) ? digits : '';
}

function cleanField(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  const text = oneLine(value);
  if (!text) return '';
  if (isRunaway(text)) return NOT_GIVEN;
  return text.length > max ? `${text.slice(0, max - 1).trim()}…` : text;
}

function cleanName(value: unknown): string {
  const name = cleanField(value, LEAD_LIMITS.name);
  if (!name || name === NOT_GIVEN || /\d/.test(name) || looksLikeJson(name)) return '';
  return name;
}

/** Sanitizes whatever the model returned. Fields may come back empty; nothing here blocks the lead. */
export function sanitizeLead(value: Record<string, unknown> | null): Partial<Lead> {
  if (!value) return {};
  const lead: Partial<Lead> = {};
  lead.name = cleanName(value.name);
  lead.phone = typeof value.phone === 'string' ? normalizePhone(value.phone) : '';
  const email = typeof value.email === 'string' ? oneLine(value.email).slice(0, LEAD_LIMITS.email) : '';
  lead.email = isEmail(email) ? email : '';
  for (const key of ['need', 'businessType', 'size', 'currentTools', 'pains', 'recommended', 'summary'] as const) {
    lead[key] = cleanField(value[key], LEAD_LIMITS[key]);
  }
  return lead;
}

// ---------- Lead from the transcript ----------

const PHONE_RE = /(?:\+?972[\s-]?|0)(?:[\s-]?\d){8,9}(?!\d)/g;
const EMAIL_RE = /[^\s@,;:]+@[^\s@,;:]+\.[a-zA-Z]{2,}/;
const NAME_PREFIX_RE = /^(?:שמי|השם שלי(?: הוא)?|קוראים לי|אני|זה|my name is|i am|i'm|name:?|שם:?)\s+/i;
const NOT_A_NAME = /^(?:כן|לא|אוקי|אוקיי|בטח|בסדר|תודה|סבבה|מעולה|יופי|שלום|היי|הי|ok|okay|yes|no|thanks)$/i;

/** Last phone number the visitor wrote, normalized, or ''. */
export function phoneFromTranscript(messages: ChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role !== 'user') continue;
    for (const match of [...messages[i].text.matchAll(PHONE_RE)].reverse()) {
      const phone = normalizePhone(match[0]);
      if (phone) return phone;
    }
  }
  return '';
}

function asName(text: string): string {
  const stripped = text
    .replace(PHONE_RE, ' ')
    .replace(EMAIL_RE, ' ')
    .replace(/[,.;:!?()"'״׳-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(NAME_PREFIX_RE, '')
    .trim();
  if (stripped.length < 2 || stripped.length > 40) return '';
  if (stripped.split(' ').length > 4 || /\d/.test(stripped) || NOT_A_NAME.test(stripped)) return '';
  return stripped;
}

/** Best guess at the visitor's name: an explicit "my name is", an answer to a name question, or the text next to the phone. */
export function nameFromTranscript(messages: ChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== 'user') continue;
    const explicit = /(?:שמי|השם שלי(?: הוא)?|קוראים לי|my name is)\s+([^\d,.\n]{2,40})/i.exec(m.text);
    if (explicit) {
      const name = asName(explicit[1]);
      if (name) return name;
    }
    const prev = messages[i - 1];
    const askedForName = prev?.role === 'bot' && /(?:(?:^|[\s,.])שם(?:[\s,.?!:]|$)|השם|שמך|שמכם|איך קוראים|\bname\b)/i.test(prev.text);
    if (askedForName) {
      const name = asName(m.text);
      if (name) return name;
    }
    // "Moshe Levi 050..." : only the comma or line separated part that holds the phone.
    const phoneSegment = m.text.split(/[,\n;]+/).find((part) => new RegExp(PHONE_RE.source).test(part));
    if (phoneSegment) {
      const name = asName(phoneSegment);
      if (name) return name;
    }
  }
  return '';
}

function shortTranscript(messages: ChatMessage[]): string {
  const lines = messages.slice(-6).map((m) => `${m.role === 'user' ? 'פונה' : 'חזקי'}: ${oneLine(m.text).slice(0, 120)}`);
  return lines.join(' | ').slice(0, LEAD_LIMITS.summary);
}

/** The visitor's last message that is about the business, not contact details. */
function lastTopic(messages: ChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== 'user') continue;
    const text = oneLine(m.text.replace(PHONE_RE, ' ').replace(EMAIL_RE, ' '));
    if (text.length >= 15 && !asName(text)) return text.slice(0, LEAD_LIMITS.need);
  }
  return '';
}

export type LeadResult = { lead: Lead; source: 'model' | 'model+transcript' | 'transcript' } | null;

/**
 * Final lead: the model's fields after sanitizing, with name and phone filled from the transcript when
 * the model missed them. Needs a name and a valid phone. Broken optional fields become "לא צוין".
 */
export function buildLead(modelLead: Record<string, unknown> | null, messages: ChatMessage[]): LeadResult {
  const fromModel = sanitizeLead(modelLead);
  const hadModelLead = Boolean(fromModel.name && fromModel.phone);

  const name = fromModel.name || nameFromTranscript(messages);
  const phone = fromModel.phone || phoneFromTranscript(messages);
  if (!name || !phone) return null;

  const email = fromModel.email || (() => {
    for (const m of [...messages].reverse()) {
      if (m.role !== 'user') continue;
      const found = EMAIL_RE.exec(m.text)?.[0] ?? '';
      if (isEmail(found)) return found.slice(0, LEAD_LIMITS.email);
    }
    return '';
  })();

  const lead: Lead = {
    name,
    phone,
    email,
    need: fromModel.need || lastTopic(messages) || NOT_GIVEN,
    summary: fromModel.summary || shortTranscript(messages),
    businessType: fromModel.businessType || NOT_GIVEN,
    size: fromModel.size || NOT_GIVEN,
    currentTools: fromModel.currentTools || NOT_GIVEN,
    pains: fromModel.pains || NOT_GIVEN,
    recommended: fromModel.recommended || NOT_GIVEN,
  };
  const source = hadModelLead ? 'model' : modelLead ? 'model+transcript' : 'transcript';
  return { lead, source };
}
