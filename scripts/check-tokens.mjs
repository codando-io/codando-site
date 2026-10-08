#!/usr/bin/env node
// Fails when component styles hold raw visual values instead of design tokens.
//
// Checked: every .css file under src/ (except the tokens file), the `styles` of components in
// .ts files, and `style="..."` attributes in .html templates.
// Rejected: hex, rgb(), hsl() (and the other CSS color functions) anywhere, and raw px in
// spacing, typography, radius and shadow properties. Borders, outlines and sizes may use px
// (hairlines and icon boxes), media queries are not declarations and are not checked.
//
// Usage: node scripts/check-tokens.mjs [root]   (default root: src)

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? 'src');
const TOKENS_FILE = resolve(root, 'styles/tokens.css');

const RAW_COLOR = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i;
const RAW_PX = /(?<![\w.-])\d*\.?\d+px\b/;
const PX_CHECKED_PROPERTY =
  /^(?:margin|padding|gap|row-gap|column-gap|inset|top|right|bottom|left|font-size|font|line-height|letter-spacing|word-spacing|text-indent|border-radius|box-shadow|text-shadow)(?:-|$)|^(?:margin|padding|inset|border)-(?:block|inline)/;
const DECLARATION = /([\w-]+)\s*:\s*([^;{}]*)(?=[;}]|$)/g;

function walk(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) files.push(...walk(path));
    else files.push(path);
  }
  return files;
}

function lineAt(text, index) {
  let line = 1;
  for (let i = 0; i < index; i++) if (text.charCodeAt(i) === 10) line++;
  return line;
}

function stripComments(css) {
  // Keep newlines so line numbers still match the source.
  return css.replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '));
}

/** Style blocks inside a file, each with its offset in the original text. */
function styleBlocks(path, text) {
  if (path.endsWith('.css')) return [{ css: text, offset: 0 }];

  if (path.endsWith('.html')) {
    return [...text.matchAll(/\sstyle="([^"]*)"/g)].map((match) => ({
      css: `x{${match[1]}}`,
      offset: match.index + 6,
    }));
  }

  if (path.endsWith('.ts') && !path.endsWith('.spec.ts')) {
    const blocks = [];
    for (const match of text.matchAll(/\bstyles\s*:\s*/g)) {
      let i = match.index + match[0].length;
      const inArray = text[i] === '[';
      do {
        const start = text.indexOf('`', i);
        if (start === -1) break;
        const end = text.indexOf('`', start + 1);
        if (end === -1) break;
        blocks.push({ css: text.slice(start + 1, end), offset: start + 1 });
        i = end + 1;
        while (/[\s,]/.test(text[i] ?? '')) i++;
      } while (inArray && text[i] === '`');
    }
    return blocks;
  }

  return [];
}

const problems = [];

for (const path of walk(root)) {
  if (resolve(path) === TOKENS_FILE) continue;
  const text = readFileSync(path, 'utf8');
  for (const block of styleBlocks(path, text)) {
    const css = stripComments(block.css);
    for (const match of css.matchAll(DECLARATION)) {
      const property = match[1].toLowerCase();
      const value = match[2];
      const where = `${relative(process.cwd(), path)}:${lineAt(text, block.offset + match.index)}`;
      if (RAW_COLOR.test(value)) {
        problems.push(`${where}  raw color in "${property}: ${value.trim()}"; use a color token`);
      }
      if (PX_CHECKED_PROPERTY.test(property) && RAW_PX.test(value)) {
        problems.push(
          `${where}  raw px in "${property}: ${value.trim()}"; use a spacing/type token`,
        );
      }
    }
  }
}

if (problems.length > 0) {
  console.error(`Design token check failed (${problems.length}):`);
  for (const problem of problems) console.error(`  ${problem}`);
  console.error(`Raw values belong in ${relative(process.cwd(), TOKENS_FILE)}.`);
  process.exit(1);
}

console.log('Design token check passed: no raw colors or px spacing outside the tokens file.');
