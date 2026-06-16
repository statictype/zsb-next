# PASS 3 — Abstractions

Built from the repeated-pattern map (`01-usage.json`), the findings
(`02-findings.md`), and the **Owner rulings R1–R13**. Evidence: usage histograms
in `01-usage.json` + the fontSize/spacing tallies recorded below. Proposals only.

---

## 1. Primitive promotion & consolidation

### 1a. Registered-recipe set: 6 → 6 (one out, one in)

| Action | Recipe | Rationale |
|--------|--------|-----------|
| **RETIRE** | `textLink` | R5: folds into `button` `text` variant. Adopters (Footer, VisitSection, editions page) + the 5 hand-rolled arrow-links migrate to `button({variant:'text'})`. ~40 LOC + a primitive gone. |
| **KEEP** | `badge`, `eyebrow`, `iconButton`, `card` | Well-scoped; adoption gaps are the leak, not the design. |
| **REWORK** | `button` | New orthogonal API below. Absorbs textLink + MagneticButton. |
| **PROMOTE** | `section` (new) | R13: the `sectionShell`. Cross-cutting, variant-driven, 6+ inline sites. |

Net registered recipes stay **6**: `badge, eyebrow, button, iconButton, card, section`.

### 1b. `button` — the consolidated action primitive (R5)

Orthogonal API (no combinatorial names):

```
variant:  primary | secondary | ghost | text        (solid→primary, outline→secondary, link→text)
size:     sm | md | lg                                (text variant is sizeless)
magnetic: false | true                                (GSAP behavior modifier — was MagneticButton)
icon:     none | leading | trailing                   (gap + icon slot; icon-ONLY stays iconButton)
```

- **No hover glow / nudge / ripple** (R5). Hovers are the existing token transitions only.
- `text` variant = the old textLink, **no trailing arrow** (R3); underline-draw on hover stays.
- `magnetic` wraps the GSAP magnet; **drop the click ripple** (`rippleAnim`) — see §4.

**Adopters / what shrinks:**
- Existing: CalendarShare, EventModal, CookieBanner, CookieSettingsButton (already `button`).
- MagneticButton component → deleted; becomes `button({magnetic:true})`. `MagneticButton.recipe.ts` collapses to a modifier.
- textLink consumers (Footer, VisitSection directionsLink [R10], editions page) → `button({variant:'text'})`.
- 5 hand-rolled arrow-links (F02: Calendar recapLink, ComingSoon, EventModal, VenuesView mapLink, FeaturedEvents calendarLink) → `button({variant:'text'})`, arrows deleted.
- error `btn`/`btnPrimary` (F06) → `button` if dependency-safe at the boundary.
- **Shrinks:** 1 recipe retired, MagneticButton recipe → modifier, ~5 link blocks + 1 chip-button block deleted; ~120 LOC.

### 1c. `section` — section-shell recipe (R13, F12)

Replaces the 6 inline "ground + re-added padding" sites and the asymmetric press padding.

```
ground:  dark | light            (sectionDark / sectionLight grounds)
rhythm:  normal | lg              (sectionY / sectionYLg — only the two existing tokens, no third)
inner:   compose `sectionInner` (maxWidth+margin) as today
```

**No `tall`/exception rhythm.** The press page's hand-rolled asymmetric 3xl–4xl
padding is **drift, not a legitimate variant** — it normalizes to `rhythm:'normal'`
(`sectionY`) like every other standard section. The only two padding-Y rhythms are
`sectionY` and `sectionYLg`.

**Adopters:** home/about/partners/press/editions page sections, VisitSection,
Manifesto (lg), About (lg). **Shrinks:** 6 inline-padding leaks + press's 3× hand-rolled
asymmetric padding → one variant call each.

### 1d. New co-located shared components (NOT registered — localized but ≥2 sites)

