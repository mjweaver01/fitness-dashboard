import { join } from 'path';
import { getDashboard } from './endpoints/dashboard';

const PORT = Number(process.env.PORT ?? 3001);
const DIST = join(import.meta.dir, '..', 'dist');

Bun.serve({
  port: PORT,
  async fetch(req) {
    const { pathname } = new URL(req.url);

    if (pathname === '/api/dashboard') return getDashboard();

    // Static SPA — only exists after `bun run build`; dev uses Vite + proxy
    const asset = Bun.file(join(DIST, pathname === '/' ? 'index.html' : pathname));
    if (await asset.exists()) return new Response(asset);
    return new Response(Bun.file(join(DIST, 'index.html')));
  },
});

console.log(`api listening on http://localhost:${PORT}`);
