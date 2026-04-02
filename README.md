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
| `pnpm build` | Production build (includes type-checking) |
| `pnpm start` | Serve production build |
| `pnpm typecheck` | Run TypeScript type-checking (`tsc --noEmit`) |
| `pnpm lint` | Run Biome linter |
| `pnpm lint:fix` | Auto-fix lint issues |
| `pnpm format` | Auto-format with Biome |
| `pnpm images:unused` | Find unused images in `public/` |

## Project Structure

```
src/
  app/                  # App Router pages
    editions/[year]/    # Dynamic edition pages
    partners/           # Partners page
    about/              # About page
  components/           # One folder per component (TSX + CSS Module)
  data/editions/        # Static data files per festival year (2022–2025)
  lib/                  # Utilities (image loader, constants, hooks)
  types/                # Shared TypeScript types (Edition, ImageData)
```

## Key Concepts

- **Editions**: Each festival year is a data file in `src/data/editions/` exporting an `Edition` object. Add a new year by creating a data file and registering it in `index.ts`.
- **Image system**: Custom Next.js image loader appends `-{width}.{ext}` to base paths at runtime. Use `imageSrc()` from `src/lib/image-utils.ts`.
- **Styling**: CSS Modules only, design tokens in `src/app/globals.css`. See `DESIGN-SYSTEM.md` for the full token reference.
- **Fonts**: Dela Gothic One (display) and Montserrat (body), loaded via `next/font/google`.
