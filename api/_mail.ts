// Shared Gmail sender for /api/contact and /api/chat.
// The underscore prefix keeps Vercel from deploying this file as its own function.
import { createTransport } from 'nodemailer';

const SMTP_HOST = 'smtp.gmail.com';
const SMTP_PORT = 465;

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Hebrew lines as plain text and as an RTL HTML body. */
export function rtlBodies(lines: string[]): { text: string; html: string } {
  return {
    text: lines.join('\n'),
    html: `<div dir="rtl">${lines.map((line) => `<p>${escapeHtml(line) || '&nbsp;'}</p>`).join('')}</div>`,
  };
}

type MailConfig = { user: string; pass: string; to: string };

function readConfig(): MailConfig | null {
  const user = process.env.GMAIL_USER?.trim() ?? '';
  // Google shows App Passwords in groups of four; strip the spaces.
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '') ?? '';
  const to = process.env.CONTACT_TO_EMAIL?.trim() ?? '';
  if (!isEmail(user) || !pass || !isEmail(to)) return null;
  return { user, pass, to };
}

export type MailResult = 'sent' | 'not-configured' | 'failed';

/** Sends a message to CONTACT_TO_EMAIL from the GMAIL_USER account. */
export async function sendToOwner(opts: {
  fromName: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}): Promise<MailResult> {
  const config = readConfig();
  if (!config) {
    console.error('Mail is missing GMAIL_USER, GMAIL_APP_PASSWORD or a valid CONTACT_TO_EMAIL');
    return 'not-configured';
  }

  try {
    const transporter = createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: true,
      auth: { user: config.user, pass: config.pass },
    });
    // Gmail only sends as the signed-in account, so "from" is GMAIL_USER.
    await transporter.sendMail({
      from: { name: opts.fromName, address: config.user },
      to: config.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
    });
    return 'sent';
  } catch (err) {
    const info = (typeof err === 'object' && err !== null ? err : {}) as {
      code?: unknown;
      responseCode?: unknown;
    };
    console.error('Gmail SMTP rejected the email', {
      code: info.code ?? null,
      responseCode: info.responseCode ?? null,
      message: err instanceof Error ? err.message : 'unknown',
    });
    return 'failed';
  }
}
