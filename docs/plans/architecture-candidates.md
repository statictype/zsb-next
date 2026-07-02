# Architecture deepening candidates

Backlog from an architecture-friction pass (`/improve-codebase-architecture`).
Terminology: **module** / **interface** / **seam** / **deletion test** — see
that skill's glossary if unfamiliar. Not a decision log — just findings,
worked through one at a time.

## ✅ Done — `preset.ts` conflated identity with recipe contracts

Split into `src/design-system/tokens.ts` (identity: colors, type, motion,
layout language) and `src/design-system/recipes/*` (one file per
variant-driven recipe), with `preset.ts` reduced to the `definePreset`
assembly. Also de-duplicated the light-ground CSS-var block `card`/`section`
each hardcoded separately. Verified: generated `styled-system/` output is
byte-identical before/after. Landed in `89b7cdb`.

## ✅ Resolved (rejected) — the `DraftAware` → `'use cache'` leaf → presentational shell triad

**Files:** `src/app/(site)/page.tsx`, `src/app/(site)/editions/[year]/edition-content.tsx`, every other dynamic route.

Grilled this expecting to extract a shared `definePage(fetchers, Shell)`
helper. Rejected: Next's `'use cache'` serialization rules explicitly forbid
functions as cache-key material except as inert pass-through (never called)
— a generic helper's leaf would close over and *call* `fetchData`/`Shell`,
which is the disallowed pattern. Confirmed against the bundled Next 16 docs,
not assumed. `DraftAware` (`src/components/DraftAware/DraftAware.tsx`) is
already the correct, real extraction — it owns everything *outside* the cache
boundary; the leaf itself has to stay per-page.

Three concrete findings fell out of the same investigation instead:

- **Fixed:** `CachedEdition` awaited `getSiteSettings` *after* `getEdition`
  resolved despite neither depending on the other — folded into one
  `Promise.all`. Landed.
- **Attempted, reverted:** adding `'use cache'` to the three `opengraph-image.tsx`
  routes (all were `ƒ` fully-dynamic per `pnpm build`, so social-unfurl bots
  regenerate the share card from scratch every time) broke the build —
  `ImageResponse` is a class instance, and `'use cache'` return values are
  held to the same restrictive serializable-types list as arguments. Real fix
  is caching the data fetch and constructing `ImageResponse` outside the
  boundary — a real follow-up candidate, not a one-liner. Not attempted this
  session.
- **Investigated, not drift:** `editions/[year]`'s bypass of `DraftAware` is
  forced by Next's parallel-routes rule (the `@modal` slot is inherently
  dynamic, so its sibling must be too) — but `pnpm build` shows `◐` Partial
  Prerender with the same 1-year cache as the fully-static pages, not `ƒ`.
  The theoretical SEO/TTFB cost from ADR 0015's "open risk" doesn't show up
  in the actual build. Left the `@modal` architecture alone.
  `notFound()` handling on Visit and the Editions list looked like drift too;
  both turned out to be intentional graceful degradation once checked against
  their actual component contracts. Left alone.

Full writeup: `journal/use-cache-serialization-limits.md` (untracked).

## ❌ Rejected on inspection — Venue rollup "computed once" mismatch

**Files:** `src/lib/venues.ts` (`rollUpVenue`, `groupVenuesByType`), `src/sanity/lib/editions.ts` (`mapEvents`).

Originally flagged (from the initial survey) as `groupVenuesByType`
re-deriving parent/child structure instead of reusing the precomputed
`rollUp`, making CONTEXT.md's "computed once... can't disagree" claim
inaccurate. Didn't hold up on a full read of `venues.ts`:

- All three real consumers — `calendar-filters.ts` (filter chips),
  `seo.ts` (JSON-LD Places), and `groupVenuesByType` (`v.rollUp` at
  `venues.ts:107`) — read the stamped `rollUp` directly; none re-touches
  `partOf`. The "computed once" claim is literally true of the code.
