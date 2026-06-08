# Per-event routes, an intercepting-route modal, and per-event OG cards

[ADR 0014] argued events needed no standalone route because sharing targeted
only the filtered calendar view. We reversed that: a single event must be
**shareable** — its own URL, and its own social preview card. This ADR records
how, and what it costs the calendar's existing URL/state model.

## Per-event URLs via a real route, not a query param

Each event gets a path-keyed route:

```
editions/[year]/events/[key]/page.tsx             — hard nav / refresh / share
editions/[year]/events/[key]/opengraph-image.tsx  — the social card
editions/[year]/@modal/(.)events/[key]/page.tsx   — soft nav: modal over the calendar
editions/[year]/@modal/default.tsx                — null
```

The `[key]` is the event's array `_key` (the same id the calendar already used to
key the modal). No human slug, no event document — the route reads the
already-cached edition and picks the event out of its nested list ([ADR 0014]
still holds).

We chose a **route over the shipped `?event=` query state** because the route is
keyed on a path param, not `searchParams`. That is what makes it free of the
cache compromise the query approach carried: a path-param route is statically
prerenderable (`generateStaticParams` over every event), and its
`opengraph-image` is statically optimised and cached per event. A query-param
card would have had to read `searchParams` at request time.

## The modal is an intercepting + parallel route, not client history

Soft-navigating from the calendar opens the event in the `@modal` slot
(intercepting route), over the edition page that's already mounted. This is the
framework's documented modal-as-URL pattern and gives us, for free, the four
behaviours the hand-rolled modal was reaching for: shareable URL, survives
refresh, closes on back, reopens on forward. React `<Activity>` (Cache
Components) preserves the calendar's scroll and filter state across the soft nav,
so none of that needs manual restoring.

**There is no standalone event page.** A cold load / scraper / refresh of
`/editions/<year>/events/<key>` renders the **full edition page with the event's
modal open over it**, not an event-only page — the event always reads in the
context of its programme. To avoid duplicating the edition page, its body is
extracted into a shared component that both `[year]/page.tsx` and the
`events/[key]` route render; the event route additionally renders the modal. The
edition body is `'use cache'`, so prerendering one page per event reuses the one
cached body.

This **retires `calendar-url.ts`** — the raw `history.pushState`/`popstate`
layer built to keep filter and event state in the URL without
`useSearchParams`. With the rewrite, filters move to real `searchParams`
(`useSearchParams` + `router.replace`, read inside a `Suspense` boundary) and the
event moves to the route. One navigation model instead of two.

### Fallback if intercepting/parallel routes don't hold under PPR

[ZSB-54]'s opening step validates two assumptions at once: that a `@modal` parallel
slot coexists with the edition page's Visual-Editing dynamic island, **and** that
`useSearchParams` works inside the `'use cache'` edition body without forcing the
route fully dynamic. If either fails, the fallback keeps the user-visible result
identical: the real `events/[key]` route (full edition page + modal) still serves
hard loads, OG, and shares — but the **in-app** modal is rendered client-side off
`usePathname` instead of the parallel slot. Less idiomatic, no `@modal` slot, but
URLs, sharing, and OG all still work, so the migration ships either way.

## The OG card has three branches, and editors can override

The per-event `opengraph-image` composes, in priority order:

1. **Editor override** — if the event carries an OG override image,
   `generateMetadata` points `og:image` straight at its Sanity CDN URL; no
   generation runs.
2. **Poster present** — the event's image, with the **ZSB badge** composited on
   top (the badge is a shared brand asset, read from the project at build time).
3. **Neither** — a generated text card: event name, venue, and the composed
   date/time/duration, plus the badge.

## Considered alternatives

- **Keep `?event=`, add dynamic `generateMetadata`.** Lower churn — the shipped
  modal stays. Rejected: reading `searchParams` in metadata is a request-time
  API, so the card can't be statically optimised, and the OG image needs a
  separate path-keyed handler anyway (a query can't key an `opengraph-image`
  segment). Once you need a path key for the image, the route is the cleaner
  whole.
- **Keep the raw-history client modal, bolt a route on beside it.** Two URL
  models for one surface; opening an event from a filtered view mixes
  router-driven path nav with manually-pushed query and races on `popstate`.
  Rejected as a bug surface.
- **Promote events to documents for a free route + slug.** Already rejected by
  [ADR 0014] for the authoring cost; the `_key` route gives addressability
  without it.

## Consequences

- ZSB-40 (the shipped `?event=` modal), ZSB-29 (filters) and ZSB-33 (filtered
  share) are reworked onto the router; the filtered-view share now rides on
  `searchParams` rather than the `#program` hash + manual query.
- New work: the per-event OG override field on the event schema, the
  `opengraph-image` generator, and the ZSB badge asset ([ZSB-53]) — composited
  into branches 2 and 3 when it lands, an enhancement rather than a blocker, so
  the cards ship without it first.
- **Open risk, de-risked as [ZSB-54]'s first step (ZSB-52 folded in):** the parallel-routes rule "if one
  slot is dynamic, all slots at that level must be dynamic" meets the edition
  page's Visual-Editing dynamic island (SanityLive / stega — [ADR 0012]). The
  edition route already reads `draftMode`/cookies at the top, so its `children`
  slot is already dynamic and the rule is *likely* satisfied — but unproven. That
  first step validates that **and** that `useSearchParams` works inside the `'use
  cache'` edition body without forcing the route fully dynamic. The fallback
  above ships the same behaviour if either fails.

## Reversibility

Medium. The route, the OG infra, and the schema field are additive, but
retiring `calendar-url.ts` and moving filters to `searchParams` rewrites the
calendar's state layer — reversing means rebuilding it. Recorded so a future
reader doesn't reintroduce the raw-history layer or wonder why events have a
route but no slug.

See also: [ADR 0012] (the cache split this renders inside), [ADR 0014] (the
content model this amends — events stay nested).

[ADR 0012]: ./0012-cache-components-three-layer-fetch.md
[ADR 0014]: ./0014-event-venue-content-model.md
[ZSB-54]: https://linear.app/zsb/issue/ZSB-54
[ZSB-53]: https://linear.app/zsb/issue/ZSB-53
