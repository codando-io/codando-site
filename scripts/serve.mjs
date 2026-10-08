import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';

// Serves the production build as a static host would, to check it before deploying.
const root = resolve(import.meta.dirname, '../dist/codando-site/browser');
const port = Number(process.env.PORT ?? 4322);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

async function resolveFile(urlPath) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(urlPath, 'http://x').pathname);
  } catch {
    return null;
  }
  let file = join(root, pathname);
  if (file !== root && !file.startsWith(root + sep)) return null;
  if ((await stat(file).catch(() => null))?.isDirectory()) {
    file = join(file, 'index.html');
  }
  return (await stat(file).catch(() => null))?.isFile() ? file : null;
}

createServer(async (req, res) => {
  const file = await resolveFile(req.url);
  const body = file && (await readFile(file).catch(() => null));
  if (!body) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found\n');
    return;
  }
  res.writeHead(200, {
    'Content-Type': types[extname(file)] ?? 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });
  res.end(req.method === 'HEAD' ? undefined : body);
}).listen(port, () => {
  console.log(`Serving dist/codando-site/browser/ at http://localhost:${port}`);
});
