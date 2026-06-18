# Design-System Refactor — Task Plan

Executes the findings in [`design-audit.md`](./design-audit.md) (rulings R1–R13).
**The whole refactor ships as one PR** on `refactor/ds-foundation` (revised
2026-06-16 — see Working agreements + Deviations); the stages/tasks are its
committed-in-order checklist (they correspond to the Linear issues). Each
**deferred epic is its own later PR**. Stages are **dependency-ordered**: nothing
in a later stage is needed by an earlier one, so the commits land in order.

## Working agreements

- **One PR for the whole refactor** on `refactor/ds-foundation` (revised 2026-06-16 —
  see Deviations log). Foundation + Primitives + Adoption + the audit docs all land
  on this one branch, committed task-by-task. (Originally one PR per stage; that was
  dropped because per-stage branches off `main` collided and off-branch gave no
  clean diffs.) No direct pushes to `main`.
- **Commit order (dependency-driven):** Foundation led with A6, then A1/A2 before
  A7. In **Stage B**, `B1` + `B5` come before `B7`/`B9` (B7 needs B5's ground color;
  B9 needs B1's `tapeIn`). In **Stage C**, `C6` comes after `C1`/`C3`/`C5`, and the
  `asChild`/`icon` button changes (C4 + the B2 `asChild` amendment) land before the
  C5/C7 button sweeps that consume them. Keep commits task-by-task so the PR reads
  as a sequence.
- **Done-bar (every PR):** `pnpm typecheck` + `pnpm lint` + `pnpm exec panda
  codegen` all green → visual review in the browser before merge. No visual test
  runner exists; each task's **Visual** tag flags how much eyeballing it needs
  (`none` / `low` / `review`) so the stage PR's risky spots are obvious.
- **Task shape:** What · Why · Scope (bullets, no implementation detail) ·
  Depends-on · Visual · Source (audit finding/ruling refs).
- **Out of scope this round** (own epics, see appendix): the fontSizes ladder
  reduction, the Calendar structural split, the EditionsNav refactor.

## Status (updated 2026-06-18)

- ✅ **Done:** A1–A7 · B1–B9 · C1–C8
- ⬜ **To do:** C9
- ⏸ **Deferred (own epics):** Calendar structural split · EditionsNav refactor · fontSizes ladder 11→7

---

## Stage A — Foundation (tokens & textStyles)

No new components; pure `panda.config.ts` + token-reference changes. Unblocks
everything else.

### ✅ A1 · Single true black; drop `lightPink`
- **What:** Redefine `black` as neutral `#000` (OKLCH form), merge `black` +
  `blackPure` into one token (~44 refs), delete the tinted magenta black. Delete
  `lightPink` (0 uses).
- **Why:** One true black; the tinted brand-ink black contradicts itself once a
  neutral is wanted. Removes a dead anchor.
- **Scope:** token redefinition; repoint refs; **append a "superseded in part"
  note to ADR 0017** (true-black). Gray ramp keeps its warm 345° hue.
- **Depends-on:** —  **Visual:** low (black shifts tinted→neutral)  **Source:** F16 / R8

### ✅ A2 · Two border roles
- **What:** Standardize on `borderDark` / `borderLight` (today's
  `divider`/`dividerLight`); map the ~11 white-alpha `rgba(255 255 255/x)`
  hairlines onto `borderLight`.
- **Why:** Collapse ad-hoc media hairlines to two roles; no precision media tokens.
- **Scope:** rename/alias roles; convert Hero/HeroSlideshow/ExternalGallery
  white-alpha literals.
- **Depends-on:** —  **Visual:** review (media hairlines)  **Source:** F15 / R7

### ✅ A3 · Modal shadow + scrim color
- **What:** Add `shadows.modal` and `colors.scrim`; replace the 5 rgba
  box-shadow/backdrop literals.
- **Scope:** Calendar:613, EventModal:55, CookieBanner:26, MagneticButton:27,
  Lightbox:29 + Lightbox.tsx:184.
- **Depends-on:** —  **Visual:** low  **Source:** F14

### ✅ A4 · Motion tokens + de-literalize transitions
- **What:** Add `durations.entrance` (~900ms) + `durations.sweep` (~1.6s); map the
  46 inline duration/easing literals to tokens (literal `ease`→`quint`; `0.3s`→
  `normal`, etc.). Loop durations (2s/4s/32s) stay literal.
- **Depends-on:** —  **Visual:** none  **Source:** F20

### ✅ A5 · Delete dead tokens
- **What:** Remove `radii.pill` (0 use); fold `spacing.5xl` (3 use) → `4xl`.
- **Depends-on:** —  **Visual:** low  **Source:** F26 / §3

### ✅ A6 · textStyle prune + title adoption  ⭐ highest-leverage, do first
- **What:** Delete the 5 unused textStyles (`sectionHeadline`, `subsectionTitle`,
  `heroBody`, `labelText`, `labelSmall`); redirect the 7 hand-rolled display titles
  to `pageTitle` / `sectionTitle` / `cardTitle`.
- **Why:** Makes the type scale real instead of nominal — the single biggest
  integrity win, and near visually-neutral.
- **Scope:** Manifesto, ThemeArtists, FeaturedEvents.name, Hero (theme→handled in
  B9), ArtistsBanner, ExternalGallery, about statementHeadline.
- **Depends-on:** —  **Visual:** near-neutral  **Source:** F07 / R1 / R11 / R12

### ✅ A7 · Raw color anchors → semantic roles
- **What:** Swap `black`/`white`/`blackPure`/`gray.500` used as *roles* for the
  semantic tokens (`heading`/`canvas`/`muted`/…).
- **Scope:** Hero, Manifesto, ArtistsTable, Footer (`gray.500`→`muted`), FeaturedEvents.
- **Depends-on:** A1, A2  **Visual:** none  **Source:** F16

---

## Stage B — Primitives (build/rework + convert consumers)

Each task builds the new/reworked piece **and migrates its consumers together** (no
half-built primitives) — typically one commit per task. The whole stage lands as
one PR.

### ✅ B1 · Keyframes 16 → 6 reusable roles
- **What:** Introduce parameterized `enter`; keep `tapeIn`, `gradientBorderShift`,
  `spin`, `heroProgress`; standardize the skeleton on `shimmer`. Delete `glowDrift`,
  `skeletonPulse`, and the six reveal keyframes that fold into `enter`. (`rippleAnim`
  / `mbGradientSpin` removed in B4; `pulse` removed in C6.) **Survivors (6):**
  `enter`, `tapeIn`, `gradientBorderShift`, `spin`, `shimmer`, `heroProgress`.
- **Decision — `enter` is the one vertical reveal.** `fadeSlideUp`, `fadeIn`,
  `dialogIn`, `cardIn`, `imageReveal`, `cardReveal` collapse into `enter`,
  parameterized by `--enter-y`, `--enter-scale`, `--enter-blur` (plus delay/
  duration at the call site). Built `from→to` with **`animation-fill-mode: both`** —
  the offset lives only in the keyframe, so the element's resting state is the
  visible final state and **reduced-motion is just `animation: none`** (no
  per-property reset).
- **Decision — `tapeIn` stays distinct.** Not folded into `enter`: it's a 2D
  diagonal slide (translate x+y) coexisting with a static `rotate`, and B9's
  EditionTheme depends on it for the tape entrance. (Avoids burdening `enter` with
  an `--enter-x`.)
- **Decision — add an `enter()` helper.** A small shared helper (function/`cva`)
  returns the full contract — `animationName: 'enter'`, the one duration + easing,
  `fillMode: both`, and the `@media (reduced-motion) { animation: none }` guard —
  with per-site offset args. Purpose is **anti-drift** (locks the reveal contract so
  a stray duration/easing can't creep back), not line-count.
- **Decision — `heroProgress` stays a keyframe** (not a CSS transition). The
  `key`-remount restart is clean and declarative; a transition would force a
  `useEffect`+reflow hack. It's a determinate progress meter, not a reveal.
- **Decision:** `glowDrift` is deleted, not preserved as a 404-page exception; an
  isolated decorative 404 effect should not keep a global motion primitive alive.
- **Decision:** `gradientBorderShift` is **not** unified into `spin`; it is a
  deliberate **accent border motion** treatment for featured/editorial
  interactive cards, not the default card hover.
- **Depends-on:** A4  **Visual:** review (reveals/loops)  **Source:** §6b / motion ruling

### ✅ B2 · Rework `button` recipe (in place)
- **What (as executed):** New API — `variant: primary|secondary|ghost|text` (rename
  solid→primary, outline→secondary, link→text) × `size`. No consumers changed,
  nothing removed yet.
- **Note — later changes to this recipe:** the originally-planned `magnetic`
  modifier was **dropped** (B4); `variant: 'icon'` is **folded in later** (C4); and
  the `<Button>` component gains **`asChild`** (Deviations). ADR 0019 amended for
  both.
- **Why:** The lever the whole Adoption stage hangs on.
- **Scope:** recipe only; **write ADR 0019** (action-primitive consolidation).
- **Depends-on:** —  **Visual:** none (additive)  **Source:** R5 / F04

### ✅ B3 · Retire `textLink` → `button.text`
- **What:** Migrate Footer, VisitSection directionsLink, editions page off
  `textLink`; delete the recipe. **Drop the trailing arrow** (R3).
- **Depends-on:** B2  **Visual:** review  **Source:** R5 / R3 / F02

### ✅ B4 · Retire `MagneticButton` — **magnetic dropped entirely** (revised)
- **What (as executed):** Delete the `MagneticButton` component **and the magnetic
  behaviour altogether** — no `button({magnetic})` modifier. Drop the click ripple,
  the gradient-border glow, the arrow nudge; delete `rippleAnim` / `mbGradientSpin`
  + the `--mb-angle` `@property`. The CTAs become plain `button`-styled `<Link>`/`<a>`
  (`variant: secondary`). Also strip the matching cursor-magnet from `PartnerBadge`
  (its elastic hover-scale stays). `gsap` is retained (still used by PartnerBadge).
- **Why the change:** owner decision (2026-06-16) to scrap the AI-chosen magnetic
  interaction wholesale and choose a deliberate behaviour later. See Deviations log.
- **Depends-on:** B2  **Visual:** review  **Source:** R5 (superseded in part)

### ✅ B5 · Restore `section` recipe + normalize section padding (reopened)
- **What:** Add a Panda `section` recipe for the outer section shell:
  `ground: dark|light` × `rhythm: normal|lg`. The recipe owns **`paddingBlock`**
  (`sectionY`/`sectionYLg`) **+ ground bg/color only** — keyed off the **semantic
  role tokens** (`canvas`/`heading` etc.), not raw `black`/`white` (stays aligned
  with A7). **Delete the `section`/`sectionDark`/`sectionLight` layerStyles** —
  fully absorbed. Keep `pageHero`; `PageHero flush` is unchanged and composes with
  the recipe.
  Adopt it at the hand-rolled section-padding sites: press, after-hero sections
  (editions/artists/privacy/partners), about carousel/pillars/project/statement,
  Manifesto, and existing `layerStyle:'section'` consumers where the recipe fits.
  **No inline section-shell padding overrides remain**; internal component padding
  (Calendar rows, Hero tapes, card internals) is untouched. `VisitSection` stays
  out (embedded sub-section, inherits gutter/ground from its parent).
- **Decision — gutter lives on the rail, not the shell.** Horizontal padding is
  **not** on the section recipe (that would trap full-bleed children behind the
  gutter). `sectionInner` owns `maxWidth` + auto-margins **+ `paddingInline`**.
  Full-bleed = a child placed **outside** the rail (the ground bg already spans
  full width). No `bleed` variant. Handles mixed sections (constrained heading +
  full-bleed band) that a section-level boolean can't.
- **Decision — rename token `content` → `gutter`** (it now lives on the rail; the
  old name read like CSS `content`).
- **Why:** Section ground and vertical rhythm are a real repeated *bundle with
  variants* (token can't carry the group + the dark/light conditional), so a
  recipe is the right grain. The earlier "no recipe" execution was a
  misunderstanding, not the intended endpoint.
- **Depends-on:** —  **Visual:** low  **Source:** F12 / R13

### ✅ B6 · Disclosure component (native `<details>`)
- **What:** Build one shared **presentational disclosure primitive** that stays
  **native `<details>/<summary>`** (the established house style — VenuesView +
  Calendar archive, zero JS). It standardizes chrome only: summary row, count/meta
  slot, rotating chevron, panel, focus/hover states, reduced-motion handling.
  Adopt in **VisitFaq** (now collapses — see decision) and **VenuesView**; Calendar
  archive adopts during the deferred split, behavior stable.
- **Decision — native, uncontrolled, no JS list state.** The primitive does **not**
  own list state. Open state is the native `<details>` attribute. Exposes
  **`defaultOpen?: boolean`** → native `open`. (Reverses the earlier
  controlled-accordion design: `<details name>` gives single-open natively now, so
  a JS controller buys nothing and costs hydration + the no-JS resilience.)
- **Decision — multi-open by default.** Each `<details>` is independent. Single-open
  is opt-in per usage via a shared native `name`. Variations in *how* a site uses
  disclosure are supported, not normalized away.
- **Decision — caller owns date/conditional behavior.** Whether to render the
  disclosure at all, and its initial open state, belong to the caller. Calendar:
  `ended ? <Disclosure defaultOpen={false}>{children}</Disclosure> : children`
  (`ended` is a render-time, request-stable boolean — no in-session state change).
- **Decision — VisitFaq collapses too.** Its always-open prose was drift, not a
  decision; the docstring is stale (mark it). SEO/AEO is preserved: the `FAQPage`
  JSON-LD is emitted separately, and native `<details>` keeps answers in the DOM
  (crawlable), just visually collapsed.
- **Decision:** Content layout still belongs to callers: FAQ prose, venue
  metadata, and archive event rows remain caller content inside the shared panel.
- **Depends-on:** —  **Visual:** low  **Source:** F25

### ✅ B7 · `SectionHeading` component
- **What:** Build one `<SectionHeading>` and adopt it at **every** `sectionTitle`
  site (the ~18 loose-inline + recipe-slot titles) for full consistency — kills the
  `css({textStyle:'sectionTitle', marginBottom})` idiom and the per-site title
  slots.
- **API:** `as` (h2|h3) · `case` (upper default | sentence — the real
  ThemeArtists/Manifesto variant) · `flush` (marginBottom 0 for gap-header cases;
  default `xl`) · `className` (cx escape for true layout only: maxWidth, gridArea).
- **Decision — color is inherited from the section ground.** The component sets
  `color: 'inherit'`; the B5 `section` ground provides white-on-dark /
  black-on-light. Kills the `white`/`headingLight` per-site fork. (**Adds B5 as a
  dependency.**)
- **Decision — normalized baked defaults:** `textStyle: 'sectionTitle'`,
  `color: 'inherit'`, `textWrap: 'pretty'` (single value — kills the pretty/balance
  fork), `marginBottom: 'xl'`.
- **Decision — no third margin size.** ArtistsBanner (too big at `xl`) uses
  `flush` and lets the **banner's own layout own the small title→subtext gap**
  (`gap: 'sm'`), same as the recipe-slot header pattern. The two margin states
  (`xl` | `flush`) stay intact. ArtistsBanner's **hover color transition is
  removed**.
- **Depends-on:** A6, B5  **Visual:** none  **Source:** F13

### ✅ B8 · `Checkbox` component
- **What:** Build a `<Checkbox>` that **owns its full styling** — the selectable
  chip appearance (box + check + label + states) lives in the primitive, plus an
  optional trailing **`meta`/`count` slot**. Replace the hand-rolled
  `<button aria-pressed>` facet chip in CalendarFilters; the caller passes only
  `label` / `count` / `checked` / `onChange`, no styling on top.
- **Decision — native `<input type="checkbox">` under the hood.** A semantics
  upgrade from the current toggle-button. Certain-safe on performance: ~5–20
  instances, one DOM node each, controlled re-render identical to today's button,
  no virtualization/hot path. (Fallback was "just rename" — not needed.)
- **Decision — scope is CalendarFilters facets only.** The two genuine action
  toggles stay `aria-pressed` buttons, untouched: `Calendar.tsx:266` (show/hide
  past) and `HeroSlideshow.tsx:106` (play/pause).
- **Depends-on:** —  **Visual:** review (label-click / Space / focus-ring a11y
  shift)  **Source:** R2 / F01

### ✅ B9 · `EditionTheme` component
- **What:** Build `<EditionTheme>` — owns the split-on-highlight logic + markup
  (kills the duplicated `splitOnFirst` + `<h><span>` in `Hero.tsx` and
  `editions/page.tsx`) and the canonical "theme tape" style. Props: `theme`,
  `themeHighlight`, `as` (h1|h2), `size`, `interactive`. Adopt in Hero
  (`tapeTheme`), the edition-page hero, and the `/editions` list cards (normal +
  featured). EditionsNav adopts in its deferred refactor.
- **Decision — `size` is a fontSize-token prop (scalar or responsive object), not
  a discrete variant.** Unifies "size variant **or** font token" into one API.
  Three named needs are just token values: **huge** edition hero, **large**
  featured edition (most-recent-live), **normal** cards. **Padding derives from
  font size via `em`** (~`0.45em 0.6em`) so it auto-scales. The editions
  `data-feature` fontSize override is removed (feature slot passes a bigger
  `size`).
- **Decision — normalized base; the truth is the edition-hero tape.** Bake in:
  `textTransform: lowercase`, `canvas` bg, `heading` text, rotation (−0.45°),
  inset + float drop-shadow, the 3px chartreuse top rule, intrinsic `marginBlock`,
  and the **tape entrance everywhere** (the `tapeIn` keyframe — kept distinct in B1,
  not folded into `enter`).
- **Decision — animate the tape entry on every instance; parents adjust.** The
  editions card slot reveal is reworked so the tape's own entry is the canonical
  motion (no double-animation).
- **Decision — `interactive` drives the accent.** `false` (edition hero, static)
  → accent `action` **at rest**. `true` (cards/featured/nav) → accent **white at
  rest, `action` on `a:hover`**.
- **Decision — positioning stays external.** Hero's negative `marginLeft` (tucks
  the tape under the nav) is container positioning on the Hero wrapper
  (`className`), not a tape property.
- **Why:** Multiple real call sites; unblocks the Hero reslot. EditionsNav later.
- **Depends-on:** A6, B1  **Visual:** review  **Source:** R6

---

## Stage C — Adoption sweeps (existing primitives; recipes shrink in place)

These reuse primitives that already exist; the oversized recipes collapse as a
side-effect (no separate reslot tasks). The whole stage is one PR; split a sweep
into per-surface commits if the diff gets large.

### ✅ C1 · Badge sweep
- **What:** Hand-rolled chips → `<Badge>` (Calendar, EventModal, VenuesView,
  FeaturedEvents); Hero tapes → `<Badge elevated>`.
- **Decision — ArtistsBanner CTA is a button, not a Badge.** `ctaText` is a
  display-font pink CTA affordance (no chip chrome) — it does not map to any Badge
  tone. It becomes `<Button asChild variant="secondary">` wrapping the existing CTA
  element (the banner stays one `<Link>`; asChild merges button styles onto the
  child, no nested-interactive). **Arrow dropped** (R3). The banner's existing
  `<Badge>Index</Badge>` eyebrow is unaffected.
- **Decision — `tone` splits by ground.** Chips on solid dark surfaces (Calendar,
  EventModal, VenuesView) → `tone="outline" sm`. FeaturedEvents chips sit over
  poster images → use the **solid editions-card badge** (default `tone="highlight"`,
  size `sm`), **no backdrop** — the solid fill carries legibility, so the former
  `color-mix(canvas 35%)` backdrop is dropped.
- **Decision — make Badge `sm` responsive:** `fontSize: '8px'` → token `'2xs'`
  (8→9→10px) so the chip sweep is lossless. The ±1px padding and lineHeight
  1.3-vs-1.4 normalize to the Badge.
- **Decision — `posterTag` excluded from the Badge sweep.** Calendar's hover-reveal
  poster tag (text label + `_before` rectangle, muted→action) is not a chip — it's a
  bare micro-label. It's promoted separately in **C9** (a `metaLabel` textStyle), not
  here.
- **Depends-on:** —  **Visual:** low  **Source:** F01 / F05(tapes) / R6 / R10

### ✅ C2 · Eyebrow sweep
- **What:** Hand-rolled kickers → `<Eyebrow>`: StripControls → `<Eyebrow tone=
  "muted" size="md">`; FeaturedEvents → `<Eyebrow tone="highlight" size="sm">`.
- **Decision — drop Hero.** Hero has no eyebrow; its only labels are the tapes (C1
  badges) and `tapeTheme` (B9). The audit's "Hero" target is stale.
- **Decision — no weight in eyebrows.** No `fontWeight` variant, **no semibold** —
  one default weight for every eyebrow. FeaturedEvents' inline `semibold` is drift,
  dropped. `marginBottom` stays caller layout (spacing isn't the type primitive's
  job).
- **Note — FeaturedEvents is unmounted / not design-validated.** It is *never* a
  source of truth: it conforms to the primitives' defaults; any styling in it is
  drift (applies to C1 chips, this eyebrow, and any future FeaturedEvents touch).
- **Depends-on:** —  **Visual:** low  **Source:** F05

### ✅ C3 · Card-hover normalization
- **What:** Normalize the genuine card surfaces onto the `card` recipe; the
  `gradientBorderShift` accent-border motion stays available for featured/editorial
  interactive cards.
- **Decision — IsdayBadge is not interactive.** It's a static seal (no Link/onClick)
  → `<Card ground="onLight">` **without** `interactive` (its surface already =
  onLight). The pink gradient is dropped so the shared light card surface remains
  the only ground treatment.
- **Decision — Calendar agenda rows stay list-rows (option b).** The dense agenda
  `event` (recipe :440) is a hairline-separated list row (`borderTop` only; hover =
  link→action + img zoom), **not** a bordered box. Forcing it into
  `card({interactive})` would restructure list→cards — a layout redesign, not a
  hover fix. So C3 normalizes only the *actual* card surfaces; the boxed-card
  treatment of agenda rows waits for the **deferred Calendar structural split**.
  `gradientBorderShift` stays on the ongoing/run poster cards.
- **Depends-on:** —  **Visual:** review  **Source:** F03 / R4

### ✅ C4 · Fold iconButton into `button`; icon adoption
- **What:** **Fold `iconButton` into `button` as `variant: 'icon'`** and **delete
  the standalone `iconButton` recipe + the `<IconButton>` component** (makes ADR
  0019's "one action primitive" literally true). `variant: 'icon'` = 44px square,
  `padding: 0`, borderless, transparent, `color: heading`, `_hover: { color:
  action }`; a compoundVariant neutralizes size padding (as `text` does).
- **Decision — drop the `media` tone (no hover variation).** All icon controls get
  the one hover (white→action). The controls sit over dark backdrops
  (scrim/vignette), so white-at-rest stays legible — safe, not just authorized.
- **Migrate consumers** off `<IconButton>` → `<Button variant="icon">`: StripControls
  (arrows), Lightbox (close/arrows), HeroSlideshow (play/prev/next), and
  ExternalGallery `ctaIcon` (also drops hairline + nudge; resting `action`→white).
  No `css()` overrides (layout-collapse only).
- **What (also):** collapse the decorative edition-plate 4 slots → 1 `plate` slot.
- **Depends-on:** B2  **Visual:** low  **Source:** F04 / §B3-overengineered
- **Amends:** ADR 0019 / B2 (icon folded in; was a separate recipe).

### ✅ C5 · `button.text` link sweep
- **What:** Hand-rolled arrow-links → the **literal `<Button asChild variant="text">`**
  (Calendar recap, ComingSoon, EventModal, VenuesView mapLink, FeaturedEvents
  calendarLink). **No arrows.**
- **Decision — standardize on `<Button asChild>`, retire raw `button()` + override
  classes.** Link/span CTAs use the literal component with the real `<a>`/`<Link>`/
  `<span>` as the asChild child; drop the drift override classes — editions Explore
  `.cta` (re-typographs button.text; keep only `flexShrink:0` if it actually
  shrinks) and VisitSection `directionsLink`. See Deviations (B2 asChild).
- **Depends-on:** B2, B3  **Visual:** review  **Source:** F02 / R3

### ✅ C6 · Calendar adoption tidy + remove the now-marker
- **What:** **Remove the now-marker UI entirely** — not just the pulse. The "now"
  state is a dormant live-edition feature, but the owner has decided against any
  real-time "now" markers in the UI.
- **Decision — remove UI, keep date logic.** Delete: `NowMarker` (the `now` row +
  `nowDot`/`nowLabel`/`nowDate` slots), the inline on-now pulse `_before` dot
  (recipe :295), the `runNow` "On now" label, the `data-now` accent-border styling,
  the `pulse` keyframe, and the now-marker positioning (`markerIndex` /
  `--marker-col`) if it only served the marker. Collapse `status === 'now'` into
  `upcoming` (a running event renders as a normal active event). **Keep** the date
  logic (`todayIso`/`live`/`ended`/past-upcoming) — it drives filtering, past
  de-emphasis, and the archive disclosure.
- **What (also):** confirm the recipe shrank after C1/C3/C5. (Full structural split
  is the deferred epic.)
- **Depends-on:** B1, C1, C3, C5  **Visual:** review (removes a live-edition
  feature)  **Source:** motion ruling / F23

### ✅ C7 · error page → `button`
- **What:** Fold error `btn`/`btnPrimary` into `button` — **dependency-safe, so
  fold** (no keep+document branch). `(site)/error.tsx` is a route-group client
  `error.tsx` (not `global-error`), already imports `styled-system`, runs in the
  app's normal styling context — no isolation barrier.
- **Decision — variant mapping:** Try again (`reset`) → `<Button variant="secondary">`
  with the `RiRefreshLine` **as a child** (the base `gap` spaces it — not the
  icon-only `variant:'icon'`, and no new `icon` prop). Home → `<Button asChild
  variant="ghost"><Link href="/">…</Link></Button>`, **trailing `RiArrowRightLine`
  dropped** (R3). Delete the `btn`/`btnPrimary` slots from `error.recipe.ts`.
- **Depends-on:** B2  **Visual:** low  **Source:** F06

### ✅ C8 · Prose & misc token adoption
- **What:** Two prose textStyles, cleanly named, adopted across the hand-rolled
  prose; plus two token cleanups.
- **Decision — two prose roles.**
  - **`prose`** (rename the misnamed `lead` → `prose`; value unchanged: `{ body,
    base, lineHeight body, color body }`) = plain body copy. Adopt at `pillarBody`
    and the privacy `article` body. Per-context bits stay local: `maxWidth`
    (50ch/70ch measure) + the Portable-Text descendant rules (h2/a/strong).
  - **`lead`** (rename `heroLead` → `lead`, broaden) = editorial emphasis prose.
    **Normalize its value to the manifesto `text` (the source of truth):** `{ body,
    fontSize {base, '3xl': md}, fontWeight {'3xl': light}, lineHeight body, textWrap
    pretty }`. Adopt at **manifesto body, about curator statement, about project
    section (`projectMain`), and the home hero lead.** Existing drift in those sites
    (breakpoint, missing `light`/`pretty`) is erased — normalize to manifesto.
- **Decision — color is ground-driven.** The `lead` textStyle owns font/size/weight/
  line-height/wrap; **color is set per ground** (manifesto on light = `bodyLight`,
  hero on dark = light) — not baked into the textStyle (same rule as SectionHeading).
- **Token cleanups:** partners `ctaBody 15px → base`; VisitSection letterSpacing
  literals (`0.15em`/`0.1em`/…) → one token (`wide`).
- **Drop `statementHeadline`** — it's a `sectionTitle` heading, owned by B7/
  SectionHeading (stale here).
- **Depends-on:** A6  **Visual:** low  **Source:** F11 / F18 / F25-prose / R9

### ⬜ C9 · `metaLabel` textStyle (promote `posterTag`)
- **What:** Add a `metaLabel` textStyle — the inline uppercase micro-label role:
  `{ fontFamily: body, fontSize: '2xs', textTransform: uppercase, letterSpacing:
  'label', fontWeight: semibold, color: muted }`. Rebuild Calendar's `posterTag`
  on it; keep the Calendar-specific bits at the call site (the leading glyph, the
  wide-hover-only display, and the `[data-poster]` parent-hover → `action`).
- **Decision — textStyle, not a Badge or a component.** It has no chip chrome, so
  it's not a Badge; and with only one current consumer, a `<MetaLabel>` component
  would be speculative API. Promote the *type* now; componentize (with a swappable
  leading icon + interactive props) only when a second real consumer appears.
- **Open nit — weight.** `metaLabel` keeps `posterTag`'s `semibold` (its source
  value). If you later want micro-label weight consistency, it could go weightless
  to match the C2 eyebrow decision — deferred, not blocking.
- **Depends-on:** —  **Visual:** none  **Source:** F01 (posterTag) / R10

---

## Deferred — follow-up epics (not this round)

| Epic | Why deferred | Notes |
|------|--------------|-------|
| **Calendar structural split** | Epic-sized; depends on B-stage pieces | 70→~22 slots: extract `EventRow` (= card + Badge + button.text), `Disclosure` archive panel, decompose the monolith recipe. After C6. |
| **EditionsNav refactor** | Already planned separately (R10) | Adopts `Badge` (soon/viewing), `card`, `EditionTheme` then. Do not touch until then. |
| **fontSizes ladder 11 → 7** | High visual blast radius | Regularize the clamps onto a ~1.25 modular scale; `2xs`→`xs`, `3xl/4xl/5xl`→`2xl`. Its own review-gated initiative. |

---

## Remaining order

Foundation (A1–A7), Stage B (B1–B9), and C1–C8 are done. Remaining commit sequence
on the one branch: **C9**.

## ADR deliverables
- **ADR 0019** — action-primitive consolidation. **Landed early** with the audit
  docs on `refactor/ds-foundation` (not the Primitives PR — see Deviations).
  **Amended twice (2026-06-16):** `asChild` element-choice; `iconButton` folded into
  `button({variant:'icon'})`.
- **ADR 0017** — true-black supersede note, added with A1.

---

## Deviations log (as executed)

Recorded as the refactor runs (owner-directed unless noted). Most recent first.

- **B9 — `size` is named variants; `delay` is a prop; editions reveal reworked**
  (2026-06-16). A runtime responsive `size` can't go through `css()` (Panda static
  extraction), so `size` is named variants (`huge`/`large`/`normal`) — same reason
  as `enter`/`section`. The tape's entrance **delay is a typed `delay` prop** (owner
  ask — keep call-site `className` to *positioning only*); the editions cards now
  pass **no** className. The editions list card reveal is the tape's own `tapeIn`
  (the B1 slot `enter()` is removed — no double-animation). Cards normalize onto the
  hero tape: float drop-shadow, `tight` letter-spacing, −0.45°, em-padding.
