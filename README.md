# Codando website

The company website for [Codando](https://codando.io): one page that presents the company, its
products (Prumo, Agora, and Cenaculum), and the technology behind them.

It is an Angular 22 application prerendered to static files at build time
([ADR 0001](docs/adr/0001-prerender-the-site-with-angular.md)). The page is complete HTML without
JavaScript; the bundle hydrates it and draws the leader lines in the hero figure.

## Layout

```
src/index.html             head metadata: title, description, Open Graph, icons, JSON-LD
src/styles/tokens.css      design tokens (colors, spacing, type, strokes, motion), both schemes
src/styles.css             font face, reset, base styles, classes shared by sections
src/app/ui/                catalog: button, status chip, wordmark
src/app/sections/          one component per page section, header, and footer
src/app/content/           the copy rendered in lists, as typed data
public/                    fonts (Schibsted Grotesk and its SIL Open Font License), icons,
                           Open Graph image, robots.txt, sitemap.xml
design/og-image.html       source for the Open Graph image, 1200x630
scripts/                   preview server, link checker, token check, image renderer
```

## Commands

Requires Node 24.18 (`nvm use` reads `.nvmrc`) and npm 11.16, and Google Chrome for
`npm run images`. npm leaves the install scripts of a few build dependencies blocked; the build
and tests do not need them.

```bash
npm ci
npm start                  # dev server, http://localhost:4200
npx ng build               # prerendered site in dist/codando-site/browser/
npm run preview            # serves the build, http://localhost:4322, or set PORT
npx ng test --watch=false  # unit tests
npm run lint:tokens        # rejects raw colors and px spacing outside the tokens file
npx prettier --check .
npm run validate           # html-validate on the built page
npm run check:links        # checks every link in the build; fetches external ones
npm run images             # regenerates the PNG and ICO files in public/
```

`npm run check:links` exits with status 1 if an anchor has no matching id, a local file is
missing, an external URL is not HTTPS, or it does not end in a 2xx response. URLs on
`https://codando.io` resolve to files in the build. It lists `mailto:` links without fetching
them.

## Regenerate the images

Edit `design/og-image.html` or `public/favicon.svg`, then run `npm run images`. The script writes
`og-image.png`, `apple-touch-icon.png`, `icon-512.png`, and `favicon.ico` into `public/`. To use a
Chrome binary outside the default location, set `CHROME_PATH`.

## Deploy

Build, then upload the contents of `dist/codando-site/browser/` to any static host, except
`index.csr.html`: Angular writes that client-rendered fallback, and this site does not use it.

The page loads its bundle and stylesheet by relative URL. Serve unknown paths as 404; a host that
answers them with `index.html` (a single-page-app fallback) would serve that page without its
styles.

Recommended headers:

- `main-*.js` and `styles-*.css`: `Cache-Control: public, max-age=31536000, immutable`. Their
  names change when their content changes.
- Fonts and images: `Cache-Control: public, max-age=86400`. Their names are fixed.
- HTML: `Cache-Control: no-cache`, with ETag validation.

Before launch, create `contact@codando.io` as a Proton Mail address or alias on the domain. The
footer and the structured data link to it.
