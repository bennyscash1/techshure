// Posts a full multi-turn conversation to <base>/api/chat, one turn at a time, and prints each reply and leadSent.
// Usage: node scripts/test-chat-lead.mjs [baseUrl]
//   node scripts/test-chat-lead.mjs http://localhost:5180
//   node scripts/test-chat-lead.mjs https://your-preview.vercel.app
// No secrets here. The server uses its own env vars. A real run sends one lead email to CONTACT_TO_EMAIL.

const base = (process.argv[2] || 'http://localhost:5180').replace(/\/+$/, '');
const url = `${base}/api/chat`;

const visitorTurns = [
  'שלום, יש לי סוכנות ביטוח עם 3 סניפים ואין לי שום מערכת. מה אפשר להציע?',
  'הלקוחות מתקשרים בעיקר בטלפון, והרבה שיחות לא נענות כשאנחנו עסוקים.',
  'כ־8 עובדים, משתמשים רק באקסל ובוואטסאפ רגיל.',
  'נשמע טוב. כן, אשמח שנציג יחזור אליי.',
  'בדיקה טסט',
  '050-1234567',
];

const greeting = 'היי, אני חזקי מ-Tech-shure. איך אפשר לעזור?';
const bad = (text) => /"reply"|"lead"|^\s*[{[]/.test(text ?? '');

const messages = [{ role: 'bot', text: greeting }];
let leadSent = false;
let failed = false;

for (const [i, text] of visitorTurns.entries()) {
  messages.push({ role: 'user', text });
  console.log(`\n[${i + 1}] Visitor: ${text}`);

  let data;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ messages, leadSent, page: '/test-chat-lead' }),
    });
    data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      console.log(`    HTTP ${res.status}, error: ${data.error ?? 'unknown'}`);
      failed = true;
      break;
    }
  } catch (err) {
    console.log(`    Request failed: ${err instanceof Error ? err.message : err}`);
    failed = true;
    break;
  }

  console.log(`    Hezki: ${data.reply}`);
  console.log(`    leadSent: ${data.leadSent}`);
  if (bad(data.reply)) {
    console.log('    PROBLEM: reply contains raw JSON');
    failed = true;
  }
  if (data.leadSent) leadSent = true;
  messages.push({ role: 'bot', text: data.reply });
}

console.log(`\nResult: leadSent=${leadSent}${failed ? ', with problems (see above)' : ''}`);
if (!leadSent) console.log('No lead email was reported as sent. Check the server log for "[chat] Lead mail:".');
process.exit(failed || !leadSent ? 1 : 0);
