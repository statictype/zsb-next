---
name: Bucharest Sculpture Days
description: An exhibition catalogue on a black ground — monochrome plates, two inks, hairline rules.
colors:
  black: "oklch(0% 0 0)"
  white: "#fff"
  magenta: "oklch(61.6% 0.2527 355)"
  chartreuse: "oklch(87.9% 0.1981 115)"
  gray-200: "oklch(90% 0.005 345)"
  gray-300: "oklch(79% 0.005 345)"
  gray-400: "oklch(69% 0.005 345)"
  gray-500: "oklch(61% 0.005 345)"
  gray-600: "oklch(52% 0.005 345)"
  gray-700: "oklch(42% 0.005 345)"
  gray-800: "oklch(32% 0.005 345)"
  gray-900: "oklch(24% 0.005 345)"
typography:
  display:
    fontFamily: "Dela Gothic One, sans-serif"
    fontSize: "min(clamp(42px, 32.78px + 2.4595vw, 80px), 11vw)"
    fontWeight: 400
    lineHeight: 1
    textTransform: "uppercase"
  manifesto:
    fontFamily: "Dela Gothic One, sans-serif"
    fontSize: "min(clamp(42px, 32.78px + 2.4595vw, 80px), 11vw)"
    fontWeight: 400
    lineHeight: 1.16
  title:
    fontFamily: "Dela Gothic One, sans-serif"
    fontSize: "clamp(34px, 27.93px + 1.6181vw, 59px)"
    fontWeight: 400
    lineHeight: 1.16
    textTransform: "uppercase"
  detailTitle:
    fontFamily: "Dela Gothic One, sans-serif"
    fontSize: "clamp(27px, 22.87px + 1.1003vw, 44px)"
    fontWeight: 400
    lineHeight: 1.12
  heading:
    fontFamily: "Dela Gothic One, sans-serif"
    fontSize: "clamp(22px, 19.33px + 0.7120vw, 33px)"
    fontWeight: 400
    lineHeight: 1.1
  cardTitle:
    fontFamily: "Dela Gothic One, sans-serif"
    fontSize: "clamp(17px, 10.14px + 0.6696vw, 23px)"
    fontWeight: 400
    lineHeight: 1.16
    textTransform: "uppercase"
  lead:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "clamp(17px, 10.14px + 0.6696vw, 23px)"
    fontWeight: 300
    lineHeight: 1.56
  body:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "clamp(14px, 11.71px + 0.2232vw, 16px)"
    fontWeight: 400
    lineHeight: 1.7
  caption:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "clamp(12px, 11.76px + 0.0647vw, 13px)"
    fontWeight: 400
    lineHeight: 1.38
  label:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "clamp(9px, 8.76px + 0.0647vw, 10px)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "1.2px"
    textTransform: "uppercase"
rounded:
  none: "0px"
  pill: "100px"
  circle: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "clamp(16px, 15.03px + 0.2589vw, 20px)"
  lg: "clamp(24px, 18.17px + 1.5534vw, 48px)"
  xl: "clamp(32px, 22.29px + 2.5890vw, 72px)"
  2xl: "clamp(48px, 32.47px + 4.1424vw, 112px)"
  3xl: "clamp(64px, 44.58px + 5.1780vw, 144px)"
  4xl: "clamp(96px, 64.93px + 8.2848vw, 224px)"
  gutter: "clamp(16px, -7.30px + 6.2136vw, 112px)"
  gridGap: "clamp(16px, -0.50px + 4.4013vw, 84px)"
  sectionY: "clamp(80px, 70.29px + 2.5890vw, 120px)"
  sectionYLg: "clamp(150px, 120.87px + 7.7670vw, 270px)"
