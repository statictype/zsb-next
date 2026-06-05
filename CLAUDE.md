# CLAUDE.md

Guidance for Claude Code working in this repo. Keep responses terse and prefer the conventions below over defaults.

## Stack

Next.js 16 (App Router, `cacheComponents: true`, `reactCompiler: true`), React 19, TypeScript (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`). Package manager is **pnpm**. No test runner.

## Commands

- `pnpm dev` — dev server (localhost:3000). **Do not start this; the user runs it themselves.**
- `pnpm build` — prod build; this is the canonical type-check
- `pnpm typecheck` — `tsc --noEmit` (faster signal than a full build)
- `pnpm lint` / `pnpm lint:fix` — ESLint (flat config in `eslint.config.mjs`, scoped to `./src`)
- `pnpm format` / `pnpm format:check` — Biome format
- `pnpm images:unused` — find unused files under `public/img/`

## Data model: Editions

Editions live in Sanity as `edition` documents. `getEdition(year, options)` in `src/data/editions/index.ts` is the gateway: it serves 2021 from its static file (`src/data/editions/2021.ts`) and queries Sanity for every other year. 2021 is the only static year — the online-only edition with a unique shape Sanity doesn't model. The 2022–2025 static fallback files were deleted once those editions were fully authored in Sanity. Pages render via the dynamic route `src/app/(site)/editions/[year]/`.

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

**Vercel Blob is legacy** (`blobUrl(path)` from `src/lib/blob.ts`), now used only by: the permanently-static 2021 edition; and as the origin the `sanity-*` migration scripts uploaded into Sanity assets from. New images go into Sanity, not Blob. A missing CMS image falls back to a neutral **local** placeholder (`src/lib/placeholder.ts` → `public/img/placeholder.jpg`), not Blob. See [ADR 0005](./docs/adr/0005-vercel-blob-for-image-originals.md) + [ADR 0011](./docs/adr/0011-sanity-assets-for-authored-images.md).

- For the legacy Blob path: `NEXT_PUBLIC_BLOB_URL` is the Blob store's public origin; `remotePatterns` in `next.config.ts` whitelists `*.public.blob.vercel-storage.com` (and Sanity's `cdn.sanity.io`); `minimumCacheTTL` is 31 days. `pnpm exec tsx scripts/blob-upload.ts <file>...` still uploads originals (lowercases basenames, resizes over 3840px) for the 2021/fallback images.

## Styling

- **CSS Modules only.** No Tailwind, no CSS-in-JS. Co-locate `ComponentName.module.css` next to `ComponentName.tsx`.
- **Tokens live in `src/app/globals.css`** — that file is the source of truth. Mobile-first; stepped breakpoints at 768 / 1024 / 1280 / 1440 / 1536 / 1792. Nine typography/spacing tokens use `clamp()` across 320→1792.
- **Use semantic role tokens, not raw grays.** Components should reach for `--canvas`, `--surface-light`, `--heading`, `--heading-light`, `--body`, `--body-light`, `--muted`, `--divider`, `--divider-light`, `--action`, `--highlight`. Raw `--gray-*` is a utility scale for rare exceptions.
- **Typography utilities** are in `src/components/Shared.module.css` (compose via `composes:`). The section primitives (`.section`, `.sectionDark`, `.sectionLight`, `.sectionInner`) standardize section layout.
- **Fonts** are loaded via `next/font/google` in `src/app/layout.tsx`: Dela Gothic One (`--font-display`) and Montserrat (`--font-body`).

## Component conventions

- One folder per component: `src/components/ComponentName/ComponentName.tsx` + `.module.css`.
- Icons: `@remixicon/react`.
- Animation: GSAP is available for non-trivial motion; prefer CSS transitions with `--duration-*` + `--ease-out-*` tokens otherwise.
- ESLint disables `react/no-array-index-key` in `Carousel`, `MediaKit`, `Program` (slides/items are positional, never reordered).

## Linting

Lint pipeline is ESLint (`eslint-config-next` + `eslint-plugin-react-compiler` + `react-hooks` v7) specifically so rules-of-React violations that would silently disable React Compiler on a file are caught at lint time. Biome handles formatting only (its linter is disabled in `biome.json`). See `journal/eslint-over-biome.md` for the rationale.

## MCP

At the start of a Next.js task, call the `init` tool from `next-devtools-mcp` first to load up-to-date Next 16 context.
