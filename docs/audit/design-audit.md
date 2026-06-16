# ZSB Design-System Integrity Audit

Stitched from the pass artifacts in [`docs/audit/`](./audit/) (00 system-map →
04 slots). All proposals incorporate the owner rulings **R1–R13** recorded during
review. **Report only — no source was edited.** Evidence is cited as `file:line`;
generated Panda output was never read.

---

## 1. Executive summary

**System health: strong foundation, leaking at the edges.** The Panda layer
discipline is genuinely intact — **zero `!important`, zero specificity hacks, zero
layer-order violations**, cascade order `reset → base → tokens → recipes →
utilities` as specified, and all 16 keyframes live in config with **no local
`@keyframes`** anywhere. The 6 registered primitives are well-designed. What has
leaked is **adoption**: the type scale and several primitives are defined but
hand-rolled at the call site, so the "one source of truth" is nominal in places.

Across **51 components/recipes** scanned: **190 leaks** (raw values 108, motion
literals 46, inline textStyle 22, inline layerStyle 14, local keyframes 0).

### Top 3 wins
1. **Adopt what already exists.** 6 of 10 `textStyles` have *zero* `textStyle:`
   usage and ~20 components hand-roll chips/links/titles/eyebrows that map 1:1 onto
   `Badge`/`button`/`textStyle`/`eyebrow`. Pure adoption — no new design — erases
   most of the 190 leaks.
2. **Consolidate the action primitives 6 → fewer-and-stronger.** Fold `textLink`
   into `button.text` and `MagneticButton` into a `magnetic` modifier; a clean
   `primary | secondary | ghost | text` × size × magnetic × icon API replaces five
   scattered link/button reimplementations.
3. **Cut the motion + type surface hard.** Keyframes **16 → 3**, fontSizes
   **11 → 7**, textStyles **10 → 5**, and 46 inline duration/easing literals → tokens.

---

## 2. System Map (from `00-system-map.md`)

- **6 registered recipe primitives** (confirmed): `badge`, `eyebrow`, `button`,
  `textLink`, `iconButton`, `card`. Each has an orthogonal `tone/size/variant` API.
- **13 semantic color roles:** canvas, surfaceLight, heading, headingLight, body,
  bodyLight, muted, divider, dividerLight, action (pink), highlight (chartreuse),
  highlightFaint, onMedia. Raw anchors (gray.50–950 from a single 345°/0.005 ramp,
  pink, lightPink, chartreuse, black [tinted], blackPure, white) are *not* for
  direct component use.
- **10 textStyles** (sectionTitle, sectionHeadline, pageTitle, subsectionTitle,
  cardTitle, heroLead, heroBody, lead, labelText, labelSmall) and **5 layerStyles**
  (section, sectionDark, sectionLight, sectionInner, pageHero).
- **Type ladder (11):** 2xs · xs · sm · base · md · lg · xl · 2xl · 3xl · 4xl · 5xl.
- **Motion:** durations `fast/normal/medium/slow/reveal` (5), easings `expo/quint`
  (2, both well-used), **16 keyframes**.
- **Cascade layers:** `reset → base → tokens → recipes → utilities` (`globals.css:13`),
  `preflight: off`.

---

## 3. Severity-ranked findings (from `02-findings.md`)

**Counts: Critical 2 · High 9 · Medium 10 · Low 6.** Full table with every
`file:line` lives in `02-findings.md`; the highest-leverage findings:

| ID | Sev | Category | Issue | Fix (per rulings) |
|----|-----|----------|-------|-------------------|
| F07 | **Crit** | textStyle | Type scale defined-but-not-adopted; 6/10 textStyles 0-use, 7 hand-rolled display titles | apply `textStyle:`; delete the unused (R1/R11/R12) |
| F01 | **Crit** | primitive | Hand-rolled chip reimplements `Badge` ×4 (+2) | adopt `<Badge tone="outline" sm>`; filters → `Checkbox` (R2) |
| F12 | High | layerStyle | Section padding re-added by hand ×6; press asymmetry | promote `section` recipe; **press → `sectionY`, no exception** (R13) |
| F20 | High | motion | 46 inline duration/easing literals; entrance/sweep have no token | map to tokens; add `entrance`+`sweep` durations |
| F03 | High | primitive | `card` surface reimplemented ×2 | `card({interactive})`, **one shared hover, drop bespoke css** (R4) |
| F02 | High | primitive | Hand-rolled arrow-link ≈ `textLink` ×4 (+1) | `button.text`, **drop the arrow** (R3) |
| F05 | High | primitive | Hand-rolled eyebrow ×3; Hero tapes | `eyebrow`; Hero tapes → `<Badge elevated>` (R6) |
| F04 | High | primitive | Reimplemented icon control | adopt `iconButton`, drop nudge (R5) |
| F23 | High | structure | Calendar.recipe 718 lines / 70 slots | SPLIT (§7) |
| F14 | High | raw value | rgba box-shadow/backdrop literals ×5 | add `shadows.modal` + `colors.scrim` |
| F16 | Med | raw value | Raw `black/white/blackPure/gray.500` as roles | map to roles; **one true `#000`** (R8) |
| F15 | Med | raw value | White-alpha rgba hairlines ×11 | normalize to `borderDark`/`borderLight` (R7) |
| F09/F10 | Med | textStyle | `heroBody`≡`lead`; `labelText`≈`labelSmall` | delete unused (R12) |
| F25 | Med | structure | Native `<details>` disclosure dup ×2 | shared `Disclosure` (3rd adopter: VisitFaq) |
| F26 | Low | token | `radii.pill` 0-use | delete |

**Positive finding:** no `!important`, no specificity hacks, no layer misuse —
cascade-layer discipline is fully intact.

---

## 4. Primitive promotion proposals (from `03-abstractions.md`)

Registered recipes stay **6**, but the set changes — `textLink` out, `section` in:

### Consolidations
- **`button`** absorbs `textLink` + `MagneticButton` (R5). New API:
  `variant: primary | secondary | ghost | text` × `size: sm/md/lg` ×
  `magnetic: bool` × `icon: none/leading/trailing`. No hover glow/nudge/ripple.
  `text` = old textLink, **no arrow**. Adopters: all current button + textLink
  users, MagneticButton, 5 hand-rolled arrow-links, error `btn`/`btnPrimary`.
  ~120 LOC + a primitive retired.
- **`section`** (new registered recipe, R13): `ground: dark/light` × `rhythm:
  normal/lg` (exactly the two existing `sectionY`/`sectionYLg` tokens — **no third
  `tall` token; press normalizes to `normal`**). Replaces 6 inline-padding sites.

### New shared components (co-located, ≥2 call sites each)
| Component | Adopters | Replaces |
|-----------|----------|----------|
| `Disclosure` | Calendar archive, VenuesView venue, **VisitFaq** (3) | 3 hand-rolled `<details>` |
| `SectionHeading` | home/partners/press (4) | the `css({textStyle:'sectionTitle', marginBottom})` idiom |
| `Checkbox` (R2) | CalendarFilters facets (+future filters) | the selectable-chip hack (F01) |
| `EditionTheme` (R6) | Hero theme + editions cards (2) | the bespoke `tapeTheme` + editions-card title |

### Adoption-only (primitive already exists)
Hand-rolled chip → `Badge`; Hero tapes → `Badge elevated`; eyebrows → `eyebrow`;
reimplemented card → `card({interactive})`; icon control → `iconButton`.
**EditionsNav stays untouched** (R10 — structural refactor already planned).

---

## 5. Type / spacing / scale reduction (from `03-abstractions.md`)

