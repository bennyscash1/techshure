# Tech-shure: אתר

Landing site for Tech-Shure: React + TypeScript + Vite, RTL Hebrew, responsive for desktop and mobile.

Pages: `/` (home), `/web`, `/automation`, `/ivr`, `/consulting`.

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the build
```

## Before going live

Fill in the business details in [`src/data/site.ts`](src/data/site.ts): `phone`, `whatsapp` (digits only, e.g. `972500000000`), `email`, and `businessId` (in `CONTACT_TEXT`, once per language).
Once `whatsapp` is set, a floating WhatsApp button appears on every page.

## Languages

Hebrew is the default and lives at the existing paths (`/`, `/solutions`, ...). English mirrors every page under `/en`
(`/en`, `/en/solutions/crm-erp?tab=faq`, ...). There is no browser-language redirect; the header links to the same page in the other language.

- UI strings: [`src/i18n/he.ts`](src/i18n/he.ts) and [`src/i18n/en.ts`](src/i18n/en.ts). TypeScript requires `en` to have every key of `he`.
- Product content: `src/data/solutions.he.ts` / `solutions.en.ts` and `src/data/offer.he.ts` / `offer.en.ts`.
- Components read the language with `useLang()` (`t` for strings, `lp()` to localize a path). `useSeo()` sets the title, description, Open Graph, canonical and hreflang tags.
- The chat sends `lang: "en"` from English pages; the English bot prompt is in `api/_chat-prompt-en.ts`. Test it with `node scripts/test-chat-prompt.mjs`.
- `public/sitemap.xml` lists both languages; add new pages there too.

### Contact form

The form posts to `/api/contact`. That Vercel function emails the submission with Resend.

Set these in Vercel → Project → Settings → Environment Variables (do not commit them):

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`: address that receives each lead

The sender is `onboarding@resend.dev` until a domain is verified. Resend’s sandbox only delivers to the account email.

## Deploy on Vercel

1. vercel.com → **Add New Project** → import `bennyscash1/techshure`.
2. Framework preset **Vite** is detected automatically (`vercel.json` is included, with SPA rewrites so `/ivr` etc. work on refresh).
3. Deploy. Every push to `main` redeploys.

`tech-shure-site.html` is the original static demo, kept for reference.
