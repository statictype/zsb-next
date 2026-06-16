# Design-System Refactor — Task Plan

Executes the findings in [`design-audit.md`](./design-audit.md) (rulings R1–R13).
**Each stage ships as one branch/PR**; the tasks within a stage are its checklist
(they correspond to the Linear issues under that milestone). Each **deferred epic
is its own PR**. Stages are **dependency-ordered**: nothing in a later stage is
needed by an earlier one, so the stage PRs land in order.

## Working agreements

- **One branch + PR per stage/milestone** (Foundation, Primitives, Adoption) — the
  PR closes all the stage's task-issues — and **one PR per deferred epic**. No
  direct pushes to `main`. `gh` CLI isn't installed yet — the PR is opened manually
  until it is.
- **Order within a stage PR:** do the tasks in dependency order (e.g. Foundation
  leads with A6, then A1/A2 before A7). Keep the commits task-by-task inside the
  branch so the PR is reviewable as a sequence.
- **Done-bar (every PR):** `pnpm typecheck` + `pnpm lint` + `pnpm exec panda
  codegen` all green → visual review in the browser before merge. No visual test
  runner exists; each task's **Visual** tag flags how much eyeballing it needs
  (`none` / `low` / `review`) so the stage PR's risky spots are obvious.
- **Task shape:** What · Why · Scope (bullets, no implementation detail) ·
  Depends-on · Visual · Source (audit finding/ruling refs).
- **Out of scope this round** (own epics, see appendix): the fontSizes ladder
  reduction, the Calendar structural split, the EditionsNav refactor.

---

## Stage A — Foundation (tokens & textStyles)

No new components; pure `panda.config.ts` + token-reference changes. Unblocks
everything else.

### A1 · Single true black; drop `lightPink`
- **What:** Redefine `black` as neutral `#000` (OKLCH form), merge `black` +
  `blackPure` into one token (~44 refs), delete the tinted magenta black. Delete
  `lightPink` (0 uses).
- **Why:** One true black; the tinted brand-ink black contradicts itself once a
  neutral is wanted. Removes a dead anchor.
- **Scope:** token redefinition; repoint refs; **append a "superseded in part"
  note to ADR 0017** (true-black). Gray ramp keeps its warm 345° hue.
- **Depends-on:** —  **Visual:** low (black shifts tinted→neutral)  **Source:** F16 / R8

### A2 · Two border roles
- **What:** Standardize on `borderDark` / `borderLight` (today's
  `divider`/`dividerLight`); map the ~11 white-alpha `rgba(255 255 255/x)`
  hairlines onto `borderLight`.
- **Why:** Collapse ad-hoc media hairlines to two roles; no precision media tokens.
- **Scope:** rename/alias roles; convert Hero/HeroSlideshow/ExternalGallery
  white-alpha literals.
- **Depends-on:** —  **Visual:** review (media hairlines)  **Source:** F15 / R7

### A3 · Modal shadow + scrim color
- **What:** Add `shadows.modal` and `colors.scrim`; replace the 5 rgba
  box-shadow/backdrop literals.
- **Scope:** Calendar:613, EventModal:55, CookieBanner:26, MagneticButton:27,
  Lightbox:29 + Lightbox.tsx:184.
- **Depends-on:** —  **Visual:** low  **Source:** F14

### A4 · Motion tokens + de-literalize transitions
- **What:** Add `durations.entrance` (~900ms) + `durations.sweep` (~1.6s); map the
  46 inline duration/easing literals to tokens (literal `ease`→`quint`; `0.3s`→
  `normal`, etc.). Loop durations (2s/4s/32s) stay literal.
- **Depends-on:** —  **Visual:** none  **Source:** F20

### A5 · Delete dead tokens
- **What:** Remove `radii.pill` (0 use); fold `spacing.5xl` (3 use) → `4xl`.
- **Depends-on:** —  **Visual:** low  **Source:** F26 / §3

### A6 · textStyle prune + title adoption  ⭐ highest-leverage, do first
- **What:** Delete the 5 unused textStyles (`sectionHeadline`, `subsectionTitle`,
  `heroBody`, `labelText`, `labelSmall`); redirect the 7 hand-rolled display titles
  to `pageTitle` / `sectionTitle` / `cardTitle`.