| Component | Lever | Adopters (≥2) | Variant API | Shrinks |
|-----------|-------|---------------|-------------|---------|
| **`Disclosure`** | promote | Calendar archive (680-715), VenuesView venue (78-120), **VisitFaq** (list/item/question/answer) — 3 | `<Disclosure summary panel>` (sva: root/summary/marker/panel); chevron rotate built in | 3 hand-rolled `<details>` blocks → 1 recipe |
| **`SectionHeading`** | promote | page.tsx:145, partners:83, press:131+179 — 4 | composes `Eyebrow?` + title `textStyle` + `marginBottom`; kills the `css({textStyle:'sectionTitle', marginBottom:'xl'})` idiom (F13) | 4 inline idioms |
| **`Checkbox`** | promote (R2) | CalendarFilters facets (N rows); future Venues/calendar filters | `<Checkbox checked label>` (box + check indicator) | replaces the hand-rolled selectable chip (F01); a real control, not a Badge hack |
| **`EditionTheme`** | extract (R6) | Hero theme display + editions-page cards (interactive) — 2 | `tone`/`interactive` variant on a shared display-title style | de-duplicates the bespoke `tapeTheme` and the editions-card title |

### 1e. Adoption-only (no new abstraction — the primitive already exists)

| Pattern | Adopt | Sites | Note |
|---------|-------|-------|------|
| Hand-rolled chip ×4 (F01) | `<Badge tone="outline" size="sm">` | Calendar:584, EventModal:113, VenuesView:187, FeaturedEvents:226 | verbatim; zero override |
| Hero tapes (R6, F05) | `<Badge elevated>` | Hero tapeDate/tapeEdition | `elevated` already = rotate + pinned-paper shadow |
| Hand-rolled eyebrow ×3 (F05) | `eyebrow` | Hero, FeaturedEvents:53, StripControls:24 | |
| ArtistsBanner ctaText (R10) | `<Badge>` | ArtistsBanner:75 | |
| Reimplemented card ×2 (F03, R4) | `card({interactive})` | Calendar event-row:199, IsdayBadge seal:24 | **drop bespoke hover css** — one shared hover |
| Reimplemented iconButton (F04) | `iconButton` | ExternalGallery ctaIcon:120 | drop hairline + nudge |
| EditionsNav year/theme | — | EditionsNav | **DO NOT TOUCH** (R10 — structural refactor coming) |

### 1f. OVERENGINEERED / deletion candidates

- `textLink` recipe — retired (R5).
- `MagneticButton` component — collapses to a `magnetic` modifier.
- `rippleAnim` keyframe — dropped with the ripple (R5, §4).
- error `btn`/`btnPrimary` — fold into `button` (F06).
- `labelText` / `labelSmall` / `heroBody` textStyles — see §2.

---

## 2. Type scale reduction (R1, R6, R11, R12)

**Evidence (fontSize token usage, external):** `2xs`×57 · `xs`×23 · `sm`×26 ·
`base`×15 · `md`×10 · `lg`×9 · `xl`×9 · `2xl`×12 · `3xl`×9 · `4xl`×7 · `5xl`×**1**.

### 2a. fontSizes ladder: 11 → 7 (ratio ≈ 1.25, single fluid clamp each)

Drop the per-breakpoint media-stepping and the irregular clamps; one clean
`clamp(min, vw, max)` per step on a ~1.25 (major-third) ratio.

| New step | Suggested value | Old steps merged in | Migration |
|----------|-----------------|---------------------|-----------|
| `xs` | clamp(10px, …, 11px) | **2xs (×57)** + xs (×23) | labels (2xs) nudge ≤1px; both → `xs` |
| `sm` | clamp(12px, …, 13px) | sm (×26) | unchanged |
| `base` | 16px | base (×15) | unchanged |
| `md` | clamp(18px, …, 20px) | md (×10) | lead |
| `lg` | clamp(22px, …, 28px) | lg (×9) | card/subsection |
| `xl` | clamp(32px, …, 48px) | xl (×9) + 2xl (×12) | section titles |
| `2xl` | clamp(44px, …, 84px) | 3xl (×9) + 4xl (×7) + **5xl (×1)** + the inline `sectionHeadline`/`pageTitle` clamps | display/hero |

**Removed steps:** `2xs` (→xs), `3xl`/`4xl`/`5xl` (→2xl). `5xl` had a single use —
clean kill. The two inline display clamps (`clamp(40,7vw,96)`, `clamp(40,4.75vw,100)`)
become the `2xl` token (no more hardcoded clamps in textStyles).