- **B8 — Checkbox is a native `<input>`** (2026-06-16). Facets upgraded from
  `<button aria-pressed>` to a real checkbox group (`:has()`-driven chip states);
  the two genuine action toggles stay `aria-pressed`. Scope held to CalendarFilters.
- **B7 — SectionHeading color is ground-inherited** (2026-06-16). `color: inherit`
  (no per-site white/headingLight fork); margin normalized to `xl`|`flush`;
  ArtistsBanner title hover-color dropped; sentence-case kept for Manifesto +
  ThemeArtists. Adopted at all 18 `sectionTitle` sites.
- **B6 — Disclosure stays native/uncontrolled** (2026-06-16). Shared
  `<details>/<summary>` chrome; VisitFaq now collapses (question stays an `<h3>`,
  answers stay in the DOM + JSON-LD). VenuesView adopts; Calendar archive later.
- **B5 — `surfaceLight` redefined to white; full-bleed carousels** (2026-06-16).
  The `section` recipe's `ground: 'light'` needed a semantic bg role, but none
  was white. Owner: **make `surfaceLight` *be* white** (was `gray.100`) and use it
  as the single light-surface role everywhere (light grounds, card `onLight`,
  About `statement`). `ground` is **optional** on the recipe (rhythm-only sections
  like the press strips + VenuesView inherit the page ground). Two carousels
  (ThemeArtists, About) become **full-bleed bands** — the decision's "constrained
  heading + full-bleed band" case — rather than re-padding them; flagged for review
  (easy to re-gutter via a rail wrapper). ExternalGallery's archive card is now in
  a `sectionInner` rail (capped at maxWidth on ultra-wide; was uncapped).
