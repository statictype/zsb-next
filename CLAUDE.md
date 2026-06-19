# CLAUDE.md

Guidance for Claude Code working in this repo. Keep responses terse and prefer the conventions below over defaults.

## Stack

Next.js 16 (App Router, `cacheComponents: true`, `reactCompiler: true`), React 19, TypeScript (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`). Package manager is **pnpm**.

## Commands

- `pnpm dev` — dev server (localhost:3000). **Do not start this; the user runs it themselves.**
- `pnpm build` — prod build; this is the canonical type-check
- `pnpm typecheck` — `tsc --noEmit` (faster signal than a full build)
- `pnpm lint` / `pnpm lint:fix` — ESLint (flat config in `eslint.config.mjs`, scoped to `./src`)
- `pnpm format` / `pnpm format:check` — Biome format
- `pnpm test` / `pnpm test:watch` — Vitest unit + component tests
- `pnpm test:e2e` — Playwright E2E smoke (builds + starts the app)
- `pnpm images:unused` — find unused files under `public/img/`

## Testing

Vitest (unit + component) + Playwright (E2E smoke), gated in CI on every PR. Tests
co-locate next to source (`*.test.ts` = unit/node, `*.test.tsx` = component/jsdom);
E2E lives in `e2e/`. We test risky logic and key pages, and deliberately skip
presentational markup, framework internals, and live Sanity (the data layer is
mocked). See [`docs/testing.md`](./docs/testing.md) for the full guide — config
gotchas (`server-only` alias, dummy env, `vi.mock` of `live.ts`) and CI.

## Data model: Editions

Editions live in Sanity as `edition` documents — **every** year, with no static files left (the last one, the online-only 2021, was migrated in ZSB-20 / [ADR 0018](./docs/adr/0018-2021-as-normal-edition-optional-program.md)). `getEdition(year, options)` in `src/data/editions/index.ts` is the gateway: a thin pass-through to the Sanity fetch. Pages render via the dynamic route `src/app/(site)/editions/[year]/`. The **program** is an optional section: an edition with `hasProgram` off (2021) renders no calendar/coming-soon block at all; "online-only" is not modelled as a distinct concept, and 2021's off-site photo-gallery link is a small static constant in `edition-content.tsx`, not a field.

To add a new year: create the `edition` document in Studio (Sanity-only — no static file). Set its `status` to `upcoming` while it's a previewable draft, then `live` when the page is ready. (The value is `live`, not `published` — "published" is Sanity's own document lifecycle and is a separate axis; see `CONTEXT.md` → Edition status. The route gate is `status != "upcoming"`.)

## CMS / Sanity Studio

Embedded Sanity Studio at `/studio`. Schema, GROQ queries, and the components that read them all change in a single PR. For the architecture, conventions, and a step-by-step "add a new page" walkthrough, see [`docs/cms.md`](./docs/cms.md). For the (now-complete) rollout record, see [`docs/cms-rollout-plan.archived.md`](./docs/cms-rollout-plan.archived.md). For specific decisions with tradeoffs, see [`docs/adr/`](./docs/adr/).

Key project conventions:
- Site routes live in `src/app/(site)/` route group so `<SanityLive />` and `<VisualEditing />` don't mount on `/studio`.
- Every Sanity fetcher takes `DynamicFetchOptions` resolved outside the cache boundary — the three-layer split Cache Components forces ([ADR 0012](./docs/adr/0012-cache-components-three-layer-fetch.md)). Fetchers route through `queryData` (the `DynamicFetchOptions`→`sanityFetch` bridge); pages let `<DraftAware>` own the dynamic half and keep their `'use cache'` leaf lexically in the page.
- Singletons: enforce via the `SINGLETON_TYPES` registry in `src/sanity/lib/singleton.ts`; never query a singleton by type, always by fixed id.
- After schema or query changes, run `pnpm typegen` and commit `sanity.types.ts`.

## Image system

Two paths. The **primary** one is Sanity: images authored in the Studio are stored as Sanity assets and served from Sanity's image CDN via `urlFor()` (`src/sanity/lib/image.ts`). All current content — the live editions, homepage, the static pages — uses this. The runtime image shape is `{ src, alt }`.

**Vercel Blob is legacy** (`blobUrl(path)` from `src/lib/blob.ts`), now used only as the origin the `sanity-*` migration scripts uploaded into Sanity assets from (including the 2021 hero in ZSB-20). New images go into Sanity, not Blob. A missing CMS image falls back to a neutral **local** placeholder (`src/lib/placeholder.ts` → `public/img/placeholder.jpg`), not Blob. See [ADR 0005](./docs/adr/0005-vercel-blob-for-image-originals.md) + [ADR 0011](./docs/adr/0011-sanity-assets-for-authored-images.md).

- For the legacy Blob path: `NEXT_PUBLIC_BLOB_URL` is the Blob store's public origin; `remotePatterns` in `next.config.ts` whitelists `*.public.blob.vercel-storage.com` (and Sanity's `cdn.sanity.io`); `minimumCacheTTL` is 31 days. `pnpm exec tsx scripts/blob-upload.ts <file>...` still uploads originals (lowercases basenames, resizes over 3840px) for legacy Blob assets.

## Styling

**Panda CSS only — CSS Modules are fully retired.** There are zero `.module.css` files; all styling is Panda. A hard ESLint `no-restricted-imports` rule blocks any new `*.module.css` import (see [ADR 0017](./docs/adr/0017-panda-css-with-oklch-token-theme.md); the migration record is [`docs/panda-migration-plan.md`](./docs/panda-migration-plan.md)). No Tailwind.

- **Panda CSS** is zero-runtime. Author styles with `css()` / `cx()` from `styled-system/css`; build variant-driven primitives as recipes. The internal `definePreset` module at `src/design-system/preset.ts` owns tokens, semantic tokens, conditions, typography, patterns, and shared recipes. `panda.config.ts` owns extraction and app build configuration. After preset/config changes run `pnpm panda codegen`; `styled-system/` is generated and gitignored. `preflight` is off (the element reset lives in `globals.css` `@layer base`).
- **Shared styling lives in the internal preset.** Typography is **textStyles**; section/page-shell layout is **layerStyles**. Reusable system contracts are preset recipes; product composition uses co-located `sva`/`cva` recipes. Normalize aggressively: collapse duplicated roles onto the primitive and do not reintroduce per-component value drift.
- **Use semantic role tokens, not raw grays.** In Panda: `canvas`, `surfaceLight`, `heading`, `headingLight`, `body`, `bodyLight`, `muted`, `divider`, `dividerLight`, `action`, `highlight`. Raw gray scale (`gray.50`…`gray.950`) is a utility for rare exceptions. (Enforcement coming in [ZSB-75].)
- **`globals.css`** is now just the cascade-layer order (`@layer reset, base, tokens, recipes, utilities`) and the element reset in `@layer base` (which reads Panda's emitted token vars). All design tokens live in `src/design-system/preset.ts`.
- **Breakpoints** are mobile-first and stepped at 768 / 1024 / 1280 / 1440 / 1536 / 1792; fluid type/spacing use `clamp()`.
- **Fonts** are loaded via `next/font/google` in `src/app/layout.tsx`: Dela Gothic One (Panda `display`) and Montserrat (Panda `body`).

## Component conventions

- One folder per component: `src/components/ComponentName/ComponentName.tsx` (+ a co-located `ComponentName.recipe.ts` when it needs multi-slot styling).
- Ark UI is a private implementation detail of one-piece site primitives under `src/components/ui/` (plus the shared Carousel). Pages and product components consume site-shaped APIs and never import Ark parts, contexts, anatomy, or change-detail types. Ark owns behavior and accessibility; Panda anatomy-aligned slot recipes own appearance.
- Primitive `className` props apply to the outer root for layout placement only. Internal Ark state styling uses `data-*` selectors in the primitive recipe.
- Icons: `@remixicon/react`.
- Animation: GSAP is available for non-trivial motion; prefer CSS transitions with `--duration-*` + `--ease-out-*` tokens otherwise.
- ESLint disables `react/no-array-index-key` in `Carousel`, `MediaKit`, `Program` (slides/items are positional, never reordered).

## Linting

Lint pipeline is ESLint (`eslint-config-next` + `eslint-plugin-react-compiler` + `react-hooks` v7) specifically so rules-of-React violations that would silently disable React Compiler on a file are caught at lint time. Biome handles formatting only (its linter is disabled in `biome.json`). See `journal/eslint-over-biome.md` for the rationale.

## MCP

At the start of a Next.js task, call the `init` tool from `next-devtools-mcp` first to load up-to-date Next 16 context.
