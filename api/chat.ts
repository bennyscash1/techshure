// Website chat with Hezki, backed by Google Gemini.
// Env: GEMINI_API_KEY (required for the chat; any format Google issues, sent in the x-goog-api-key header),
// GEMINI_MODEL (optional, defaults to DEFAULT_MODEL below),
// plus GMAIL_USER, GMAIL_APP_PASSWORD and CONTACT_TO_EMAIL for lead emails (same as /api/contact).
import { SYSTEM_PROMPT } from './_chat-prompt.js';
import { isEmail, oneLine, rtlBodies, sendToOwner } from './_mail.js';

// gemini-2.5-flash now returns 404 "no longer available to new users", so default to 3.5 Flash Lite.
const DEFAULT_MODEL = 'gemini-3.5-flash-lite';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

// Abuse limits. The client enforces the same numbers so visitors see a friendly message first.
const MAX_MESSAGE_CHARS = 600;
const MAX_USER_TURNS = 20;
const MAX_BOT_CHARS = 2_000;
const MAX_BODY_CHARS = 60_000;
const RATE_WINDOW_MS = 10 * 60_000;
const RATE_MAX_REQUESTS = 40;

type Role = 'user' | 'bot';
type ChatMessage = { role: Role; text: string };
type Lead = {
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

type ChatReply = {
  ok: boolean;
  reply?: string;
  leadSent?: boolean;
  error?: 'disabled' | 'invalid' | 'too-long' | 'turn-limit' | 'rate-limit' | 'upstream';
};

function json(body: ChatReply | { enabled: boolean; maxChars: number; maxTurns: number }, status = 200): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function apiKey(): string {
  return process.env.GEMINI_API_KEY?.trim() ?? '';
}

/** Never show long dashes on the site, even if the model slips one in. */
function noDashes(text: string): string {
  return text.replace(/\s*[–—]\s*/g, ', ').replace(/,\s*,/g, ',').trim();
}

// Best effort, per warm instance. Good enough to stop a single noisy client.
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear();
  return recent.length > RATE_MAX_REQUESTS;
}

function readMessages(body: unknown): { messages: ChatMessage[]; leadSent: boolean } | { error: ChatReply['error'] } {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'invalid' };
  const record = body as { messages?: unknown; leadSent?: unknown };
  if (!Array.isArray(record.messages) || record.messages.length === 0) return { error: 'invalid' };

  const messages: ChatMessage[] = [];
  for (const item of record.messages) {
    if (!item || typeof item !== 'object') return { error: 'invalid' };
    const { role, text } = item as { role?: unknown; text?: unknown };
    if ((role !== 'user' && role !== 'bot') || typeof text !== 'string') return { error: 'invalid' };
    const trimmed = text.trim();
    if (!trimmed) continue;
    if (role === 'user' && trimmed.length > MAX_MESSAGE_CHARS) return { error: 'too-long' };
    messages.push({ role, text: role === 'bot' ? trimmed.slice(0, MAX_BOT_CHARS) : trimmed });
  }

  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') return { error: 'invalid' };
  if (messages.filter((m) => m.role === 'user').length > MAX_USER_TURNS) return { error: 'turn-limit' };
  return { messages, leadSent: record.leadSent === true };
}

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    reply: { type: 'STRING' },
    lead: {
      type: 'OBJECT',
      nullable: true,
      properties: {
        name: { type: 'STRING' },
        phone: { type: 'STRING' },
        email: { type: 'STRING' },
        need: { type: 'STRING' },
        businessType: { type: 'STRING' },
        size: { type: 'STRING' },
        currentTools: { type: 'STRING' },
        pains: { type: 'STRING' },
        recommended: { type: 'STRING' },
        summary: { type: 'STRING' },
      },
      required: ['name', 'phone', 'need', 'summary'],
    },
  },
  required: ['reply'],
};

class GeminiError extends Error {
  constructor(readonly status: number, readonly model: string, readonly googleMessage: string) {
    super(`Gemini ${status} (model ${model}): ${googleMessage}`);
  }
}

