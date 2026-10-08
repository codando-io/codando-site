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

Verified on 2026-10-08 (macOS, Node 24.18, npm 11.16). Run from the repository root.

| Purpose             | Command                                                     |
| ------------------- | ----------------------------------------------------------- |
| Restore             | `npm ci`                                                    |
| Build               | `npx ng build` (prerenders to `dist/codando-site/browser/`) |
| Fast tests          | `npx ng test --watch=false --include <spec path>`           |
| Full tests          | `npx ng test --watch=false`                                 |
| Run locally         | `npm start` (port 4200)                                     |
| Lint / format check | `npx prettier --check .`                                    |

`npm` 11 blocks dependency install scripts (`@parcel/watcher`, `esbuild`, `fsevents`, `lmdb`,
`msgpackr-extract`); build and tests pass without them, so do not approve them.

## Architecture

An Angular 22 application (standalone, zoneless) with no router, built with
`@angular/build:application` and `outputMode: "static"`: the build renders the page once on the
server (`src/main.server.ts`, `src/app/app.config.server.ts`, server route `'**'` prerendered in
`src/app/app.routes.server.ts`) and writes plain files. No server ships. The browser bundle
hydrates the prerendered HTML.

## Conventions

- File names `thing.ts` + class `Thing`; templates and styles in `thing.html` and `thing.css`.
- Prettier formats everything (`printWidth` 100, single quotes, Angular parser for HTML).

## Reference implementations

(none yet: added with the first components)

## Testing

Vitest with jsdom through `@angular/build:unit-test` (`ng test`). Specs sit next to the code
(`src/app/app.spec.ts`). CI: missing.

## Observability

None. The site is static files with no server behavior; once deployed, the host's access logs are
the only signal.

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
outside the repository at runtime.