components:
  card:
    backgroundColor: "transparent"
    textColor: "{colors.gray-400}"
    rounded: "{rounded.none}"
    padding: "0"
  badge-highlight:
    backgroundColor: "{colors.chartreuse}"
    textColor: "{colors.black}"
    typography: "label"
    rounded: "{rounded.none}"
    padding: "6px 12px"
  badge-outline:
    backgroundColor: "{colors.black}"
    textColor: "{colors.gray-400}"
    typography: "label"
    rounded: "{rounded.none}"
    padding: "6px 12px"
  badge-muted:
    backgroundColor: "transparent"
    textColor: "{colors.gray-400}"
    typography: "label"
    rounded: "{rounded.none}"
    padding: "6px 12px"
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    typography: "label"
    rounded: "{rounded.none}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    typography: "label"
    rounded: "{rounded.none}"
    padding: "12px 24px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.gray-400}"
    typography: "label"
    rounded: "{rounded.none}"
    padding: "12px 24px"
  button-pressed:
    backgroundColor: "{colors.chartreuse}"
    textColor: "{colors.black}"
    typography: "label"
    rounded: "{rounded.none}"
    padding: "12px 24px"
  button-icon:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    height: "48px"
    width: "48px"
  nav-link:
    backgroundColor: "{colors.black}"
    textColor: "{colors.gray-400}"
    typography: "label"
    rounded: "{rounded.none}"
  nav-link-active:
    backgroundColor: "{colors.black}"
    textColor: "{colors.chartreuse}"
    typography: "label"
    rounded: "{rounded.none}"
---

# Design System: Bucharest Sculpture Days

Source of truth: `src/design-system/tokens.ts`, `preset.ts`, `recipes/`. This file states the rules those files do not.

## Overview

**Creative North Star: "The Exhibition Catalogue"**

The site is an exhibition catalogue on a black ground. Dela Gothic One and the two inks are the cover: loud, and used on few objects. The interior is hairline rules, uppercase labels, a 60ch measure, monochrome plates, and exact credits. Test for any surface: would it fit inside a well-made exhibition catalogue?

There is no signature graphic device. The devices are the hairline, the square corner, and the plate. Marginalia (construction lines, index stamps, scaffold rules) was tried and removed.

**Key Characteristics:**

- Black ground. White headings, gray-400 body.
- Two inks with a fixed role split: magenta acts, chartreuse marks.
- One display face, set without tracking, uppercase except on edition themes and the manifesto.
- Square corners. 1px hairlines separate surfaces.
- Photography is greyscale at rest and gains colour on hover.
- Every size and space step is a `clamp()`.

Not: a SaaS page (rounded cards, stacked shadows, pastel gradients), a municipal culture site (civic blue, logo wall above the fold), a luxury art-fair site (thin serif, beige), a ticketing site (countdowns, stock crowd photos), or brutalist (system fonts, unstyled borders).

**Open: the ground rule.** Light ground is used on 5 surfaces (edition credits, About, artists banner, Partners, partner strip); everything else is dark. No principle decides which. The edition page is the evidence for the decision.

## Colors

Two chromatic inks, black, white, and one gray ramp (hue 345, chroma 0.005).

### Primary

- **Magenta** (`{colors.magenta}`, token `pink`, role `action`): links, primary button edge, card border on hover, the rolled-in label copy, the nav pending bar, the gallery caption band.

### Secondary

- **Chartreuse** (`{colors.chartreuse}`, role `highlight`): active and pressed nav text, badge fills, selected chip edges, pressed toggles, the today marker, the artist roster separators. It marks state and structure.

### Neutral

Components use role tokens. The `ground` maps (`recipes/ground.ts`) set each role per ground.

| Role | Dark ground | Light ground |
|---|---|---|
| `surface` | black | white |
| `heading` | white | black |
| `body` | gray-400 | gray-700 |
| `muted` | gray-500 (5.53:1) | gray-600 (5.52:1) |
| `divider` | gray-900 | gray-200 |

`surface.scrim` is `rgb(0 0 0 / 0.95)`, behind dialogs and the lightbox. `gray-800` is the skeleton ground only.

### Named Rules

**The Two Inks Rule.** Magenta and chartreuse are the only chromatic colours. Anything else that needs distinguishing uses value, weight, or space.

**The Ink Area Rule.** Magenta may fill a field (a banner, a CTA band, a caption band). Chartreuse fills nothing larger than a control: a dot, a tab, a badge, a short rule.

**The Role Token Rule.** Components address `surface` / `heading` / `body` / `muted` / `divider` / `action` / `highlight`, never a raw gray step. A ground is set by spreading a ground map, never by hand-assigning a background.

## Typography

**Display:** Dela Gothic One, 400 only. **Body:** Montserrat, 300–900.

### Hierarchy

