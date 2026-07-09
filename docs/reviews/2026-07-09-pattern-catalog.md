# Panda pattern catalog — layout drift-collapse (Phase 0, frozen)

Frozen catalog consumed by `panda-pattern-adopt.prompt.md`. Built by inventorying
every hand-rolled layout container in `src/app/**` and `src/components/**` (all
layout lives in `*.recipe.ts` slots today — JSX-level layout is effectively zero:
only `editorialSplit` is called from `.tsx`, in `Manifesto.tsx` and
`ThemeArtists.tsx`; no `Flex/Stack/Grid/...` JSX and no `css()`/`flex()` calls).

**Sequencing step 1 is already done in the working tree:** `panda.config.ts` is
`jsxStyleProps: 'all'`, `strictTokens: true`. `css={{…}}` stays banned in adopted
code; use pattern JSX + utility props.

The real layout shape-set is **8 patterns across 9 clusters**: `Container` (C1),
`editorialSplit` (C2), `Stack` (C3), `Center` (C4), `HStack` (C5 **and** C6 —
C6 is `HStack` with `justify="space-between"`), `Wrap` (C7), `Grid` (C8),
`Divider` (C9). Everything below collapses to them.

---

## View 1 — decision record

Signature key: `{ direction + responsive shift · gap-bucket · align · justify · wrap · columns }`.
Paint/type are **not** in the signature — they rehome per the prompt's policy
table (type → `textStyle` on the leaf; structural paint → `layerStyle`/`section`;
separators → `Divider`; decorative → deleted).

### C1 — Content rail  → `Container`

**Signature:** `maxWidth: maxWidth · marginInline: auto · paddingInline: gutter`.
This *is* the built-in `container`. Two encodings of one shape:

- **Via `sectionInner`/`pageHero` layerStyle (16 slots):** FeaturedEvents.inner,
  about.inner, Calendar.inner, Credits.container, ExternalGallery.inner,
  editions/page.inner, ComingSoon.inner, press/page.{kitHeader,appearancesInner,
  releasesInner}, VenuesView.inner, VisitSection.inner, VisitFaq.inner,
  PageHero.inner, plus `pageHero` (PageHero.hero).
- **Hand-rolled duplicates of the same three declarations:** page.recipe
  `heroInner` (56–57 + hero px 47), `upcomingInner` (142–143), Hero.recipe
  `stage` (30–31, lg px 25), ExternalGallery `inner` (37–38), ArtistsBanner
  `inner` (47–48, px 23), CookieBanner `inner` (37–38), Manifesto `container`
  (20–22), ThemeArtists `inner` (23,28), loading (44,51–52).

**Drift:** the max-width (`maxWidth` 1800px) and gutter (`gutter` token) are
identical everywhere they appear; the only variance is *how* it's spelled
(layerStyle vs three raw props) and whether the gutter sits on the shell or the
rail. ThemeArtists caps at `narrowColumn` on mobile then `maxWidth` at lg — that
is a genuine width variant, not drift.

**Canonical:** `Container` — the one built-in we re-author (it bakes `maxWidth:8xl`
+ `px:4/6/8` into its transform with no props to default), giving `maxW=maxWidth`,
`px=gutter`. The `sectionInner` layerStyle **retires** — see reconciliation R1.
`pageHero` keeps only its *paint* (bg/color/paddingTop ramp); its inner rail
becomes a `Container`.

**Visual delta:** none for the 16 layerStyle sites (same values). Hand-rolled
sites are byte-identical today → none. ThemeArtists' mobile `narrowColumn` cap is
preserved via `maxW` prop override at that one call site.

### C2 — Editorial two-column split  → `editorialSplit` (custom) — **Manifesto + about only**

**Signature:** `flex column (base) → grid 2-col (lg)`, narrow aside + wide prose.
*Decision (grill):* `editorialSplit` is reserved for the genuine editorial
relationship — a narrow aside/headline beside a wide prose body. Only **two**
members qualify:

| member | left (aside) | right (prose) | ratio | note |
| --- | --- | --- | --- | --- |
| Manifesto `container` | title headline | body prose | `0.8fr 1.2fr` → xl `1fr 1fr` | proportional aside |
| about `statementInner` (59) | portrait + byline | letter body | `minmax(260,340) minmax(0,1fr)` → 2xl `minmax(300,380)/1fr` | **capped** sidebar |