/** Pulls Google's own error message out of the response body, falling back to the raw text. */
function googleErrorMessage(body: string): string {
  try {
    const parsed = JSON.parse(body) as { error?: { message?: unknown; status?: unknown } };
    const msg = typeof parsed.error?.message === 'string' ? parsed.error.message : '';
    const status = typeof parsed.error?.status === 'string' ? parsed.error.status : '';
    if (msg) return (status ? `${status}: ${msg}` : msg).slice(0, 500);
  } catch {
    // not JSON
  }
  return body.trim().slice(0, 500) || 'no details';
}

/** Server console line that says what kind of failure it was, so a model problem never reads as a key problem. */
function logGeminiFailure(err: unknown): void {
  if (!(err instanceof GeminiError)) {
    const detail = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error(`[chat] Gemini request failed before a response (network or timeout): ${detail}`);
    return;
  }
  const kind =
    err.status === 404
      ? 'MODEL NOT FOUND / NOT AVAILABLE. Set GEMINI_MODEL to a model this key can use'
      : err.status === 429
        ? 'QUOTA OR RATE LIMIT at Google'
        : err.status >= 500
          ? 'GOOGLE SERVER ERROR'
          : err.status === 401 || err.status === 403
            ? 'REQUEST REJECTED (key or permissions), see Google message'
            : 'REQUEST ERROR';
  console.error(`[chat] Gemini HTTP ${err.status}, ${kind}. Model: ${err.model}. Google says: ${err.googleMessage}`);
}

