# ZSB — Zilele Sculpturii București

Website for **Bucharest Sculpture Days**, an annual contemporary sculpture event in Bucharest. Built with Next.js 16 (App Router), React 19, TypeScript, and Sanity as the CMS.

## Setup

Requires Node.js 24.x (see `.nvmrc`; matches Vercel's Project Settings default) and pnpm.

```bash
pnpm install
pnpm dev          # Development server on localhost:3000
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build (also serves as the type-check) |
| `pnpm start` | Serve production build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` / `pnpm lint:fix` | ESLint (`./src`) |
| `pnpm format` / `pnpm format:check` | Biome format (formatting only; linter disabled) |
| `pnpm images:unused` | Find unused images in `public/img/` (add `:json` for JSON output) |

## Project Structure

```
src/
  app/
    (site)/             # Route group — every public page
      page.tsx          # Homepage
      editions/         # Editions index + [year]/ dynamic pages
      artists/          # All-artists page
      about/ visit/ partners/ press/ privacy/
      layout.tsx        # Site chrome (Footer, CookieBanner, JsonLd, SanityLive)
    studio/[[...tool]]/ # Embedded Sanity Studio at /studio
    api/                # draft-mode enable/disable, revalidate/tag (Sanity webhook)
    layout.tsx          # Bare HTML shell + fonts + root metadata
    globals.css         # Cascade-layer order + element reset (tokens live in panda.config.ts)
    sitemap.ts, robots.ts
  components/           # One folder per component (TSX + co-located Panda recipe)
  sanity/               # Studio config, schemaTypes, structure, GROQ queries, fetchers
  data/editions/        # 2021.ts (static online edition) + index.ts gateway
  lib/                  # blob.ts (image URLs), constants, seo, hooks
  types/                # Shared TypeScript types (Edition, ImageData)
scripts/                # Image + Sanity migration/seed utilities
docs/                   # Architecture (cms.md), ADRs, specs
```

## Key Concepts

- **Editions** — Sanity is the source of truth; each year is an `edition` document rendered via the dynamic route `editions/[year]/`. Only 2021 (the online-only year) stays as a static file (`src/data/editions/2021.ts`); every other year lives in Sanity. See [`docs/cms.md`](docs/cms.md).
- **CMS** — Sanity Studio is embedded at `/studio` in this same app. Schema, GROQ, and the components that read them change in one PR. Run `pnpm typegen` after schema/query changes and commit `sanity.types.ts`.
- **Image system** — images authored in Sanity are served from Sanity's asset CDN via `urlFor()` (`src/sanity/lib/image.ts`). This is the primary path for all current content (editions, homepage, static pages). A legacy **Vercel Blob** store (`blobUrl()` in `src/lib/blob.ts`, `NEXT_PUBLIC_BLOB_URL`) still backs the permanently-static 2021 edition and is the origin the migration scripts uploaded into Sanity from. A missing CMS image falls back to a neutral **local** placeholder (`src/lib/placeholder.ts` → `public/img/placeholder.jpg`), not Blob; singleton image fields are `required()`, so on a seeded dataset the placeholder never shows. `ImageData` is `{ src, alt }`.
- **Styling** — Panda CSS only ([ADR 0017](docs/adr/0017-panda-css-with-oklch-token-theme.md)). Author with `css()` / recipes from `styled-system`; the OKLCH design tokens and type/space scales live in `panda.config.ts`. Prefer semantic role tokens (`canvas`, `heading`, `body`, `action`, …) over raw `gray.*`. Shared typography is **textStyles**, section/page-shell layout is **layerStyles**, and per-component styling is a co-located `Component.recipe.ts` (`sva`).
- **Fonts** — Dela Gothic One (display) and Montserrat (body), loaded via `next/font/google`.

## Deployment & content updates

Hosted on Vercel at [sculpturedays.com](https://sculpturedays.com). Pages are served from Next 16's cache (`cacheComponents`), so a published Sanity edit reaches prod via a webhook (`/api/revalidate/tag`) that busts the relevant cache tags — not on a timer. If a publish doesn't show in prod, check the webhook delivery log in sanity.io/manage. Environment variables (Sanity project/dataset/tokens, `NEXT_PUBLIC_BLOB_URL`, `SANITY_REVALIDATE_SECRET`) are documented in [`docs/cms.md`](docs/cms.md).