**The other five leave C2 → C8 `Grid`** (explicit responsive `columns`, no shared
editorial semantics; each refactored to the `Grid` pattern in the adoption phase,
none left bespoke): **ThemeArtists** `inner` (migrates *out* of its current
editorialSplit use), **VisitSection** `splitLayout` (`5fr 6fr`), **ExternalGallery**
`cardInner` (`1.4fr 1fr`, the left-dominant content+plate card), **partners**
`whySculptureTop` (`1fr 1fr`), and **page `heroInner`** (`1fr auto` + row reorder,
a hero-specific 2-row grid). All are C8, never C2.

**Ratio (resolved):** Manifesto is a *proportional* aside (`0.8fr`, grows with the
rail); about is a *capped* sidebar (`minmax`, holds ~340px so the portrait can't
balloon to ~700px at the 1800px rail). These are genuinely different — capping the
leaf can't cap the *column*, only `minmax` does — so `editorialSplit` keeps a
**2-value `ratio` enum**: `editorial` (`0.8fr 1.2fr`, default) and `aside`
(`minmax(0,340px) minmax(0,1fr)`). `blocklist` the raw grid props against drift.

**Visual delta:** none for Manifesto/about if each keeps its ratio via the enum.
The five migrated members keep their exact columns as `Grid` props → none.

### C3 — Vertical stack  → `Stack` (column, gap md, align stretch)

**Signature:** `flex · column · gap {xs|sm|md|lg|xl|2xl} · align stretch/flex-start · no wrap`.
The dominant shape. Members (file · slot · gap):

- **gap md:** about.statementByline/letterBody,
  Calendar.day/event/marker(col@md)/recap/empty, CalendarFilters.filters,
  ExternalGallery.header(base)/cardLeft, partners.eventBody, privacy.article,
  EditionCard.content, PillarGrid.item, loading.manifesto/venueRow,
  Footer.baseline(base).
- **gap sm:** Calendar.runContent/eventBody, CalendarFilters.filterRow(base),
  Credits.block/partnersBlock/inline, VenuesView.event/child,
  ArtistsBanner.left, VisitSection.list, page(various), privacy nested list.
- **gap xs:** about.authorCaption, CookieBanner.copy, VisitSection.block.
- **gap lg:** VisitSection.content, ExternalGallery(lg), page.heroPanel/heroText,
  Credits.primary(base)/partners/secondary, Footer.primary/cols(base).
- **gap xl / 2xl:** Footer.inner(xl), page.upcomingInner(2xl, → row at lg — see C6).

**Drift:** gap is the only real axis and it's a legitimate scale prop, not drift —
it stays a `gap` prop. `alignItems` is unset (→ stretch) in most; a handful set
`flex-start` which is a no-op delta on single-column text stacks.

**Canonical:** `Stack` (built-in; `defaultValues: { gap: 'md' }` — direction column
and stretch are already the built-in defaults). Common case (`gap md`) needs no
props. Other gaps pass `gap`.
`flex-start` members drop the prop (stretch is visually identical for
block-level children).

**Visual delta:** none — stretch vs flex-start is a no-op for the full-width text
children in every member.

### C4 — Centered box  → `Center` (+ `direction="column"` when stacking)

**Signature:** `flex · align center · justify center` (often `+ column + gap`).
Members: error.page, loading.hero, IsdayBadge.inner, partners.partnerCtaInner,
ExternalGallery.cardRight/plate, Lightbox.lightbox, PartnerBadge.body,
Navigation.mobileShell/mobileNav, Footer.primary/cols (mobile centering).

**Drift:** identical center-both intent; the column+gap ones are a `Center`
wrapping a `Stack`, or `Center` with `direction`/`gap` props.

**Canonical:** `Center` (built-in). Stacking-centered members add
`direction="column"` + `gap`. Footer/Navigation members that only center at base
and switch to row/start at md keep the responsive object on the align/justify
props.

**Visual delta:** none.

### C5 — Inline horizontal group  → `HStack` (row, align center, gap sm)

**Signature:** `flex · row · align center · gap {sm|md} · wrap optional`.
Members: Calendar.pastToggle/marker/markerMeta, ExternalGallery.count/cta,
ArtistsTable.entry, EditionCard.cta, PillarGrid.head(baseline),
VisitSection.item/line, CalendarFilters.reset, EditionTheme.lead, plus the
wrap-carrying ones that route to C7.

**Drift:** align `center` vs `baseline` (PillarGrid.head, CalendarFilters@md,
VenuesView.childHead, EditionTheme.heading) is a real, content-driven variant →
`align` prop. gap sm vs md → `gap` prop.

