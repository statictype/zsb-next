# DS Phase 1 — frozen catalog (censuses for the coherence sweeps)

Build the **frozen catalog** that Phase 2 (`ds-phase2-adopt.prompt.md`)
executes against and Phase 3 (`ds-phase3-deletion.prompt.md`) verifies.
Authority for every rule: `docs/reviews/2026-07-09-ds-grill-findings.md`
(read it in full — it is short and every census below implements one of its
decisions). Precondition: Phase 0
(`ds-phase0-foundations.prompt.md`) has landed — the 7 sealed textStyles,
the 6-step fontSize scale, the `Text` pattern, and the global
focus/disabled rules exist. Verify that before starting; if Phase 0 is not
in the tree, stop.

Model: **Fable 5**. This is the judgment-heavy phase: you are deciding,
per site, what each declaration *becomes*. You're trusted with the
judgment calls Sonnet would be told to escalate — so the escalation bar
is different here:

- **Ground every verdict in read code** — cite `file:line` for every row.
  No hallucinated slots, no assumed values. Judgment doesn't excuse an
  unverified claim.
- **Decide everything the rules + evidence determine, including close
  calls** — pick, and record the reasoning in the row (one clause, not an
  essay). Reserve **Open questions** for genuine user-facing taste: an
  unsanctioned visible delta, a conflict between two grill decisions, a
  new art-classification candidate. Aim for a short, high-quality list —
  every question you punt is a grill round the user pays for; every
  question you *should* have punted but decided is drift they'll ship.
- **Don't gold-plate.** The catalog is a work order, not a design essay:
  one row per site, verdict + citation + delta. Resist restructuring
  ideas outside the eight censuses — park them in one final "noted,
  out of scope" list if they're genuinely valuable.
- **Review only. Do not edit any file. Do not commit.** The catalog
  document is the single deliverable.

## Output

One git-tracked file: `docs/reviews/<YYYY-MM-DD>-ds-catalog.md` (append
`-2` if taken). Structure: an **adoption-status table** (surfaces ×
status, all `pending`), then one section per census below, then **Open
questions**. Catalog entries must be executable without re-judging —
Phase 2 runs at lower discretion and follows rows literally.

## The censuses

### 1. Type census (T3/T4)

Every remaining type declaration in `src/` (recipes and `.tsx`):
`fontSize`, `fontFamily`, `fontWeight`, `letterSpacing`, `lineHeight`,
`textTransform`, and every `textStyle:` reference (the legacy names
`pageTitle`…`labelDisplay` all die in Phase 2). Per site, one verdict:

- **→ `<Text variant="…">`** — which of the 7, on which element; note the
  visual delta if the site's current values differ from the style.
- **→ ambient** — the declaration equals what the surface/document already
  provides and simply disappears.
- **→ art** — the T6 class (PartnerBadge ring, Hero tape clamp,
  ExternalGallery plate, Calendar `markerDay`, and anything you argue
  joins them — argue it in Open questions if new). Name the component
  token each art value becomes.
- **→ escalate** — doesn't fit any style without an unsanctioned delta.

Include the DS primitives (Badge/Eyebrow/Button internals → compose
`<Text variant="label">` per T5; their bespoke type tokens die in Phase 3).

### 2. Ink census + ground mechanics (T3 pure-type corollary)

Every `color:` in recipes/tsx: **cascades** (dies — the surface provides
it), **stays** (a real per-slot deviation, kept in the recipe), or
**escalates**. Then design the mechanics this depends on, as a concrete
catalog section Phase 2 step 0 can implement verbatim:

- How `ground`/`section` supply heading/body/muted ink per surface
  (extend the existing `ground` recipe; check every light-ground page).
- The ambient default (`body` textStyle + body ink at the document root)
  — where it's declared, and what in `globals.css` it replaces or
  conflicts with (read that file; list the collisions).

### 3. Rhythm census (R1)

