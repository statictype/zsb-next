# Testing

## Layers

| Layer | Tool | Scope |
|---|---|---|
| Types | `pnpm typecheck`, Sanity TypeGen | The whole codebase |
| Unit | Vitest, node environment | Pure logic: date math, content mappers, name sorting, SEO and JSON-LD builders, program filters |
| Component | Vitest, jsdom, Testing Library | Components with behavior (accordion, dialog, carousel, lightbox, navigation, program board), asserted through what the user sees |
| End to end | Playwright, Chromium | Route rendering and user journeys against a production build |

Not tested: presentational components without logic, framework routing, live Sanity responses (the data layer is mocked), markup snapshots, coverage percentage.

## Layout and naming

Tests sit next to the source: `format-utils.test.ts` beside `format-utils.ts`. The extension selects the environment: `*.test.ts` runs in node, `*.test.tsx` in jsdom with `vitest.setup.ts`. Playwright specs are in `e2e/*.spec.ts`.

## Running

```bash
pnpm test                                     # unit and component, once
pnpm test:watch
pnpm exec vitest run --project unit           # node project only
pnpm exec vitest run --project component      # jsdom project only
pnpm exec vitest run src/lib/seo.test.ts      # one file
pnpm test:e2e                                 # Playwright
```

`pnpm test:e2e` runs `pnpm build && pnpm start` unless a server is already listening on port 3000 (override with `PORT`). Under `CI` it runs `pnpm start` only, because the workflow builds first. The build and the runtime need the Sanity variables from `.env.example`.

## Vitest setup

`vitest.config.ts` defines two projects, `unit` and `component`, under one config.

- Path aliases come from `resolve.tsconfigPaths`. `@vitejs/plugin-react` handles JSX. The React Compiler is not applied in tests.
- `server-only` and `client-only` resolve to `test/empty-module.ts`, because they throw outside the Next.js bundler.
- `test.env` sets dummy Sanity variables, because `src/sanity/env.ts` throws when they are missing.
- `src/sanity/lib/live.ts` calls `defineLive()` at import, which throws outside React Server Components. Tests of modules that import it, such as `seo.ts` and `staticPages.ts`, mock it with `vi.mock`.
- Tests import `describe`, `it` and `expect` from `vitest`; there are no globals. jest-dom matchers load from `vitest.setup.ts`.

## Playwright

`smoke.spec.ts` checks that routes render. `journeys.spec.ts` and `lightbox.spec.ts` cover event dismissal, mobile-navigation focus, program filtering, cookie consent, carousel drag versus click, and the lightbox.

`trackErrors` and `expectErrorClean` in `e2e/helpers.ts` fail a test on any uncaught page error or `console.error`, except for a short ignore list: framework chatter, the `<SanityLive>` event stream that the browser blocks on origins missing from the Sanity CORS allowlist, and `/_next/image` requests that fail on a cold image cache.

## CI

`.github/workflows/ci.yml` runs on pull requests and on pushes to `main`.

1. `check`: `pnpm lint`, `pnpm format:check`, `pnpm test`.
2. `build-e2e`: `pnpm typegen`, then a diff check that `sanity.types.ts` is unchanged, `pnpm build`, and `pnpm test:e2e`. The Sanity variables come from repository secrets, so the job fails without them.

CI type-checks through `pnpm build`. Next.js generates the route types (`PageProps`) during `build` and `dev`, so `tsc --noEmit` alone fails on a fresh checkout until one of them has run.

The pre-commit hook in `.githooks/pre-commit` formats staged files with Biome.