**Canonical:** `HStack` — **no override needed** (built-in is already row + align
center + gap 8px = our `sm`; we only token-ref it via `defaultValues: { gap: 'sm' }`).
`baseline` members pass `align="baseline"`.

**Visual delta:** none.

### C6 — Space-between bar  → `HStack justify="space-between"`

**Signature:** `flex · row · justify space-between · align {center|flex-end|flex-start} · gap md`.
Members: FeaturedEvents.header(flex-end), Calendar.header(flex-start),
ExternalGallery.header@md(flex-end), EditionCard.meta(center),
ArtistsTable.colHeader/footer(center), CookieBanner.inner@md(center),
Footer.baseline@md(center), EventModal.controls(center), ArtistsBanner.inner@md,
page.upcomingInner@lg(flex-start, gap 3xl).

**Drift:** cross-axis align (`flex-end`/`center`/`flex-start`) tracks whether the
bar aligns a title's baseline or its box — real, kept as `align` prop. Several
are `column → row` at md (ArtistsBanner, CookieBanner, ExternalGallery,
upcomingInner): that's C3-stack-at-base **→** C6-bar-at-md, expressed with
responsive `direction`/`justify`.

**Canonical:** `HStack` with `justify="space-between"` and `align` as needed. The
column→row members use responsive props (`direction={{ base:'column', md:'row' }}`).

**Visual delta:** none.

### C7 — Wrapping chip/tag row  → `Wrap` (gap sm, align center)

**Signature:** `flex · wrap · gap {sm|md} · align center/baseline`.
Members: the `chipRow` layerStyle (CalendarFilters.chips, VenuesView.chips) +
FeaturedEvents.chips/venue, Calendar.counts/runFoot/eventTop,
CalendarMeta.meta, VenueLine.venue, VenuesView.place/childHead,
FollowLinks.follow/links, EventModal.links, Credits.partnersList,
ArtistsTable.meta, Footer.navCol(base), Footer.legal, **VisitSection
`amenityStrip`** *(from C8 — grill: the rigid mobile 2-col grid collapses to a
plain wrapping row of amenity chips)*.

**Drift:** gap sm vs md; align center vs baseline. Both real props.

**Canonical:** `Wrap` (built-in; `defaultValues: { gap: 'sm', align: 'center' }` —
only `align` differs from the built-in). The `chipRow` layerStyle **retires** into
`Wrap` (add `listStyle: none` at the `<ul>` call site — R3). `amenityStrip` adopts
`Wrap gap="md"`.

**Visual delta:** `amenityStrip` loses its guaranteed mobile 2-up — on a narrow
phone the amenity chips reflow ragged (1–3 per row by label width) instead of a
clean 2 columns. Accepted (labels are short). All other members: none.

### C8 — Column grid  → `Grid` (default gap `gridGap`)

**Signature:** `grid · N columns (or ratio) · responsive`. Every member below,
with its adoption. `columns={N}` for uniform repeat(N,1fr) ramps; explicit
`gridTemplateColumns` for ratio grids (ex-C2 — distinct shapes, not collapsed,
the refactor only moves them from recipe slot to `Grid` JSX); `minChildWidth` for
auto-fit. A member being inside a skinned/stateful recipe does **not** exempt its
grid container — the container adopts `Grid`, the recipe keeps only skin/variants
on its other slots. The sole exception is where the *columns themselves* are a
variant.

