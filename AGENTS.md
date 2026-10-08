# Codando website

The company website for Codando, served at <https://codando.io>: one English page that presents
the company, its products (Prumo, Agora, and Cenaculum), and the technology behind them. Visitors
are people who want to know what Codando builds. What matters most: the copy is accurate (no
claim the products do not support), the page is complete as prerendered HTML for search engines
and link previews, and it stays fast and accessible.

This repository uses the engineering harness. Harness configuration, project overrides, and
project memory live in `.engineering/`. Decisions live in the ADR directory declared in
`.engineering/harness.yaml` (`adr_dir`).

## Commands

Verified on 2026-10-08 (macOS, Node 24.18, npm 11.16, Google Chrome). Run from the repository
root, after `nvm use` (`.nvmrc` pins Node 24.18.0; `package.json` requires 22.22 or 24.13 and
later, as Angular 22 does).

| Purpose             | Command                                                                         |
| ------------------- | ------------------------------------------------------------------------------- |
| Restore             | `npm ci`                                                                        |
| Build               | `npx ng build` (prerenders to `dist/codando-site/browser/`)                     |
| Fast tests          | `npx ng test --watch=false --include <spec path>`                               |
| Full tests          | `npx ng test --watch=false`                                                     |
| Run locally         | `npm start` (dev server, port 4200); `npm run preview` (the build, port 4322)   |
| Lint / format check | `npx prettier --check .` and `npm run lint:tokens`                              |
| Built page checks   | `npm run validate` (html-validate) and `npm run check:links`, after a build     |
| Images              | `npm run images` (headless Chrome; rewrites the PNG and ICO files in `public/`) |

`npm` 11 blocks dependency install scripts (`@parcel/watcher`, `esbuild`, `fsevents`, `lmdb`,
`msgpackr-extract`); build and tests pass without them, so do not approve them.
`npm run check:links` fetches the external product links over the network.

## Architecture

An Angular 22 application (standalone, zoneless, OnPush by default) with no router, built with
`@angular/build:application` and `outputMode: "static"` (ADR 0001): the build renders the page in
Node (`src/main.server.ts`, `src/app/app.config.server.ts`, server route `'**'` prerendered in
`src/app/app.routes.server.ts`) and writes plain files. No server ships. The browser bundle
hydrates the prerendered HTML.

- `src/index.html`: the whole head (title, description, canonical, Open Graph, icons, font
  preload, JSON-LD) and a one-line script that marks the first rendered frame
  (`data-painted` on `<html>`). Angular adds the stylesheet and the bundle.
- `src/app/app.html`: skip link, header, the five sections in `main`, footer.
- `src/app/sections/<name>/`: one component per section (`site-header`, `hero`, `products`,
  `prumo-feature`, `technology`, `about`, `site-footer`), with child components in subfolders
  (`products/prumo-panel`, `products/product-entry`, `prumo-feature/relationship-diagram`,
  `prumo-feature/pipeline`) and the hero's `trace-figure`.
