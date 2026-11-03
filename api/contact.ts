import { randomUUID } from 'node:crypto';
import { Resend } from 'resend';

const FROM = 'onboarding@resend.dev';

const LIMITS: Record<string, number> = {
  name: 120,
  phone: 40,
  email: 200,
  service: 200,
  message: 5000,
  page: 200,
};

const LABELS: Record<string, string> = {
  name: 'שם',
  phone: 'טלפון',
  email: 'אימייל',
  service: 'תחום',
  message: 'הודעה',
  page: 'עמוד',
};

const FIELD_ORDER = ['name', 'phone', 'email', 'service', 'message', 'page'] as const;

type Fields = Record<(typeof FIELD_ORDER)[number], string>;

function json(body: { ok: boolean }, status: number): Response {
  return Response.json(body, { status });
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function readFields(body: unknown): { fields: Fields } | { error: string } {
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
  return { fields };
}

function emailBodies(fields: Fields): { text: string; html: string } {
  const lines = FIELD_ORDER.map((key) => `${LABELS[key]}: ${fields[key] || '—'}`);
  const text = lines.join('\n');
  const html = `<div dir="rtl">${lines
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('')}</div>`;
  return { text, html };
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
  const { fields } = parsed;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL?.trim() ?? '';
  if (!apiKey || !isEmail(to)) {
    console.error('Contact form is missing RESEND_API_KEY or a valid CONTACT_TO_EMAIL');
    return json({ ok: false }, 500);
  }

  const { text, html } = emailBodies(fields);
  const subject = `פנייה מהאתר – ${oneLine(fields.name).slice(0, 80)}`;
  const idempotencyKey = `contact-form/${randomUUID()}`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send(
      {
        from: FROM,
        to: [to],
        subject,
        text,
        html,
        ...(fields.email ? { replyTo: fields.email } : {}),
      },
      { idempotencyKey },
    );
    if (error) {
      console.error('Resend rejected the contact email', {
        status: error.statusCode,
        message: error.message,
      });
      return json({ ok: false }, 502);
    }
  } catch (err) {
    const status = typeof err === 'object' && err !== null && 'statusCode' in err ? err.statusCode : null;
    const message = err instanceof Error ? err.message : 'unknown';
    console.error('Resend request failed', { status, message });
    return json({ ok: false }, 502);
  }

  return json({ ok: true }, 200);
}