- **B1 — `enter()` is a `cva`, applied via `cx`** (2026-06-16). Panda only resolves
  *local* object spreads, so the anti-drift reveal helper couldn't be a plain
  imported style object spread into recipes — it's a co-located `cva`
  (`src/components/enter.ts`) composed at the render site (`cx(slot, enter({…}))`),
  same shape as the section-recipe adoption. Recipe slots keep only the per-site
  `animationDelay`. Distances normalized (dialog 12→`sm` 16px; fadeSlideUp/cardIn/
  cardReveal → `md` 30px); modal + cookie banner keep `normal` speed via a `speed`
  variant (overlay responsiveness, not drift). Hero image's `grayscale(0.3)` moved
  image→frame so it survives `enter`'s animated `filter`. 404 `glowDrift` blobs are
  now static; skeleton switched from `skeletonPulse` to the `shimmer` sweep.
- **B2/C4 — iconButton folded into `button`** (2026-06-16). The standalone
  `iconButton` recipe + `<IconButton>` component contradicted ADR 0019's "one action
  primitive." Folded into `button` as `variant: 'icon'` (44px square, borderless,
  white→action); the `media` tone is dropped (no hover variation — controls sit over
  dark backdrops, so legible). Recipe + component deleted; consumers (StripControls,
  Lightbox, HeroSlideshow, ExternalGallery) move to `<Button variant="icon">`.