| member | columns / template | gap · align | adoption |
| --- | --- | --- | --- |
| FeaturedEvents.grid (52) | `columns={{base:1,md:2,lg:3}}` | `gridGap` (default) | `Grid` |
| editions/page.grid (8) | `columns={{base:1,lg:2}}` | `gridGap` (mobile `2xl→gridGap`, 48→16px) | `Grid` |
| loading.artistGrid (68) | `columns={{base:2,md:3,lg:4}}` | `md` (skeleton, kept) | `Grid` |
| Credits.primary (44) | `columns={{base:1,md:2,xl:4}}` | `lg/xl` rhythm (kept) | `Grid` |
| Credits.partners/secondary (90/104) | `columns={{base:1,md:4}}` | `lg` (kept) | `Grid` |
| ArtistsTable.body (45) | `columns={{base:1,md:2}}` | — | `Grid` · ruled-table **skin stays in recipe** |
| PillarGrid.grid (12) | `columns={{base:1,md:2}}` | `0` | `Grid` · item **rhythm/skin stays in recipe** |
| Calendar.runs (144) | `minChildWidth="300px"` (auto-fit) | `md` | `Grid` |
| ThemeArtists.inner *(from C2)* | lg `0.8fr 1.2fr` | rowGap lg / columnGap 4xl | `Grid` |
| VisitSection.splitLayout *(from C2)* | lg `5fr 6fr` | `2xl→gridGap`, align center | `Grid` |
| partners.whySculptureTop *(from C2)* | `columns={{base:1,lg:2}}` (`1fr 1fr`) | `2xl→3xl`, align end | `Grid` |
| page.heroInner *(from C2)* | lg `1fr auto` | columnGap 2xl / rowGap 3xl | `Grid` · children keep `gridColumn`/`gridRow` reorder |
| ExternalGallery.cardInner *(from C2)* | lg `1.4fr 1fr` | — | `Grid` |
| GalleryCarousel.slide (12) | variant grids (trio/duo/featured/full) | sm/md | **stays recipe** — columns *are* the `layout` variant |

**Canonical:** `Grid` (built-in; `defaultValues` default gap → `gridGap`, keeping
the built-in's "no gap when columnGap/rowGap set" guard — `columns` /
`minChildWidth` / raw `gridTemplateColumns` are all handled by the built-in
transform). Deliberate-rhythm members pass an explicit `gap`. `amenityStrip`
(`1fr1fr → md flex-wrap`) is **not** here — it's a wrapping row → C7 `Wrap`.

**Visual delta:** editions/page mobile gap `2xl→gridGap` (48→16px). Others none.

### C9 — Separators & decoration  → `Divider` / delete

~50 `hairline` border sites, classified below (three keep `border`, one becomes
`Divider`):

- **Structural separators → `Divider`:** LinkList.list/item (row rules),
  PillarGrid bookend/pair rules, Credits.secondary/partners top rules (93,107),
  ExternalGallery.footer top rule (91), CalendarFilters top rule (21),
  Calendar.band/agenda/day/events top rules (133,244,275,354), VenuesView group
  & event rules (33,57,76), VisitSection stat top rule (92), Footer top rules
  (36,126), EditionCard.details top rule (79), ComingSoon top rule (20),
  about.carouselSection top rule (57), page editionsHead/lastEdition rules
  (137,186).
- **Structural paint (stays `border` on the box) — a framed surface, not a
  separator:** error.content (54), privacy.settingsRow (49), about image frames
  (39,90), Calendar.count/run frames (111,154), partners cards (46,64,75),
  CookieBanner (22), ArtistsTable.body outer (49), Navigation pills (79,148),
  Hero.frame outline (51). These are box outlines; keep as `border`.
- **Interior column/cell rules → stay `border` (grill: not `Divider`):**
  ArtistsTable.column `borderRight` (56), VenuesView.child `borderLeft` (103),
  ExternalGallery `borderLeft` (126), PillarGrid `borderRight` (51,64). These are
  rules *between grid columns*, toggled by `nth-child`/`last-child` on the cells
  themselves — `Divider` is a standalone in-flow element and would fight grid
  auto-placement. None are cruft (ledger rules, pillar rules, a nesting-indent
  marker), so all stay `border` on the box, outside the Divider cluster.
- **Accent rule → stays `border` (grill):** about `authorCaption` (114)
  `borderTop: 'primary'` (2px pink) is a deliberate brand accent topping the
  author attribution, not a neutral region separator — keep as `border` on the
  box; the `primary` border token stays (single-consumer, fine).

---

## View 2 — adoption index

