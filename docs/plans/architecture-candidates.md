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

### Venue rollup: the "computed once" promise doesn't match what `groupVenuesByType` does

**Files:** `src/lib/venues.ts` (`rollUpVenue`, `groupVenuesByType`), `src/sanity/lib/editions.ts` (`mapEvents`).

CONTEXT.md's Venue section says rollUp is "computed once... so those surfaces
can't disagree." `rollUpVenue` itself is a one-line parent-or-self ternary
(deletion test: inlining it into `mapEvents` loses nothing). The module with
the real logic — `groupVenuesByType` — re-derives parent/child structure from
the stamped rollUp rather than reusing a precomputed shape, so the real
complexity isn't actually behind `rollUpVenue`'s seam.

**Candidate:** decide whether `rollUpVenue` should be inlined, and whether
`groupVenuesByType`'s traversal is the thing that should be named/promoted as
the actual "computed once" seam CONTEXT.md describes — then sharpen the
CONTEXT.md wording to match.

### `generateStaticParams` duplicated verbatim across the event page and its OG-image route

**Files:** `editions/[year]/events/[slug]/page.tsx`, `.../opengraph-image.tsx`.

Both routes independently fetch all editions and flatten events into
`(year, slug)` params — identical logic, no shared owner. If event-slug
derivation in `mapEvents` changes, both copies have to be remembered by hand.

**Candidate:** extract a single `getAllEventParams()` in the events data
layer that both routes call.

### `staticPages.ts` `normalize*` mappers are exported only so tests can reach past the fetcher

**Files:** `src/sanity/lib/staticPages.ts` (`normalizeAbout`, `normalizePartners`, `normalizePrivacy`).

These are exported "for the co-located unit test," with no production caller
besides their own fetcher. The tests cross a seam that isn't the interface
real callers use (the fetcher is), so a bug in how the fetcher wires the
mapper wouldn't be caught.

**Candidate:** un-export and test the fetcher end-to-end (mocking
`queryData`, matching this repo's existing fetcher-test convention), or
deliberately promote the mapper as a first-class module if it earns that.