- `src/app/content/`: the copy rendered in lists, as typed constants (products, pipeline stages,
  technology concepts and stack, the trace figure's fields and records, section links). One-off
  headings and sentences stay in the templates.
- `src/app/ui/`: the catalog: `a[uiButton]` (primary or secondary, sm or md), `ui-status-chip`
  (live or in development), `a[uiWordmark]` (the mark and name, linking to `#top`).
- `src/styles/tokens.css`: every color, spacing, type, radius, border, stroke, and motion value.
  The dark scheme and the `.surface-ink` band
  (the Prumo section) swap token values. `src/styles.css`: font face, reset, base elements, and
  the classes more than one section uses (`.container`, `.section`, `.lead`, `.nav-link`,
  `.text-link`, `.product-heading`, `.product-meta`, `.nowrap`, `.visually-hidden`).
- The trace figure (`sections/trace-figure/`) draws leader lines from each highlighted source
  value to the record built from it. `leaders.ts` is the pure geometry; the component measures
  after the first render, on resize, and when fonts load. It plays the motion only if the page
  has not rendered a frame yet (`data-painted` absent), so visible content never vanishes to
  animate back in, then settles for good. The bundle usually runs after the first frame, so the
  motion is usually skipped (ADR 0001). Below 880px a CSS connector stands in for the leaders.

## Conventions

- Copy is exact: curly apostrophes, a no-break space (written `\u00a0` in TypeScript) inside
  "R$ 25,000.00" and "August 14", `.nowrap` around hyphenated terms such as AI-assisted, and
  `<wbr />` in the CSV file name. Change copy only with the owner's approval.
- Components whose host is a semantic element use an attribute selector on it
  (`header[appSiteHeader]`, `section[appProducts]`, `article[appProductEntry]`,
  `figure[appTraceFigure]`). The sticky header and the sibling, `:last-child`, and grid rules
  then see the same DOM as plain HTML. A section's `id`, classes, and `aria-labelledby` sit in
  its `host` metadata.
- Visual values come from tokens. `npm run lint:tokens` rejects raw colors anywhere and raw px in
  spacing, type, radius, and shadow properties outside the tokens file; it does not check
  strokes, sizes, or durations, so review those. Media query breakpoints (420, 560, 720, 880px)
  are the exception: custom properties do not work there.
- Component styles are scoped, so they outrank the global `a:hover` color. A scoped rule that
  sets a link's color restates the hover color (`ui/button/button.css`,
  `site-footer/site-footer.css`).
- Angular drops whitespace-only text between elements. Where two inline elements need a space
  between them, write `&ngsp;` (`hero.html`, `product-entry.html`). The space matters to text
  extraction and reader modes even where flex layout hides it.
- File names `thing.ts` + class `Thing`; catalog classes are `UiThing` with the `ui` prefix,
  page components use the `app` prefix. Prettier formats everything (`printWidth` 100, single
  quotes, Angular parser for HTML); harness files in `.engineering/` are excluded.

## Reference implementations

Copy these when adding something similar:

- Catalog component with typed variants: `src/app/ui/button/` (and its spec).
- Section rendered from typed content: `src/app/sections/products/` with
  `src/app/content/products.ts` and `products.spec.ts`.
- Pure logic with literal-value tests: `src/app/sections/trace-figure/leaders.ts` and
  `leaders.spec.ts`.
- Browser-only behavior after hydration: `src/app/sections/trace-figure/trace-figure.ts`
  (`afterNextRender`, `ResizeObserver`, cleanup through `DestroyRef`) and its spec.

## Testing

Vitest with jsdom through `@angular/build:unit-test` (`ng test`). Specs sit next to the code: the
catalog components, `leaders.spec.ts` (geometry), `trace-figure.spec.ts` (motion plays before the
first frame and settles when it ends; skipped after it), `content/trace.spec.ts` (every marker
pairs one field with one record), `products.spec.ts` (the exact product links, no new tabs), and
`app.spec.ts` (one `h1`; in-page links target the main content, the sections, and `#top`, the
body's id). jsdom has no layout, so the figure and app specs stub `ResizeObserver`,
`document.fonts`, and `getAnimations`, and remove the stubs after each test.
One spec: `npx ng test --watch=false --include src/app/sections/trace-figure/leaders.spec.ts`.

Visual changes have no automated screenshot test in the repository. Check them in a browser
against `npm run preview` at 320, 375, 768, 1100, and 1440px, in both color schemes. CI: missing.

## Observability

None. The site is static files with no server behavior; once deployed, the host's access logs are
the only signal. Health check after a deploy: `https://codando.io/` returns 200 with the
prerendered `<h1>`.

## Delivery

| Item                | Value                                                      |
| ------------------- | ---------------------------------------------------------- |
| CI on every change  | missing                                                    |
| Hosting / provider  | (unknown - ask the team): any static host serves the build |
| Environments        | local only                                                 |
| Staging gate        | missing                                                    |
| Deploy trigger      | manual upload of `dist/codando-site/browser/` (not set up) |
| Rollback            | upload the previous build                                  |
| Feature flags       | missing                                                    |
| Database migrations | none (no database)                                         |

## Security notes

No runtime input, no authentication, no secrets, no backend. Nothing reaches the page from
outside the repository at runtime. Templates never bind `innerHTML`; the JSON-LD is static text in
`src/index.html`. External links open in the same tab. The `contact@codando.io` mailbox must exist
before launch (README).