- **Why:** Makes the type scale real instead of nominal — the single biggest
  integrity win, and near visually-neutral.
- **Scope:** Manifesto, ThemeArtists, FeaturedEvents.name, Hero (theme→handled in
  B9), ArtistsBanner, ExternalGallery, about statementHeadline.
- **Depends-on:** —  **Visual:** near-neutral  **Source:** F07 / R1 / R11 / R12

### A7 · Raw color anchors → semantic roles
- **What:** Swap `black`/`white`/`blackPure`/`gray.500` used as *roles* for the
  semantic tokens (`heading`/`canvas`/`muted`/…).
- **Scope:** Hero, Manifesto, ArtistsTable, Footer (`gray.500`→`muted`), FeaturedEvents.
- **Depends-on:** A1, A2  **Visual:** none  **Source:** F16

---

## Stage B — Primitives (build/rework + convert consumers)

Each task builds the new/reworked piece **and migrates its consumers together** (no
half-built primitives) — typically one commit per task. The whole stage lands as
one PR.

### B1 · Keyframes 16 → 3
- **What:** Introduce parameterized `enter` (opacity + `--enter-y/scale/blur`);
  unify `spin` on a `--angle` @property (absorbs `mbGradientSpin`,
  `gradientBorderShift`); standardize the skeleton on `shimmer`. Delete `glowDrift`,
  `skeletonPulse`; convert `heroProgress` → CSS transition. (`rippleAnim` removed in
  B4; `pulse` removed in C6.)
- **Depends-on:** A4  **Visual:** review (reveals/loops)  **Source:** §6b / motion ruling

### B2 · Rework `button` recipe (in place)
- **What:** New API — `variant: primary|secondary|ghost|text` (rename
  solid→primary, outline→secondary, link→text) × `size` × `magnetic` × `icon`. No
  consumers changed, nothing removed yet.
- **Why:** The lever the whole Adoption stage hangs on.
- **Scope:** recipe only; **write ADR 0019** (action-primitive consolidation).
- **Depends-on:** —  **Visual:** none (additive)  **Source:** R5 / F04

### B3 · Retire `textLink` → `button.text`
- **What:** Migrate Footer, VisitSection directionsLink, editions page off
  `textLink`; delete the recipe. **Drop the trailing arrow** (R3).
- **Depends-on:** B2  **Visual:** review  **Source:** R5 / R3 / F02

### B4 · Retire `MagneticButton` → `button({magnetic})`
- **What:** Fold the GSAP magnet into the modifier; delete the component. **Drop
  the click ripple + any glow/nudge.** Delete `rippleAnim` / `mbGradientSpin` if
  unused.
- **Depends-on:** B2, B1  **Visual:** review  **Source:** R5

### B5 · `section` recipe + convert padding sites
- **What:** New `section` recipe — `ground: dark|light` × `rhythm: normal|lg`
  (exactly `sectionY` / `sectionYLg`, **no third token**). Convert the 6 inline
  padding sites; **press normalizes to `rhythm:'normal'`** (its asymmetry is drift).
- **Depends-on:** —  **Visual:** low  **Source:** F12 / R13

### B6 · `Disclosure` component
- **What:** Build a shared `<Disclosure>` (rotating-chevron `<details>`); adopt in
  VisitFaq and VenuesView. (Calendar archive adopts in the deferred split.)
- **Depends-on:** —  **Visual:** low  **Source:** F25

### B7 · `SectionHeading` component
- **What:** Build `<SectionHeading>` (kills the `css({textStyle:'sectionTitle',
  marginBottom})` idiom); adopt in home/partners/press.
- **Depends-on:** A6  **Visual:** none  **Source:** F13

### B8 · `Checkbox` component
- **What:** Build a real `<Checkbox>` (box + check + label); replace the hand-rolled
  selectable chip in CalendarFilters.
- **Depends-on:** —  **Visual:** review (filter UI)  **Source:** R2 / F01

### B9 · `EditionTheme` component
- **What:** Extract the edition theme-title style with optional **highlighted
  substring** support (static + interactive variants); adopt in Hero (`tapeTheme`)
  and the `/editions` list cards.
