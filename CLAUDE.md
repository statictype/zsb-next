# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Next.js 16 (App Router, `cacheComponents: true`, `reactCompiler: true`), React 19, TypeScript (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`), Panda CSS, embedded Sanity Studio. Package manager is **pnpm**.

## Commands

- `pnpm dev` — dev server (localhost:3000). **Do not start this; the user runs it themselves.**
- `pnpm build` — production build; the canonical type-check (don't run unprompted — prefer `typecheck`)
- `pnpm typecheck` — `tsc --noEmit`, faster signal than a full build
- `pnpm lint` / `pnpm lint:fix` — ESLint, scoped to `./src`
- `pnpm format` / `pnpm format:check` — Biome (formatting only)
- `pnpm test` / `pnpm test:watch` — Vitest
- `pnpm vitest run path/to/file.test.ts` — a single test file
- `pnpm test:e2e` — Playwright smoke suite
- `pnpm typegen` — regenerate `sanity.types.ts`; run after any schema or GROQ change
- `pnpm panda codegen` — regenerate `styled-system/`; run after touching the design-system preset
- `pnpm images:unused` — find unreferenced files under `public/img/`

## Where to look

- **Domain vocabulary** (Edition, Program, Event, Venue, Latest/Upcoming, status values): `CONTEXT.md`
- **CMS/Studio architecture, singleton pattern, draft-mode fetching, adding a page**: `docs/cms.md`
- **Testing layers, what's deliberately untested, seeded-test pattern**: `docs/testing.md`
- **Individual design decisions with tradeoffs**: `docs/adr/` (`docs/adr/retired/` for superseded ones)
- **Design-system tokens/recipes**: `src/design-system/preset.ts`
- **Miscellaneous debugging notes and rationale**: `journal/`

## MCP

At the start of a Next.js task, call the `init` tool from `next-devtools-mcp` first to load current Next 16 context.
