import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

type Handler = (request: Request) => Response | Promise<Response>;

// API routes served during `vite dev`, using the same handlers Vercel runs.
const API_ROUTES: Record<string, string> = {
  '/api/contact': '/api/contact.ts',
  '/api/chat': '/api/chat.ts',
};

function devApi(): Plugin {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split('?')[0] ?? '';
        const file = API_ROUTES[path];
        if (!file) return next();

        const fail = (status: number) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false }));
        };

        try {
          const mod = (await server.ssrLoadModule(file)) as Partial<Record<'GET' | 'POST', Handler>>;
          const method = req.method === 'GET' || req.method === 'POST' ? req.method : null;
          const handler = method ? mod[method] : undefined;
          if (!method || !handler) return fail(405);

          let body: Buffer | undefined;
          if (method === 'POST') {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            }
            body = Buffer.concat(chunks);
          }

          const response = await handler(
            new Request(`http://127.0.0.1${path}`, {
              method,
              headers: {
                'content-type': 'application/json',
                'x-forwarded-for': req.socket.remoteAddress ?? 'local',
              },
              body,
            }),
          );
          res.statusCode = response.status;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (err) {
          console.error(err);
          fail(500);
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Give the dev API the server-side vars from .env files (GEMINI_API_KEY, GMAIL_*, CONTACT_TO_EMAIL).
  // Vars already set in the shell win. None of these reach the browser bundle.
  for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), ''))) {
    if (process.env[key] === undefined) process.env[key] = value;
  }
  return { plugins: [react(), devApi()] };
});