| Style | Size | Job |
|---|---|---|
| `display` | 42 → 80px, capped 11vw | page heroes, one per page |
| `manifesto` | same as `display`, 1.16 leading, mixed case | the edition and About statement |
| `title` | 34 → 59px | section headings |
| `detailTitle` | 27 → 44px | the subject of a detail view |
| `heading` | 22 → 33px, mixed case | list-link titles, editorial headings |
| `cardTitle` | 17 → 23px | titles inside cards; the artist roster (13 → 23px by breakpoint) |
| `lead` | 17 → 23px, 300 | intro paragraphs |
| `body` | 14 → 16px | running text; reaches 16px at 1920px |
| `caption` | 12 → 13px | captions, secondary meta |
| `label` | 9 → 10px, 1.2px tracking, uppercase | eyebrows, badges, nav, chips |

Display rungs set `text-wrap: balance`; `lead` and `body` set `pretty`. Edition themes have their own lowercase ladder (`editionTheme.sub` / `cell` / `row`), built from the same font-size tokens; `sub` carries +0.007em tracking. `tight` (-0.01em) is used only on bold Montserrat rows.

### Named Rules

**The No-Tracking Rule.** Display type carries no letter-spacing. Dela Gothic One's uppercase pairs `ST` and `LA` open only 0.040em; negative tracking closes them.

**The Lowercase Theme Rule.** Display type is uppercase except on an edition theme, which is lowercase.

**The Text Component Rule.** Type is set with `<Text variant="…">` or a `textStyle`. The `Text` pattern blocklists `fontSize`, `fontWeight`, `letterSpacing`, `lineHeight`, and `textTransform`, and picks the ink from the variant. To inherit a parent's colour (the edition hero's `ink`), pass `color="[currentColor]"`.

**The 60ch Rule.** Running text never exceeds the `measure` token.

**The 320px Floor Rule.** The display size is `min(clamp(…), 11vw)` so a long single word fits a 320px viewport.

## Layout

One centred rail: `maxWidth` 1800px, `gutter` padding (16 → 112px), `gridGap` (16 → 84px). Sections stack directly on `sectionY` (80 → 120px) or `sectionYLg` (150 → 270px). Every hero clears the fixed nav with the `nav` size (60 / 72 / 84 / 100px at base / md / lg / xl); `scroll-padding-top` uses the same token. Touch targets are 48px (`touch`).

Breakpoints (min-width): `sm` 637, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1440, `3xl` 1536, `4xl` 1792px. Media queries are for structural changes only; sizes come from `clamp()`.

Orientation conditions, for layouts that depend on shape rather than width:

| Condition | Query | Used by |
|---|---|---|
| `portraitPhone` | < 600px, portrait | edition hero stack, carousel paging, gallery slide width |
| `portraitTablet` | 600–1023px, portrait | edition hero |
| `portraitLarge` | ≥ 1024px, portrait | edition hero |
| `landscapeLg` | ≥ 1024px, landscape | edition hero |

### Named Rules

**The Fluid Scale Rule.** Sizes and spaces are `clamp()` expressions. A size that exists at only one breakpoint means the scale is wrong.

**The Square-On-Phone Rule.** Full-bleed media is square below `md` and widens above (2/1 edition hero, 16/9 About and carousel, 4/5 Visit). On a portrait phone the edition hero stacks: a square thumbnail above white text on black. Card plates are exempt; an index may shrink its plate to a thumbnail (the archive card: 3/2 half-column at `lg`, 16/9 at `md`, a 72 → 104px square below).

## Elevation & Depth

Flat. Hairlines separate objects in the flow. A shadow means the object is detached from the page.

| Shadow | Where |
|---|---|
| `litEdge` | the inset top highlight on ink-filled controls |
| `modal` | dialog panels |
| `badge` | the draft-mode badge |

### Named Rules

**The Detached-Only Rule.** A shadow never ranks two surfaces that are both in the flow.

**The Lit-Edge Rule.** On black, depth is made with light: an inset white hairline, the gradient ring, a scrim. A black shadow on black renders as nothing.

## Shapes

Every rectangle has 90° corners. `pill` and `circle` exist for objects that are round (the partner badge disc).

| Border | Value | Use |
|---|---|---|
| `hairline` | 1px `divider` | the default edge |
| `highlight` | 1px `highlight` | selected chip, structural boundary |
| `primary` | 1px `action` | primary button |
| `focus` | 0.5px `action` outline, inset (−0.5px offset) | global `:focus-visible` |

`hairlineThin` (0.5px) is used on badges and the edition hero's info rows.

### Named Rules

**The Hairline Rule.** One border weight, 1px; 0.5px on small chips and rows. The focus ring is a 0.5px inset outline, not a border.

## Motion