### 2b. textStyles: 10 → 5 (delete the unused — no merging)

`pageTitle` and `sectionTitle` are **the truth** for display titles. Everything
with 0 adoption is simply deleted; would-be consumers adopt the survivors or the
Badge/Eyebrow primitives.

| Action | textStyle | Reason |
|--------|-----------|--------|
| **KEEP** | `pageTitle` | canonical display title; use `2xl` token, drop inline clamp |
| **KEEP** | `sectionTitle` | canonical section title (used ×14) |
| **KEEP** | `cardTitle` | the edition/card special treatment (R6); FeaturedEvents.name adopts it |
| **KEEP** | `heroLead` | brighter lead (used ×1, distinct color) |
| **KEEP** | `lead` | body lead (used ×1) |
| **DELETE** | `sectionHeadline` | unused; hand-rolled display titles (Manifesto, ThemeArtists) adopt `sectionTitle`/`pageTitle` instead |
| **DELETE** | `subsectionTitle` | unused → `sectionTitle` |
| **DELETE** | `heroBody` | unused, byte-identical to `lead` |
| **DELETE** | `labelText` | unused; label kickers adopt **Eyebrow/Badge** per R10, not a textStyle |
| **DELETE** | `labelSmall` | unused → as above |

`statementHeadline` (about) and prose (privacy/about/partners ctaBody) → map to the
survivors (R11), no new textStyle.

---

## 3. Spacing / radius / shadow reduction

**Spacing evidence:** all of `xs`(28) `sm`(73) `md`(105) `lg`(78) `xl`(44) `2xl`(46)
`3xl`(29) `4xl`(17) are well-used. Only **`5xl`×3** is weak. `content`×37,
`sectionY`×11, `sectionYLg`×3, `gridGap`×4.

- **`spacing.5xl` (×3) → fold into `4xl`.** Otherwise the spacing scale is earning
  its keep; no further cuts. (`sectionY`/`content`/`sectionYLg` move *into* the
  `section` recipe but stay as tokens.)
- **`radii.pill` (100px) — 0 usage → DELETE** (F26). `circle` (×8) stays. radii 2→1.
- **shadows:** `card`, `badge` stay (each self-used). **Add `shadows.modal`** to kill
  the rgba box-shadow literals (F14: Calendar:613, EventModal:55, CookieBanner:26).
  Add a **`colors.scrim`** semantic for the Lightbox/EventModal backdrops
  (`rgba(0 0 0 / .82–.95)`). shadows 2→3; +1 scrim color role.
- **Border roles (R7):** collapse the white-alpha-on-media rgba hairlines onto
  **two** roles only — rename/standardize `divider`→`borderDark`, `dividerLight`→
  `borderLight`; map the ~11 `rgba(255 255 255/x)` literals → `borderLight`.

---

## 4. Motion consolidation — **16 → 3** (Motion philosophy, hard)

Canonical survivors:

| # | Survivor | Mechanism | Absorbs | One-line justification |
|---|----------|-----------|---------|------------------------|
| 1 | **`enter`** | `from{opacity:0; transform:translateY(var(--enter-y,0)) scale(var(--enter-scale,1)); filter:blur(var(--enter-blur,0))} to{opacity:1;transform:none;filter:none}` | fadeSlideUp, fadeIn, dialogIn, cardIn, imageReveal, tapeIn, cardReveal (7) | One parameterized entrance covers every fade/rise/scale/blur reveal; consumers set vars + duration. |
| 2 | **`spin`** | custom-prop `to{ --angle: 360deg }`, consumers rotate/`conic-gradient(from var(--angle))` | spin, mbGradientSpin, gradientBorderShift (3) | All three are "rotate a thing/gradient to 360°"; unify on a registered `--angle` @property. |
| 3 | **`shimmer`** | `to{ transform: translateX(100%) }` sweep | shimmer + skeletonPulse (skeleton uses ONE treatment now) | The skeleton sweep; collapsing skeletonPulse removes the second, redundant skeleton animation. |

