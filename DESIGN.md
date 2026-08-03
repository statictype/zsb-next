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
    letterSpacing: "-0.02em"
    textTransform: "uppercase"
  title:
    fontFamily: "Dela Gothic One, sans-serif"
    fontSize: "clamp(34px, 27.93px + 1.6181vw, 59px)"
    fontWeight: 400
    lineHeight: 1.16
    letterSpacing: "-0.02em"
    textTransform: "uppercase"
  detailTitle:
    fontFamily: "Dela Gothic One, sans-serif"
    fontSize: "clamp(27px, 22.87px + 1.1003vw, 44px)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "Dela Gothic One, sans-serif"
    fontSize: "clamp(22px, 19.33px + 0.7120vw, 33px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  cardTitle:
    fontFamily: "Dela Gothic One, sans-serif"
    fontSize: "clamp(17px, 15.54px + 0.3883vw, 23px)"
    fontWeight: 400
    lineHeight: 1.16
    letterSpacing: "-0.02em"
    textTransform: "uppercase"
  lead:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "clamp(17px, 15.54px + 0.3883vw, 23px)"
    fontWeight: 300
    lineHeight: 1.56
  body:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "16px"
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
  sectionYLg: "clamp(100px, 80.58px + 5.1780vw, 180px)"
motion:
  durations:
    fast: "200ms"
    normal: "300ms"
    entrance: "600ms"
    stagger: "80ms"
    sweep: "1600ms"
    travel: "2s"
    orbit: "32s"
  easings:
    feedback: "linear(0, 0.01 1.8%, 0.044 4%, 0.112 6.9%, 0.267 12.2%, 0.451 18.5%, 0.572 23.3%, 0.671 28%, 0.753 32.8%, 0.822 38.1%, 0.879 44.2%, 0.924 51.3%, 0.959 60.3%, 0.983 72.8%, 0.996 94.4%, 1)"
    motion: "linear(0, 0.01 1.9%, 0.043 4%, 0.104 6.6%, 0.21 10%, 0.536 19.4%, 0.667 23.8%, 0.769 27.8%, 0.852 31.8%, 0.918 36%, 0.968 40.6%, 1.004 45.8%, 1.026 52%, 1.031 60.7%, 1.002 95.1%, 1)"
  verbs:
    interactive: "{motion.durations.fast} {motion.easings.feedback}"
    develop: "{motion.durations.normal} {motion.easings.motion}"
components:
  card-on-dark:
    backgroundColor: "transparent"
    textColor: "{colors.gray-400}"
    rounded: "{rounded.none}"
    padding: "0"
  card-on-light:
    backgroundColor: "{colors.white}"
    textColor: "{colors.gray-700}"
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
    backgroundColor: "transparent"
    textColor: "{colors.gray-400}"
    typography: "label"
    rounded: "{rounded.none}"
  nav-link-active:
    backgroundColor: "{colors.chartreuse}"
    textColor: "{colors.black}"
    typography: "label"
    rounded: "{rounded.none}"
---

# Design System: Bucharest Sculpture Days

## Overview

**Creative North Star: "The Exhibition Catalogue"**

The site is an exhibition catalogue on a black ground. Dela Gothic and the two inks are the cover: loud, young, slightly awkward, and used on few objects. Everything after the cover is the interior — hairline rules, uppercase micro-labels, a 60ch measure, monochrome plates, exact credits. The interior is what makes the cover legible as a choice rather than as noise.

The test for any surface: would this page be at home inside a well-made exhibition catalogue?

The register is chosen from what the product is. The archive is permanent and editions accumulate; credits are first-class; photography is the material the site is made of. It also answers the brand's own tension — approachable and youthful without being childish or comic is a bold cover on a rigorous book.

**There is no signature graphic device, and none is added.** The devices are the hairline, the square corner, and monochrome photography. Recognition rests on the type, the two inks, and the plates. Marginalia — construction lines, index stamps, scaffold rules — was evaluated and rejected: a distill pass removed the site's existing marginalia because it stated facts the content already stated.

**Key Characteristics:**

