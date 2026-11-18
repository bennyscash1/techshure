import { isEmail, oneLine, rtlBodies, sendToOwner } from './_mail.js';

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

  const { text, html } = rtlBodies(FIELD_ORDER.map((key) => `${LABELS[key]}: ${fields[key] || 'לא צוין'}`));
  const result = await sendToOwner({
    fromName: 'Tech-Shure, טופס יצירת קשר',
    subject: `פנייה מהאתר: ${oneLine(fields.name).slice(0, 80)}`,
    text,
    html,
    replyTo: fields.email || undefined,
  });

  if (result === 'not-configured') return json({ ok: false }, 500);
  if (result === 'failed') return json({ ok: false }, 502);
  return json({ ok: true }, 200);
}