| cluster-id | signature | pattern + props (JSX) | canonical values | member files |
| --- | --- | --- | --- | --- |
| C1-rail | maxW+auto+gutter | `<Container>` | maxW `maxWidth`, px `gutter` | all `sectionInner`/`pageHero` sites + page/Hero/ExternalGallery/ArtistsBanner/CookieBanner/Manifesto/ThemeArtists/loading rails |
| C2-split | col → lg grid 2-col | `<div className={editorialSplit({ ratio, gap, align })}>` | ratio∈{editorial(def),aside}, align `start` | **Manifesto, about only** |
| C3-stack | col · gap · stretch | `<Stack gap>` | dir col, gap `md`, align stretch | ~30 slots (see C3) |
| C4-center | center both | `<Center [direction gap]>` | align+justify center | error, loading, IsdayBadge, partners, ExternalGallery, Lightbox, PartnerBadge, Navigation, Footer(mobile) |
| C5-hstack | row · center · gap | `<HStack [align] gap>` | align `center`, gap `sm` | Calendar, ExternalGallery, ArtistsTable, EditionCard, PillarGrid, VisitSection, EditionTheme |
| C6-bar | row · space-between | `<HStack justify="space-between" [align] [direction]>` | justify space-between | FeaturedEvents, Calendar, EditionCard, ArtistsTable, CookieBanner, Footer, EventModal, ArtistsBanner |
| C7-wrap | wrap · gap · center | `<Wrap [align] gap>` | gap `sm`, align `center` | chipRow sites, FeaturedEvents, Calendar, CalendarMeta, VenueLine, VenuesView, FollowLinks, EventModal, Credits, ArtistsTable, Footer, VisitSection.amenityStrip |
| C8-grid | grid · N-col / ratio / auto-fit | `<Grid columns \| gridTemplateColumns \| minChildWidth [gap]>` | gap `gridGap` | uniform: FeaturedEvents, editions, loading, Credits, ArtistsTable, PillarGrid · ratio(ex-C2): ThemeArtists, VisitSection, ExternalGallery, partners, page.heroInner · auto-fit: Calendar.runs · *stays recipe: GalleryCarousel (columns=variant)* |
| C9-divider | separator rule | `<Divider [orientation]>` | border `hairline` | separator sites in C9 |

### Registration block (paste into `preset.ts` → `patterns.extend`, sequencing step 2)

**We do not restate the built-in transforms.** `patterns.extend` deep-merges into
the preset-base pattern, so passing only `defaultValues` keeps Panda's transform
and just changes what applies when a prop is omitted. Most patterns need one line;
`HStack`/`Center`/`Divider` need nothing (the built-in defaults already match).
The only genuinely authored patterns are `editorialSplit` (no built-in equivalent)
and `Container` (see its note).

```ts
import { definePattern } from '@pandacss/dev'

export const designSystemPatterns = {
  // Default gaps → our spacing tokens (built-in transforms untouched).
  stack: { defaultValues: { gap: 'md' } },      // C3 · was 8px; align stays stretch
  hstack: { defaultValues: { gap: 'sm' } },     // C5 · token-ref the 8px default; align already center
  wrap: { defaultValues: { gap: 'sm', align: 'center' } }, // C7 · only align differs from built-in
  grid: {                                        // C8 · gridGap default, keeping the built-in's
    defaultValues: (props) => ({                 //      "no gap when columnGap/rowGap set" guard
      gap: props.columnGap || props.rowGap ? undefined : 'gridGap',
    }),
  },
  // center: {}  — built-in is already center+center. No entry.
  // divider: {} — built-in is fine. No entry.
  // C6 is HStack with a call-site justify="space-between"; no pattern of its own.

  // C1 — Container. The built-in bakes maxWidth:8xl + px:{4,6,8} into its
  // transform (no props to default), so it's the one built-in we re-author
  // (decided: adopt Container, retire the sectionInner layerStyle — R1).
  container: definePattern({
    transform(props) {
      return { maxWidth: 'maxWidth', marginInline: 'auto', paddingInline: 'gutter', ...props }
    },
  }),

  // C2 — editorialSplit. The one custom shape (no built-in equivalent); extends
  // the existing pattern with a 2-value ratio enum.
  editorialSplit: definePattern({
    description: 'One column on mobile; two from lg. Ratio enum: editorial | aside.',
    properties: {
      ratio: { type: 'enum', value: ['editorial', 'aside'] },
      gap: { type: 'token', value: 'spacing' },
      align: { type: 'property', value: 'alignItems' },
    },
    defaultValues: { ratio: 'editorial', align: 'start' },
    blocklist: ['display', 'gridTemplateColumns', 'flexDirection', 'gridTemplateRows'],
    transform(props) {
      const { ratio, gap, align, ...rest } = props
      const columns = {
        editorial: '0.8fr 1.2fr', // proportional aside (Manifesto)
        aside: 'minmax(0, 340px) minmax(0, 1fr)', // capped sidebar (about)
      }[ratio as 'editorial' | 'aside']
      return {
        display: 'flex',
        flexDirection: 'column',
        gap,
        lg: { display: 'grid', gridTemplateColumns: columns, alignItems: align },
        ...rest,
      }
    },
  }),
}
```

