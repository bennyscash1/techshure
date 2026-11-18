// Website chat with Hezki, backed by Google Gemini.
// Env: GEMINI_API_KEY (required for the chat; any format Google issues, sent in the x-goog-api-key header),
// GEMINI_MODEL (optional, defaults to DEFAULT_MODEL below),
// plus GMAIL_USER, GMAIL_APP_PASSWORD and CONTACT_TO_EMAIL for lead emails (same as /api/contact).
import { SYSTEM_PROMPT } from './_chat-prompt.js';
import { buildLead, LEAD_LIMITS, looksLikeJson, parseModelOutput, type ChatMessage, type Lead } from './_chat-lead.js';
import { oneLine, rtlBodies, sendToOwner, type MailResult } from './_mail.js';

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

// Friendly fixed replies for when the model's reply cannot be recovered. The visitor never sees raw JSON.
const REPLY_LEAD_THANKS = 'תודה! קיבלתי את הפרטים, נציג מ-Tech-shure יחזור אליך בהקדם.';
const REPLY_RETRY = 'סליחה, משהו השתבש אצלי. אפשר לכתוב שוב?';
const REPLY_MAIL_FAILED = 'אופס, לא הצלחתי להעביר את הפרטים כרגע. אפשר להתקשר אלינו או לכתוב בוואטסאפ, ונחזור אליך.';

// Same visitor resending after a lost response: don't email the same phone twice from a warm instance.
const LEAD_DEDUPE_MS = 30 * 60_000;
const recentLeads = new Map<string, number>();
function alreadyEmailed(phone: string): boolean {
  const now = Date.now();
  for (const [key, at] of recentLeads) if (now - at > LEAD_DEDUPE_MS) recentLeads.delete(key);
  return recentLeads.has(phone);
}

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

const short = (description: string, max: number) => ({ type: 'STRING', description: `${description} Max ${max} chars.` });

// reply comes first so a cut-off answer still carries it; the long summary comes last.
const LEAD_ORDER = ['name', 'phone', 'email', 'need', 'businessType', 'size', 'currentTools', 'pains', 'recommended', 'summary'];
const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    reply: short('Text shown to the visitor, 2 to 4 short sentences.', 700),
    lead: {
      type: 'OBJECT',
      nullable: true,
      description: 'Only when the visitor wrote a name and a phone number. Otherwise null.',
      properties: {
        name: short('Visitor name as written.', LEAD_LIMITS.name),
        phone: short('Phone digits as written, 9 to 10 digits.', LEAD_LIMITS.phone),
        email: short('Email or empty string.', LEAD_LIMITS.email),
        need: short('The need in one line.', LEAD_LIMITS.need),
        businessType: short('Business type, or לא צוין.', LEAD_LIMITS.businessType),
        size: short('Size: branches or employees, or לא צוין. A few words only.', LEAD_LIMITS.size),
        currentTools: short('Tools used today, or לא צוין.', LEAD_LIMITS.currentTools),
        pains: short('Pains that came up.', LEAD_LIMITS.pains),
        recommended: short('Products recommended with launch prices.', LEAD_LIMITS.recommended),
        summary: short('Summary for the rep, 3 to 5 sentences.', LEAD_LIMITS.summary),
      },
      required: ['name', 'phone', 'need', 'summary'],
      propertyOrdering: LEAD_ORDER,
    },
  },
  required: ['reply'],
  propertyOrdering: ['reply', 'lead'],
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

async function askGemini(
  key: string,
  messages: ChatMessage[],
  leadSent: boolean,
): Promise<{ reply: string; lead: Record<string, unknown> | null }> {
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
    temperature: 0.4,
    maxOutputTokens: 1024,
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
    candidates?: { finishReason?: string; content?: { parts?: { text?: string; thought?: boolean }[] } }[];
  };
  const candidate = data.candidates?.[0];
  const raw = (candidate?.content?.parts ?? [])
    .filter((p) => !p.thought && typeof p.text === 'string')
    .map((p) => p.text)
    .join('');

  const parsed = parseModelOutput(raw);
  if (parsed.mode !== 'json' || (candidate?.finishReason && candidate.finishReason !== 'STOP')) {
    console.warn(
      `[chat] Model output needed recovery: parse=${parsed.mode}, finishReason=${candidate?.finishReason ?? 'none'}, ` +
        `length=${raw.length}, reply recovered=${Boolean(parsed.reply)}, lead fields=${parsed.lead ? Object.keys(parsed.lead).length : 0}`,
    );
  }
  return { reply: parsed.reply, lead: parsed.lead };
}

/** Emails the lead to CONTACT_TO_EMAIL through the same Gmail pipeline as the contact form. */
async function sendLeadEmail(lead: Lead, messages: ChatMessage[], page: string): Promise<MailResult> {
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
  return sendToOwner({
    fromName: 'Tech-shure, צ׳אט באתר',
    subject: `ליד מהצ׳אט: ${lead.name.slice(0, 80)}`,
    text,
    html,
    replyTo: lead.email || undefined,
  });
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

  let answer: { reply: string; lead: Record<string, unknown> | null };
  try {
    answer = await askGemini(key, messages, leadSent);
  } catch (err) {
    logGeminiFailure(err);
    // Model, quota and server errors (404, 429, 5xx) are upstream failures, never reported as a key problem.
    return json({ ok: false, error: 'upstream' }, 502);
  }

  // The lead comes from the model when it is usable, otherwise from the name and phone in the transcript.
  const built = leadSent ? null : buildLead(answer.lead, messages);

  let reply = answer.reply.trim();
  if (!reply || looksLikeJson(reply)) reply = built ? REPLY_LEAD_THANKS : REPLY_RETRY;

  // Exactly one email per conversation: the client's leadSent flag, plus a per-instance phone check.
  let sentNow = false;
  if (built) {
    if (alreadyEmailed(built.lead.phone)) {
      console.info(`[chat] Lead mail: skipped, already sent for this phone (source: ${built.source})`);
      sentNow = true;
    } else {
      const result = await sendLeadEmail(built.lead, messages, page);
      // await sendLeadToWhatsApp(built.lead);
      console.info(`[chat] Lead mail: ${result} (source: ${built.source})`);
      if (result === 'sent') {
        recentLeads.set(built.lead.phone, Date.now());
        sentNow = true;
      } else {
        reply = `${reply}\n\n${REPLY_MAIL_FAILED}`;
      }
    }
  }

  reply = noDashes(reply);
  if (!reply || looksLikeJson(reply)) reply = REPLY_RETRY;
  return json({ ok: true, reply, leadSent: leadSent || sentNow });
}