- **Why:** Two real call sites; unblocks the Hero reslot. EditionsNav adopts later.
- **Depends-on:** A6  **Visual:** review  **Source:** R6

---

## Stage C — Adoption sweeps (existing primitives; recipes shrink in place)

These reuse primitives that already exist; the oversized recipes collapse as a
side-effect (no separate reslot tasks). The whole stage is one PR; split a sweep
into per-surface commits if the diff gets large.

### C1 · Badge sweep
- **What:** Hand-rolled chips → `<Badge tone="outline" sm>` (Calendar, EventModal,
  VenuesView, FeaturedEvents); Hero tapes → `<Badge elevated>`; ArtistsBanner
  ctaText → `<Badge>`.
- **Depends-on:** —  **Visual:** low  **Source:** F01 / F05(tapes) / R6 / R10

### C2 · Eyebrow sweep
- **What:** Hand-rolled kickers → `eyebrow` (Hero, FeaturedEvents, StripControls).
- **Depends-on:** —  **Visual:** low  **Source:** F05

### C3 · Card-hover normalization
- **What:** Calendar event-row + IsdayBadge → `card({interactive})`; **drop the
  bespoke gradient/hover css — one shared hover** (R4). IsdayBadge's gradient seal
  becomes a one-line `css()` override.
- **Depends-on:** —  **Visual:** review  **Source:** F03 / R4

### C4 · iconButton adoption
- **What:** ExternalGallery `ctaIcon` → `iconButton` (drop hairline + nudge);
  collapse the decorative edition-plate 4 slots → 1.
- **Depends-on:** —  **Visual:** low  **Source:** F04 / §B3-overengineered

### C5 · `button.text` link sweep
- **What:** Hand-rolled arrow-links → `button({variant:'text'})` (Calendar recap,
  ComingSoon, EventModal, VenuesView mapLink, FeaturedEvents calendarLink). **No
  arrows.**
- **Depends-on:** B2, B3  **Visual:** review  **Source:** F02 / R3

### C6 · Calendar adoption tidy
- **What:** Remove the `pulse` now-dot (and delete the `pulse` keyframe once
  unused); confirm the recipe shrank after C1/C3/C5. (Full structural split is the
  deferred epic.)
- **Depends-on:** B1, C1, C3, C5  **Visual:** review  **Source:** motion ruling / F23

### C7 · error page → `button`
- **What:** Fold error `btn`/`btnPrimary` into `button` **iff** dependency-safe at
  the boundary route; else keep + document.
- **Depends-on:** B2  **Visual:** low  **Source:** F06

### C8 · Prose & misc token adoption
- **What:** Map hand-rolled prose to existing textStyles (about projectMain/
  pillarBody, partners ctaBody `15px`→`base`, privacy article, statementHeadline);
  collapse VisitSection's 3 letterSpacing literals to one token.
- **Depends-on:** A6  **Visual:** low  **Source:** F11 / F18 / F25-prose / R9

---

## Deferred — follow-up epics (not this round)

| Epic | Why deferred | Notes |
|------|--------------|-------|
| **Calendar structural split** | Epic-sized; depends on B-stage pieces | 70→~22 slots: extract `EventRow` (= card + Badge + button.text), `Disclosure` archive panel, decompose the monolith recipe. After C6. |
| **EditionsNav refactor** | Already planned separately (R10) | Adopts `Badge` (soon/viewing), `card`, `EditionTheme` then. Do not touch until then. |
| **fontSizes ladder 11 → 7** | High visual blast radius | Regularize the clamps onto a ~1.25 modular scale; `2xs`→`xs`, `3xl/4xl/5xl`→`2xl`. Its own review-gated initiative. |

---

## Suggested first PR

**The Foundation stage** — lead with **A6** (textStyle prune + title adoption):
mechanical, near visually-neutral, closes the biggest integrity gap, and unblocks
B7/B9 in the next stage.

## ADR deliverables
- **ADR 0019** — action-primitive consolidation (lands in the **Primitives** PR, with B2).
- **ADR 0017** — append true-black supersede note (lands in the **Foundation** PR, with A1).