**Grid call sites:** `columns={{…}}` for uniform ramps, `minChildWidth` for
auto-fit, and a raw `gridTemplateColumns` for ratio grids — all handled by the
*built-in* grid transform (no override needed for those; only the default gap is
tuned above).

Register: `patterns: { extend: designSystemPatterns }`. Only `container` and
`editorialSplit` are authored patterns; `stack`/`hstack`/`wrap`/`grid` are
one-line default tweaks; `center`/`divider` (and C6's `HStack`) need no entry.

---

## DS reconciliations

**R1 — `Container` vs `sectionInner`/`pageHero`.** *Resolved: rails adopt
`Container`; `sectionInner` retires.* The rail is layout (max-width + gutter) and
`Container` does exactly it; keeping both ships a duplicate. `pageHero` is split:
its **paint** (`background: black`, `color: white`, the `paddingTop` nav-clear
ramp, `paddingBottom`) stays a `layerStyle`; its **rail** (the `sectionInner`
inner) becomes a `Container`. Delete `sectionInner` from `layerStyles` after the
sweep.

**R2 — `Divider` vs raw hairlines.** *Resolved by classification (C9):* row/region
separators → `Divider`; box outlines that frame a surface stay `border: hairline`
on the box; interior grid-cell rules and the pink accent rule stay `border` too
(grill, Q3/Q4 — `Divider` is a standalone in-flow element, wrong for grid-internal
and single-leaf rules); no purely decorative edge hairlines were found to delete
outright (all carry a framing, separating, or deliberate-accent role).

**R3 — `chipRow` layerStyle vs `Wrap`.** *Resolved: `chipRow` retires into `Wrap`.*
It is `flex + wrap + gap sm` with `listStyle: none` — pure C7 layout plus a list
reset. Adopt `Wrap gap="sm"` and move `listStyle: none` to the `<ul>` call site.

---

## Open questions — all blocking questions resolved (grill, 2026-07-09)

Q1–Q4 (the cluster-blocking decisions) are settled below. Q5 is a confirmation,
not a blocker. Nothing here blocks the adoption phase.

**Q1 — editorialSplit scope & ratio (C2). RESOLVED.** `editorialSplit` is reserved
for Manifesto + about, with a 2-value `ratio` enum (`editorial` proportional +
`aside` capped). ThemeArtists, VisitSection, ExternalGallery, partners, and page
`heroInner` all refactor to the `Grid` pattern (C8) with explicit responsive
`columns` — none stay bespoke. about's `minmax` cap unifies to `minmax(0,340)`
(the 2xl step-up to 380px is dropped — accepted).

**Q2 — amenity strip (C8→C7). RESOLVED.** VisitSection's `amenityStrip` adopts
`Wrap gap="md"`; the rigid mobile 2-column grid is dropped, accepting ragged wrap
on narrow phones (labels are short enough).

**Q3 — interior column separators (C9). RESOLVED.** All four (ArtistsTable.column,
VenuesView.child, ExternalGallery, PillarGrid) stay `border` on the box — grid-cell
rules driven by `nth-child`/`last-child`, not standalone `Divider` elements.

**Q4 — accent rule (C9). RESOLVED.** about `authorCaption` `borderTop: 'primary'`
stays a `border` accent on the box (a deliberate brand-pink topline, not a
separator). `primary` border token retained.

**Q5 — GalleryCarousel.slide. RESOLVED.** Stays a recipe — its `layout` variant
*is* the grid-template (columns change per variant), which a built-in `Grid` can't
express. This is the **only** grid that stays a recipe: ArtistsTable and PillarGrid
have static columns, so their grid containers adopt `Grid` and their recipes keep
only skin/rhythm on other slots.

---

## Comment reduction (applied)

DS comment cuts applied this phase:

- **preset.ts** — raw-value policy essay cut to one line; the layerStyle/section
  narration removed (names carry it).
- **tokens.ts** — gray-ramp OKLCH essay trimmed to the solid-not-alpha constraint;
  keyframe `enter` narration + "folds in the former…" history cut; fontSize and
  duration design-narration/historical refs cut.
- Load-bearing constraints kept (e.g. the `screen`-size preset-base shadowing note).

Registration cuts (`sectionInner`/`chipRow` retirement, comment updates on the
patterns) land with sequencing step 2, not here.

---

Then **stop** — no pattern registration in `preset.ts` and no component edits;
those are the later sequencing steps driven by `panda-pattern-adopt.prompt.md`.