Motion acknowledges a pointer, explains a change of state or place, or loops to say an object is live. Timing values are in `.impeccable/design.json`.

**CSS.** A call site names a verb; `preset.ts` is the only file that writes a duration or easing.

| Verb | Duration / easing | Job |
|---|---|---|
| `interactive` | 200ms, `feedback` spring (no overshoot) | hovers, colour and border changes |
| `develop` | 300ms, `motion` spring (3.1% overshoot) | the image develop, label roll, slide dimming, clip-path reveals |

Entrances: `enter` (600ms: default 30px rise, `fade`, `zoom` from 1.06) for the page arriving; `arrive` (300ms: 12px rise, `fade`) for content over an existing page. One entrance per route, at the top, offset by one 80ms `stagger` step. Scroll position never triggers an entrance.

Loops, the complete set: `gradientBorder` (hover only), `shimmer` (skeleton), `spin` (partner badge disc), `marquee` (credits and partner logo walls, paused on hover), `progressSweep` (nav link while its route is pending).

**GSAP.** Allowed in client islands, loaded off the critical path: the carousel engine (drag, wheel steps by whole slides, 0.725s `power3` glide) and the lightbox (FLIP flight from the thumbnail on open, grid dissolve between images, fade on close). A component is not made a client island to get motion.

### Named Rules

**The Two Verbs Rule.** CSS transitions use `interactive`, `develop`, or `none`. Any other value is a no-op.

**The Hover Twin Rule.** Motion triggered by `:hover` on a focusable object also answers `:focus-visible`. Where that state is visible on focus, the focus ring is removed: link-list rows, nav links, link buttons, and gallery images on hover-capable devices.

**The Reduced-Motion Rule.** One global rule sets every animation and transition to 0.01ms. States still change. Marquees stop and wrap into a static grid. JS motion reads `useReducedMotion()`.

## Components

### Buttons

Six variants. Square, uppercase label type, sized by `size` (`sm` / `md` / `lg` / `touch`).

- **Primary:** transparent, 1px magenta edge, white label. Hover: the gradient ring travels over the border box while the resting edge fades out. The label rolls to magenta.
- **Secondary:** transparent, hairline edge, heading label. Hover: the edge turns magenta; the label rolls in heading colour.
- **Quiet:** no visible edge (transparent hairline, so it aligns with Secondary), body label. Hover: heading colour; the label rolls to magenta.
- **Icon:** 48px square, heading colour, magenta on hover.
- **Link:** heading colour in running copy. Hover: magenta with a magenta underline at 4px offset.
- **Plain:** no chrome, for a pressable surface that styles itself.

**Pressed** (`aria-pressed="true"` on Secondary or Quiet): chartreuse fill, black label, `litEdge`, no roll.

### Named Rules

**The Filled-Means-Black Rule.** An ink-filled control carries black text and `litEdge`. White on magenta is 2.9:1.

**The One Loud Edge Rule.** A fill and the travelling ring never appear on the same object.

**The Roll Rule.** Labelled buttons roll: the label leaves upward while an `aria-hidden` copy enters from 110% (`rollOffset`). Chrome-less variants and pressed controls do not roll.

**The Press Rule.** Every pressable answers `:active` with 0ms timing, through the `pressable` utility: `fill` (divider-colour background: Secondary, Quiet, cards, nav), `inline` (chartreuse text: Icon, Link, Plain, logo links), or `dim` (85% opacity). Primary fills magenta.

### Cards

A transparent hairline box on the dark ground; the recipe spreads the dark ground map, so contents need no ground-specific styles. `interactive` cards change border colour to magenta on hover, nothing else. The gradient ring is used on the primary button and the featured program card only.

### Badges

Label type, 12 × 6px padding, 0.5px edge, never wrapping. Tones: `highlight` (chartreuse fill, black text), `outline` (black, chartreuse edge, body text), `muted` (gray-700 edge, gray-400 text). Tone is stated at the call site.

### Filter Chips

Checkbox-based. Rest: hairline edge, gray-300 label, 14px control at 50% opacity. Selected: chartreuse edge, white label, magenta-filled control with a black check. Hover: magenta edge. Focus outline inset on the chip edge. All options start selected, so the informative state is a chip switched off; that is why selection is an edge and not a fill.

### Link Lists

Hairline-ruled rows. Hover: title turns magenta, arrow moves 4px up-right. `emphasis="title"` puts the year in a fixed column; `emphasis="year"` sets the year at `detailTitle` size with tabular figures and the title in body type beneath.

