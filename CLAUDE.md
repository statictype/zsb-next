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

Editions live in Sanity as `edition` documents. `src/data/editions/YYYY.ts` files are a static fallback — `getEdition(year, options)` in `src/data/editions/index.ts` queries Sanity first and falls back to the static file. 2021 is permanently static (online-only edition with a unique shape). Pages render via the dynamic route `src/app/(site)/editions/[year]/`.

To add a new year as a draft you can preview: create the `edition` document in Studio. To add a year while migration is in progress: drop a `src/data/editions/YYYY.ts` file and register it in `src/data/editions/index.ts`.

## CMS / Sanity Studio

Embedded Sanity Studio at `/studio`. Schema, GROQ queries, and the components that read them all change in a single PR. For the architecture, conventions, and a step-by-step "add a new page" walkthrough, see [`docs/cms.md`](./docs/cms.md). For the in-flight rollout (status, queued steps, follow-ups), see [`docs/cms-rollout-plan.md`](./docs/cms-rollout-plan.md). For specific decisions with tradeoffs, see [`docs/adr/`](./docs/adr/).

Key project conventions:
- Site routes live in `src/app/(site)/` route group so `<SanityLive />` and `<VisualEditing />` don't mount on `/studio`.
- Every Sanity fetcher takes `DynamicFetchOptions` resolved outside the cache boundary — three-layer pattern (page → dynamic → cached).
- Singletons: enforce via the `SINGLETON_TYPES` registry in `src/sanity/lib/singleton.ts`; never query a singleton by type, always by fixed id.
- After schema or query changes, run `pnpm typegen` and commit `sanity.types.ts`.

## Image system

Originals live in Vercel Blob; Vercel's built-in image optimizer handles resizing, format negotiation (AVIF/WebP), and edge caching on demand. `ImageData` is just `{ src, alt }` and `src` is a full URL built via `blobUrl(path)` from `src/lib/blob.ts`.

- Set `NEXT_PUBLIC_BLOB_URL` to the Blob store's public origin (e.g. `https://xxxx.public.blob.vercel-storage.com`) in `.env.local` and in Vercel env vars.
- Upload originals to Blob at paths like `YYYY/<basename>.jpg` (or `.png`) so `blobUrl('2025/bws01906.jpg')` resolves correctly. Filenames are case-sensitive on Linux/Vercel — keep them lowercase.
- `pnpm exec tsx scripts/blob-upload.ts <file>...` uploads local originals — auto-detects the year from the source path (or pass `--year YYYY`), lowercases the basename, and resizes anything over 3840px on the longest edge.
- `remotePatterns` in `next.config.ts` whitelists `*.public.blob.vercel-storage.com`. `minimumCacheTTL` is 31 days.

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
