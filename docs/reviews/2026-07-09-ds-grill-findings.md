# DS coherence grill — findings & decisions (2026-07-09)

Produced during the grill session. Each section records the evidence
gathered, the decision made, and what it implies for the sweeps that
implement it. Status: **grill complete — all branches resolved**. This
document seeds the Phase-1 frozen catalog and, eventually, the brand-guide
chapter (`docs/design-system.md`, deferred).

## Evidence base (measured before questioning)

### T — Typography

- **10 textStyles exist** (`sectionTitle`, `pageTitle`, `cardTitle`,
  `boardTitle`, `labelDisplay`, `metaLabel`, `footerMeta`, `lead`,
  `leadLarge`, `prose`) — already above the target of 6, before counting
  the ad-hoc combos below.
- **~50 ad-hoc type combos** declared directly in recipes (fontSize +
  weight + lh + ls + family tuples). The repeated ones cluster into three
  families:
  - **Uppercase label** (body face · semibold · ls `label`/`wide` ·
    size `2xs`/`xs`): ≥13 sites — `CalendarMeta.meta`, `Calendar.count`,
    `Calendar.markerMeta`, `LinkList.year`, `EditionCard.cta`,
    `checkbox.root`, `Calendar.emptyClear`, `EventModal.when`,
    `FeaturedEvents.when`, `accordion.itemTrigger`, `Calendar.bandLabel`,
    `CalendarFilters.filterRowLabel`, `VenuesView.groupTitle`, … This is
    `metaLabel` re-typed with small per-site drift.
  - **Body copy** (body face · lh `body` · size `sm`/`base`): ≥8 sites —
    `Calendar.eventDesc`, `Credits.inlineNames`, `VisitSection.value`,
    `ArtistsBanner.subtext`, `page.editionsSubtext`, `Calendar.recapLine`,
    `EventModal.description`, `ExternalGallery.description`. This is
    `prose`/`lead` re-typed.
  - **Display heading** (display face · lh tight/display · uppercase ·
    size `lg`–`2xl`): ~6 sites — `ComingSoon.base`, `EventModal.name`,
    `Credits.name`, `Calendar.emptyText`, plus raw clamps
    (`ExternalGallery.plate`, Hero).
- **fontSizes split across two mechanisms**: `md`–`5xl` are clamp() tokens
  in `tokens.fontSizes`; `base`/`sm`/`xs`/`2xs` are stepped-responsive
  tokens in `semanticTokens.fontSizes` (they DO exist — but in a different
  file/mechanism than the rest of the scale).
- 3 raw `[clamp(…)]` fontSizes remain (ExternalGallery plate, Hero, page).

### F — Focus & interactivity

- **Two competing focus rings**: `outline: 'focus'` (2px chartreuse) at 13
  sites vs `outline: 'primary'` (2px pink) at 4 sites (button, carousel ×3).
- **Five different offsets**: `xs` (9×), `2px` (4×), `3px` (accordion),
  `4px` (carousel dots), `calc(focus * -1)` inset (dialog).
- 17 `_focusVisible` declarations total, each hand-rolled per recipe/slot.

### D — Disabled

- **Three conventions in play**: `opacity 0.5 + cursor not-allowed`
  (button, carousel), `color: gray.800 + cursor default`
  (CalendarFilters.reset), and a comment in `EditionRailCard.recipe.ts:35`
  explicitly noting "No shared disabled/muted opacity convention exists".
- Badge has no disabled treatment at all.

### R — Vertical rhythm

- Ownership is scattered: ~60 `marginTop`/`marginBottom` declarations in
  recipes, ~20 `paddingTop`/`paddingBottom`, plus `Divider` (10 consumer
  files) sometimes carrying rhythm via adjacent padding, sometimes via the
  neighbour's margin.
- The section shell (`section` recipe, `sectionY` tokens) owns page-level
  rhythm; below that level there is no rule.

### C — Calcs

- 12 `calc()` sites outside `tokens.ts`. Some are derivations the audit
  blessed (hitSlop negation, lightbox frame from `lightboxNavColumn`),
  some are candidates to move into the token layer (`cardOverlap * -1`,
  `nav + spacing.xl` sticky offset, dialog `100dvh - 2*lg`).