**Deletions / conversions:**
- `pulse` → **DELETE** (owner ruling): the Calendar "now"/on-now pulsing dot is not
  wanted — **remove the pulsing dots from the project** (drop the keyframe and its
  consumers in Calendar / skeleton / Figure).
- `glowDrift` → **DELETE** (single decorative 404 ambient loop; lowest value).
- `rippleAnim` → **DELETE** (R5 drops the click ripple from `magnetic`).
- `heroProgress` → **convert to a CSS transition** (`transform: scaleX()` on a state
  change — a one-shot fill needs no `@keyframes`).
- `skeletonPulse` → **DELETE** (skeleton standardizes on `shimmer`).

**Before → after: 16 → 3.** ✅ (under the ~4 target)

### Motion tokens (kills the 46 inline literals, F20)

- Map literal easings `ease`/`ease-in-out`/`ease-out` → `{easings.quint}` (the
  established micro-transition easing). **Keep just `expo` + `quint`** — no new easing.
- Map literal durations that already have tokens: `0.2s→fast`, `0.3s→normal`,
  `0.4s→medium`, `0.5s→slow`, `0.6s→reveal`.
- **Add 2 duration tokens** for the values with no home (>600ms):
  `durations.entrance` ≈ **900ms** (reveals — incl. the duplicated PageHero:21 /
  page:96 `1s`) and `durations.sweep` ≈ **1.6s** (skeleton). Loop durations
  (`2s/4s/32s`) stay literal as deliberately-bespoke, or a `durations.loop` family
  if preferred. durations 5→7; **46 literals → tokens**.

---

## 5. OKLCH ramp sanity check (lightweight — no palette redesign)

Gray ramp L-steps (hue 345°, chroma 0.005): 97, 94.5, 90, 79, 69, 61, 52, 42, 32, 24, 15.

**Perceptual evenness:** mid-ramp is even (~10 L per step). The **light end is
bunched** — 50/100/200 sit at 97/94.5/90 (only 7 L across 3 steps) while 200→300
jumps 11 L. Minor: nudging `100→93`, `200→87` would even the top. Not blocking.

**Contrast (after R8: `canvas` = true `#000`):** true-black slightly *raises* every
dark-surface ratio — net positive.

| Pairing | ≈ ratio | Verdict |
|---------|--------|---------|
| `heading` (white) on `canvas` (#000) | 21:1 | AAA ✓ |
| `body` (gray.400) on `canvas` | ~8.6:1 | AAA ✓ |
| `muted` (gray.600) on `canvas` | ~5.2:1 | AA ✓ (not AAA) |
| `headingLight` (#000) on `surfaceLight` (gray.100) | ~17:1 | AAA ✓ |
| `bodyLight` (gray.700) on `surfaceLight` | ~5.1:1 | AA ✓ |
| **`muted` (gray.600) on `surfaceLight`** | **~3.5:1** | ⚠️ **fails AA for normal text** — large/secondary only |
| **`action` (pink) as text on `surfaceLight`** | **~3.1:1** | ⚠️ **fails AA normal** — ok for large headings/links, risky inline body |
| `highlight` (chartreuse) as text on light | ~1.2:1 | ✗ never as text on light — must be a **fill with black text** (already the badge pattern) |
| `highlight` on `canvas` | ~16:1 | AAA ✓ |

**Flags (no redesign, just guardrails):**
1. `muted` on light surfaces is **AA-fail for body text** — confine to large/secondary, or define a darker `mutedOnLight` (gray.700-ish) for body use.
2. `action` (pink) as inline text on light is **borderline** — fine for large/CTA, avoid for small body links.
3. `highlight` must stay a *background* with black text — never inline text on a light ground.
4. After R8, audit that nothing relied on the old tinted-black's slight lift over `#000` (purely cosmetic; no contrast risk).

---

## Checkpoint digest

- Promotion candidates: **5** (Disclosure, SectionHeading, Checkbox, EditionTheme, + `section` recipe) — plus 1 retirement (textLink) and the button rework.
- Type scale ratio: **≈1.25 (major third)**, fontSizes **11 → 7**, textStyles **10 → 5** (delete unused, no merges).
- Keyframes: **16 → 3** (`enter`, `spin`, `shimmer`; `pulse` removed too).