- Black ground; white and gray-400 do the reading work.
- Two inks on a strict role split: magenta acts, chartreuse marks.
- One heavy display face (Dela Gothic One), always tight, uppercase except on edition themes.
- Square corners. No radius exists outside `pill` and `circle`.
- 1px hairline borders as the primary separator.
- Monochrome photography that develops toward colour on interaction.
- Fluid `clamp()` scales for every size and space step.

Not a soft SaaS product page (no rounded cards, no shadow-stacked depth, no pastel gradients), not a municipal culture site (no civic blue, no logo wall above the fold), not a luxury art-fair site (no thin serif elegance, no beige restraint), not a ticketing site (no countdown urgency, no stock crowd photography). Bold, but **not brutalist**: no raw system fonts, no unstyled borders, no deliberate ugliness. The hairline is precise, not crude.

**Open: the ground rule.** Which sections sit light and which sit dark is decided per surface today — 14 dark call sites against 5 light, with no principle. The decision is taken after the edition-page redesign, with that page as evidence.

## Colors

Two chromatic inks against a black ground and one near-neutral gray ramp (hue 345, chroma 0.005 — warm enough to avoid a dead blue-gray, not warm enough to read as a colour).

### Primary

- **Magenta** (`{colors.magenta}`, raw token `pink`, semantic `action`): the action ink. Links, primary button borders, the accent word inside a headline, the card border on hover, the nav label that rolls in. If an element does something when you click it, this is the colour that says so.

### Secondary

- **Chartreuse** (`{colors.chartreuse}`, semantic `highlight`): the marker ink. The active nav tab's fill, badge fills, selected chip edges, the today marker. It marks state and structure, never navigation.

### Neutral

| Token | Job |
|---|---|
| `black` | the page ground; text on any ink fill |
| `white` | headings on dark. Never body copy |
| `gray-400` | body copy on dark — the most-used text colour on the site |
| `gray-500` | muted text and labels on dark (5.53:1) |
| `gray-600` | muted text and labels on light (5.52:1) |
| `gray-700` | body copy on light |
| `gray-900` | dividers and hairlines on dark |
| `gray-200` | dividers and hairlines on light |
| `gray-800` | skeleton ground only |

### Named Rules

**The Two Inks Rule.** Magenta and chartreuse are the only chromatic colours in the interface. A third accent is not a design decision, it is a bug. Anything that needs distinguishing uses value, weight, or space.

**The Ink Area Rule.** The inks are asymmetric. Magenta may fill a field — a banner, a CTA band — because it is the action ink and a filled magenta surface reads as something you do. Chartreuse never fills anything larger than a control: a dot, a pip, a tab, a badge, a short rule. Kitsch comes from area, not from hue.

**The Role Token Rule.** Components address colour as `surface` / `heading` / `body` / `muted` / `divider` / `action` / `highlight`, never as `gray.700` or `black`. The `ground` variants on `section` and `card` redefine those variables locally, so one component renders correctly on either ground without a conditional.

**The Two Grounds Rule.** Exactly two grounds, dark and light, both set by spreading a ground map — never by hand-assigning a background and hoping the text colours follow.

## Typography

**Display:** Dela Gothic One (single weight, 400). **Body:** Montserrat (300–900, with italics).

One very heavy, very tight display face against a neutral geometric grotesque. Montserrat never competes with it and never appears above 23px except in the program's bold rows.

### Hierarchy

Five display rungs and four body rungs, on one modular scale.

| Style | Family | Size | Job |
|---|---|---|---|
| `display` | display | 42 → 80px, capped 11vw | page heroes. One per page |
| `title` | display | 34 → 59px | section headings |
| `detailTitle` | display | 27 → 44px | the subject of a detail view — the event name |
| `heading` | display | 22 → 33px | list-link titles and editorial headings, mixed case |
| `cardTitle` | display | 17 → 23px | the title inside a card |
| `lead` | body | 17 → 23px, 300 | intro paragraphs. Light weight keeps it off the display type |
| `body` | body | 16px | all running text, capped at 60ch |
| `caption` | body | 12 → 13px | figure captions and secondary meta |
| `label` | body | 9 → 10px, 1.2px tracking | eyebrows, badges, nav links, chips |

Edition themes carry their own four-rung ladder (`huge` / `large` / `normal` / `rail`) that references the display sizes rather than paralleling them. It is the one place display type is lowercase, and the one letterSpacing other than `tight` on display type (+0.007em).

