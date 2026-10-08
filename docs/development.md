# Development

Requires Node.js 24 (`.nvmrc`) and pnpm. The app reads content from a Sanity project, so it needs a project ID, a dataset and a read token. It does not start without them.

```bash
pnpm install
cp .env.example .env.local
```

Fill in `.env.local`, then start the dev server:

```bash
pnpm dev
```

The site is at `http://localhost:3000` and the Studio at `http://localhost:3000/studio`.

`pnpm install` also runs `panda codegen` and sets `core.hooksPath` to `.githooks`, whose pre-commit hook formats staged files with Biome.

## Environment variables

| Variable | Required | Use |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | yes | Sanity project |
| `NEXT_PUBLIC_SANITY_DATASET` | yes | Sanity dataset |
| `NEXT_PUBLIC_SANITY_API_VERSION` | yes | Sanity API version (a date, `YYYY-MM-DD`) |
| `SANITY_API_READ_TOKEN` | yes | Viewer token for draft mode and live content |
| `SANITY_REVALIDATE_SECRET` | production | Verifies the revalidation webhook signature |
| `SANITY_API_WRITE_TOKEN` | scripts only | Editor token for `scripts/` |
| `NEXT_PUBLIC_GA_ID` | no | Google Analytics measurement ID |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | no | Umami website ID |
| `NEXT_PUBLIC_ZSB_TODAY` | no | `YYYY-MM-DD` date override for local previews; ignored in production (see [`cms.md`](cms.md#previewing-clock-sensitive-and-unpublished-states)) |

## Scripts

| Command | Action |
|---|---|
| `pnpm dev` / `pnpm build` / `pnpm start` | Development server, production build (runs `panda codegen` first), production server |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` / `pnpm lint:fix` | ESLint on `src/` |
| `pnpm format` / `pnpm format:check` | Biome formatter on `src/` |
| `pnpm test`, `pnpm test:e2e` | Vitest and Playwright; see [`testing.md`](testing.md) |
| `pnpm typegen` | Regenerate `schema.json` and `sanity.types.ts` after schema or GROQ changes |
| `pnpm images:unused` | List files in `public/img/` that nothing references (`images:unused:json` for JSON) |

Tests: [`testing.md`](testing.md). Sanity schema, scripts and webhook setup: [`cms.md`](cms.md).
