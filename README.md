# Bucharest Sculpture Days

Website for Bucharest Sculpture Days (ZSB), an annual contemporary sculpture event in Bucharest, live at [sculpturedays.com](https://sculpturedays.com). It publishes each edition's theme, artists, credits and a filterable day-by-day program, with a shareable page and Open Graph card for every event. Editors manage all content in a Sanity Studio embedded in the same app at `/studio`.

## How it works

Content lives in one Sanity dataset. Pages are React Server Components that fetch it through a GROQ layer in `src/sanity/lib/`: each fetcher runs a query, then a mapper turns the result into the view-model the components render (for example `Edition` in `src/types/edition.ts`). Absent values are resolved in the mapper, so components receive total data.

Pages are cached with Next.js `cacheComponents` (`'use cache'`). Cache entries have no expiry. They are invalidated in two ways:

- A Sanity webhook posts to `/api/revalidate/tag`, which revalidates the tags of the changed document types and then re-fetches the affected pages.
- `<SanityLive />` refreshes tabs that are already open.

Draft mode reads request cookies, which `'use cache'` forbids. Each previewable route therefore splits into a dynamic half that resolves draft state and a cached half keyed on the result. `DraftAware` and `singletonPage` implement that split. Details are in [`docs/cms.md`](docs/cms.md).

Domain behavior worth knowing before changing code:

- Every edition is an `edition` document. Its `status` (`announced` or `live`) decides whether `/editions/<year>` is reachable. Latest and Upcoming editions are derived from dates, not stored.
- Events are nested in their edition and addressed by `/editions/<year>/events/<key>`. On in-app navigation the event opens as a modal over the program (an intercepting route); on a direct load it renders as a page.
- Whether an event has passed is decided in the browser, against the current Bucharest date, because the page HTML is cached.
- `src/app/(beller)/` is a second root layout for a Romanian-language landing page, `/galeria-beller`, with its own Sanity singleton.

Vocabulary is defined in [`CONTEXT.md`](CONTEXT.md).

## Stack

Next.js 16 (App Router, React Compiler), React 19, TypeScript, Panda CSS, Sanity (Studio and `next-sanity`), GSAP for the carousel and lightbox, Vitest with Testing Library, Playwright, Biome and ESLint. Fonts are Dela Gothic One and Montserrat. Analytics are Google Analytics (after cookie consent) and Umami; both are optional.

`styled-components` is in `package.json` only because `sanity` and `@sanity/ui` require it as a peer dependency.

## Getting started

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

### Environment variables

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
| `NEXT_PUBLIC_ZSB_TODAY` | no | `YYYY-MM-DD` date override for local previews; ignored in production |

## Scripts

| Command | Action |
|---|---|
| `pnpm dev` / `pnpm build` / `pnpm start` | Development server, production build (runs `panda codegen` first), production server |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` / `pnpm lint:fix` | ESLint on `src/` |
| `pnpm format` / `pnpm format:check` | Biome formatter on `src/` |
| `pnpm test` / `pnpm test:watch` | Vitest unit and component tests |
| `pnpm test:e2e` | Playwright against a production build |
| `pnpm typegen` | Regenerate `schema.json` and `sanity.types.ts` after schema or GROQ changes |
| `pnpm images:unused` | List files in `public/img/` that nothing references (`images:unused:json` for JSON) |

Testing is described in [`docs/testing.md`](docs/testing.md).

## Project structure

```text
src/
  app/
    (site)/          Public pages, shared layout, one directory per route
    (beller)/        Galeria Beller landing page and /artists/<slug> profiles (own root layout)
    studio/          Embedded Sanity Studio
    api/             Draft-mode toggles and the revalidation webhook
  components/        Shared components; ui/ holds the primitives
  design-system/     Panda preset: tokens, patterns, recipes
  sanity/            Studio config, schema, GROQ queries, fetchers, mappers
  lib/               Constants, SEO and JSON-LD builders, date and format helpers
  types/             Runtime types such as Edition
scripts/             Sanity import and migration scripts, image tooling
e2e/                 Playwright specs
docs/                CMS and testing guides
```

Design tokens, type scale, breakpoints and component rules are in [`DESIGN.md`](DESIGN.md). Component styles live next to each component in `*.recipe.ts` files.

## Known limitations

- The site is English only, except `/galeria-beller`, which is Romanian.
- `/artists` is a name index. `/artists/<slug>` profiles exist only for artists with `work` documents and use the Galeria Beller layout.
- The "N editions" count on the homepage is the hand-maintained constant `EDITIONS_HELD` in `src/lib/constants.ts`.
- Preview content for clock-sensitive states is authored as draft documents in the production dataset. There are no fixtures. See [`docs/cms.md`](docs/cms.md).

## License

No license file is present. All rights reserved by default.