### fontSizes: 11 → 7 (ratio ≈ 1.25, single fluid `clamp()` each)
Evidence (usage): `2xs`×57 · `xs`×23 · `sm`×26 · `base`×15 · `md`×10 · `lg`×9 ·
`xl`×9 · `2xl`×12 · `3xl`×9 · `4xl`×7 · `5xl`×**1**.

| New step | Value | Merges in | Migration |
|----------|-------|-----------|-----------|
| `xs` | clamp(10–11px) | 2xs (×57) + xs | labels nudge ≤1px |
| `sm` | clamp(12–13px) | sm | — |
| `base` | 16px | base | — |
| `md` | clamp(18–20px) | md | lead |
| `lg` | clamp(22–28px) | lg | card/subsection |
| `xl` | clamp(32–48px) | xl + 2xl | section titles |
| `2xl` | clamp(44–84px) | 3xl + 4xl + 5xl + the inline display clamps | display/hero |

Removed: `2xs`→xs, `3xl/4xl/5xl`→2xl (`5xl` had 1 use). The hardcoded
`sectionHeadline`/`pageTitle` clamps become the `2xl` token.

### textStyles: 10 → 5 (delete unused — no merges, R1/R12)
**Keep:** `pageTitle`, `sectionTitle` (the truth), `cardTitle` (R6 special edition
treatment), `heroLead`, `lead`. **Delete:** `sectionHeadline`, `subsectionTitle`,
`heroBody`, `labelText`, `labelSmall` (all 0-adoption; label kickers go to
Eyebrow/Badge per R10).

### spacing / radius / shadow
- `spacing.5xl` (×3) → fold into `4xl`; the rest earns its keep.
- `radii.pill` (0-use) → **delete** (radii 2 → 1).
- Add `shadows.modal` + `colors.scrim` (kills the 5 rgba literals); collapse
  white-alpha hairlines onto **`borderDark` / `borderLight`** only (R7).

### palette (R8)
**One true black `#000`** — delete the tinted magenta `black`, merge `black`/
`blackPure` into one token (~44 refs). **Delete `lightPink`** (confirmed 0 use).
Gray ramp keeps its warm 345° hue.

---

## 6. Color / contrast risks (from `03-abstractions.md`)

Lightweight check — no palette redesign. After R8 (`canvas` = true `#000`),
dark-surface contrast slightly improves. Flags:

| Pairing | ≈ratio | Verdict |
|---------|-------|---------|
| heading / body on `canvas` | 21:1 / 8.6:1 | AAA ✓ |
| `muted` on `canvas` | 5.2:1 | AA ✓ (not AAA) |
| **`muted` on `surfaceLight`** | **3.5:1** | ⚠️ fails AA for normal text — large/secondary only |
| **`action` (pink) text on light** | **3.1:1** | ⚠️ fails AA normal — large/CTA only |
| `highlight` text on light | 1.2:1 | ✗ never as text on light — fill-with-black only |

Guardrails (no redesign): confine `muted`/`action` to large/secondary on light
grounds (or add a darker `mutedOnLight`); keep `highlight` a background. **Ramp
evenness:** light end (50/100/200) is bunched — optional minor nudge.

### 6b. Motion consolidation — 16 → 3 (from `03-abstractions.md`)

| Survivor | Mechanism | Absorbs |
|----------|-----------|---------|
| **`enter`** | opacity + `--enter-y/scale/blur` vars | fadeSlideUp, fadeIn, dialogIn, cardIn, imageReveal, tapeIn, cardReveal (7) |
| **`spin`** | custom-prop `--angle → 360deg` | spin, mbGradientSpin, gradientBorderShift (3) |
| **`shimmer`** | translateX sweep | shimmer + skeletonPulse (one skeleton treatment) |

