# PASS 0 — System Map (ground truth)

Source: `panda.config.ts` (single file; no token imports — all tokens inline).
Layer order confirmed from `src/app/globals.css:13`.

> This file is ground truth for all later passes. Cite it instead of re-reading
> `panda.config.ts`.

---

## Registered recipe primitives — confirmed count: **6**

`theme.extend.recipes` (panda.config.ts:728) registers exactly:

| # | Recipe | className | Variant API | defaultVariants | Notes |
|---|--------|-----------|-------------|-----------------|-------|
| 1 | `badge` | `badge` | `tone` (highlight\|outline\|dark) × `size` (sm\|md) × `elevated` (true) | tone=highlight, size=md | config:43. Collapsed 8 legacy pill/chip/tape/status variants. |
| 2 | `eyebrow` | `eyebrow` | `tone` (muted\|highlight) × `size` (sm\|md) × `rule` (true) | tone=muted, size=md, rule=false | config:86. `rule` adds a 40×2px `_before` bar in currentColor. |
| 3 | `button` | `btn` | `variant` (solid\|outline\|ghost\|link) × `size` (sm\|md\|lg) | variant=solid, size=md | config:131. `staticCss: ['*']` (runtime props in MagneticButton). `link` is sizeless (compoundVariant neutralizes padding/gap). |
| 4 | `textLink` | `textlink` | `underline` (draw\|border\|quiet) | underline=draw | config:231. Inline link primitive. |
| 5 | `iconButton` | `iconbtn` | `tone` (default\|media) | tone=default | config:280. Fixed 44px square (WCAG tap floor); no size variant. |
| 6 | `card` | `card` | `ground` (onDark\|onLight) × `interactive` (true) | ground=onDark, interactive=false | config:323. Hairline-bordered surface. Hover = border-color → action. |

**INVARIANT CHECK — "exactly 6 registered primitives": ✅ CONFIRMED (6).**

---

## Semantic color token roles — count: **13**

`semanticTokens.colors` (config:521):

| Role | Resolves to | Intended use |
|------|-------------|--------------|
| `canvas` | `{colors.black}` (oklch 15.6% tinted) | Dark page ground |
| `surfaceLight` | `{colors.gray.100}` | Light card/surface |
| `heading` | `{colors.white}` | Heading on dark |
| `headingLight` | `{colors.black}` | Heading on light |
| `body` | `{colors.gray.400}` | Body on dark |
| `bodyLight` | `{colors.gray.700}` | Body on light |
| `muted` | `{colors.gray.600}` | Muted/secondary |
| `divider` | `{colors.gray.900}` | Hairline on dark |
| `dividerLight` | `{colors.gray.200}` | Hairline on light |
| `action` | `{colors.pink}` | Primary action/accent (magenta) |
| `highlight` | `{colors.chartreuse}` | Highlight/brand-forward |
| `highlightFaint` | `color-mix(oklch, chartreuse 32%, transparent)` | Chartreuse hairline (badge outline) |
| `onMedia` | `rgb(255 255 255 / 0.55)` | Dimmed control fg over imagery |