async function askGemini(key: string, messages: ChatMessage[], leadSent: boolean): Promise<{ reply: string; lead: Lead | null }> {
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  // Gemini wants the conversation to open with the user and alternate roles, so the site greeting
  // is dropped and back to back messages from the same side (after a failed send) are merged.
  const contents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
  for (const m of messages) {
    const role = m.role === 'user' ? 'user' : 'model';
    const last = contents[contents.length - 1];
    if (!last && role === 'model') continue;
    if (last?.role === role) last.parts[0].text += `\n${m.text}`;
    else contents.push({ role, parts: [{ text: m.text }] });
  }
  const system = leadSent ? `${SYSTEM_PROMPT}\n\nהערה: הפרטים של הפונה כבר הועברו לבעל העסק. אל תמלא lead שוב.` : SYSTEM_PROMPT;

  const generationConfig: Record<string, unknown> = {
    temperature: 0.6,
    maxOutputTokens: 800,
    responseMimeType: 'application/json',
    responseSchema: RESPONSE_SCHEMA,
  };
  // 2.5 Flash models think by default; a short chat reply does not need it.
  if (/2\.5-flash/.test(model)) generationConfig.thinkingConfig = { thinkingBudget: 0 };

  const res = await fetch(`${GEMINI_URL}/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents, generationConfig }),
    signal: AbortSignal.timeout(25_000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new GeminiError(res.status, model, googleErrorMessage(body));
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[];
  };
  const raw = (data.candidates?.[0]?.content?.parts ?? [])
    .filter((p) => !p.thought && typeof p.text === 'string')
    .map((p) => p.text)
    .join('');

  let parsed: { reply?: unknown; lead?: unknown };
  try {
    parsed = JSON.parse(raw) as typeof parsed;
  } catch {
    // Fall back to plain text if the model ignored the JSON format.
    return { reply: raw, lead: null };
  }

  const reply = typeof parsed.reply === 'string' ? parsed.reply : '';
  return { reply, lead: readLead(parsed.lead) };
}

function readLead(value: unknown): Lead | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;
  const str = (k: string, max: number) => (typeof v[k] === 'string' ? oneLine(v[k] as string).slice(0, max) : '');
  const lead: Lead = {
    name: str('name', 120),
    phone: str('phone', 40),
    email: str('email', 200),
    need: str('need', 600),
    summary: typeof v.summary === 'string' ? (v.summary as string).trim().slice(0, 2_000) : '',
    businessType: str('businessType', 200),
    size: str('size', 200),
    currentTools: str('currentTools', 400),
    pains: str('pains', 600),
    recommended: str('recommended', 800),
  };
  const digits = lead.phone.replace(/\D/g, '');
  if (!lead.name || digits.length < 9 || digits.length > 15 || !lead.need) return null;
  if (lead.email && !isEmail(lead.email)) lead.email = '';
  return lead;
}

/** Emails the lead to CONTACT_TO_EMAIL through the same Gmail pipeline as the contact form. */
async function sendLeadEmail(lead: Lead, messages: ChatMessage[], page: string): Promise<boolean> {
  const transcript = messages.map((m) => `${m.role === 'user' ? 'פונה' : 'חזקי'}: ${oneLine(m.text)}`);
  const { text, html } = rtlBodies([
    `שם: ${lead.name}`,
    `טלפון: ${lead.phone}`,
    `אימייל: ${lead.email || 'לא צוין'}`,
    `צורך: ${lead.need}`,
    `עמוד: ${page || 'לא ידוע'}`,
    '',
    'פרופיל העסק:',
    `סוג העסק: ${lead.businessType || 'לא צוין'}`,
    `גודל: ${lead.size || 'לא צוין'}`,
    `כלים היום: ${lead.currentTools || 'לא צוין'}`,
    `כאבים: ${lead.pains || 'לא צוין'}`,
    `המלצות ורעיונות שעלו: ${lead.recommended || 'לא צוין'}`,
    '',
    'סיכום השיחה:',
    lead.summary || 'אין סיכום',
    '',
    'השיחה המלאה:',
    ...transcript,
  ]);
  const result = await sendToOwner({
    fromName: 'Tech-Shure, צ׳אט באתר',
    subject: `ליד מהצ׳אט: ${lead.name.slice(0, 80)}`,
    text,
    html,
    replyTo: lead.email || undefined,
  });
  return result === 'sent';
}

/*
 * WhatsApp delivery hook, for later.
 * Call this next to sendLeadEmail once a WhatsApp sender is chosen (for example the
 * WhatsApp Cloud API, or the business bot's own webhook). Keep tokens in env vars.
 *
 * async function sendLeadToWhatsApp(lead: Lead): Promise<boolean> {
 *   const url = process.env.WHATSAPP_LEAD_WEBHOOK_URL;   // e.g. the bot's webhook
 *   const token = process.env.WHATSAPP_LEAD_TOKEN;
 *   if (!url || !token) return false;
 *   const res = await fetch(url, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
 *     body: JSON.stringify({
 *       text: `ליד חדש מהצ׳אט\nשם: ${lead.name}\nטלפון: ${lead.phone}\nצורך: ${lead.need}\n\n${lead.summary}`,
 *     }),
 *   });
 *   return res.ok;
 * }
 */

/** Lets the site know whether the chat is configured, without exposing anything else. */
export function GET(): Response {
  return json({ enabled: Boolean(apiKey()), maxChars: MAX_MESSAGE_CHARS, maxTurns: MAX_USER_TURNS });
}

export async function POST(request: Request): Promise<Response> {
  const key = apiKey();
  if (!key) return json({ ok: false, error: 'disabled' }, 503);

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (rateLimited(ip)) return json({ ok: false, error: 'rate-limit' }, 429);

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_CHARS) return json({ ok: false, error: 'too-long' }, 413);
    body = raw ? JSON.parse(raw) : null;
  } catch {
    return json({ ok: false, error: 'invalid' }, 400);
  }

  const parsed = readMessages(body);
  if ('error' in parsed) return json({ ok: false, error: parsed.error }, parsed.error === 'turn-limit' ? 429 : 400);
  const { messages, leadSent } = parsed;
  const page = typeof (body as { page?: unknown }).page === 'string' ? oneLine((body as { page: string }).page).slice(0, 200) : '';

  let answer: { reply: string; lead: Lead | null };
  try {
    answer = await askGemini(key, messages, leadSent);
  } catch (err) {
    logGeminiFailure(err);
    // Model, quota and server errors (404, 429, 5xx) are upstream failures, never reported as a key problem.
    return json({ ok: false, error: 'upstream' }, 502);
  }

  let sentNow = false;
  if (answer.lead && !leadSent) {
    sentNow = await sendLeadEmail(answer.lead, messages, page);
    // await sendLeadToWhatsApp(answer.lead);
    if (!sentNow) {
      answer.reply = `${answer.reply}\n\nאופס, לא הצלחתי להעביר את הפרטים כרגע. אפשר להתקשר אלינו או לכתוב בוואטסאפ, ונחזור אליך.`;
    }
  }

  const reply = noDashes(answer.reply) || 'סליחה, לא הבנתי. אפשר לנסח שוב?';
  return json({ ok: true, reply, leadSent: leadSent || sentNow });
}