### Named Rules

**The One Size Per Family Rule.** No two textStyles of the same family share a `fontSizes` entry. Within a family, two styles that should look different differ in size, not only in line-height or case. A component that needs a weight or a tighter leading than its rung carries that delta in its own recipe — the program's day rows are `body` at bold with 1.4 leading — rather than earning a second global style at the same size.

**The Lowercase Theme Rule.** Display type is uppercase everywhere except an edition theme, which is lowercase. That inversion is what makes a theme read as a different object from a heading.

**The Text Component Rule.** Type is applied by variant (`<Text variant="lead">`), never by ad-hoc `fontSize` / `fontWeight` / `letterSpacing`. The pattern blocklists those props and picks the ink from the variant.

**The 60ch Rule.** Running text never exceeds the `measure` token. A wider column is a layout error, not a density choice.

**The 320px Floor Rule.** The display step is `min(clamp(…), 11vw)`, not a bare `clamp()`. The viewport-proportional cap holds a long single word inside a 320px viewport; a fluid minimum alone does not survive the narrowest reflow width.

## Layout

A single centered rail: max-width 1800px, horizontal padding on the fluid `gutter` scale (16 → 112px), grid gaps on `gridGap` (16 → 84px). Little is full-bleed except hero and section imagery.

Vertical rhythm comes from two section cadences: `sectionY` (80 → 120px) standard, `sectionYLg` (100 → 180px) editorial. Sections stack directly.

Breakpoints are stepped and mobile-first: `sm` 637, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1440, `3xl` 1536, `4xl` 1792px. Because both scales are `clamp()`-based, most components need no breakpoint — media queries are reserved for structural changes (the nav switching from a fullscreen dialog to an inline row at `md`, the editorial split going two-column at `lg`).

Media aspect ratios are the exception that steps. Full-width media is **square below `md`** and widens above (2/1 on the edition hero, 16/9 on About and the carousel, 4/5 on Visit). Media inside a card keeps its ratio at every width. A portrait full-bleed frame on a phone pushes everything below it off the first screen; a square one does not.

The navigation is fixed and floating — logo top-left, link row top-right, no bar behind them. Every hero clears it via the responsive `nav` token (60 → 100px), and `scroll-padding-top` uses the same token so anchor jumps land correctly.

Touch targets are 48px (`touch`), which is also the icon button and the `touch` button size.

### Named Rules

**The Fluid Scale Rule.** Sizes and spaces are `clamp()` expressions, not breakpoint ladders. If a component needs a size that exists at only one breakpoint, the scale is wrong before the component is.

**The Square-On-Phone Rule.** Full-width media is square below `md`. Ratio changes are structural, so they belong in a breakpoint, not a `clamp()`.

## Elevation & Depth

The system is flat: 1px hairlines do the separating, and shadows appear on three objects. What is settled:

- **A shadow means the object is detached from the wall** — modals, partner badges. Objects in the document flow are separated by a hairline.
- **A soft black shadow on a black ground is not depth.** On dark grounds depth comes from a border, an inset highlight, a scrim, or motion.
- **The animated gradient border is the system's strongest attention device**: a masked ring filled magenta → chartreuse → magenta at 200% width, sliding over 2s linear, faded in on hover.

| Shadow | Value | Where |
|---|---|---|
| `litEdge` | `inset 0 1px 0 rgb(255 255 255 / 0.18)` | the lit top edge on any ink-filled control |
| `modal` | `0 30px 80px rgb(0 0 0 / 0.5)` | dialog panels over a 95%-black scrim |
| `badge` | inset white hairline + `0 6px 16px rgb(0 0 0 / 0.25)` | partner badge discs |
| `card` | `0 2px 12px rgb(0 0 0 / 0.03)` | light-ground cards only |

### Named Rules

**The Detached-Only Rule.** Add a shadow only to say "this object is not on the wall". Never to rank two surfaces that are both in the flow.

**The Lit-Edge Rule.** Depth on black is made with light, not dark: an inset white hairline, a gradient ring, a scrim. Reach for `rgb(255 255 255 / …)` before `rgb(0 0 0 / …)`.

## Shapes

Square by default. The token set contains no radius other than `pill` (100px) and `circle` (50%), both reserved for genuinely round objects. Cards, buttons, badges, dialogs, images and inputs have hard 90° corners.

