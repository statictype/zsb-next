# Plan: retire CSS Modules → pure Panda

**Goal:** zero `.module.css` files. The 6 shared primitives (Badge, Eyebrow,
Button, TextLink, IconButton, Card) and the OKLCH token theme already landed
(ZSB-70 / ZSB-71); this is the migration of everything that still imports a CSS
Module onto Panda.

**Governing principle — normalize aggressively, don't port drift.** Most
`composes:` and per-component variation is accidental tech debt, not design.
Duplicated roles collapse onto the existing primitive (`composes: pill` →
`<Badge>`); near-duplicate values merge; real conflicts get resolved
pragmatically. We are not faithfully reproducing every legacy value.

## Sequence

### Phase 1 — Foundation (additive)

Stand up the shared layer every leaf depends on, **without** deleting anything
yet (`Shared.module.css` / `strip.module.css` stay on disk until their last
consumer migrates — no flag-day).

- Port the remaining foundational **tokens** into `panda.config.ts` that the
  Shared utilities need but ZSB-70 hadn't yet carried over: the rest of the type
  scale (`base, md, xl, 2xl, 3xl, 4xl, 5xl`), `spacing.3xl`, `spacing.sectionY`,
  `sizes.nav`, `sizes.maxWidth`.
- `Shared.module.css` typography → Panda **textStyles** (`sectionTitle`,
  `sectionHeadline`, `pageTitle`, `subsectionTitle`, `cardTitle`, `heroLead`,
  `heroBody`, `lead`, `labelText`, `labelSmall`). textStyles stay pure
  typography; margins/`max-width` move to the call site.
- Section layout → Panda **layerStyles** (`section`, `sectionDark`,
  `sectionLight`, `sectionInner`, `pageHero`). This also dissolves the
  section-padding ordering bug (Panda dedupes at the property level). NB Panda
  layerStyles are surface props only: `sectionHeader` (flex layout) and
  `skeleton` (positioned + animated) are *not* layerStyles — they migrate with
  their first consumer (inline `css` / a shared `css` helper). Likewise textStyles
  are typography-only, so `pageTitle`'s entrance animation is applied at the call
  site.
- **Retire, don't port:** `pill` and `eyebrowMuted` are the Badge/Eyebrow
  recipes — no textStyle equivalents are created; consumers adopt the recipe
  during their sweep.
- `strip.module.css` `viewport`/`track` → a shared `strip` recipe, folded in
  with the first strip consumer (Carousel) rather than pre-built.

### Phase 2 — Pilot: ArtistsBanner

First full component migration (home page, visible). Proves the whole toolchain
on one tractable file: `composes: pill` → `<Badge>`, token remap including the
hardcoded `rgba()` brand literals → the pink/chartreuse anchors, display
typography, and the compound parent→child hover (kept nested in the component's
own co-located `sva`).

### Phase 3 — Sweep, per-component

Each component migrated **whole in one PR**: its `.module.css` → co-located
inline `sva`/`cva` (imported from `styled-system/css`, **not** registered in
`panda.config` — `config.recipes` stays the 6 shared primitives) + textStyles +
adopt every primitive it uses; then delete the module. Each module reaches zero
in exactly one PR. ZSB-71's deferred per-primitive sub-issues are absorbed here.
The three controls (StripControls, HeroSlideshow, Lightbox) are ordinary leaves
— adopt `IconButton` for the arrow visuals, navigation behaviour untouched.
`Calendar` (965 lines) is just a heavy `sva` component, no special casing.

## Tokens & teardown

- The **OKLCH ramp is the source of truth.** Migration is a deliberate,
  progressive re-color, **not** pixel-identical (legacy `globals.css` is hex;
  Panda is a fresh OKLCH lightness ramp — e.g. `divider` moved `gray-850` →
  `gray.900`). Verify "reads correctly," not `diff == 0`. No screenshot
  baselines — they would only capture the look being retired.
