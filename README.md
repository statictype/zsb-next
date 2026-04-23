# ZSB — Zilele Sculpturii București

Website for **Bucharest Sculpture Days**, a contemporary sculpture festival. Built with Next.js 16 (App Router), React 19, and TypeScript.

## Setup

Requires Node.js >= 20.9.0 and pnpm.

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
| `pnpm lint` / `pnpm lint:fix` | Biome check (`./src`) |
| `pnpm format` / `pnpm format:check` | Biome format |
| `pnpm images:unused` | Find unused images in `public/img/` (add `:json` for JSON output) |

## Project Structure

```
src/
  app/                  # App Router
    editions/[year]/    # Dynamic edition pages
    about/              # About page
    partners/           # Partners page
    press/              # Press page (media kit across editions)
    layout.tsx          # Root layout with <Navigation /> and <Footer />
    globals.css         # Design tokens
    sitemap.ts, robots.ts
  components/           # One folder per component (TSX + CSS Module)
  data/editions/        # Static data files per festival year (2022–2025)
  lib/                  # Image loader, constants, hooks
  types/                # Shared TypeScript types (Edition, ImageData)
scripts/                # Image-optimization utilities
docs/                   # Internal specs (e.g., section-scroll-spec)
```

## Key Concepts

- **Editions** — each festival year is a data file in `src/data/editions/` exporting an `Edition` object. Add a year by creating the file and registering it in `index.ts`.
- **Image system** — a custom Next.js image loader appends `-{width}.{ext}` to base paths at runtime. Use `imageSrc()` from `src/lib/image-utils.ts` to build a src that encodes widths and extension.
- **Styling** — CSS Modules only. Design tokens live in `src/app/globals.css`; prefer semantic role tokens (`--canvas`, `--heading`, `--body`, `--action`, …) over raw `--gray-*`. Shared typography and section primitives are in `src/components/Shared.module.css`.
- **Fonts** — Dela Gothic One (display) and Montserrat (body), loaded via `next/font/google`.