Borders carry the form language — four composite tokens, all 1px except the focus outline:

- **`hairline`** — 1px solid `divider`. The default edge of everything.
- **`highlight`** — 1px solid `chartreuse`. The marked edge: a selected chip, a structural boundary.
- **`primary`** — 1px solid `action`. The primary button's edge. Only the colour carries the meaning.
- **`focus`** — 2px solid `action`, offset 4px, applied globally on `:focus-visible`. An outline, not a border, and the one place 2px is correct: a focus indicator has to survive on any ground, which is why it takes the magenta rather than the chartreuse.

`hairlineThin` (0.5px) exists as a raw width, used on badges so a small chip's edge does not read as heavy as a card's.

### Named Rules

**The Square Corner Rule.** If it is a rectangle, it has 90° corners. There is no "slightly rounded" here — a 4px radius reads as a different brand.

**The Hairline Rule.** One border weight, 1px. 0.5px is allowed on small chips; the gradient ring matches the 1px it replaces. The 2px focus outline is not a border and is exempt.

## Motion

Motion does one of three jobs: it acknowledges a pointer, it explains a change of state or place, or it runs as a mechanical loop saying an object is live. Nothing else moves. The site is photography-led and mostly still, so every instance of movement is read.

The one authored moment is **the develop** — a photograph going from greyscale to colour under the pointer. It is the image rule played as a transition: colour belongs to the work, and attention is what pays for it.

### The Two Verbs

A call site names the verb, never the physics.

| Verb | Duration | Easing | Job |
|---|---|---|---|
| `interactive` | `fast` (200ms) | `feedback` | state feedback: hovers, presses, glyph nudges |
| `develop` | `normal` (300ms) | `motion` | movement and reveal: the image develop, the label roll, a panel sliding |

Raw `transition-*` longhands belong to the preset. Any value other than the two verbs and `none` is a deliberate no-op, so a legacy easing name cannot smuggle its own timing back in.

### The Two Springs

Both easings are sampled from one mass-spring-damper simulation and emitted as CSS `linear()`. The verb decides which setting applies.

| Token | ζ | ω | Peak | Character |
|---|---|---|---|---|
| `feedback` | 1.0 | 8.256 | none | arrives and stops. A hairline that wobbles reads as a defect |
| `motion` | 0.74 | 7.949 | 1.031 at 61% | overshoots 3.1% once, then settles. A reveal earns a settle; feedback does not |

Each ω is solved so the curve is within 0.5% of target at the end of its duration, then sampled to 16 stops — the fewest that hold the emitted `linear()` within 0.25% of the true spring. Retuning means changing ζ and regenerating, not adding stops by hand. There is no bézier easing in the token set.

### Durations

`fast` 200ms · `normal` 300ms · `entrance` 600ms · `stagger` 80ms · `sweep` 1600ms · `travel` 2s · `orbit` 32s.

### Entering and Leaving

Two entrance scales drive the same `enter` keyframe (opacity, `--enter-y`, `--enter-scale`):

- **`enter`** (600ms) — the page arriving. Variants: default (30px rise), `fade`, `zoom` (from 1.06, for a hero image behind its own vignette).
- **`arrive`** (300ms) — something appearing over a page already there: a modal shell, the cookie banner, the facts column of an event switched by the stepper. Variants: default (12px rise), `fade`.

Both are CSS animations on the server-rendered element; entry motion does not require a client island. A composition offsets its parts by one `stagger` step; a list may step per item, capped at four steps. Scroll position is not an entrance trigger. Exits run at `fast`, fade only — arriving is an event, leaving is not.

### Loops

Three continuous animations sit outside both verbs. The set is closed.

| Loop | Duration | Where |
|---|---|---|
| `gradientBorder` | `travel` | the travelling ring, on hover only |
| `shimmer` | `sweep` | the loading skeleton, while content is pending |
| `spin` | `orbit` | the partner badge disc |

A loop is allowed on hover, while something is pending, or on one small object. Never idling on a full-width surface.

### The Signature Motions

