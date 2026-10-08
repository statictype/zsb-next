# Bucharest Sculpture Days

Website for Bucharest Sculpture Days (ZSB), an annual contemporary sculpture event in Bucharest, live at [sculpturedays.com](https://sculpturedays.com). It publishes each edition's theme, artists, credits and a filterable day-by-day program, with a shareable page and Open Graph card for every event. Editors manage all content in a Sanity Studio embedded in the same app at `/studio`.

## How it works

Content lives in one Sanity dataset. Pages are React Server Components that fetch it through a GROQ layer in `src/sanity/lib/`: each fetcher runs a query, then a mapper turns the result into the view-model the components render (for example `Edition` in `src/types/edition.ts`). Absent values are resolved in the mapper, so components receive total data.

Pages are cached with Next.js `cacheComponents` and invalidated by a Sanity webhook, with `<SanityLive />` refreshing open tabs. Previewable routes split into a dynamic half that resolves draft mode and a cached half. [`docs/cms.md`](docs/cms.md) covers both, and [`CONTEXT.md`](CONTEXT.md) defines the domain terms: edition status, events and their URLs, Latest and Upcoming.

`src/app/(beller)/` is a second root layout for a Romanian-language landing page, `/galeria-beller`, with its own Sanity singleton.

## Stack

Next.js 16 (App Router, React Compiler), React 19, TypeScript, Panda CSS, Sanity (Studio and `next-sanity`), GSAP for the carousel and lightbox, Vitest with Testing Library, Playwright, Biome and ESLint. Fonts are Dela Gothic One and Montserrat. Analytics are Google Analytics (after cookie consent) and Umami; both are optional.

`styled-components` is in `package.json` only because `sanity` and `@sanity/ui` require it as a peer dependency.

## Documentation

- [`docs/development.md`](docs/development.md): setup, environment variables, scripts
- [`docs/cms.md`](docs/cms.md): Sanity schema, fetching, caching, revalidation
- [`docs/testing.md`](docs/testing.md): test layers, setup, CI
- [`CONTEXT.md`](CONTEXT.md): domain vocabulary
- [`DESIGN.md`](DESIGN.md): design tokens and component rules

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
scripts/             Image tooling, app icon generation, organization logo upload
e2e/                 Playwright specs
docs/                CMS and testing guides
```

Component styles live next to each component in `*.recipe.ts` files.

## Known limitations

- The site is English only, except `/galeria-beller`, which is Romanian.
- `/artists` is a name index. `/artists/<slug>` profiles exist only for artists with `work` documents and use the Galeria Beller layout.

## License

No license file is present. All rights reserved by default.
