import { isEmail, ltrBodies, oneLine, rtlBodies, sendToOwner } from './_mail.js';

const LIMITS: Record<string, number> = {
  name: 120,
  phone: 40,
  email: 200,
  service: 200,
  message: 5000,
  page: 200,
};

type Lang = 'he' | 'en';

// The lead email follows the language of the page the form was sent from. A missing lang means Hebrew.
const LABELS: Record<Lang, Record<string, string>> = {
  he: { name: 'שם', phone: 'טלפון', email: 'אימייל', service: 'תחום', message: 'הודעה', page: 'עמוד' },
  en: { name: 'Name', phone: 'Phone', email: 'Email', service: 'Interested in', message: 'Message', page: 'Page' },
};

const MAIL: Record<Lang, { notGiven: string; language: string; fromName: string; subject: (name: string) => string }> = {
  he: {
    notGiven: 'לא צוין',
    language: 'שפה: עברית',
    fromName: 'Tech-shure, טופס יצירת קשר',
    subject: (name) => `פנייה מהאתר: ${name}`,
  },
  en: {
    notGiven: 'Not provided',
    language: 'Language: English',
    fromName: 'Tech-shure, contact form',
    subject: (name) => `Website inquiry (English site): ${name}`,
  },
};

const FIELD_ORDER = ['name', 'phone', 'email', 'service', 'message', 'page'] as const;

type Fields = Record<(typeof FIELD_ORDER)[number], string>;

function json(body: { ok: boolean }, status: number): Response {
  return Response.json(body, { status });
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function readFields(body: unknown): { fields: Fields; lang: Lang } | { error: string } {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'invalid' };
  }
  const record = body as Record<string, unknown>;
  const fields = {} as Fields;
  for (const key of FIELD_ORDER) {
    const value = asString(record[key]);
    if (value.length > LIMITS[key]) return { error: 'invalid' };
    fields[key] = value;
  }
  if (!fields.name || !fields.phone) return { error: 'invalid' };
  if (fields.email && !isEmail(fields.email)) return { error: 'invalid' };
  return { fields, lang: record.lang === 'en' ? 'en' : 'he' };
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 20_000) return json({ ok: false }, 413);
    body = raw ? JSON.parse(raw) : null;
  } catch {
    return json({ ok: false }, 400);
  }

  const parsed = readFields(body);
  if ('error' in parsed) return json({ ok: false }, 400);
  const { fields, lang } = parsed;
  const mail = MAIL[lang];

  const lines = [...FIELD_ORDER.map((key) => `${LABELS[lang][key]}: ${fields[key] || mail.notGiven}`), mail.language];
  const { text, html } = lang === 'en' ? ltrBodies(lines) : rtlBodies(lines);
  const result = await sendToOwner({
    fromName: mail.fromName,
    subject: mail.subject(oneLine(fields.name).slice(0, 80)),
    text,
    html,
    replyTo: fields.email || undefined,
  });

  if (result === 'not-configured') return json({ ok: false }, 500);
  if (result === 'failed') return json({ ok: false }, 502);
  return json({ ok: true }, 200);
}
