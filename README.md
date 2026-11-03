# Tech-Shure טק-שור – אתר

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

Fill in the business details in [`src/data/site.ts`](src/data/site.ts): `phone`, `whatsapp` (digits only, e.g. `972500000000`), `email`, `businessId`.
Once `whatsapp` is set, a floating WhatsApp button appears on every page.

### Contact form

The form posts to `/api/contact`. That Vercel function emails the submission with Resend.

Set these in Vercel → Project → Settings → Environment Variables (do not commit them):

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL` — address that receives each lead

The sender is `onboarding@resend.dev` until a domain is verified. Resend’s sandbox only delivers to the account email.

## Deploy on Vercel

1. vercel.com → **Add New Project** → import `bennyscash1/techshure`.
2. Framework preset **Vite** is detected automatically (`vercel.json` is included, with SPA rewrites so `/ivr` etc. work on refresh).
3. Deploy. Every push to `main` redeploys.

`tech-shure-site.html` is the original static demo, kept for reference.