1. **The image develop.** Greyscale to colour under the pointer, `develop`, on `filter`. Non-interactive images never do it. The two colour surfaces develop by contrast instead, having no greyscale to leave.
2. **The label roll.** The label leaves upward while an `aria-hidden` magenta duplicate enters from 110% below, both clipped to a mask sized to the label. On buttons and nav links.
3. **The gradient border sweep.** A masked ring at the border's own 1px width, filled `action → highlight → action` at 200% background width and translated over `travel`, while the resting border fades out underneath. The edge travels; it does not thicken. Allowed on four objects — the primary button, a card that is a route into something, and the gallery frame — on hover and focus only, so at most one is ever travelling.

### Reduced Motion

One global rule collapses every animation and transition to 0.01ms under `prefers-reduced-motion: reduce`. States still change; they snap. A component must not disable its own state changes to satisfy the preference.

The rule reaches `*`, `*::before` and `*::after`. Two mechanisms sit outside that reach and carry their own guard: native smooth scrolling (`scroll-behavior` is not an animation property) and view-transition pseudo-elements, which are generated outside the element tree.

### What Each Surface Animates

| Surface | What moves | Verb / duration |
|---|---|---|
| Page arrival | title and ground fade up; a hero image also scales from 1.06 | `enter` 600ms, one `stagger` beat |
| Homepage slideshow | scroll to the next snap point; 5s dwell, paused on hover, focus, reduced motion | native smooth scroll |
| Gallery carousel, next/previous | the same native scroll | native smooth scroll |
| Carousel image, hover | 1.05 scale and the contrast develop | `develop` 300ms |
| Lightbox, open / close | the viewer fades in over its scrim | `arrive.fade` in, `fast` out |
| Lightbox, next / previous | drag follows the pointer 1:1; release returns on the `motion` spring | `develop` 300ms |
| Event popup, open / close | the shell fades, painting its own ground over a transparent backdrop | `arrive.fade` in, `fast` out |
| Event popup, next / previous | the facts column re-arrives one `stagger` behind the poster | `arrive` 300ms |
| Route change | old and new snapshots cross-fade; no shared-element flight | `fast`, View Transitions API |
| Buttons, chips, cards, nav | colour and border colour, the label roll, the 1px press | `interactive` 200ms; the roll on `develop` |

JavaScript motion is permitted without restraint on components that are already client islands — the galleries, the carousels, the program. Turning a further component into a client island to get motion is decided per component, never a default.

### Where the Render Is Behind This Specification

Four gaps, owned by the motion milestone rather than by this document:

- The lightbox has no entrance, and neither it nor the event popup has an exit. Both stay mounted, so `data-state="closed"` is available to animate.
- The sweep, the develop and the image zoom answer `:hover` but not `:focus-visible`. A keyboard visitor is never shown them.
- Route transitions do not exist.
- Nothing verifies that a loop stops when its object is offscreen.

### Named Rules

**The Two Verbs Rule.** A call site names the verb and never the physics; the preset is the only file that may write a duration or an easing.

**The One Physics Rule.** Two springs, one system. `feedback` for state, `motion` for movement. A new easing is not a design decision, it is a bug.

**The One Entrance Rule.** A route gets one entrance, at the top. Sections do not announce themselves on scroll.

**The Hover Twin Rule.** Any motion triggered by `:hover` on a focusable object also answers `:focus-visible`.

**The Closed Loop Set Rule.** Three loops. A loop is decoration or a pending signal; it never carries state.

**The Reduced-Motion Rule.** One global rule makes everything snap. Anything that rule cannot reach carries its own guard.

## Components

### Buttons

Six variants, all square, all setting uppercase Label type sized by the `size` prop, all pressing down 1px on `:active`.

- **Primary** — the one loud action on a view. Transparent fill, 1px magenta border, white text. On hover the gradient ring is drawn over the border box at the border's own width while the resting border fades out underneath. The label rolls to magenta. No fill at rest or on hover.
- **Secondary** — the card's language at button scale: transparent fill, hairline border, heading text. On hover the border takes magenta and the label rolls in `heading`, not magenta — the ink is already on the edge.
- **Quiet** — no chrome, `body` text, same box geometry as Secondary (a transparent hairline border) so quiet and secondary controls align on one edge. On hover the text goes to `heading`.
- **Icon** — 48px square, no chrome, `heading` colour; magenta on hover.
- **Link** — inline in running copy, magenta underline at 4px offset. Inherits surrounding type; no roll.
- **Plain** — no chrome at all, for a pressable surface carrying its own look. No roll.