**Deleted:** `pulse` (owner ruling — remove the pulsing now-dot project-wide),
`glowDrift` (404 decoration), `rippleAnim` (ripple dropped with `magnetic`),
`skeletonPulse` (→shimmer). `heroProgress` → CSS transition. **Tokens:** map literal
easings → `quint`/`expo`; add `durations.entrance` (~900ms) + `durations.sweep`
(~1.6s); loops stay literal. 46 inline literals → tokens.

---

## 7. Composition + slot reorganization (from `04-slots.md`)

**23 components flagged** (EditionsNav deferred). By primary lever:
**SPLIT 1 · RECOMPOSE 3 · MERGE 1 · DELETE 2 · RESLOT 16.**

### Headline structural moves
- **SPLIT Calendar** (718/70 → ~22 slots): decompose into `Calendar` orchestrator
  + `EventRow` (= `card` + `Badge` + `button.text`) + `OngoingGrid`/`AgendaList` +
  `ArchivePanel` (= `Disclosure`); now-marker loses its pulse.
- **DELETE** MagneticButton (→ `magnetic` modifier) and textLink (→ `button.text`).
- **RECOMPOSE** CalendarFilters → `Checkbox`; VisitFaq → `Disclosure`; IsdayBadge →
  `card` + `Badge` (gradient seal = one css() override).
- **MERGE** error `btn/btnPrimary` → `button`.
- **RESLOT** the oversized recipes by extracting primitives: Hero (12 → ~5; tapes
  become positioned Badges + EditionTheme), FeaturedEvents (24 → ~10; poster =
  card+Badge+cardTitle composition), ExternalGallery (19 → ~10; ctaIcon→iconButton,
  edition-plate collapses to 1 slot — **don't** extract a component), and the page
  recipes (home/about/press/partners 29/28/29/22 → ~12–18 via `section` +
  `SectionHeading`; **press normalizes to `sectionY`**).

### OVERENGINEERED register
Calendar.recipe (70 slots), the 3 page recipes, FeaturedEvents.recipe,
ExternalGallery's 4-slot decorative edition-plate, MagneticButton, textLink.

---

## 8. Phased refactor plan

| Phase | Scope | Est. reduction | Risk |
|-------|-------|----------------|------|
| **1 — Mechanical leaks** | Adopt existing primitives/textStyles/tokens with no design change: hand-rolled chips→`Badge`, arrow-links→`button.text` (drop arrow), eyebrows→`eyebrow`, display titles→`textStyle`, section padding→`section`, motion literals→tokens, raw colors→roles. Delete `radii.pill`, `lightPink`, tinted `black`→`#000`. | ~150 of 190 leaks closed; **~400–600 LOC** of duplicated recipe deleted | **Low** — visual parity; mechanical, reviewable per-component |
| **2 — Promotion** | Rework `button` (absorb textLink + MagneticButton); create `section`, `Disclosure`, `SectionHeading`, `Checkbox`, `EditionTheme`. Migrate adopters. | 1 primitive retired, 1 component deleted, 5 shared pieces; **~300+ LOC** | **Medium** — touches interactive behavior (magnetic, links, filters); needs visual QA |
| **3 — Composition + slots + scale + motion** | SPLIT Calendar; RESLOT the oversized recipes; reduce fontSizes 11→7 + textStyles 10→5; keyframes 16→3; remove pulsing dots; finalize border/shadow/scrim tokens; contrast guardrails. | Calendar 70→~22 slots; **~500–800 LOC**; type/motion surface roughly halved | **Medium-High** — type-scale reduction + Calendar split are wide-reaching; stage behind visual regression checks |

---

## Single highest-leverage change to make first

**Phase 1's type-scale adoption (F07).** Apply `textStyle:` at the 7 hand-rolled
display-title sites and delete the 5 unused textStyles. It is mechanical, visually
near-neutral, closes the single biggest integrity breach (the type scale becoming
real instead of nominal), and unblocks the `cardTitle`/`EditionTheme` extraction
that Phase 2–3 build on. One reviewable PR, low risk, high signal.
