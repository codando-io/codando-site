# Codando website

The company website for Codando, served at <https://codando.io>: one English page that presents
the company, what it is building (Prumo), the products that are live (Agora and Cenaculum), and how
it builds them. Codando builds its own products only; the page offers no client services. Visitors
are people who want to know what Codando builds. What matters most: the copy is accurate (no
claim the products do not support), the page is complete as prerendered HTML for search engines
and link previews, and it stays fast and accessible.

This repository uses the engineering harness. Harness configuration, project overrides, and
project memory live in `.engineering/`. Decisions live in the ADR directory declared in
`.engineering/harness.yaml` (`adr_dir`).

## Commands

Verified on 2026-10-13 (macOS, Node 24.18, npm 11.16, Google Chrome). Run from the repository
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
  preload, JSON-LD). Angular adds the stylesheet and the bundle.
- `src/app/app.html`: skip link, header, the six sections in `main` (hero, Prumo, products, how
  we build, about, contact), footer.
- `src/app/sections/<name>/`: one component per section (`site-header`, `hero`,
  `prumo-feature`, `products`, `how-we-build`, `about`, `contact`, `site-footer`), with child
  components in subfolders (`hero/status-board`, `prumo-feature/relationship-diagram`,
  `products/product-entry`). `feature-list` renders a grid of heading-and-sentence cards for
  both Prumo and how we build; the section sets the columns.
- `src/app/content/`: the copy rendered in lists, as typed constants. `products.ts` holds every
  product once (`PRUMO`, `LIVE_PRODUCTS`, and `PRODUCTS` for the hero's status board), so the
  board and the sections never repeat a name, category, or status. `prumo.ts` and
  `how-we-build.ts` hold the cards and the stack; `navigation.ts` the section links. One-off
  headings and sentences stay in the templates.
- `src/app/ui/`: the catalog: `a[uiButton]` (pill, primary or secondary, sm or md),
  `ui-status-chip` (live: a glowing LED; in development: a ring; both pulse slowly),
  `[uiCard]` (solid, or dashed for what is not built yet), `a[uiWordmark]` (the mark and name,
  linking to `#top`).
- `src/styles/tokens.css`: every color, spacing, type, radius, border, shadow, stroke, and motion
  value, including the hero mesh and the contact band's mesh. The dark scheme and the
  `.surface-ink` band (the contact section) swap token values. `src/styles.css`: font faces,
  reset, base elements, and the classes more than one section uses (`.container`, `.section`,
  `.section-well`, `.kicker`, `.lead`, `.nav-link`, `.text-link`, `.nowrap`, `.visually-hidden`).
- Motion is CSS only: the status board fades in once on load, and the status chips pulse. Both
  sit under `prefers-reduced-motion: no-preference`, so reduced motion shows the final state
  (ADR 0001).

## Conventions

- Copy is exact: curly apostrophes and `.nowrap` around hyphenated terms such as AI-assisted.
  Change copy only with the owner's approval. State only facts the owner has confirmed: no
  invented users, numbers, partners, or team size. The founder appears only as "johnp"; the
  owner's legal name never appears.
- Political neutrality: no red, no green together with yellow or amber, no party colors. Emerald
  marks "live" and nothing else.
- Components whose host is a semantic element use an attribute selector on it
  (`header[appSiteHeader]`, `section[appProducts]`, `article[appProductEntry]`,
  `div[appStatusBoard]`, `ul[appFeatureList]`). The sticky header and the sibling,
  `:last-child`, and grid rules then see the same DOM as plain HTML. A section's `id`, classes,
  and `aria-labelledby` sit in its `host` metadata.
- Visual values come from tokens. `npm run lint:tokens` rejects raw colors anywhere and raw px in
  spacing, type, radius, and shadow properties outside the tokens file; it does not check
  strokes, sizes, or durations, so review those. Media query breakpoints (420, 560, 720, 880,
  1024px) are the exception: custom properties do not work there.
- Component styles are scoped, so they outrank the global `a:hover` color. A scoped rule that
  sets a link's color restates the hover color (`ui/button/button.css`,
  `site-footer/site-footer.css`).
- Angular drops whitespace-only text between elements. Where two inline elements need a space
  between them, write `&ngsp;` (`hero.html`, `status-board.html`, `product-entry.html`). The
  space matters to text extraction and reader modes even where flex or grid layout hides it.
- File names `thing.ts` + class `Thing`; catalog classes are `UiThing` with the `ui` prefix,
  page components use the `app` prefix. Prettier formats everything (`printWidth` 100, single
  quotes, Angular parser for HTML); harness files in `.engineering/` are excluded.

## Reference implementations

Copy these when adding something similar:

- Catalog component with typed variants: `src/app/ui/button/` and `src/app/ui/card/` (and their
  specs).
- Section rendered from typed content: `src/app/sections/products/` with
  `src/app/content/products.ts` and `products.spec.ts`.
- Derived copy with a literal-value test: `src/app/sections/hero/status-board/` counts products
  by status from `content/products.ts`; its spec asserts the rendered rows and the count.

## Testing

Vitest with jsdom through `@angular/build:unit-test` (`ng test`). Specs sit next to the code: the
catalog components, `status-board.spec.ts` (each product's row, status, and anchor; the
`2 live, 1 in development` count), `products.spec.ts` (the exact product links, no new tabs), and
`app.spec.ts` (one `h1`; every in-page link targets an existing id; the founder named only as
johnp; no "AI-powered"; the CNPJ in the footer; the owner's legal name absent). That last test
compares SHA-256 digests of the page's words, so the name never enters the repository.
One spec: `npx ng test --watch=false --include src/app/sections/hero/status-board/status-board.spec.ts`.

Visual changes have no automated screenshot test in the repository. Check them in a browser
against `npm run preview` at 320, 375, 768, 1100, and 1440px, in both color schemes, and with
reduced motion. Text over the hero mesh and the contact band must keep 4.5:1 (3:1 for the large
headings) where it actually sits, not only against the base color. CI: missing.

## Observability

None. The site is static files with no server behavior; once deployed, the host's access logs are
the only signal. Health check after a deploy: `https://codando.io/` returns 200 with the
prerendered `<h1>`.

## Delivery

| Item                | Value                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------- |
| CI on every change  | missing                                                                                 |
| Hosting / provider  | gemma, the NixOS VPS in `oss/infra`: nginx behind Traefik (`hosts/gemma/codando.nix`)   |
| Environments        | production only                                                                         |
| Staging gate        | missing                                                                                 |
| Deploy trigger      | tag `vX.Y.Z` here, then point the infra `codando-site` input at it and merge infra main |
| Rollback            | point the infra input back at the previous tag and merge infra main                     |
| Feature flags       | missing                                                                                 |
| Database migrations | none (no database)                                                                      |

The infra package (`pkgs/codando-site.nix`) builds this repository with `buildNpmPackage`, so its
`npmDepsHash` changes whenever `package-lock.json` does, including a version bump.

## Security notes

No runtime input, no authentication, no secrets, no backend. Nothing reaches the page from
outside the repository at runtime. Templates never bind `innerHTML`; the JSON-LD is static text in
`src/index.html`. External links open in the same tab. The `contact@codando.io` mailbox must exist
before launch (README).