Sizes carry type as well as padding: `sm` 9–10px label; `md` 12–13px; `lg` 12–13px rising to 16px at `md`; `touch` 48px square, icon only.

**Pressed** (`aria-pressed="true"` on Secondary or Quiet) takes the chartreuse fill with black text. The roll is suppressed while pressed.

### Named Rules

**The Filled-Means-Black Rule.** Any control filled with an ink carries black text and a `litEdge` inset highlight. Both inks are light enough that white on them fails contrast (white on magenta is 2.9:1).

**The One Loud Edge Rule.** A fill and the travelling ring never appear on the same object — they compete for the same job.

**The Roll Rule.** Every labeled button rolls, using the nav's gesture and the shared `rollOffset` token. The duplicate is magenta where the magenta has nowhere else to go (Primary, Quiet) and `heading` on Secondary, whose border takes the ink. Chrome-less variants and Icon do not roll; a pressed control holds still.

**The Press Rule.** Every button moves 1px down on `:active`. A control that does not answer the finger is unfinished.

### Cards

The most resolved primitive in the system: **a hairline box on a ground, with one normalized hover.**

- **Ground:** `onDark` — transparent fill, hairline border. `onLight` — white fill, hairline border, `card` shadow. The variant also rewrites the role colour variables, so contents need no ground-specific styling.
- **Interactive state:** one shared hover — the border colour changes to magenta. Border-colour only, no transform. Title shifts and image zooms are the consuming component's business.
- **Signature layer:** the gradient ring on edition cards, the featured program card, and the gallery frame.
- **Internal padding:** owned by the consumer, not the recipe.

### Badges

Uppercase Label type, 12 × 6px padding, square corners, `fit-content`, never wrapping. The default edge is 0.5px so a chip does not read as heavy as a card. Tones: `highlight` (chartreuse fill, black text), `outline` (black fill, chartreuse 0.5px border, gray label), `muted` (no fill, gray-700 border, gray-400 text). Tone is always stated at the call site.

### Filter Chips

The program's venue and type filters, built on the Checkbox primitive. One object, three edges — the chip never fills, so the two inks read at chip scale as they do everywhere.

- **Rest:** hairline border, gray-300 label, 36px min height, a 14px square control at 50% opacity.
- **Selected:** the border takes chartreuse, the label goes white, and the control — the one slot that fills — takes a magenta fill with a black check.
- **Hover, from either state:** the border takes magenta and the label comes up to white. Hovering a selected chip offers to switch it off, so the pointer speaks in the action ink.
- **Focus:** the outline at a 2px offset rather than the global 4px, because chips sit 8px apart.

Every option is selected by default (a null selection means "all"), so the informative state is a chip switched off. That is why selection is an edge: fills would make the default state the loudest thing on the page.

### Link Lists

The hairline-ruled row list used for editions, press appearances, and any index that is a list of links rather than a grid of cards. On hover the title takes magenta and the arrow nudges 4px up and right. Two `emphasis` variants decide which fact carries the row: `title` (a fixed year column, then title, then tags) and `year` (the year moves into the title slot at Heading size, the title drops beneath it as a Label).

### Navigation

Floating, no bar. Logo top-left, hairline-bordered link row top-right; below `md` the links move into a fullscreen black dialog. Label type. On hover the label rolls, the muted copy leaving upward while a magenta copy enters from below. `data-active` gives the link a chartreuse fill with black text and suppresses the roll; the exact page also carries `aria-current="page"`.

### Dialogs

- **Panel:** 540px (760px at `md`, 1000px at `size="wide"`), black fill, hairline border, `modal` shadow, over a 95%-black scrim.
- **Fullscreen:** 100vw × 100dvh, transparent backdrop — the mobile menu and the event lightbox.
- **Title:** `srOnly` by default; the visible heading is part of the content.

### Photography

Not a component, but the system's dominant material and governed like one. Under the catalogue register these are plates.