- **B2 — Button gains `asChild` (Slot)** (2026-06-16). The `<Button>` component
  was `<button>`-only; link/span CTAs used the raw `button()` recipe className +
  per-site override classes (drift). Decision: add an `asChild` (Slot) prop so the
  literal `<Button>` renders *as* the call site's own `<a>`/`<Link>`/`<span>` —
  styles merged onto the child, **no wrapper, no nested-interactive**. Chosen over a
  polymorphic `as` prop (generic + `forwardRef` + prop-collision type mess). Link/
  span CTAs migrate to `<Button asChild>` and drop the drift override classes
  (editions `.cta`, VisitSection `directionsLink`). Amends ADR 0019; standardized in
  C5, used by C1 (ArtistsBanner CTA).
- **B5 — reopened: section recipe is required** (2026-06-16). The earlier "no
  `section` recipe" execution was a misunderstanding. Canonical endpoint: a
  Panda `section` recipe owns `ground: dark|light` (semantic-role bg/color) ×
  `rhythm: normal|lg` (vertical `paddingBlock`) — **but not the horizontal
  gutter**: that lives on `sectionInner` (the rail) so full-bleed children can
  escape (token `content` → `gutter`). The `section`/`sectionDark`/`sectionLight`
  layerStyles are deleted; `PageHero flush` is kept and composes with the recipe.
  See the B5 task for the full design.
