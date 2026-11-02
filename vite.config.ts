import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/** Serves /api/contact during `vite dev`, using the same handler Vercel runs. */
function contactApi(): Plugin {
  return {
    name: 'contact-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split('?')[0];
        if (path !== '/api/contact') return next();
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false }));
          return;
        }
        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          }
          const { POST } = (await server.ssrLoadModule('/api/contact.ts')) as {
            POST: (request: Request) => Promise<Response>;
          };
          const response = await POST(
            new Request('http://127.0.0.1/api/contact', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: Buffer.concat(chunks),
            }),
          );
          res.statusCode = response.status;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (err) {
          console.error(err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), contactApi()],
});
