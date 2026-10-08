import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { platform, tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const chrome =
  process.env.CHROME_PATH ??
  {
    darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    linux: 'google-chrome',
    win32: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  }[platform()];

function screenshot(file, out, width, height, transparent = false) {
  execFileSync(
    chrome,
    [
      '--headless',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      ...(transparent ? ['--default-background-color=00000000'] : []),
      `--window-size=${width},${height}`,
      `--screenshot=${out}`,
      pathToFileURL(file).href,
    ],
    { stdio: 'ignore' },
  );
  console.log(`${basename(out)}  ${width}x${height}`);
}

screenshot(join(root, 'design/og-image.html'), join(root, 'public/og-image.png'), 1200, 630);

const temp = mkdtempSync(join(tmpdir(), 'codando-icons-'));
const mark = readFileSync(join(root, 'public/favicon.svg'), 'utf8');
// Headless Chrome lays out at least 500px wide whatever the window size, so the
// mark gets a fixed size at the top left instead of filling the viewport.
function icon(size, background, out, transparent = false) {
  const file = join(temp, `icon-${size}.html`);
  writeFileSync(
    file,
    `<!doctype html><style>html,body{margin:0;background:${background}}svg{display:block;width:${size}px;height:${size}px}</style>${mark}`,
  );
  screenshot(file, out, size, size, transparent);
}

// Full bleed: the ink background fills the rounded corners, as iOS applies its own mask.
icon(180, '#0E1423', join(root, 'public/apple-touch-icon.png'));
icon(512, '#0E1423', join(root, 'public/icon-512.png'));
const png32 = join(temp, 'favicon-32.png');
icon(32, 'transparent', png32, true);
const png = readFileSync(png32);
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt8(0, 8);
header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
writeFileSync(join(root, 'public/favicon.ico'), Buffer.concat([header, png]));
console.log('favicon.ico  32x32, the PNG above in an ICO container');

rmSync(temp, { recursive: true, force: true });
