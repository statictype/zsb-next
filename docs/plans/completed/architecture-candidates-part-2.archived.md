# Architecture candidates — part 2 — Decision log (completed)

External-consultant grilling session, continuing from
[`architecture-candidates.archived.md`](./architecture-candidates.archived.md).
All prior decisions, including ADRs, treated as arbitrary — nothing re-litigated
just because it's documented, only because it's questioned and holds up (or
doesn't) on inspection.

Status: every item below is settled **and landed**.

---

## ✅ Macro — editor draft-preview / caching / staging

Opened as "does draft preview earn its keep, given no staging env and a single
live dataset." Turned out to be two separate questions the original framing
conflated.

**Draft-mode preview (ADR 0012's three-layer split): keeps.** Confirmed with
the user: two editors, no established habit yet, but they explicitly want to
preview pages before publishing. Given that requirement, `DraftAware` is
already the *lean* solution — Cache Components make a page dynamic only for
the cookie-holding editor's own request, not for the whole build the way a
`force-dynamic` route-segment flag would. Nothing to cut here.

**Click-to-edit (`stega` + `<VisualEditing />`): cut.** Not used, not wanted
("click to edit is not important"). `presentationTool`'s `previewUrl` in
`sanity.config.ts` wires the Presentation iframe to
`/api/draft-mode/enable|disable` independently of `VisualEditing` — the
iframe-preview flow keeps working with click-to-edit removed. Landed:

- `DynamicFetchOptions` (`src/sanity/lib/live.ts`) shrank from
  `{ perspective, stega }` to `{ perspective }`.
- `<VisualEditing />` import + mount removed from `src/app/(site)/layout.tsx`,
  along with the client-level `stega: { studioUrl }` config in `client.ts`.
- Every hardcoded `{ perspective: 'published', stega: false }` /
  `{ perspective, stega: false }` literal lost its `stega` field.
- The now-dead `stegaClean()`/`clean()` defensive stripping in `seo.ts` (21
  call sites) and `press/page.tsx` was removed too — found during
  implementation, not originally scoped, since leaving it would have been
  dead weight from the same cut feature.

**"No staging env": not actually true, closed with no action.** Confirmed:
Vercel already builds a working preview deployment per branch/PR against the
live Sanity dataset, and the user already uses them. Code-staging and
content-preview are different axes — this session was about the latter. No
infrastructure change needed.

**Next/React version: already current.** `next@16.2.4`, `react@^19`,
`cacheComponents: true`, `reactCompiler: true`. There was no version-upgrade
lever to pull; whatever the ask meant by "upgrading project setup," it isn't
a dependency bump.

Landed in `273332d`.

---

## ✅ Item 1 — Edition build-time fetch pattern duplicated

**Files:** `editions/[year]/page.tsx`, `events/[slug]/page.tsx`,
`editions/[year]/opengraph-image.tsx`, `events/[slug]/opengraph-image.tsx`,
`src/data/editions/index.ts`, `src/sanity/lib/live.ts`.

**Partially stale on inspection.** The agent's original framing claimed the
*entire* `generateStaticParams` enumerating every `year × event.slug` was
duplicated across the event page and its OG route — false as of this session;
`getAllEventParams()` already lived in `src/data/editions/index.ts` and both
routes called it (landed in `fc9137c`, predates this doc).

**What was still real, confirmed by reading the current files:**

- `generateStaticParams` for years-only was byte-identical in
  `editions/[year]/page.tsx` and `editions/[year]/opengraph-image.tsx` — no
  shared helper existed for this one (unlike the event version).
- `getEdition(Number(year), { perspective, stega: false })` for metadata was
  byte-identical in `editions/[year]/page.tsx` and `events/[slug]/page.tsx`.
- The OG-route `{ perspective: 'published', stega: false }` literal was a
  named `PUBLISHED` const in one file, inlined without a name in the other.

**Landed:** extracted `getAllEditionYearParams()` and `getEditionForMetadata()`
into `src/data/editions/index.ts`, mirroring the existing `getAllEventParams`
shape — both route pairs shrank to one-line calls. `LivePerspective` is now
re-exported from `@/sanity/lib/live` rather than reaching past the bridge
module into `next-sanity/live` directly.

**Confirmed as existing precedent, not a new pattern:** `src/lib/seo.ts`
already has `makePageMetadata(fetcher, config)`, a shared seam solving the
same "resolve perspective → fetch → strip stega" problem for the static
pages (about/partners/visit/press/privacy). It doesn't fit editions/events
directly — it bakes in a fixed `{ title, path }`, which a per-year/per-event
dynamic route doesn't have — so `getEditionForMetadata` is the right-sized
analog for the dynamic-route shape, not a divergence from house style.
(Homepage's `generateMetadata` also hand-rolls the pattern instead of using
`makePageMetadata` — noted for awareness, left out of scope.)

**Scope broadened during the sanity pass.** A full grep for
`perspective: 'published'` turned up the same literal in 9 real (non-test)
places, not just the 2 OG routes: `DraftAware.tsx`, `artists.ts`,
`editions.ts` (×2), `data/editions/index.ts`'s `getAllEventParams`, and what
`getDynamicFetchOptions()` itself short-circuits to. Same root cause as the
OG-route literal, wider blast radius. Landed: one canonical
`export const PUBLISHED: DynamicFetchOptions = { perspective: 'published' }`
in `live.ts`, and every one of the 9 call sites repointed at it instead of
declaring its own copy. The literal collapsed from 9 independent copies to 1.

Landed in `b29174d`.

---

## ✅ Item 2 — Calendar filters' export surface

**Files:** `src/components/Calendar/calendar-filters.ts` (222 lines, 14
exports).

**The original diagnosis didn't hold up.** The doc claimed most of the 14
exports existed "so tests can poke internals" and proposed narrowing the
public interface to ~5 deep verbs. Checked every export against real
(non-test) consumers:

| Export | Real consumer |
|---|---|
| `isSelected` | `CalendarFilters.tsx` |
| `toggleSelection`, `parseFilters`, `serializeFilters` | `useCalendarFilters.ts` |
| `applyFilters`, `computeFacets`, `editionWindow`, `resolveShowPast`, `hasPastEvents`, `hasUpcomingEvents`, `matchesFacets`, `hasActiveFilters` | `Calendar.tsx` — 8 separate calls, each driving a distinct piece of UI (filtered list, chip counts, live/finished window, past-toggle checkbox state, whether to show the toggle at all, reset-button visibility, the "X of Y" match count) |
| `isAllSelected`, `isNoneSelected` | **nobody** — zero product consumers, only their own test |

12 of 14 were genuinely load-bearing; narrowing the interface would have
forced `Calendar.tsx` to reimplement inline what it already calls — the
opposite of the fix. Only 2 were dead weight.

**The real complaint, once pushed on:** not export *count*, but one flat file
mixing four unrelated concerns, so all 14 names were equally visible
regardless of which concern you were touching. Fixed by splitting on
responsibility, not by public/private — landed as:

- **`filter-selection.ts`** — generic per-filter selection algebra, reusable
  if a third filter dimension ever shows up: `FilterSelection`, `isSelected`,
  `toggleSelection`. (`isAllSelected`/`isNoneSelected` deleted here, not
  relocated — dead.)
- **`url.ts`** — pure URL codec, only consumed by `useCalendarFilters.ts`:
  `parseFilters`, `serializeFilters`, the `PARAM_*` constants.
- **`calendar-filters.ts`** (composition root, same file/location) —
  `CalendarFilters`, `DEFAULT_FILTERS`, `FilterOption`, `CalendarFilterOptions`,
  `computeFilterOptions`, `matchesFilters`, `applyFilters`, `hasActiveFilters`,
  `hasUpcomingEvents`, `hasPastEvents`, `resolveShowPast`. The past-filter
  trio stayed here (not a separate file) — they're `showPast`'s own
  resolution logic, not a distinct cross-cutting concern.

**`editionWindow` didn't belong in this file at all.** It had zero dependency
on `CalendarFilters` — it's the edition's own date span (earliest start →
latest end across *all* events, unfiltered), consumed exactly once in
`Calendar.tsx` purely to derive `ended`/`live` status. That's edition status,
not filter state. It shared only its date primitives (`isPastEvent`/
`eventEndIso`) with the filter-timing helpers, which already live in
`src/lib/edition-dates.ts`. **Relocated there** instead of getting its own
"time-window" file — a 4th module for one function would have been the same
mistake (grouping by "touches dates" instead of by actual responsibility)
one level down. The relocation needed a signature change, not a plain
cut-paste: `edition-dates.ts` has its own standing rule (its comment: *"Typed
structurally so this module stays free of `CalendarEvent`"*), so
`editionWindow` was retyped from `CalendarEvent[]` to the module's existing
`EventWhen[]` structural type — `CalendarEvent` satisfies `EventWhen`
structurally, so `Calendar.tsx`'s call site needed no change, and the move
reinforces the module's convention instead of violating it.

**Naming: "facet" → "filter."** `facet` appeared nowhere in `CONTEXT.md`; the
project's own domain language already says "filter chips." "Facet" was
IR/e-commerce jargon introduced only in this file, but it had already leaked
into `CalendarFilters.recipe.ts` (slots `facet`/`facetLabel`) and
`checkbox.ts`'s description — renaming only the data layer would have
swapped one inconsistency for another, so the rename covered all three
layers. Went through two rejected rounds ("chip," "filter group") before
landing on the minimal form — no qualifier beyond what's needed to avoid an
actual collision:

| Was | Landed as | Why |
|---|---|---|
| `FacetSelection` | `FilterSelection` | No collision; reads clearly as `venues: FilterSelection` inside `CalendarFilters`. |
| `FacetOption` | `FilterOption` | No collision. |
| `CalendarFacets` | `CalendarFilterOptions` | Distinct from `CalendarFilters` (current selection) without needing "Group" — this is the *available* options, computed from events. |
| `computeFacets` | `computeFilterOptions` | Matches its return type name. |
| `matchesFacets` | `matchesFilters` | Reads directly: does this event match `filters`. |
| `FacetChips` (component) | `FilterChips` | No collision; takes `options: FilterOption[]`. |
| recipe slots `facet` / `facetLabel` | `filterRow` / `filterRowLabel` | The one real collision risk — the recipe's slot array already had a sibling `'filters'` (plural, the whole bar); `filter`/`filters` in the same array is a typo away from ambiguous. `filterRow` names what it actually is (one row within the bar) without infecting the rest of the vocabulary. |
| checkbox.ts "Controlled facet checkbox" | "Controlled filter-option checkbox" | One checkbox renders one option, not the whole group — more accurate, not just renamed. |

Landed in `5f1151f`.

**Unplanned follow-on, same session:** mid-implementation the user pointed
out the codebase runs `reactCompiler: true`, so the `useMemo`/`useCallback`
calls touched by this split (plus one unrelated `useCallback` in
`RoutedEventModal.tsx`) were redundant. Stripped as a separate commit —
`Calendar.tsx`'s multi-statement `useMemo` block became a named
`computeCounts()` helper (matching the existing `buildSchedule()` pattern);
everything else inlined directly. Landed in `fdf8876`.

---

## ✅ Item 3 — `EditionCard` is a shallow primitive

**Files:** `src/components/EditionCard/EditionCard.tsx` (15 props), callers in
`editions/page.tsx` and `EditionsNav/EditionsNavBand.tsx`.

**The original diagnosis overstated it on two counts.** Checked both actual
callers (there are only two in the whole codebase — "homepage editions list"
in the original framing is `EditionsNavBand`, not a third site):

- **"Repeated across call sites" was false.** Only `editions/page.tsx`
  derived `date: edition.dateTape.split(' · ')[0]` and
  `artistCount: edition.artists.length` — once. `EditionsNavBand` works from
  a deliberately slim `EditionEntry` type (`year`, `theme`, `themeHighlight`,
  `status`) with no `dateTape`/`artists`/`venueLine` at all, because
  `media="none"` cards never render the meta row. There was no second
  occurrence to de-duplicate.
- **The proposed fix (`{ edition: Pick<Edition, …>, variant, href?,
  className? }`) didn't fit either caller.** Coupling the whole card to a
  domain-shaped `Edition` pick assumes every caller has (or could fabricate)
  one. `EditionsNavBand` genuinely doesn't — its data source is a lighter
  edition-list query, and forcing it to satisfy an `Edition`-shaped prop
  would have meant over-fetching just to appease a type, not a real
  simplification.

**What was actually real, narrowly scoped:** exactly 3 of the 15 props —
`date`, `artistCount`, `location` — were derived from raw `Edition` fields,
always passed together as a trio, only by `editions/page.tsx`, only consumed
on the `media === 'image'` path. That was a legitimate (if modest) "the card
should own this derivation" case, without domain-coupling the rest of the
component.

**Landed:** collapsed the 3 scalar props into one optional
`edition?: Pick<Edition, 'dateTape' | 'artists' | 'venueLine'>`, derived
internally by the card only on the `media === 'image'` branch.
`EditionsNavBand` stayed untouched — it already omitted `image`/`date`/etc.,
and continues to omit `edition` the same way. `editions/page.tsx`'s call
site changed from 3 hand-computed scalars to `edition={edition}`. `status`,
`media`, `size`, `href`, and the rest stayed as independent scalar props —
they're genuinely per-caller concerns, not domain derivations.

Landed in `5707348`.

---

## ✅ Item 4 — Event OG route fetches the whole edition — not pursued

**Files:** `events/[slug]/opengraph-image.tsx`.

Flagged by the original doc as low-priority with a real counter-argument
already attached (a slim per-event GROQ query would bypass the shared
`getEdition` cache entry and add a second fetch shape to maintain). Only
worth pursuing if OG cold-render time becomes a measured problem. Recorded,
not scheduled — no code change.