### P — Recipe placement

- 10 DS recipes in `src/design-system/recipes/`; ~44 colocated
  `*.recipe.ts` next to components. No stated rule for which goes where.

### X — Redundant declarations

- `alignItems: 'flex-start'` ×7 (mostly no-ops on stacks), `inherit`
  values ×~10, fontSizes redeclared where a parent/document default would
  cascade.

## Decisions

### G — Global authoring constraints (set during the grill)

- **G1 — no `css({…})` in JSX.** Styles reach markup only through recipe
  slots or patterns (built-in or custom-authored). The one sanctioned
  exception: a genuinely unique case where neither a slot nor a pattern can
  be shaped to carry the style. (Supersedes the `css({ textStyle })` leaf
  idiom in `panda-pattern-adopt.prompt.md`'s gold example — amend that
  prompt.)
- **G2 — recipes are consumed as JSX elements**, `styled('span', badge)` →
  `<Badge tone>`, never `className={recipe({…})}` in markup. Markup contains
  only JSX components/patterns with typed props; zero className plumbing.
- **G3 — end-state goal:** the design system doubles as (a) a brand guide
  for AI agents implementing new UI and (b) a chapter of the future ZSB
  brand manual. Every rule must be statable as one sentence a non-engineer
  could follow.

### T — Typography (branch closed)

- **T1 — one 6-step size scale**: `xs sm base md lg xl`. Mapping from the
  old scale: `2xs+xs → xs`, `sm → sm`, `base → base`, `md+lg → md`,
  `xl+2xl+3xl → lg`, `4xl+5xl → xl`.
- **T2 — one mechanism: all `clamp()`** (decided by Claude under delegated
  authority): each size is a single fluid formula, tiny sizes get a
  near-flat slope. Kills the stepped `:root` overrides and the
  non-monotonic `base` (16→15→16px). The `tokens.fontSizes` /
  `semanticTokens.fontSizes` split disappears.
- **T3 — 7 sealed textStyles** built on the scale, each baking in
  face + size + lh + ls + transform. **Pure type — no color**; ink cascades
  from the surface (ground/section owns heading/body/muted ink):
  | style | recipe |
  | --- | --- |
  | `display` | xl · display face · uc · lh 1 · ls tight — page/hero titles |
  | `title` | lg · display face · uc · lh 1.16 · ls tight — section titles, modal names |
  | `heading` | md · display face · uc · lh 1.16 · ls tight — card titles, credits names, board titles |
  | `lead` | md · body face · light · lh 1.56 — editorial intros (survives as a real voice) |
  | `body` | base · body face · lh 1.56 — prose, descriptions |
  | `caption` | sm · body face · lh 1.38 — secondary copy, venue lines |
  | `label` | xs · body face · semibold · uc · ls label · lh 1.3 — metas, chips, badges, kickers, CTAs |
- **T4 — delivery: `<Text>` pattern everywhere.** Every type-bearing leaf
  is a `<Text style="…">` (sealed enum of the 7; font props blocklisted).
  Recipes never declare textStyle — they become pure skin/layout. Document
  ground sets `body` as the ambient default.
- **T5 — type-carrying components compose `<Text>`**: Badge/Eyebrow/Button
  recipes keep only surface (bg/border/padding/radius/states); their label
  type is an internal `<Text style="label">`. Badge's 10px snaps to `xs`.
  `fontSizes.badge`, `lineHeights.badge` die.
- **T6 — art type is not typography.** PartnerBadge's rotating ring, Hero's
  giant tape clamp, ExternalGallery's plate numeral, Calendar's `markerDay`
  are classified as **art**: named single-purpose tokens grouped with their
  component, outside the type census (same status as `brushStroke` assets).
- **T7 — tracking/leading collapse into the styles.** `letterSpacings`
  shrink from 5 tokens to the survivors the styles use (`tight`, `label`;
  `badgeRing` reclassified as ring art); per-site drift (0.6px `subtle`,
  4px `wide`) snaps to the style's value. Same for `lineHeights`.