- **At rest:** greyscale. One grade, `mono`, on every plate, interactive or not. It lifts brightness and contrast, because `grayscale()` maps a photograph's chroma onto luminance and returns a darker, flatter image; a treatment that does not correct for it reads as murk rather than as a decision.
- **On interaction:** develops toward colour — `monoHover`, on the `develop` verb. Brightness and contrast are held equal across the two states, so the develop is carried by colour returning and nothing else. Only interactive images have a hover.
- **The two colour surfaces:** the edition carousel and the homepage slideshow are in colour at rest, developing by contrast rather than saturation.
- **Not the treatment:** `grayscaleFull` marks an announced edition as de-emphasised. It is a state, not the image rule.
- **Scrims:** `cardScrim` for text over an image, `carouselVignette` for gallery focus, `stageScrim` behind the slideshow controls. A scrim that protects text keeps its density; the image is brightened underneath it, not the scrim thinned.

**The plate standard.** A plate has a subject, not a scene. Its crop is decided, never default. Adjacent plates hold one grade. No snapshots, no phone frames, no crowd-at-an-opening filler. A catalogue is judged on its plates.

**For editors.** Nothing enforces the colour/monochrome split — there is no work/documentation flag on an image and none is planned. The distinction is made by putting the picture in the right place: artists' work goes in the edition carousel, where it keeps its colour; institutional and documentary photography goes everywhere else and renders greyscale.

### Named Rules

**The Develop Rule.** Every image is greyscale at rest; an interactive image reveals colour on hover. Colour in a photograph is earned attention, and it is what keeps the two inks unrivaled on the page. Two surfaces are exempt because the work itself is what the visitor came for. The split is a statement of support for the artists — their work is the thing that gets colour.

## Do's and Don'ts

### Do:

- **Do** address colour through role tokens and let a `ground` variant do the light/dark work.
- **Do** set type with `<Text variant="…">` or a `textStyle`, and let the variant choose the ink.
- **Do** keep corners square. `pill` and `circle` are for objects that are actually round.
- **Do** separate surfaces with the 1px hairline; let colour, not weight, say what an edge means.
- **Do** name a motion verb — `interactive` or `develop` — instead of writing transition longhands.
- **Do** ship photography monochrome at rest and develop it on interaction.
- **Do** use the animated gradient ring when an object needs to pull attention.
- **Do** make depth on black with light: inset white hairlines, gradient rings, scrims.
- **Do** hold running text to the 60ch `measure`.
- **Do** square full-width media below `md` and widen it above.
- **Do** cap display-scale type against the viewport (`min(clamp(…), 11vw)`).
- **Do** answer to the card when building a new primitive — it is the most resolved object in the system.
- **Do** give every ink-filled control black text and a `litEdge` inset highlight.
- **Do** give every pressable thing an `:active` response.
- **Do** state a variant at the call site when a branch picks between two of them.

### Don't:

- **Don't** introduce a third accent colour. Two inks, split by role: magenta acts, chartreuse marks.
- **Don't** fill anything larger than a control with chartreuse. Magenta may own a field; chartreuse may not.
- **Don't** use chartreuse for navigation or magenta for marking state. The split is the whole information design.
- **Don't** add a corner radius to a rectangle.
- **Don't** add a soft black shadow on a black ground — it renders as nothing.
- **Don't** uppercase an edition theme. Display type is uppercase everywhere except there.
- **Don't** put white text on an ink fill — both inks fail it. Filled means black.
- **Don't** put a fill and the travelling gradient ring on the same object.
- **Don't** introduce a second border weight. 1px, or 0.5px on a small chip. The 2px focus outline is an outline, not a border.
- **Don't** re-implement button chrome at a call site. A toggle is `aria-pressed` on a Secondary button, a reset is a Quiet button, an image plate is a Plain button.
- **Don't** reach for a raw gray step when a role token exists.
- **Don't** build a breakpoint ladder for a size a `clamp()` step already covers — but do use one for an aspect-ratio change, which is structural.
- **Don't** let a component opt out of state changes under reduced motion. Do write a guard for what the global rule cannot reach.
- **Don't** add a third easing. Two springs, split by job.
- **Don't** trigger an entrance from scroll position, and don't give a section its own.
- **Don't** add a signature graphic device. The devices are the hairline, the square corner and the plate.
- **Don't** make it brutalist. Raw system fonts, unstyled borders and deliberate crudeness are not this system; the hairline is precise.
