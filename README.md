# ShureTech טק-שור – אתר

Landing site for ShureTech (Tek-Shur): React + TypeScript + Vite, RTL Hebrew, responsive for desktop and mobile.

Pages: `/` (home), `/web`, `/automation`, `/ivr`.

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

- Set `VITE_FORM_ENDPOINT` (Vercel → Project → Settings → Environment Variables) to any URL that accepts a JSON POST (Formspree, Make, n8n, Zapier webhook…).
- Without it, submitting the form opens WhatsApp (or email) with the details pre-filled.

## Deploy on Vercel

1. vercel.com → **Add New Project** → import `bennyscash1/techshure`.
2. Framework preset **Vite** is detected automatically (`vercel.json` is included, with SPA rewrites so `/ivr` etc. work on refresh).
3. Deploy. Every push to `main` redeploys.

`ShureTech-site.html` is the original static demo, kept for reference.