- **Casualties accepted:** `boardTitle` → `heading` (display face on the
  schedule board — visible change); `wide`-tracked labels → `label`
  tracking; old `lg`-sized type folds into `md` (assumption — confirm the
  old-`lg` mapping at catalog time; the user's mapping didn't name it).

### R — Vertical rhythm (branch closed)

- **R1 — gap-only; Divider is a pure line.** Vertical space comes from
  exactly two sources: the section shell's `sectionY` padding (page
  rhythm) and `Stack`/`Grid` gap (everything inside). `marginTop/Bottom`
  and rhythm-carrying `paddingTop/Bottom` are banned from recipes. A
  `Divider` occupies zero space and rides the surrounding gap. Uneven
  spacing = nested Stacks with different gaps — grouping becomes visible
  in markup. Brand-guide sentence: *"space between siblings is always the
  parent's gap."* Sweep: ~60 recipe margins + ~20 rhythm paddings
  dissolve into parent gaps.
- **R2 — spacing scale mirrors the type decision.** One numbered ladder
  (`xs sm md lg xl 2xl 3xl`-ish), every step a single `clamp()` (small
  steps near-flat). The semantic roles survive as named rhythm vocabulary:
  `sectionY`, `sectionYLg`, `gutter`, `gridGap`. Component one-offs
  (`badgeX/Y`, `navLogoTopMd`, `navDesktopTop*`, `cardOverlap`) are
  audited at catalog time: snap to the ladder where close, else
  reclassify as component/art tokens (T6 status). Brand-guide sentence:
  *"gaps come from the ladder; page anatomy has named spaces."*

### F/D/M — Interactivity (branch closed)

- **F1 — one global focus ring.** `globalCss ':focus-visible' { outline:
  focus (2px chartreuse), outlineOffset: xs }`. All 17 per-recipe
  `_focusVisible` blocks are deleted; button/carousel lose the pink
  `primary` ring (chartreuse won 13:4). Sanctioned deviations (2): the
  dialog close's inward offset (clipping), and the Navigation toggle's
  `::before` ring (drawn on the visible pill — the global rule would ring
  the invisible 48px touch target instead; Phase-0 escalation, blessed). The `primary`
  border token loses its focus duty (audit remaining consumers).
  Brand-guide sentence: *"focus is always the chartreuse ring."*
- **D1 — one global disabled treatment.** `globalCss ':disabled,
  [aria-disabled=true]' { opacity 0.5, cursor not-allowed }`. Deletes
  `button._disabled`, `carousel._disabled`, CalendarFilters' bespoke
  `gray.800` recolor; resolves the EditionRailCard comment complaining no
  convention exists. Brand-guide sentence: *"disabled is 50% opacity,
  everywhere."*
- **M1 — two-speed motion vocabulary.** Paint feedback (color/opacity/
  border) = `fast` (200ms) · `quint`; movement feedback (transform/
  filter/padding) = `normal` (300ms) · `quint`. `expo`/elastics are
  reserved for entrances (`animationStyles`) only; `medium`/`slow`/
  `reveal` disappear from transitions (`instant` stays as the
  reduced-motion kill switch). ~15 sites change speed slightly.
  Brand-guide sentence: *"feedback is fast, movement is normal,
  everything eases with quint."*

### P — Recipe placement & mechanism (branch closed)

- **P1 — one mechanism: config recipes, colocated.** `sva` dies entirely
  (47 files). Every surviving recipe is a `defineRecipe`/
  `defineSlotRecipe` with `jsx` enabled, consumed as styled JSX elements
  (G2); components import from the generated `styled-system/recipes`.
  Definition files stay colocated (`Component.recipe.ts`); a preset index
  registers them. `src/design-system/recipes/` keeps only multi-consumer
  primitives. Rule: *"a recipe lives with its only consumer; primitives
  live in the design system."* (Centralizing all skins into the DS folder
  was considered with a concrete example and rejected — editing proximity
  won.)
- Note: after T4/R1/F1/D1 strip type, rhythm, and states, most feature
  recipes shrink to a few paint declarations; several dissolve to zero
  and lose their file.

### C — Calc policy (branch closed)