### Navigation

Floating, no bar. Logo top-left; a row of hairline-bordered links on black top-right; below `md`, a fullscreen black dialog. Display face at 12px with label tracking (17 → 23px in the dialog). Hover and focus: the label rolls to magenta. Active (`data-active`) and pressed: chartreuse text. The current-page link (`aria-current`) does not roll and is out of the tab order. While a route is pending, the clicked link turns chartreuse and a 2px magenta bar sweeps along its bottom edge; the previously active link reverts.

### Carousels

One engine (`useCarouselEngine`) for the homepage slideshow (`stage`) and the gallery rail (`rail`). Non-current slides dim to 20% opacity. On a portrait phone the rail pages one image at a time and does not dim. Hovering one gallery image dims its siblings to 32%. Gallery captions sit on a magenta band that slides up on hover or focus, on the current slide only, on hover-capable devices only.

### Lightbox

Fullscreen over `surface.scrim`. A control bar holds counter, caption, previous/next, and close in the display face at caption size; buttons are magenta, white on hover. The bar runs along the bottom, and becomes a 200px right-hand column at `3xl`.

### Logo Walls

Edition credits and the partner strip run logos in a `marquee`. Logos are `grayscaleFull` at rest and full colour on hover. Credits marks are sized by area.

### Dialogs

Panel: 540px (760px at `md`), black, hairline edge, `modal` shadow, over `surface.scrim`. Fullscreen: 100vw × 100dvh (mobile menu, lightbox). The title is `srOnly`; the visible heading is part of the content.

### Photography

- **Rest:** `mono` (greyscale with brightness 1.08 and contrast 1.06 to offset the darkening).
- **Interactive:** `monoHover` (70% colour) on program, featured-event, and media-kit plates; `monoReveal` (full colour) in mono galleries. Both on the `develop` verb.
- **Colour at rest:** edition cards (`color`, `colorHover` and 1.05 scale on hover), the edition hero (`color`), the theme artists gallery (`treatment="color"`), and the homepage slideshow (ungraded).
- **Logos:** `grayscaleFull`.
- **Scrim:** `stageScrim` behind the About slideshow controls. A scrim keeps its density; the image is brightened, not the scrim thinned.

A plate has a subject, not a scene. Its crop is chosen. Adjacent plates share one grade. No snapshots, phone frames, or crowd photos.

**The Develop Rule.** Every image is greyscale at rest; an interactive image gains colour on hover. The colour surfaces are exempt because they show artists' work or represent an edition. Editors decide the split by placement: work goes in the theme artists gallery, documentation goes elsewhere.

## Do's and Don'ts

### Do:

- **Do** address colour through role tokens and a `ground` map.
- **Do** set type with `<Text variant="…">` or a `textStyle`.
- **Do** keep corners square.
- **Do** separate surfaces with a 1px hairline.
- **Do** name a motion verb instead of writing transition longhands.
- **Do** ship photography greyscale at rest.
- **Do** make depth on black with light: inset white hairlines, the gradient ring, a scrim.
- **Do** hold running text to 60ch.
- **Do** make full-bleed media square below `md`.
- **Do** give every ink-filled control black text and `litEdge`.
- **Do** give every pressable an `:active` response through `pressable`.
- **Do** state the variant at the call site when a branch picks between two.

### Don't:

- **Don't** introduce a third accent colour.
- **Don't** fill anything larger than a control with chartreuse.
- **Don't** use chartreuse for navigation links at rest, or magenta to mark state.
- **Don't** add a corner radius to a rectangle.
- **Don't** put a soft black shadow on a black ground.
- **Don't** uppercase an edition theme.
- **Don't** put white text on an ink fill.
- **Don't** put a fill and the travelling ring on the same object.
- **Don't** add a second border weight.
- **Don't** re-implement button chrome at a call site. A toggle is `aria-pressed` on Secondary; a reset is Quiet; an image plate is Plain.
- **Don't** add an easing. CSS has two springs; GSAP stays inside its islands.
- **Don't** add a loop outside the set of five.
- **Don't** trigger an entrance from scroll position.
- **Don't** add a signature graphic device.

## Known Gaps

Places where the code does not yet follow this file.

- Primary button `:active` fills magenta with white text (breaks Filled-Means-Black).
- `manifesto` shares the `3xl` size with `display`.
- The event popup has no exit animation. Route transitions do not exist.
