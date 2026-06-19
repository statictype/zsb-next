# How we test

A lean, modern setup that protects the logic that breaks silently and the pages
that must never render broken — without a heavy maintenance bill. We test what's
risky and **deliberately skip what isn't**.

## The layers

1. **Type safety** — `pnpm typecheck` (`tsc`) + Sanity TypeGen. The first gate.
2. **Unit** — [Vitest](https://vitest.dev). The core of the strategy: pure logic
   (edition date math, content mappers, name sorting, SEO / JSON-LD builders).
3. **Component** — Vitest + React Testing Library, jsdom. Only components that
   carry real behaviour, tested by what the user sees — never markup snapshots.
4. **E2E smoke** — [Playwright](https://playwright.dev). A thin suite that proves
   "the site is up and renders" against a production build.
5. **CI** — GitHub Actions gates every PR (`.github/workflows/ci.yml`).

### What we deliberately don't test

Presentational components with no logic; framework/routing internals; live Sanity
or the network (the data layer is mocked); exhaustive snapshots or a coverage %.

## Where tests live

- **Co-located** next to the source — `format-utils.test.ts` beside
  `format-utils.ts`, `Venues.test.tsx` beside `Venues.tsx`. Same convention as
  the co-located `Component.recipe.ts`.
- File extension picks the environment:
  - `*.test.ts` → **unit**, node environment.
  - `*.test.tsx` → **component**, jsdom + RTL (`vitest.setup.ts`).
- **E2E** is separate: `e2e/*.spec.ts` (different runner + a real server).

## Running

```bash
pnpm test            # unit + component, once (CI mode)
pnpm test:watch      # unit + component, watch mode
pnpm test:e2e        # Playwright smoke (builds + starts the app)

# Handy filters
pnpm exec vitest run --project unit         # just the node project
pnpm exec vitest run --project component    # just the jsdom project
pnpm exec vitest run src/lib/seo.test.ts    # a single file
```

## Unit / component setup (`vitest.config.ts`)

Two Vitest **projects** (`unit` node, `component` jsdom) under one config. Notable
pieces, each there for a reason:

- **`vite-tsconfig-paths`** resolves the `@/*` alias; **`@vitejs/plugin-react`**
  enables JSX. We pin `@vitejs/plugin-react@5` to match the Vite that Vitest 4
  bundles.
- **No React Compiler in tests.** It's a build-time optimization; components
  behave correctly without it, and tests exercise behaviour, not compiler output.
- **`server-only` / `client-only` are aliased** to `test/empty-module.ts` so the
  data-layer modules import under the runner (they throw outside Next's bundler).
- **Dummy Sanity env** is set in `test.env` so importing the data layer (which
  routes through `src/sanity/env.ts`, and that throws on missing vars) doesn't
  blow up. `urlFor` just builds CDN URLs from these; tests assert shape.
- **The live data layer is mocked, not hit.** `src/sanity/lib/live.ts` calls
  `defineLive()` at module load, which throws outside React Server Components.
  Tests for modules that transitively import it (`seo.ts`, `staticPages.ts`)
  `vi.mock('…/live', …)` — the functions under test are pure and never call it.
- **Explicit imports, no globals** — `import { describe, it, expect } from 'vitest'`.
  jest-dom matchers come from `vitest.setup.ts`.

### Seeded tests (the pattern to copy)

| File | Covers |
|---|---|
| `src/lib/format-utils.test.ts` | surname sort key, Romanian collation, padding, split |
| `src/lib/edition-dates.test.ts` | date-range formatting + date-tape composition |
| `src/lib/seo.test.ts` | Event / breadcrumb / FAQ / org / press JSON-LD, edition metadata |
| `src/sanity/lib/staticPages.test.ts` | `buildFaq`, `mapVisit` (Sanity → render shape) |
| `src/components/ui/Accordion/Accordion.test.tsx` | single/multiple behavior + mounted content |
| `src/components/ui/Checkbox/Checkbox.test.tsx` | controlled boolean interaction |
| `src/components/ui/Collapsible/Collapsible.test.tsx` | labels, mounted content, closed default |
| `src/components/ui/Dialog/Dialog.test.tsx` | labeling, Escape dismissal, focus restoration |
| `src/components/Carousel/Carousel.test.tsx` | stage/rail controls, autoplay policy, reduced motion |

## E2E smoke (`playwright.config.ts`, `e2e/smoke.spec.ts`)

- Runs against a **production build**. Locally the config self-builds
  (`pnpm build && pnpm start`) or reuses a dev server already on `:3000`; in CI it
  only `pnpm start`s (the workflow builds first). Override the port with `PORT`.
- **`smoke.spec.ts`** keeps route rendering broad. **`journeys.spec.ts`** covers
  route-aware event dismissal, mobile-navigation focus behavior, filtering,
  cookie consent, and Carousel drag-versus-click through accessible public UI.
- **Error guard:** uncaught `pageerror`s always fail; `console.error`s fail too,
  minus a small ignore list. Notably, `<SanityLive>` opens a live-content SSE that
  the browser CORS-blocks on any origin not in the Studio's allowlist (CI, preview
  ports) — benign, so it's filtered by its request URL.

## CI (`.github/workflows/ci.yml`)

On every PR (and pushes to `main`), two jobs:

1. **`check`** — lint → `format:check` → `pnpm test` (unit + component).
2. **`build-e2e`** — `pnpm build`, then `pnpm test:e2e`. Reads its build env
   from Actions secrets (the vars in `.env.example`).

**Types are checked by `pnpm build`, not a standalone `tsc`** — Next generates the
route types (`PageProps` etc.) during `build`/`dev`/`next typegen`, so
`tsc --noEmit` alone fails on a fresh checkout. `pnpm typecheck` stays for local
use, where a running `pnpm dev` has already generated those types.

The format-only pre-commit hook (`.githooks/pre-commit`) is unchanged — it
formats staged files with Biome and is independent of the test gate.
