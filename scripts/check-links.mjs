import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';

// Checks every link in the prerendered build: in-page anchors, local files, and external URLs.
const root = resolve(import.meta.dirname, '../dist/codando-site/browser');
const origin = 'https://codando.io';

if (!(await stat(root).catch(() => null))?.isDirectory()) {
  console.error('No build in dist/codando-site/browser. Run `npx ng build` first.');
  process.exit(1);
}

const links = [];
for (const page of (await readdir(root)).filter((name) => name.endsWith('.html'))) {
  const html = await readFile(join(root, page), 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id));
  for (const [, attribute, url] of html.matchAll(/\s(href|src|content)="([^"]*)"/g)) {
    if (attribute === 'content' && !url.startsWith('https://')) continue;
    links.push({ source: page, url, ids });
  }
}
for (const file of ['robots.txt', 'sitemap.xml']) {
  const text = await readFile(join(root, file), 'utf8');
  for (const [url] of text.matchAll(/https:\/\/[^\s<"]+/g)) links.push({ source: file, url });
}

async function localFile(pathname) {
  let file = join(root, decodeURIComponent(pathname));
  if (file !== root && !file.startsWith(root + sep)) return null;
  if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, 'index.html');
  return (await stat(file).catch(() => null))?.isFile() ? file : null;
}

async function check({ url, ids }) {
  if (url.startsWith('#')) {
    return ids.has(url.slice(1)) ? [true, 'anchor'] : [false, 'no element with this id'];
  }
  if (url.startsWith('mailto:')) return [true, 'mailto, not fetched'];
  const target = new URL(url, `${origin}/`);
  if (target.origin === origin) {
    const file = await localFile(target.pathname);
    return file ? [true, `dist${file.slice(root.length)}`] : [false, 'missing file'];
  }
  if (target.protocol !== 'https:') return [false, 'not https'];
  try {
    const response = await fetch(target, {
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
    });
    return [response.ok, `${response.status}${response.redirected ? ` via ${response.url}` : ''}`];
  } catch (error) {
    return [false, error.cause?.code ?? error.name];
  }
}

const unique = [...new Map(links.map((link) => [`${link.source} ${link.url}`, link])).values()];
const results = await Promise.all(unique.map(async (link) => [link, ...(await check(link))]));
for (const [{ source, url }, ok, detail] of results) {
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${source}  ${url}  ${detail}`);
}
const failures = results.filter(([, ok]) => !ok).length;
console.log(`\n${results.length} links, ${failures} failed`);
process.exitCode = failures ? 1 : 0;