- **C1 — calc is a smell; restructure it away.** User stance, verbatim
  intent: 99% of calcs should be eliminated by rethinking the layout, not
  by naming the math — e.g. `main` owns nav-clearance once instead of
  every hero computing `nav + Npx`; Lightbox becomes a
  `[lightboxNavColumn 1fr lightboxNavColumn]` grid instead of
  `100vw − 2×column`; dialog uses `inset` instead of `100dvh − 2×lg`;
  absolutely-positioned accommodation padding becomes a generous ladder
  step. The irreducible remainder becomes a named token
  (`hairlineOverlap`-style) — never math in a recipe or markup. Sweep:
  all 12 call-site calcs audited with "restructure first"; raw constants
  hiding inside calcs (`220px` poster width, the editions `120ms` stagger
  vs `durations.stagger` 60ms — two clocks for one concept) are
  independent findings.

### S — Sensible defaults early (principle, resolved by construction)

The decisions above implement it: ambient `body` type from the document
ground (T4), ink from the surface (T3), focus/disabled from `globalCss`
(F1/D1), gaps from pattern `defaultValues`, `Stack gap="md"` etc. already
in the preset. Rule: *"defaults live at the outermost capable layer
(document → pattern default → recipe defaultVariant); callers state only
deviations."* The X-smells (redundant `flex-start`, `inherit`, restated
browser defaults) are deleted mechanically during the sweeps — anything
equal to the inherited/initial/default value is drift by definition.

### E — Execution

- **E1 — rollout: catalog → phased adopt** (the machinery proven by the
  C1–C9 pattern sweeps):
  - **Phase 0 — foundations:** new size scale + 7 sealed textStyles +
    `Text` pattern + `globalCss` focus/disabled. Execution prompt:
    `docs/reviews/ds-phase0-foundations.prompt.md` (fontSize compat
    aliases were dropped in favour of a mechanical rename table — old
    `lg`/`xl` names change meaning, so aliasing would misrender the ~16
    changed-meaning call sites; legacy *textStyle* names do stay as thin
    redefinitions until Phase 2).
  - **Phase 1 — frozen catalog:** type census (every type site → its
    target style), ink census + ground mechanics, rhythm census (every
    margin → its gap owner), spacing-ladder formulas, calc audit (every
    calc → its restructure), motion census, recipe dissolution map
    (every sva → dissolve/convert), surface list. Grill resolves the
    Open-questions section before freezing. Prompt:
    `docs/reviews/ds-phase1-catalog.prompt.md`.
  - **Phase 2 — per-surface adopt sweeps** (primitives first, then
    Calendar, Venues, Editions, …) against the frozen catalog,
    escalate-don't-improvise; step 0 of the first run lands the spacing
    ladder + ground ink mechanics. Prompt:
    `docs/reviews/ds-phase2-adopt.prompt.md`.
  - **Phase 3 — delete** legacy textStyles, `sva`, dead tokens
    (`fontSizes.badge`, `lineHeights.badge`, dead `letterSpacings`,
    unused durations), then prove the ten census invariants repo-wide.
    Prompt: `docs/reviews/ds-phase3-deletion.prompt.md`.
- **E2 — enforcement & brand-guide doc: out of scope for this pass.**
  Decisions are recorded here; lint/blocklist/CI enforcement and
  `docs/design-system.md` come later.
- **E3 — prompt amendments needed:** `panda-pattern-adopt.prompt.md`'s
  gold example uses `css({ textStyle })` on leaf spans — superseded by
  G1/T4 (`<Text>`); amend before any further adopt runs.

## Open details for catalog time (not blocking)

1. Old `lg` fontSize mapping (assumed → new `md`).
2. Exact clamp formulas for the 6 sizes and the spacing ladder.
3. `Text` pattern API surface (prop name `style` vs `variant`; `as`
   handling; whether a `tone`/ink prop exists or ink stays purely
   contextual).
4. Ground/section ink mechanics: how `heading`/`body`/`muted` cascade per
   surface (extend the `ground` recipe; verify light-ground pages).
5. Which component one-off spacing tokens snap vs reclassify (R2 audit).
6. `primary` border token's remaining consumers after F1.
7. Where `Divider`-adjacent breathing room that was padding becomes gap
   (C9 sites re-visited under R1).

