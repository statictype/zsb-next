# Architecture deepening plan

Remaining **deepening opportunities** surfaced by the `improve-codebase-architecture`
review — refactors that turn a shallow, repeated pattern into one deep module
(a small interface over real behaviour) for better *locality* (change in one
place), *leverage* (callers get more for less), and testability.

Vocabulary: a **seam** is where an interface lives; the **deletion test** asks
whether removing a module would *concentrate* complexity (it earns its keep) or
merely *move* it (a pass-through, not worth extracting).

## Status

| # | Candidate | State |
|---|-----------|-------|
| 1 | Render seam (`Figure`) | ✅ Done — see note below |
| 2 | Media-strip controls (`StripControls`) | ✅ Done — commit `64e8b45` |
| 3 | `generateMetadata` factory (`makePageMetadata`) | ✅ Done — see note below |
| 4 | Mappers in the data layer | ✅ Done — commit `d4e3694`, [ADR 0013](./adr/0013-reshaping-in-data-layer.md) |
| 5 | `useMouseMagnetic` hook | **Pending** — verify overlap first |

---

## 1. A render seam for `ImageData` (highest leverage) — ✅ Done

**Outcome.** Built `src/components/Figure/Figure.tsx` — a server component (no
`'use client'`, so it drops into both the server pages and the client strips)
taking `{ image: ImageData, sizes }` plus the passthrough `Pick<ImageProps,
'className' | 'priority' | 'draggable' | 'style'>`. It internalizes the skeleton
span, `fill`, and the `placeholder="blur"` hand-off (derived from
`image.blurDataURL`). Passthrough props are spread as a rest object so
next/image's exact prop optionality survives `exactOptionalPropertyTypes` (a
direct `priority={undefined}` does not type-check).

Migrated **11 sites** (the 13 minus the two notes below): `Carousel`,
`MediaKitStrip`, `Hero`, `HeroSlideshow`, `MasonryGallery`, `VisitSection`, and
the `editions`, `about` (×2), `partners` (×2) pages. Decisions taken:

- **Name: `Figure`** (chosen over `FillImage`/`BlurImage`/`Media`). It's a UI
  primitive, so it is **not** in `CONTEXT.md`. Per-site visual styling
  (object-fit, radius, transitions) stays in each caller's `className`; `Figure`
  owns only the loading convention.
- **Blur is now uniform.** Projected `lqip` on the about, partners, and visit
  page queries (the visit gap the original note called out, plus the about/
  partners gaps) and regenerated `sanity.types.ts`. Every authored image now
  blurs wherever an LQIP exists — one decision in `Figure`, not 13.
- **`MediaKitStrip` blur de-drifted.** Its separate `blurDataURL` field was
  removed; `flattenKit` (press page) now carries the LQIP on `item.image` so the
  single `image: ImageData` is the only blur source.
- **`Lightbox` deliberately excluded.** Its load-tracked crossfade
  (`!loaded` skeleton gate + opacity + `onLoad` + preload frames + `contain`)
  is a richer convention than the 11 paint-over sites; folding it in would bloat
  the interface with props only it uses. Left as-is.
- **Dead `MediaKit` (grid) component deleted** — it had zero references; only
  `MediaKitStrip` is used (press page).

---

**Problem.** `ImageData` (`{ src, alt, blurDataURL? }`) has a deep adapter on the
way *in* — `toImageData` / `requireImageData` / `imageDataOrPlaceholder` in
`src/sanity/lib/image.ts` wash Sanity-isms into a clean runtime shape — but **no
seam on the way out**. The "how an authored image renders" convention is hand-
rolled at **13 sites**: a skeleton pulse span + `<Image fill …>` + the blur
hand-off.

Skeleton + `<Image>` sites (`<span aria-hidden className={shared.skeleton} />`):
- `components/Carousel/Carousel.tsx:116`, `components/MediaKitStrip/MediaKitStrip.tsx:82`
- `components/Hero/Hero.tsx:41`, `components/HeroSlideshow/HeroSlideshow.tsx:61`
- `components/MediaKit/MediaKit.tsx:45`, `components/MasonryGallery/MasonryGallery.tsx:38`
- `components/VisitSection/VisitSection.tsx:82`, `components/Lightbox/Lightbox.tsx:187` (gates on `!loaded`)
- `app/(site)/editions/page.tsx:49`, `app/(site)/about/page.tsx:106,132`, `app/(site)/partners/page.tsx:92,116`

The blur conditional-spread `…(blurDataURL ? { placeholder: 'blur' as const, blurDataURL } : {})`
appears at 5 of those (`editions/page.tsx:61`, `MediaKitStrip:91`, `Carousel:126`,
`Hero:50`, `HeroSlideshow:70`). The interface each caller manages (skeleton, `fill`,
`sizes`, blur pairing, objectFit) is nearly the whole implementation — **shallow,
×13** — and already drifting: `MediaKit` and the `about` figures render *no* blur
even where an LQIP exists; `Lightbox` alone gates the skeleton on `!loaded`.

**Solution.** One component — the output mirror of `toImageData` — taking an
`ImageData` plus per-site knobs, internalizing the skeleton, `fill`, objectFit,
and deriving `placeholder="blur"` from the presence of `blurDataURL`:

```tsx
<Figure image={img} sizes="(max-width: 767px) 92vw, 65vw" className={styles.x} priority? />
```

**Benefits.** *Locality*: the loading convention (and the MediaKit/about blur
gap, the visit-hero LQIP gap) becomes one decision instead of 13. *Leverage*:
callers state intent (`image`, `sizes`). *Tests*: the image contract becomes a
real test surface instead of scattered JSX. *Deletion test*: removing it
re-scatters the scaffold across all 13 callers → concentrates, earns its keep.

**Notes.**
- Name: **not** `CoverImage` (collides with an edition's cover/thumbnail). Candidates:
  `Figure`, `BlurImage`, `FillImage`, `Media`. It's a UI primitive, so it does **not**
  go in `CONTEXT.md`.
- Adjacent cleanup it would absorb: `VISIT_PAGE_QUERY` omits the `lqip` projection,
  so the visit hero silently can't blur — fix the query when wiring `VisitSection`.
- Optional, keep separate: 4 sites (`Carousel`, `MediaKit`, `MasonryGallery`,
  `HeroSlideshow`) also repeat an Enter/Space → `lightbox.open(i)` handler. Don't
  conflate it into the image component; if wanted, a tiny `useLightboxKey` /
  openable-wrapper is its own micro-seam.

---

## 3. A `generateMetadata` factory — ✅ Done

**Outcome.** Added `makePageMetadata(fetcher, { title, path, description?, robots? })`
to `lib/seo.ts`. It binds a page singleton's fetcher + its fixed title/path into a
`generateMetadata`, owning the resolve-perspective → fetch (stega off) → map-meta
orchestration in one place. The five static pages collapse to one line each:

```ts
export const generateMetadata = makePageMetadata(getAboutPage, { title: 'About', path: '/about' })
```

Migrated `about`, `partners`, `press`, `visit`, `privacy`. The privacy `robots`
override rides the config's optional `robots` (merged onto the result), and the
`metaDescription ?? SITE_DESCRIPTION` fallback now lives once in the factory.
Verified with `pnpm build` — Next picks up the const-bound `generateMetadata` and
all five pages prerender. Per the note below, **no** `makePage()` route wrapper
was added (pure pass-through; fails the deletion test).

---

**Problem.** `pageMetadata()` (`lib/seo.ts`) is already a clean adapter, but the
orchestration around it is copy-pasted across **5 pages**:

```ts
const { perspective } = await getDynamicFetchOptions()
const page = await getX({ perspective, stega: false })
return pageMetadata({ title, description: page?.metaDescription ?? SITE_DESCRIPTION, path, shareImage: page?.ogImage })
```

Sites: `about/page.tsx:12`, `partners/page.tsx:17`, `press/page.tsx:34`,
`visit/page.tsx:16`, `privacy/page.tsx:13` (privacy adds a `robots` override).
Only the fetcher, title, and path vary; the "resolve perspective → fetch
singleton → map meta fields" knowledge is duplicated, seated nowhere.

**Solution.** A factory in `lib/seo.ts` binding `(fetcher, { title, path, …override })`
→ a `generateMetadata`, with an optional merge for the privacy `robots` case:

```ts
export const generateMetadata = makePageMetadata(getAboutPage, { title: 'About', path: '/about' })
```

**Benefits.** *Locality*: the description-fallback rule, the always-strip-stega
perspective handling, and any future canonical/hreflang change move to one place.
*Tests*: the metadata-resolution policy gets one interface.

**Notes.**
- Does **not** conflict with [ADR 0012](./adr/0012-cache-components-three-layer-fetch.md):
  that ADR rejects a factory hiding the **render** `'use cache'` boundary; metadata
  fetchers are already cached behind their own directive, so binding them is safe.
- Do **not** also build a `makePage()` route wrapper — it only hides `<DraftAware>`
  behind ~3 fewer lines and fails the deletion test (pure pass-through).

---

## 5. A `useMouseMagnetic` hook

**Problem.** `components/MagneticButton/MagneticButton.tsx` and
`components/PartnerBadge/PartnerBadge.tsx` both hand-roll the same "follow the
cursor, snap back with an elastic GSAP ease" interaction (~40 lines each):
offset-from-centre math, transform on move, elastic return on leave. Same
mechanism, two unshared copies — the shape `use-scroll-snap-strip` was in before
it was extracted.

**Solution.** `useMouseMagnetic(ref, { strength, damping })` returning the
pointer handlers; both components become thin.

**Benefits.** *Locality*: GSAP easing/duration/threshold tuned once. *Deletion
test*: the math reappears in both callers → concentrates. Medium value (lower
traffic than #1).

**Notes.** Verify the two implementations actually overlap before extracting —
this candidate came from the Explore pass and hasn't been hand-confirmed like the
others. If `PartnerBadge`'s motion differs materially (scale-on-enter, ripple),
scope the hook to the shared core and leave the divergent bits in each component.

---

## How to pick one up

Each candidate is independent. Order by leverage: **#1** is the widest (13 sites,
real drift to fix). **#3** is a clean, low-risk factor. **#5** wants a
verification pass first. Grill the interface before building (the
`improve-codebase-architecture` skill walks the design tree); land naming in
`CONTEXT.md` only for domain concepts, not UI primitives.