- **Keep grays-over-media solid.** Do not convert text/scrims over imagery
  (Hero, galleries, FeaturedEvents) to alpha; opacity reads as gray over a solid
  ground only.
- **Per-token teardown.** Each PR that removes the *last* reference to a legacy
  `--*` var deletes that var from `globals.css` in the same PR (grep before
  deleting). `globals.css` stays a live inventory of what's left.

## Guardrails & done

- `CLAUDE.md` flips to **Panda only, no new `.module.css`** now (review-enforced).
- A hard ESLint `*.module.css` import ban is added only once the count hits zero.
- Automated gate: typed Panda build + lint. Visual check: browser eyeball per PR.
- When the last module is gone: add the lint ban, delete any residual legacy
  token block, and amend [ADR 0017](./adr/0017-panda-css-with-oklch-token-theme.md)
  to record that CSS Modules are fully retired.

## Progress (resume point — 2026-06-15)

**Module count: 47 → 36.** All committed to `main`; typecheck + lint clean throughout.

**Foundation (done):** textStyles (typography) + layerStyles (`section`,
`sectionDark`, `sectionLight`, `sectionInner`, `pageHero`) in `panda.config.ts`;
tokens ported — full type scale, `spacing.sectionY`/`sectionYLg`/`3xl`/`gridGap`,
`sizes.nav`/`maxWidth`. **The `globals.css` reset is wrapped in `@layer base`**
(with the `@layer reset, base, tokens, recipes, utilities` order declaration) so
Panda utilities/recipes win — REQUIRED; without it the unlayered universal reset
zeroes every Panda padding/margin. `Shared.module.css` + `strip.module.css` are
still on disk (delete when their last consumer migrates).

**Migrated:** ArtistsBanner · PartnerBadge · Manifesto · VisitFaq · IsdayBadge
(adopts `<Badge tone="dark">`) · DisableDraftMode.

**Deleted as dead** (styleguide-only / orphaned): AnimatedStats (+ `data/stats`),
Marquee, ReadMore, MasonryGallery, SlowVideo. The `/styleguide` route itself was
deleted (gitignored, regenerated by `/design-audit`) — do NOT maintain it; verify
a component renders on a real route before migrating (styleguide refs ≠ usage).

**Conventions proven / gotchas:**
- textStyles = typography-only; layerStyles = surface-props-only (no
  display/flex/position/animation — those live in the component's `sva` / inline `css`).
- Foundation textStyles carry no margin → add margin at the call site.
- Passing an `sva` slot to a primitive's `className` needs `cx(slot)` — slots are
  `string | undefined`, the primitive's `className` is strict `string` under
  `exactOptionalPropertyTypes`. (Widen the 6 primitives' `className` to
  `string | undefined` if this recurs.)
- Single-element component → inline `css()`; multi-element → co-located
  `ComponentName.recipe.ts` (`sva`). `config.recipes` stays the 6 primitives only.
- `layerStyle: 'sectionLight'` / `textStyle: 'sectionTitle'` compose fine inside
  an `sva` slot.
- Per-token teardown: nothing has hit zero refs yet, so `globals.css` is untouched.

Dead-code sweep is COMPLETE — the remaining 36 modules are all on live,
verified-used components, so just migrate; no need to re-check usage.

**Next candidates:** Credits (184) · VisitSection (211) ·
CookieBanner + CookieSettingsButton (→ `<Button>`) · Footer · Navigation · Hero.
Plus fold `strip.module.css` → a shared `strip` recipe when Carousel migrates.

## Out of scope / dropped

- **ZSB-74** (consolidate control *behaviour* under IconButton) is dropped — the
  three control sites have genuinely different navigation engines
  (`useScrollSnapStrip`, `useSlideshow`, the Lightbox's modal keydown+swipe), not
  three forks of one thing. They migrate as ordinary leaves (visual only).