Every `marginTop`/`marginBottom` (~60) and rhythm-carrying
`paddingTop`/`paddingBottom` (~20) in recipes: which parent gap absorbs
it — existing `Stack`/`Grid`/pattern gap, a **new nested Stack** (specify
the grouping and gap), the section shell, or **stays** (non-rhythm
padding, e.g. a box's internal inset — say why). Revisit the C9 Divider
sites: breathing room that was padding becomes the surrounding gap.
`marginTop: 'auto'` (pin-to-bottom) and negative-margin art
(`cardOverlap`) route to the calc/art audits, not to gaps.

### 4. Spacing ladder (R2)

Mirror the Phase 0 type-scale method: for each ladder step
(`xs sm md lg xl 2xl 3xl 4xl`) and each named role (`sectionY`,
`sectionYLg`, `gutter`, `gridGap`), derive one `clamp()` (375→1920px
linear; near-flat for xs/sm; keep current base/max endpoints; collapse
`md`'s 16→20 step into a clamp). Precompute the formulas — Phase 2 pastes
them. Audit the component one-offs (`badgeX/Y`, `navLogoTopMd`,
`navDesktopTop*`, `cardOverlap`, `hairlineOverlap`): snap to a ladder
step (state the delta) or reclassify as component tokens. Any deletion of
a spacing token someone still references is Phase 3's job — the catalog
only maps.

### 5. Calc audit (C1)

All `calc()` sites outside `tokens.ts` (12 at last count — re-grep).
Per site, a **restructure design**, concrete enough to execute: e.g.
nav-clearance owned once by the page shell instead of per-hero math;
Lightbox as a `[lightboxNavColumn 1fr lightboxNavColumn]` grid; dialog
sized with `inset` instead of `100dvh − 2×lg`. Last resort: a named
derived token (`hairlineOverlap` style). Raw constants hiding inside
calcs (the `220px` poster width, the editions `120ms` stagger vs
`durations.stagger` 60ms) are their own rows. If a restructure would
change behavior, state the delta or escalate.

### 6. Motion census (M1)

Every `transition*` in recipes: classify **paint** (color/opacity/border
→ `fast` · `quint`) or **movement** (transform/filter/padding →
`normal` · `quint`). List every site whose duration or easing changes
(all `expo`/`medium`/`slow`/`reveal` transitions). `instant` stays as the
reduced-motion kill switch. A transition that resists the two-speed rule
(the nav roll, the develop treatments, elastics) → Open questions with
your recommendation, per the grill's rejection of the "hero exceptions"
option — the default answer is it conforms.

### 7. Recipe dissolution map (P1/G2)

All sva recipes (47 at last count — re-glob). Per **slot**: dissolves to
a pattern/`Text`/global rule (name which), or **survives as skin** (list
the exact declarations that remain). Per **recipe**: dissolves entirely
(file deleted) or converts to a colocated config recipe —
`defineRecipe`/`defineSlotRecipe`, `jsx: […]` names, consumed as styled
JSX elements, registered via a preset index (design that index once,
here). Flag every `className`-plumbing consumer that must move to JSX
form. The single sanctioned cva (`grep` for it) gets a row too.

### 8. Surface list (Phase 2's run units)

Cluster the affected files into ordered sweep surfaces, each one
Phase 2 run: **primitives first** (DS recipes + Badge/Eyebrow/Button
composition), then feature surfaces (Calendar family, Venues/Visit,
Editions, Home page, Footer/Nav/chrome, …you decide the exact cut). Per
surface: member files + which census rows apply. Order so shared
dependencies land before their consumers.

### Open questions

Everything escalated, plus the findings doc's §"Open details" 1–7 —
resolve the ones your censuses answered factually; leave genuinely
user-facing ones as questions with a recommendation each. The catalog is
**not frozen** until the user grills this section.

## Verification

The catalog's counts must reconcile: every grep hit for the censused
properties appears in exactly one row (or the art/untouched lists). State
each census's total vs. grep total. Then **stop** — no edits, no commit.
