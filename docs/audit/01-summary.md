# PASS 1 — Inventory Summary

Index for PASS 2+. Cite `01-inventory.md` (per-component rows + line_ranges) and
`01-usage.json` (histograms + repeated-pattern map). Do not re-scan; re-open
individual files only via recorded line_ranges.

## Headline numbers

| Metric | Value |
|--------|-------|
| Components/recipes scanned | **51** |
| Total leaks (raw + textstyle + layerstyle + anim + local-keyframe) | **190** |
| Largest leak category | **raw values — 108** (then anim 46, textstyle 22, layerstyle 14, local-keyframes 0) |
| Local `@keyframes` in components | **0** (all 16 keyframes live in panda.config; none duplicated locally) |

## Leaks by type

| Type | Count | Where it concentrates |
|------|-------|-----------------------|
| `raw_value` | 108 | Calendar 17, Hero 14, FeaturedEvents 8, CalendarFilters 6, HeroSlideshow 6, VisitSection/EditionsNav 5 each. Mix of raw color anchors (gray.*, black, white, blackPure), rgba/rgb literals, and raw letterSpacing/font px. Some are documented dark-board exceptions (skeleton/loading/Calendar grays). |
| `anim_inline` | 46 | Hero 6, page.recipe 6, HeroSlideshow/Carousel 5 each, PartnerBadge 4 (GSAP — legit), Lightbox/Navigation/CookieBanner/Credits. Literal durations bypass the duration tokens; literal `ease`/`ease-in-out`/`ease-out` bypass easing tokens. |
| `textstyle_inline` | 22 | press 3, about/partners/ArtistsBanner/ExternalGallery/EditionsNav 2 each. Hand-rolled display titles + label kickers instead of `textStyle:`. |
| `layerstyle_inline` | 14 | about 3, PageHero/Credits 2 each. Inline section/page padding instead of `layerStyle: 'section'`/`'pageHero'`. |
| `keyframes_local` | 0 | — |

## Cleanest (0 design-token leaks — the baseline to copy)

`VisitFaq`, `RoutedEventModal`, `CalendarShare`, `FeaturedSpotlight`, `AccentSplit`,
`EditionsNavBand`, `Figure`, `FallbackImage`, `PageHero` (1 literal-duration only),
all 7 `ui/*` thin wrappers, `CookieSettingsButton`. **PageHero is the model
citizen**: pure `layerStyle` + `textStyle`, no hand-rolled type.

## Worst offenders (highest leak density / structural)

1. **Calendar.recipe.ts** — 718 lines / 70 slots, ≥7 sub-components in one `sva`; 17 raw values; reimplements card + chip; dup blocks.
2. **Hero.recipe.ts** — 244 lines / 12 slots; 14 raw colors, 6 anim literals; hand-rolled eyebrow ×2 + display title; dup reduced-motion ×3.
3. **FeaturedEvents.recipe.ts** — 243 lines / 24 slots; hand-rolled chip + eyebrow + cardTitle; 8 raw values.
4. **Home page.recipe.ts / about / press** — 29 / 28 / 29 slots; inline section padding + inline sectionTitle idiom; hand-rolled prose.
5. **ExternalGallery.recipe.ts** — 193 lines / 19 slots; reimplements IconButton; bespoke edition-plate.

## textStyle histogram (the big structural finding)

```
sectionTitle    ██████████████ 14
pageTitle       ██ 2
heroLead        █ 1
lead            █ 1
sectionHeadline   0   ← defined, NEVER adopted (hand-rolled ×2)
subsectionTitle   0   ← defined, NEVER adopted
cardTitle         0   ← defined, NEVER adopted (hand-rolled in FeaturedEvents)
heroBody          0   ← defined, NEVER adopted; identical to `lead`
labelText         0   ← defined, NEVER adopted (hand-rolled ×3+)
labelSmall        0   ← defined, NEVER adopted; near-dup of labelText
```

**6 of 10 textStyles have zero `textStyle:` adoption** — not because the type is
unused, but because consumers hand-roll the same look inline (the 22
textstyle_inline leaks + the 7-entry `hand_rolled_display_title` pattern). This is
the headline PASS 2/3 story: the type scale is defined-but-not-adopted.

## Keyframe usage histogram

```
fadeSlideUp ████████ 9     spin           █ 1     imageReveal █ 2
pulse       ████ 4         heroProgress   █ 1     dialogIn    █ 1
tapeIn      ████ 4         rippleAnim     █ 1     cardIn      █ 1
fadeIn      ███ 3          mbGradientSpin █ 1     cardReveal  █ 1
gradientBorderShift █ 2    glowDrift      █ 1     skeletonPulse █ 1
shimmer     ██ 2
```

**No unused keyframes** — every one of the 16 is referenced ≥1×. PASS 0's
deletion-suspects (glowDrift, rippleAnim, pulse) are all referenced. The lever is
**consolidation, not deletion**: 7 enter-family → 1 parameterized; sweep ×2; loop-to-end ×3;
pulse ×2. PASS 2 must confirm each ref is an *applied* `animation:`.

## Top repeated patterns (full map in 01-usage.json)

| Pattern | N | Lever |
|---------|---|-------|
| Hand-rolled chip ≈ Badge | 4 (+2 related) | adopt `<Badge>` |
| Hand-rolled uppercase arrow-link ≈ TextLink | 4 (+1) | adopt `textLink` |
| Hand-rolled display title ≈ textStyle | 7 | apply `textStyle:` |
| Hand-rolled eyebrow ≈ Eyebrow | 3 | adopt `eyebrow` |
| Inline section padding ≈ layerStyle.section | 6 | apply `layerStyle:'section'` |
| Inline `sectionTitle + marginBottom` idiom | 4 | promote a `SectionHeading` |
| Native `<details>` rotating chevron | 2 | shared disclosure recipe |
| rgba box-shadow/backdrop literal | 5 | shadow/scrim token |
| Reimplemented card surface | 2 | adopt `card` |
| Reimplemented iconButton | 1 | adopt `iconButton` |

## Dead / unused tokens

- `radii.pill` (100px) — **0 usage**, deletion candidate.
- `shadows.badge` / `shadows.card` — only referenced inside their own primitive (fine, but no external use).

## Non-styling note

The editions lead copy at `src/app/(site)/editions/page.tsx:130` ("Five past
editions. Five #, …") is **intentional** — the `#` is the editions' hashtag
naming convention, not a placeholder. No action.