- **B4 — magnetic dropped entirely** (2026-06-16). Plan was to fold MagneticButton
  into a `button({magnetic})` modifier. Owner chose to **remove all magnetic
  behaviour** instead: deleted the component + the modifier + ripple/gradient-glow/
  nudge + the `rippleAnim`/`mbGradientSpin` keyframes + `--mb-angle`; CTAs are now
  plain `button`-styled links (`secondary`); PartnerBadge's cursor-magnet removed
  too (elastic hover-scale kept). `gsap` retained for future deliberate motion.
- **B3 — VisitSection directions kept as `text`** (2026-06-16). R10 suggested a
  bolder "button variant"; executed as `button.text` (least visual jump), leading
  map-pin preserved. Open to upgrade to `secondary` later.
- **A3 — scope widened, audit line-refs stale** (2026-06-16). Added: EventModal
  backdrop → `scrim` + its controls → plain ghost buttons (owner-directed: don't
  assume the 82%/blur was deliberate). Two F14-listed sites were stale/owned
  elsewhere — the now-dot pulse (C6) and the magnetic ripple (B4).
- **A5 — `radii.pill` kept** (2026-06-16). Audit's "0-use" was stale; DisableDraftMode
  uses it and `circle` can't substitute a stadium radius. Only `spacing.5xl` folded.
- **A2 — only 2 real media hairlines mapped** (2026-06-16). The audit's "~11 white-alpha
  hairlines" were mostly shadows/fills/foreground, not borders; left for later
  shadow/overlay-token work. Two genuine hairlines → `borderLight`.
- **Process — one PR, not per-stage** (2026-06-16). Whole refactor + audit docs +
  ADR 0019 ship on `refactor/ds-foundation`. See Working agreements.
