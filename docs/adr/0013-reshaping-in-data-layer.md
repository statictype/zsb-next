# Reshaping lives in the data layer; the shapes it produces live in `src/types`

A Sanity fetcher that needs **more than a 1:1 passthrough** owns a mapper, and
that mapper lives in the data layer (`src/sanity/lib/`) next to its fetcher and
query — not in the page that renders it. A fetcher whose result the view can
consume **as-is** returns the raw GROQ result type and has no mapper.

Today that splits the fetchers into two groups:

- **Mapped.** `getEditionFromSanity` → `mapEdition` (`editions.ts`);
  `getHomepage` folds in `mapSlideshow` so it returns `slideshow` as
  `HeroImage[]` (`homepage.ts`); `mapVisit` + `buildFaq` sit beside the
  `VisitPage` type (`staticPages.ts`). Each does real work — stripping Sanity's
  `_key`/`_type`/`_ref`, composing fields (`dateTape`), resolving image URLs +
  LQIP, deriving the FAQ from structured fields.
- **Passthrough.** `getAboutPage`, `getPartnersPage`, `getPrivacyPage` return
  `NonNullable<…_QUERY_RESULT>` directly. Their content is flat and maps ~1:1;
  the component reads the GROQ shape and applies field-level `?? ''` fallbacks.

The dividing line is the **deletion test**. A mapper over a flat page would be a
pass-through: delete it and no complexity concentrates — it just moves the same
fields across one boundary. The editions / homepage-slideshow / visit mappers
fail to delete cleanly — their logic would reappear, scattered, across every
caller — so they earn their place. Forcing a mapper onto the flat pages for
"consistency" would add shallow layers; leaving the non-trivial reshaping in the
page (where `mapSlideshow` and `mapVisit` originally lived) scatters
data-shaping into the view and couples components to the generated GROQ types.

## The shapes mappers produce live in `src/types`, not in components

The runtime types a mapper returns — `Edition`, `ImageData`, `HeroImage`,
`Amenity`, `TransportRoute`, `VisitData` — live in `src/types/edition.ts`. The
component that renders the shape (`HeroSlideshow`, `VisitSection`) imports it
**from** `src/types`; so does the data layer that produces it. Neither imports
the other.

This is deliberate. When a mapper's return shape is defined as a component's
prop type (e.g. `mapVisit` once returned `VisitSection`'s `VisitSectionProps`),
the data layer ends up importing from a component — the dependency points
**data → view**, backwards. Seating the shape in `src/types` makes both sides
depend on the type instead: **data → types ← view**. Presentation-only concerns
(the amenity-icon component map, decorative pixel positions) stay in the
component; only the data shape moves.

## Considered alternatives

- **Uniform mappers — every fetcher maps before returning.** Symmetric, but the
  flat pages gain a pass-through layer that fails the deletion test. Skipped:
  depth should track shape complexity, not be applied evenly.
- **No mappers — pages reshape inline.** The prior state for home/visit. Keeps
  the data layer thin but smears reshaping across the view, duplicates the work
  `mapEdition` already does in the lib, and couples components directly to
  `…_QUERY_RESULT` types so a GROQ projection change ripples into JSX. Skipped.
- **Keep view-model types in the components.** Minimal churn, but inverts the
  dependency (the data layer imports a component's prop type). Skipped — type-only
  or not, data should not depend on the view.

## Reversibility

High. Moving a mapper back into a page, or relocating a shape, is mechanical —
no schema or query change. The rule is a placement convention, not a data shape.

See also: [ADR 0008](./0008-derive-edition-listings-from-status.md) (what the
edition fetchers return) and [ADR 0012](./0012-cache-components-three-layer-fetch.md)
(the cache split the mapped fetchers sit inside). Surfaced by an architecture
review; recorded so the home/visit-vs-flat-page asymmetry isn't re-flagged as
drift.