Raw color anchors (config:439): `gray.50..950` (11-step ramp, generated from hue 345° / chroma 0.005 / stepped L), `pink`, `lightPink`, `chartreuse`, `black` (tinted), `blackPure` (#000), `white` (#fff).

> NB: `pink`/`lightPink`/`chartreuse`/`black`/`gray.*` are raw anchors. Components
> must reference **semantic** roles, not these — direct raw-color use = leak
> (exceptions: `gray.200` used inside `heroLead` textStyle is theme-internal).

---

## textStyles — count: **10**

`textStyles` (config:627). Typography-only (no margins/max-width):

| textStyle | font | fontSize | lineHeight | extras |
|-----------|------|----------|------------|--------|
| `sectionTitle` | display | {base:xl, md:2xl} | display(1) | uppercase |
| `sectionHeadline` | display | `clamp(40px,7vw,96px)` ⚠️raw | 0.9 ⚠️raw | uppercase |
| `pageTitle` | display | `clamp(40px,4.75vw,100px)` ⚠️raw | 1 ⚠️raw | uppercase |
| `subsectionTitle` | display | {base:xl, md:2xl, 3xl:3xl} | heading | uppercase |
| `cardTitle` | display | xl | heading | letterSpacing tight, uppercase |
| `heroLead` | body | {base:base, 2xl:md} | body | color gray.200 (raw-color exception) |
| `heroBody` | body | base | body | color body |
| `lead` | body | base | body | color body |
| `labelText` | body | 2xs | — | semibold, ls wide, uppercase |
| `labelSmall` | body | 2xs | — | semibold, ls label, uppercase |

> Drift flags for later passes:
> - `heroBody` and `lead` are **identical** (body/base/body/color body) → dup candidate.
> - `labelText` vs `labelSmall` differ only in letterSpacing (wide=4px vs label=1.2px) → near-dup.
> - `sectionHeadline` & `pageTitle` hardcode `clamp()` + numeric lineHeight instead of using fontSizes/lineHeights tokens.

### Type scale — `fontSizes` (the 2xs..5xl ladder)

Static/fluid (config:458): `md, lg, xl, 2xl, 3xl, 4xl, 5xl` (clamp-based).
Stepped-responsive (semanticTokens, config:540): `base, 2xs, xs, sm`.
Full ladder: **2xs, xs, sm, base, md, lg, xl, 2xl, 3xl, 4xl, 5xl** (11 steps).

---

## Other scales (for PASS 3 reduction analysis)

- **spacing** raw (config:467): `xs(4px), sm(8px), lg(clamp), xl(clamp)` + semantic stepped: `md, sectionY, sectionYLg, gridGap, 3xl, content, 2xl, 4xl, 5xl`.
- **radii** (config:473): `pill(100px), circle(50%)` — only 2.
- **shadows** (config:515): `card, badge` — only 2.
- **lineHeights** (config:481): `display(1), heading(1.38), tight(1.16), body(1.56), loose(1.9)` — 5.
- **letterSpacings** (config:488): `tight(-0.02em), subtle(0.6px), label(1.2px), wide(4px)` — 4.
- **fontWeights** (config:494): light/regular/medium/semibold/bold/black — 6.
- **sizes** (config:477): `maxWidth(1800px)`, `nav` (stepped).

---

## layerStyles — count: **7**

`layerStyles` (config:708):

| layerStyle | Props |
|------------|-------|
| `section` | paddingBlock sectionY, paddingInline content |
| `sectionDark` | bg blackPure, color white |
| `sectionLight` | bg white, color black |
| `sectionInner` | maxWidth maxWidth, marginInline auto |
| `pageHero` | bg blackPure, color white, paddingTop calc(nav+80/120px), paddingBottom 2xl/3xl, paddingInline content |
| — | (no others) |

> 5 layerStyles total (section, sectionDark, sectionLight, sectionInner, pageHero).
> Corrected count: **5** (not 7). Section/page-shell padding lives here — inline
> section padding in components = leak.

---

## Cascade layers

`src/app/globals.css:13`: **`@layer reset, base, tokens, recipes, utilities;`** ✅
matches invariant. Co-located `sva`/`cva` emit into `utilities` → beat config
`recipes`. globals.css `@layer base` (config:27) holds the element reset reading
Panda's emitted token vars. `preflight: false` (config:359).

**INVARIANT CHECK — layer order: ✅ CONFIRMED.**

---

## Motion baseline

### Duration tokens (config:502) — 5
`fast(200ms), normal(300ms), medium(400ms), slow(500ms), reveal(600ms)`.

### Easing tokens (config:509) — 2
`expo(cubic-bezier(0.16,1,0.3,1)), quint(cubic-bezier(0.23,1,0.32,1))`.

> ⚠️ `quint` is defined — verify in PASS 1/2 whether it is ever referenced
> (suspected near-dup of `expo`; only `expo` appears in the recipes above).

### Registered keyframes — count: **16** (target 16 → ~4)

Every keyframe is a consolidation/deletion candidate by default (burden of proof
on KEEPING). One-line note + hypothesis bucket:

| # | Keyframe | config | What it does | Hypothesis |
|---|----------|--------|--------------|------------|
| 1 | `fadeSlideUp` | :378 | opacity 0→1 + translateY 30→0 | **COLLAPSE → enter** |
| 2 | `glowDrift` | :382 | translate+scale loop (50% keyframe) | **DELETE** (suspected unused) |
| 3 | `spin` | :387 | rotate → -360deg (PartnerBadge ring) | **CHALLENGE → loop-to-end** |
| 4 | `gradientBorderShift` | :389 | backgroundPosition 0→200% (Carousel hover) | **CHALLENGE → loop-to-end** |
| 5 | `heroProgress` | :394 | scaleX 0→1 (Slideshow progress) | **CHALLENGE → sweep-a-bar** |
| 6 | `rippleAnim` | :396 | scale→4, opacity→0 (MagneticButton) | **DELETE** (suspected unused) |
| 7 | `mbGradientSpin` | :397 | --mb-angle → 360deg (MagneticButton) | **CHALLENGE → loop-to-end** |
| 8 | `fadeIn` | :399 | opacity 0→1 (EventModal backdrop) | **COLLAPSE → enter** |
| 9 | `dialogIn` | :400 | opacity 0→1 + translateY 12→0 (EventModal) | **COLLAPSE → enter** |
| 10 | `cardIn` | :405 | opacity 0→1 + translateY 28→0 (FeaturedEvents) | **COLLAPSE → enter** |
| 11 | `imageReveal` | :410 | opacity 0→1 + scale 1.06→1 (Hero) | **COLLAPSE → enter** |
| 12 | `tapeIn` | :414 | opacity→1, translate→0 0 (Hero tape) | **COLLAPSE → enter** |
| 13 | `shimmer` | :416 | translateX -100%→100% (skeleton sweep) | **CHALLENGE → sweep-a-bar** |
| 14 | `cardReveal` | :421 | opacity→1, translateY→0, blur→0 (editions list) | **COLLAPSE → enter** |
| 15 | `skeletonPulse` | :425 | opacity 0.45↔0.85 (Figure/Lightbox skeleton) | **CHALLENGE → pulse family** |
| 16 | `pulse` | :430 | boxShadow ring 0→8px (Calendar "now" dot) | **CHALLENGE → pulse family** |

**INVARIANT CHECK — keyframe count: ✅ 16 (matches prompt's "16 → ~4" premise).**

Enter-family collapse candidates (7): fadeSlideUp, fadeIn, dialogIn, cardIn,
imageReveal, tapeIn, cardReveal — all are opacity + optional translate + optional
scale/blur. Loop-to-end (3): spin, gradientBorderShift, mbGradientSpin.
Sweep-a-bar (2): heroProgress, shimmer. Pulse (2): skeletonPulse, pulse.
Delete-suspects (2): glowDrift, rippleAnim. → usage must be verified in PASS 1.