- `groupVenuesByType`'s tree-building (merging address/mapUrl, counting
  events, sorting) is genuinely separate work from "what's this venue's
  rolled-up identity" — `rollUp` was never meant to produce a tree, only a
  flat grouping key. Nothing is being redone.
- `rollUpVenue` is 3 lines but earns its keep by the "multiple consumers
  depend on this one definition staying consistent" bar, not by line count.
- Checked a plausible failure mode (child nodes keyed by raw `v.name` vs. the
  calendar's `rollUp.slug` diverging on a capitalization mismatch) — not
  possible in practice, since `partOf` is a Sanity document reference, not
  free text, so a venue's `.name` always resolves identically.

CONTEXT.md's existing wording already separates "rollUp is the shared key"
from "`groupVenuesByType` is the Visit-specific tree builder that consumes
it" accurately — no doc change needed either.

## ✅ Done — `generateStaticParams` duplicated verbatim across the event page and its OG-image route

**Files:** `editions/[year]/events/[slug]/page.tsx`, `.../opengraph-image.tsx`, `src/data/editions/index.ts`.

Both routes independently fetched all editions and flattened events into
`(year, slug)` params — identical logic, no shared owner. Extracted
`getAllEventParams()` into `src/data/editions/index.ts` (alongside
`getAllEditionYears`, same `'use cache'` shape), both routes now just
`return getAllEventParams()`. Confirmed via `pnpm build`: identical route
table before/after (same 45 prerendered event pages, same `◐`/`ƒ`
classification) — pure structural extraction, no behavior change. Landed.

## ✅ Done (redirected) — `staticPages.ts` `normalize*` mappers exported only for tests

**Files:** `src/sanity/lib/staticPages.ts`, `editions.ts`, `press.ts` and their tests.

Original framing ("un-export and test the fetcher end-to-end, matching this
repo's existing fetcher-test convention") was wrong — that convention doesn't
exist anywhere in this codebase. `docs/testing.md` is explicit: *"The live
data layer is mocked, not hit... the functions under test are pure and never
call it."* `editions.test.ts` does the identical thing (`vi.mock('./live', …)`
+ test the pure mappers directly). Testing fetchers end-to-end would also be
largely pointless: `'use cache'` is a directive Next's compiler interprets —
outside the Next build pipeline (i.e. in Vitest) it's inert, so "testing the
fetcher" wouldn't exercise any real caching behavior, just `queryData` +
mapper composition through much heavier Sanity-query-result-shaped fixtures.

**The real finding, once pushed on:** the `vi.mock('./live', …)` boilerplate
in all three test files (`editions.test.ts`, `press.test.ts`,
`staticPages.test.ts`) is a symptom, not the disease. `./live` calls
`defineLive()` at **module load time**, which throws outside a React Server
Component. The pure mappers (`mapEvents`, `mapEdition`, `normalizeAbout`,
`flattenKit`, etc.) were bundled in the *same file* as `'use cache'` fetchers
that import `queryData` from `./live` — so importing a pure mapper for a test
transitively pulled in RSC-only infrastructure it never touches, forcing the
mock. Checked the mappers' own dependencies (`carousel.ts`, `image.ts`,
`edition-dates.ts`, `slugify.ts`, `defined-fields.ts`, `derive-editions.ts`):
none import `./live`. The one near-miss (`@/lib/seo`'s `FaqEntry` type) is
already a type-only import, erased at compile time — zero runtime coupling.

**Fix:** split all three files into `{name}.ts` (fetchers: `'use cache'`,
`queryData`, delegates to mappers) + `{name}-mappers.ts` (pure, zero `./live`
dependency) — `editions-mappers.ts`, `press-mappers.ts`,
`staticPages-mappers.ts`. All three test files now import straight from the
mappers module with **no mock at all**, not a better mock. Verified: `pnpm
typecheck`/`lint`/`format` clean, all 162 unit tests pass, and `pnpm build`
route table is byte-identical to before (same static/PPR/dynamic
classification for every route). Zero external importers of any mapper
existed outside its own file + test, confirmed by grep before moving anything.
