// Unit test for the chat prompt builder and the language handling of leads (change requests 25 and 26). No network, no email.
// Usage: node scripts/test-chat-prompt.mjs
// Bundles the TypeScript sources with esbuild (installed with vite) into a temp file, then checks them.
import { build } from 'esbuild';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const dir = mkdtempSync(join(tmpdir(), 'chat-prompt-test-'));
const outfile = join(dir, 'bundle.mjs');
await build({
  stdin: {
    contents: `export * from './api/_chat-prompt.ts'; export { buildLead, NOT_GIVEN } from './api/_chat-lead.ts';`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile,
  logLevel: 'error',
});
const m = await import(pathToFileURL(outfile).href);
rmSync(dir, { recursive: true, force: true });

let failed = 0;
const check = (name, ok) => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
};

const he = m.buildSystemPrompt('he');
const en = m.buildSystemPrompt('en');
const HEB = /[א-ת]/;
const DASH = /[–—]/;

check('missing or unknown lang means Hebrew', m.chatLang(undefined) === 'he' && m.chatLang('fr') === 'he' && m.chatLang('he') === 'he');
check('lang "en" is English', m.chatLang('en') === 'en');
check('Hebrew prompt is unchanged (same as SYSTEM_PROMPT)', he === m.SYSTEM_PROMPT);
check('Hebrew lead-sent note is unchanged', m.buildSystemPrompt('he', true) === `${m.SYSTEM_PROMPT}\n\nהערה: הפרטים של הפונה כבר הועברו לבעל העסק. אל תמלא lead שוב.`);
check('English prompt is a different, English prompt', en !== he && en.startsWith('You are Hezki'));
check('English prompt has no Hebrew letters', !HEB.test(en));
check('English lead-sent note is English', m.buildSystemPrompt('en', true).endsWith('Do not fill lead again.') && !HEB.test(m.buildSystemPrompt('en', true)));
check('no long dashes in either prompt', !DASH.test(en) && !DASH.test(he));
check('English prompt answers in English', /Natural, warm, everyday English/.test(en));
check('English prompt keeps the brand rule', /always write Tech-shure, exactly like that/.test(en));
// Change request 26: the English bot quotes exactly the same shekel amounts as the Hebrew bot ("₪2,500" vs "2,500 ₪").
const shekels = (text, re) => [...text.matchAll(re)].map((x) => Number(x[1].replace(/,/g, ''))).sort((a, b) => a - b);
const heAmounts = shekels(he, /(\d{1,3}(?:,\d{3})*)\s*₪/g);
const enAmounts = shekels(en, /₪(\d{1,3}(?:,\d{3})*)/g);
check(`English prompt quotes the same shekel amounts as Hebrew (${[...new Set(heAmounts)].join(', ')})`, heAmounts.length > 0 && JSON.stringify(heAmounts) === JSON.stringify(enAmounts));
check('English prompt writes amounts as "₪399" (symbol first), never "399 ₪"', !/\d\s*₪/.test(en) && en.includes('₪399 a month'));
check('English prompt: no dollars', !/\$\s?\d|USD|dollar/i.test(en));
check('English prompt: the AI session is ₪499, one-time and not a launch price', en.includes('consulting session for ₪499') && en.includes('Never call ₪499 a "launch price"'));
check('English prompt: launch price rule', en.includes('These are limited-time launch prices.') && en.includes('Never quote a regular or future price'));
check('English prompt: special pricing for several packages', /special pricing when (you )?choos(e|ing) several packages/i.test(en));
check('English prompt: phone and WhatsApp in +972 format only', en.includes('Phone: +972-74-705-4942') && en.includes('WhatsApp: +972-52-656-5024') && !/\b0\d{1,2}-?\d{7}\b|\b0\d{1,2}-\d{3}-\d{4}\b/.test(en));
check('English prompt: active 24/7', en.includes('active 24/7'));
check('English prompt: Shabbat only in the "never mention" rule', (en.match(/Shabbat/g) ?? []).length === 1 && /Never mention: Shabbat/.test(en));
check('English prompt: "cheap" only in the rule that forbids it', en.split('\n').filter((l) => /cheap/i.test(l)).every((l) => l.startsWith('- Never use the words')));
check('English prompt links to the English pages', en.includes('/en/solutions/ai-consulting') && en.includes('/en/modules') && !/[^n]\/solutions\//.test(en.replace(/\/en\/solutions\//g, '')));
check('English prompt uses the English address and hours', en.includes('9 Jabotinsky St., Bnei Brak') && en.includes('9:00 to 17:00'));
check('Hebrew prompt quotes the monthly-only prices', he.includes('399 ₪ לחודש') && !/הקמה \d/.test(he));
check('Neither prompt quotes a setup amount', !/setup ₪\d/.test(en));

// Leads: language of the "not given" word and of the transcript fallback.
const msgs = [
  { role: 'bot', text: "Hi, I'm Hezki." },
  { role: 'user', text: 'I run a dental clinic with two branches and we miss a lot of calls.' },
  { role: 'bot', text: "What's your full name?" },
  { role: 'user', text: 'Dana Cohen' },
  { role: 'user', text: '050-1234567' },
];
const leadEn = m.buildLead(null, msgs, 'en');
check('English lead from transcript: name and phone', leadEn?.lead.name === 'Dana Cohen' && leadEn?.lead.phone === '0501234567');
check('English lead uses "Not provided" and English transcript labels', leadEn?.lead.size === 'Not provided' && leadEn.lead.summary.startsWith('Hezki:') && !HEB.test(JSON.stringify(leadEn.lead)));
const leadHe = m.buildLead(null, msgs);
check('Hebrew lead (no lang) keeps "לא צוין" and Hebrew labels', leadHe?.lead.size === m.NOT_GIVEN && leadHe.lead.summary.startsWith('חזקי:'));
const leadModel = m.buildLead({ name: 'Dana Cohen', phone: '0501234567', need: 'Phone answering', summary: 'x'.repeat(10), size: 'abababababababab' }, msgs, 'en');
check('English lead: a runaway field becomes "Not provided", not Hebrew', leadModel?.lead.size === 'Not provided');

console.log(failed ? `\n${failed} failed` : '\nAll passed');
process.exit(failed ? 1 : 0);
