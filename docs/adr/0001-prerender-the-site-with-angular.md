# 0001. Prerender the site with Angular

- Status: accepted
- Date: 2026-10-08
- Deciders: johnp (owner)

## Context

codando.io is one page of content in English. Search engines and link previews must get the
whole page as HTML, and nothing on the page needs a server: there is no form, no account, and no
data fetched at runtime. An approved static implementation (plain HTML, CSS, and a 2.5 kB script
that draws the hero figure's leader lines) fixed the copy and the design.

The owner builds his web projects in Angular under the engineering harness (`lastro/web` is the
nearest example) and asked for this site to follow the same stack and the harness's Angular
profile: a component catalog, design tokens checked by a script, Vitest specs, and the harness
lifecycle.

## Decision

Build the site as an Angular 22 application with `outputMode: "static"`. The build renders the
page in Node at build time and writes plain files to `dist/codando-site/browser/`; the browser
bundle hydrates that HTML. No router, no server at runtime.

## Alternatives considered

| Option                                             | Why not                                                                                                                                                        |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plain static files (the approved reference)        | No build step and almost no JavaScript, but outside the owner's stack: no component catalog, no token check, no specs, and no harness profile to guide changes |
| Angular with server-side rendering at request time | Needs a Node server running in production to serve a page that never changes between builds                                                                    |
| Astro or another static site generator             | A second framework for the owner to keep current, with no harness profile                                                                                      |

## Consequences

- The page is complete HTML without JavaScript. With JavaScript, the browser downloads a 216 kB
  bundle (61 kB with Brotli, 69 kB with gzip) to hydrate the page and draw the leader lines,
  where the reference needed 2.5 kB.
- The hero figure's motion plays only if the page has not rendered a frame yet, because content
  already on screen must not vanish to animate back in. The reference's small script usually ran
  before that frame; the bundle usually runs after it, so the leaders appear without motion.
  Measured on 2026-10-08 in headless Chrome, cache disabled, against the local preview: the
  reference played the motion unthrottled and throttled to DevTools' Fast 4G and Slow 4G
  figures; this build skipped it in all three (first frame at 48, 456, and 1,380 ms; leaders
  drawn at 54, 648, and 2,707 ms). Bringing the motion back means hiding content until the
  bundle runs, or animating only the leaders, which were never on screen.
- Any static host serves the site: upload `dist/codando-site/browser/`. Hashed bundle names allow
  long cache lifetimes for the JavaScript and CSS.
- Angular major upgrades follow the harness `dependency-update` skill, one major at a time.
- Visual changes go through `src/styles/tokens.css` and the catalog in `src/app/ui/`;
  `npm run lint:tokens` rejects raw colors and pixel spacing elsewhere.
- Reversible at low cost: the prerendered `index.html` and its stylesheet are the site. Going back
  to plain files means keeping that output and replacing the bundle with a small script for the
  leaders.
