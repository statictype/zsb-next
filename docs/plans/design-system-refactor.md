# Design System Refactor — Decision Log

Live decision log for the brutal DRY/maintainability refactor of the Panda CSS
architecture (`src/design-system/preset.ts` + component recipes). External-consultant
grilling session; **all prior decisions, including ADRs, are treated as arbitrary.**

Status legend: ✅ settled · 🔶 proposed (awaiting confirmation) · ⏳ deferred (downstream dependency)

---

## Token layer

### ✅ Q1 — Core vs semantic split principle

The governing rule, one line: **named like a scale step → `tokens` (core); named like a job → `semanticTokens`.**

- **Core** = raw palette + scales, named by position (`gray.500`, `pink`, type scale, spacing scale). Zero intent. A token's *value* may be a `clamp()` or a stepped media object — **responsiveness never promotes a token to semantic.**
- **Semantic** = role/intent names only, always reference core via `{…}`, and the **only** place conditions live.

Migration: pull the entire type scale and the entire numeric spacing scale into `tokens` (stepped values and all); leave only role-named spacing/sizing (`sectionY`, `gutter`, `gridGap`, `nav`) in `semanticTokens`. Today's `fontSizes` are split across both layers purely by `clamp` vs stepped — fix that.

### ✅ Q2 — CSS-variable ground roles (collapse the `*Light` pairs)

The four parallel pairs (`heading/headingLight`, `body/bodyLight`, `borderDark/borderLight`, `canvas/surfaceLight`) exist only because there are two grounds. Collapse each to ONE role token whose value is an **inherited CSS custom property** with a dark fallback.

```ts
// each role token reads an inherited ground var, dark default baked into the fallback
heading: { value: 'var(--ground-heading, {colors.white})' }
body:    { value: 'var(--ground-body,    {colors.gray.400})' }
surface: { value: 'var(--ground-surface, {colors.black})' }
```

```ts
// the ground-declaring element sets the vars for ITSELF + all descendants
section: { variants: { ground: {
  dark:  { '--ground-heading': '{colors.white}', '--ground-body': '{colors.gray.400}', /* … */ },
  light: { '--ground-heading': '{colors.black}', '--ground-body': '{colors.gray.700}', /* … */ },
} } } }
```

**Why CSS vars, not a `[data-ground=light] &` descendant condition** (decided second-pass):
- A descendant combinator **cannot style the element that declares the ground** — `Section`(light) setting `background: 'surface'` on its own root would resolve to the `base` (black) value, because the condition needs an *ancestor* match, not self. A light section would render black. Inherited vars apply to the declaring element too.
- A descendant combinator **cannot express "nearest ancestor wins"** for nested opposite grounds (light Section ⊃ dark Card): the light ancestor still matches deep inside the dark card. CSS inheritance gives nearest-wins for free — the inner ground re-sets the vars, descendants pick up the closest value.
- Net: the ground-root consumes the *same* flipping roles as its descendants; no element hardcodes its ground colors.

- `Section`/`Card` `ground` variant sets the `--ground-*` vars; everything (root + descendants) just uses `heading`/`body`/`surface`/`hairline` and resolves to the nearest ground.
- The `_light` *condition* is **not** introduced for grounds. (Reserve a condition only if a genuine standalone flip-outside-a-Section ever appears.)
- Net: 8 roles → 4; all ~24 `*Light` call sites stop hand-picking a ground.
- This is an authoring-time ground scope, **not** a user theme switcher.
- ⚠️ Build-time detail to verify: Panda token-reference interpolation inside a custom-property value (`'--ground-heading': '{colors.white}'`). Fall back to `token(colors.white)` syntax if the curly form doesn't resolve in a recipe variant.

### ✅ Q3 — Composite `borders.*` tokens; no border color/width tokens at all

All hairlines are `1px`; Button's `2px` is the only other weight. Side-specific hairlines dominate (`borderTopWidth: 1px` ×14, plus others).

- **Only composite border tokens exist.** No standalone border-color tokens, **no `borderWidths` token** — width is baked into each composite value.
- Ground-flip lives *inside* the composite value:

```ts
borders: {
  hairline:  { value: { base:   { width: '1px', style: 'solid', color: '{colors.gray.900}' },
                        _light: { width: '1px', style: 'solid', color: '{colors.gray.200}' } } },
  highlight: { value: { width: '1px', style: 'solid', color: '{colors.chartreuse}' } },
}
```

- `hairline` replaces all `borderColor: borderDark` borders **and** the ~22 side-specific dividers (`borderBottom: 'hairline'`, etc. — composites apply to any single edge).
- `highlight` covers the chartreuse accent incl. the **fixed** Badge `outline`.
- Raw `gray.700`/`gray.800` borders (checkbox + 1 other) are drift → normalize to `hairline`.
- **Button border is also a token — nothing inline.** Button is itself a mess to be refactored; its border composite(s) are ⏳ deferred until the Button taxonomy is set (downstream of the interactive-elements strategy).
- **Ground-flip via CSS var (resolved by Q2):** the composite's `color` slot is `var(--ground-hairline, {colors.gray.900})` — no conditional composite value needed, so the earlier "Panda may reject a conditional composite" worry is moot. Grounds set `--ground-hairline` (dark: `gray.900`, light: `gray.200`).

### ✅ Q4 — `canvas`+`surfaceLight` → `surface`; selective nesting only

- **(a)** Collapse `canvas` (black) + `surfaceLight` (white) → one flipping `surface` token. They're the same role on two grounds.
- **(b)** Nesting earns its place **only** where a genuine `DEFAULT` + modifier relationship exists — not as a blanket reorg (it would only make call sites longer).
  - Nest: `highlight` → `highlight.faint`*, `surface` → children (see Q5), `borders` → `hairline`/`highlight`.
  - Keep flat (distinct siblings): `heading`, `body`, `muted`, `action`.

\* superseded by Q5 — `highlightFaint` is drift and removed entirely.

### ✅ Q5 — surface/scrim/onMedia normalization

- **`highlightFaint`: removed.** Drift. It has **two** consumers (not one): Badge `outline` (`borderColor: highlightFaint`) **and** the EditionsNav `viewing` status plate (`EditionsNav.recipe.ts:84`, the chartreuse current-edition chip). Both switch to the `borders.highlight` composite. (The EditionsNav plate is already being relocated into `EditionCard` by Q16 — its border becomes `borders.highlight` there.)
- **`scrim` → `surface.scrim`.** Genuinely reused (dialog + lightbox backdrops). It's a full-bleed fill, so it joins the `surface` group — but as a **fixed dark overlay that does NOT ground-flip** (modals dim to black even over a light page):
  ```ts
  surface: {
    DEFAULT: { value: { base: '{colors.black}', _light: '{colors.white}' } }, // flips
    scrim:   { value: 'rgb(0 0 0 / 0.95)' },                                   // fixed
  }
  ```
- **`onMedia`: deleted.** Single consumer (inactive carousel indicator dash). Active dash is `highlight`, so inactive normalizes to `muted` (gray). Fallback: if those dashes sit *over imagery* and wash out, keep a single "controls over media" role rather than re-adding `onMedia` by name.
- The **8 inline translucent overlays** (Hero/EditionTheme/FeaturedEvents signature gradients/shadows) are deferred to the component pass.

### ✅ Q6 — z-index ladder + radii cleanup + motion micro-values

**z-index** — introduce a role-named semantic ladder; kill the `9998/9999`/`1001`/`1100` bidding war. **Fully mapped (second-pass)** so every cross-component layer has a named rung — the earlier 4-rung draft collided CookieBanner with nav and had no home for the nav toggle or the draft badge:
```ts
zIndex: {
  nav: 100,        // floating logo + desktop menu (was 1001)
  banner: 200,     // CookieBanner — above nav, below overlays (was 100, collided with nav)
  overlay: 1000,   // scrims / backdrops (modal + mobile-nav dialog) (was 1100 / 9998)
  modal: 1010,     // modal + dialog content, mobile-nav menu (was 1101 / 9999)
  navToggle: 1011, // hamburger stays above the menu it toggles (was 1002)
  lightbox: 1020,  // also FIXES a latent bug — Lightbox was z 10, i.e. under the nav
  draftBadge: 1030,// DisableDraftMode dev affordance, always on top (was 9999)
}
```
- nav `100` clears all non-overlay local stacking (max non-overlay is Hero z `4`).
- **Local stacking `0`–`3`** inside `isolation: isolate` components stays **inline** (correctly local; tokenizing would over-couple). (`navToggle` may alternatively remain a documented local exception inside the nav's own stacking context rather than a global rung — either is acceptable, but it must be named, not omitted.)

**radii** — keep `circle`; normalize `50%`→`circle`; drop lone `2px` and `borderRadius: '0'` (sharp is the default — just omit). Verify `pill` isn't dead; remove if unused.

**shadows / motion easings+durations** — healthy, no token work (0 inline `cubic-bezier`; `card`/`badge`/`modal` adopted). The 2 signature inline shadows (EditionTheme, Hero) stay deferred to the component pass.

**Stray motion micro-values (cleaned up):**
- `60ms`/`90ms` per-item stagger → add **`durations.stagger` (60ms)**. Now consumed *inside* the `enter` animationStyle's `animationDelay` (Q20), not at each call site; consumers only set `--i`. FeaturedEvents folds 90ms→60ms.
- Navigation `transitionDuration: '0ms'` → replace with standard `_motionReduce: { transition: 'none' }`. No token.
- **The broader animation cleanup (inline `2s`/`32s`/tape delays, the `enter()` cva → animationStyles, the two reveal mechanisms, the missing reduced-motion guard) is owned by [Q20], not here.** Q6 keeps only the `durations.stagger` token + the Navigation `0ms` fix.

### ✅ Q7 — token scale depth: NO trimming needed

Audited adoption: every `fontWeight` (semibold 41×, others 1–5× but all real), every `duration` (incl. thin `sweep`/`reveal`), and every `lineHeight` is referenced with **zero inline drift**. The scales are *adopted*, not bloated.

**Conclusion: the token "mess" was never bloat.** It was (1) core/semantic confusion [Q1], (2) missing composite/ladder tokens — borders & z-index [Q3, Q6], and (3) component-level drift (raw grays, inline values) — handled in the component pass. Token-layer grilling is **complete**; keep all existing scales.

---

## Animation layer

### ✅ Q20 — Adopt Panda `animationStyles` as the one animation home

The animation layer has the same shape of drift the token layer had: inline literals (`gradientBorderShift 2s`, `spin 32s`, tape delays `0.35s`/`0.75s`), an **inconsistent reduced-motion guard** (`skeleton.ts` has one; `loading.recipe.ts:46` shimmer doesn't), **two parallel reveal mechanisms** (the paint-triggered `enter()` cva vs the EditionsNav transition-reveal gated on `[data-revealed]`), and **dead `enter()` variants** (`soft`, `rise:sm` — zero call sites). Fix it the same way: one named, nestable home.

**Decision: move all named animations into `theme.extend.animationStyles`.** Keyframes (`enter`, `tapeIn`, `spin`, `gradientBorderShift`, `shimmer`) stay as-is — `animationStyles` is the *consumption* layer that bundles `animationName` + duration + easing + fill-mode + **a baked-in `_motionReduce` guard** + any gating conditions, consumed via `css({ animationStyle: 'enter' })` / `'enter.inView'`.

```ts
animationStyles: {
  // Entrance family — ONE `enter` keyframe, parameterized combos (replaces the enter() cva).
  enter: {
    DEFAULT: { value: {                       // rise + fade — the page/card entrance default
      animationName: 'enter', animationDuration: 'entrance',
      animationTimingFunction: 'expo', animationFillMode: 'both',
      animationDelay: 'calc(var(--i, 0) * {durations.stagger})',   // stagger folds in; --i unset → 0
      '--enter-y': '30px', _motionReduce: { animation: 'none' },
    } },
    fade:   { value: { /* …base, --enter-y: 0px */ } },                  // hero vignette (pure fade)
    zoom:   { value: { /* …base, --enter-y: 0px, --enter-scale: 1.06 */ } }, // hero image
    snappy: { value: { /* …base, animationDuration: normal */ } },       // cookie banner / overlays
    inView: { value: {                        // gated: paused until an ancestor flips [data-revealed]
      /* …base */ animationPlayState: 'paused',
      '[data-revealed=true] &': { animationPlayState: 'running' },
    } },
  },
  // Continuous loops — one-off speeds live here as literals, single-sourced (no single-use tokens).
  spin:           { value: { animationName: 'spin', animationDuration: '32s', animationTimingFunction: 'linear', animationIterationCount: 'infinite', _motionReduce: { animationPlayState: 'paused' } } },
  shimmer:        { value: { animationName: 'shimmer', animationDuration: 'sweep', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', _motionReduce: { animation: 'none' } } },
  gradientBorder: { value: { animationName: 'gradientBorderShift', animationDuration: '2s', animationTimingFunction: 'linear', animationIterationCount: 'infinite', _motionReduce: { animation: 'none' } } },
  // Signature diagonal tape entrance — per-instance delay via --tape-delay.
  tape: { value: { animationName: 'tapeIn', animationDuration: 'entrance', animationTimingFunction: 'expo', animationFillMode: 'forwards', animationDelay: 'var(--tape-delay, 0s)', _motionReduce: { animation: 'none' } } },
}
```

**Naming:** type/family-based with nested `DEFAULT` + variants per Panda's recommended convention — `enter` (+ `.fade`/`.zoom`/`.snappy`/`.inView`), `spin`, `shimmer`, `gradientBorder`, `tape`. Orthogonal `enter()` axes become a handful of enumerated named combos — fine, because only ~4 are actually used.

**What this folds in / fixes:**
- **`enter()` cva deleted** (`src/components/enter.ts` removed). ~10 call sites swap `cx(x, enter())` → `cx(x, css({ animationStyle: 'enter' }))`, `enter({ rise:'none', zoom:true })` → `'enter.zoom'`, `enter({ rise:'none' })` → `'enter.fade'`, `enter({ speed:'normal' })` → `'enter.snappy'`. Dead `soft`/`rise:sm` dropped.
- **In-view reveal unified** onto `enter.inView` (play-state-paused until `[data-revealed]`). Replaces the EditionsNav bespoke transition-reveal; **resolves Gap 4 (Q18)** — `sectionTitle` reveal is now just `animationStyle: 'enter.inView'` (see Q18).
- **`--i` stagger** baked into the entrance styles via `animationDelay: calc(var(--i,0) * {durations.stagger})`; consumers only set `--i`. FeaturedEvents/editions stop hand-rolling the delay. (`durations.stagger` is the one shared token here — Q6.)
- **Reduced-motion guard on every style**, incl. continuous loops (spin/shimmer pause; fixes the `loading.recipe.ts` shimmer that lacked one).
- **Inline literals consolidated**: `2s`/`32s`/tape delays now live once inside their animationStyle.

**Sharp edges to verify at build:**
- `animationDelay: calc(var(--i,0) * {durations.stagger})` baked into `enter` default means non-staggered consumers get `--i: 0` → `0s` delay (correct). Confirm Panda token interpolation inside `calc()` in an animationStyle value.
- `enter.inView` no-JS / observer-fails case: the title renders real text but sits paused at the `from` frame (`opacity:0`) until `[data-revealed]`. The shared observer must **default to revealed** when `IntersectionObserver` is unavailable (as `EditionsNavBand` already does). Reduced-motion → `animation:none` → natural visible state, safe.

---

## Component layer

### ✅ Q8 — Interactive taxonomy: 4 variants, `ghost` eliminated

Button variants are **`primary` · `secondary` · `link` · `icon`**.
- Rename current `text` → `link`. Delete `ghost`; it was an under-defined "quiet button" catch-all whose 5 uses scatter across three real roles:
  | site | was | becomes |
  |---|---|---|
  | `CalendarShare` share | ghost | secondary |
  | `CookieBanner` reject | ghost sm | secondary |
  | `EventModal` close / action | ghost sm | icon / secondary |
  | `error.tsx` go-home (`asChild`) | ghost | link |
- **Single `secondary` look — no emphasis sub-dimension** (Option A). "Quieter than secondary" = a `link`, not a secondary sub-variant. Chips stay on the existing facet/checkbox chip recipe; icon-ish group members are `icon`.
- The 1 leftover `primary` becomes a real primary (see CTA mapping, pending).
- Ad-hoc raw `<button>`s to migrate onto the primitive: **CalendarFilters, Calendar, Navigation, MediaKitStrip**.

### ✅ Q9 — Shared interaction treatments (corrected: secondary is SUBTLE)

Effects are extracted **once** and spread into both the Button recipe and the Nav recipe — no copy-paste. Key correction: **the current bold pink fill-on-hover is wrong; the bold pink `fillHover` is eliminated.**

- **Shared objects** (single source of truth for "what a hover means"):
  - `subtleHover` — the new **secondary + nav** treatment (subtle; defined in Q10).
  - `colorShift` — `_hover: { color: 'action' }` for **link + icon**.
- **link** → `colorShift` **+ underline on hover** (links should read as links; today they're color-only).
- **icon** → `colorShift` + its existing small transform.
- **nav** → mirrors the *subtle* secondary treatment, not the old bold fill.
- The old `bg→action, color:white` fill is no longer used by secondary/nav. (Nav current-page active state keeps its `highlight`/black indicator — that's a state, not a hover.)
- **⚠️ Intended visual change (made explicit second-pass):** nav links **rest at `surfaceLight` (white) today**; to genuinely share `subtleHover` (gray→white) they must **rest at `muted` (gray) and brighten to `heading` (white) on hover** — a deliberate dimming of the resting nav. The border already matches (rests `hairline` → hover `heading`). This is an accepted change, not a silent side effect. (The resting-white alternative would force `subtleHover` to be border-only — rejected.)

### ✅ Q10 — primary/secondary effects (reassigned)

- **primary** = the **current secondary look**: resting pink *outline* (transparent bg, `action` border, `action` text) → hover **fills** (`bg: action, color: white`). The bold fill isn't deleted — it's *repurposed* as primary. One per section (hero CTA, partner CTA, visit directions, banners).
  - Open: should primary *rest* solid-filled (more prominent for a hero CTA) rather than outline? Recorded as a minor option; default = take the outline→fill as-is.
- **secondary** = muted monochrome: resting `muted`/gray text + `hairline` (gray) border → hover text **and** border become `heading` (white on dark, flips on light). **No `action` color, no fill, no motion.** GPU-safe (color + border-color).
- **nav** mirrors secondary's gray→white shift.
- The reusable `subtleHover` from Q9 is now this gray→white treatment (secondary + nav); the pink fill lives only in `primary`.

### ✅ Q11 — Button/link text effect: CUT (no GSAP)

**Reversed (second-pass).** The GSAP `ScrambleText` flourish is dropped entirely. Reasons:
- It forces a client boundary onto every `primary`/`link` — including ones in pure **server** trees (footer link, `error.tsx` go-home) — to chase a hover flourish. Not worth complicating site architecture.
- Scramble mutates `textContent` frame-by-frame, so the "accessible name unchanged" contract needs a two-layer `sr-only` + `aria-hidden` DOM. Real cost, cosmetic payoff.
- Buttons/links already get their full interaction language from the **Q9/Q10 CSS hover treatments** (primary fill, link underline, icon/link color-shift) — GPU-safe, zero JS, server-safe.

**Decision: no `<ScrambleText>`, no `@gsap/react`, no plugin registration.** GSAP stays confined to its single existing use (PartnerBadge rotating ring), untouched and out of scope. Interactive feedback is CSS-only.

### ✅ Q12 — Button border tokens, sizing, CTA reassignment

**Border tokens** (resolves the deferred Q3 item):
- **primary** → new composite **`borders.primary` = `2px solid {action}`** (2px baked in; nothing inline). Resting outline → hover fills `bg: action, color: white`.
- **secondary** → **reuses `borders.hairline`** (1px) + `_hover: { borderColor: 'heading' }` (gray→white).
- **link / icon** → no border.
- Weight hierarchy: primary 2px, secondary 1px (heavier = louder).

**Sizing:** keep **sm / md / lg** (all responsive). `lg` is NOT dead — it's the home hero CTA size and the intended primary-CTA size. (Earlier "lg dead" was a grep miss: CTAs use `button({ size: 'lg' })` object syntax.)

**primary resting state:** stays **outline → fill on hover** (ported old-secondary style, per decision). Not solid-resting.

**CTA reassignment (secondary → primary, large):**
- Home hero CTA (responsive md→lg) → **primary**, lg.
- Become-a-partner CTA → **primary**, lg.

**Ad-hoc migration priority:**
- *Real* ad-hoc = raw `<button>` no recipe → **Calendar, CalendarFilters, Navigation, MediaKitStrip** (migrate to primitive/recipe).
- `button({…})`-on-`<a>` (hero, partner, footer) already use the recipe; standardize to `<Button asChild>` (lower priority, cosmetic).

### ✅ Q13–14 — Badge

- **`elevated`: removed** — appears only in comments + the recipe def; **no consumer ever sets it** (not "always true" — never applied). The rotate + shadow go.
- **One size — the existing `md`; the `size` variant is deleted.** Consumers split 5 `sm` / 5 `md`; **port every `sm` occurrence to `md`** and bake `md`'s values into `base`. The five `sm` sites grow to `md`: homepage edition pill (`page.tsx:167`), EventModal chip, Calendar type-chip, VenuesView chip, FeaturedEvents tag. (Decided second-pass: no density sub-size — uniform `md` everywhere, including dense Calendar contexts. The `md` `fontSize` is already responsive, `10px`→`13px`.) Drop the `size` prop from all call sites.
- **tones: `highlight` (default) + `outline`; `dark` removed.**
  - `highlight` = solid chartreuse fill + black text (ground-independent).
  - **`outline` (Q14 final model)** = **fixed-`black` bg backing + chartreuse hairline (`borders.highlight`) + chartreuse text**, *always* — no ground-flip. The dark backing guarantees legibility on every ground (dark section ≈ transparent; over imagery = legible base; white IsdayBadge card = crisp dark chip, replacing old `dark`). `bg` is an overridable default (consumer `css({bg})` wins by cascade). Fixes "outline renders no border" — was pointing at the now-removed `highlightFaint` (one of its two consumers; see Q5).
- IsdayBadge (lone `dark` consumer) → `outline`.

### ✅ Q15 — Eyebrow: `rule`-only

From `tone × size × rule` (8 combos) → **just `rule`** (2 states).
- One size = the carousel `md` (already responsive `fontSize: xs`); baked into base. FeaturedEvents' `sm` grows to `md`.
- `tone: highlight` removed → FeaturedEvents becomes `muted`; since `muted` is the only tone left, the `tone` variant is deleted and `color: muted` baked into base.
- `rule` (the `_before` hairline) stays.
- Cleanup: Carousel + FeaturedEvents drop `tone`/`size` props.

### ✅ Q16 — Extract one `EditionCard`; editions-nav is its imageless/small variant

Today the edition card exists as **two copy-pasted compositions** — the archive page assembles it inline, EditionsNav reassembles a smaller imageless version in its own `editionsNav` sva — both wrapping the same `Card` primitive.

- Extract **one `EditionCard`** owning chrome + content, variants **`media` (image | none) × `size` (lg | md | sm)**.
  - Archive → `<EditionCard media="image" size={isFeature ? 'lg' : 'md'}>` (deletes inline composition + most card styles in `editions/page.recipe.ts`).
  - EditionsNav → `<EditionCard media="none" size="sm">` (deletes duplicated chrome/content from `editionsNav` sva).
- **Boundary:** `status` (live | current | upcoming → chartreuse hairline + soon/viewing plates) lives **in EditionCard** (it's about the card). The full-bleed black band, the Carousel rail, and the entrance stagger stay **nav-local**. `editionsNav` sva shrinks to `band` + rail/stagger.

### ✅ Q17 — One normalized `LinkList`; all three lists share cells (not just chrome)

Aggressive normalization: **differing cell layouts per list are themselves drift.** Every list item is the same shape — **`year · title (link) · tags · arrow`** — all styled like the canonical homepage editions list.

- Extract **one `LinkList` / `LinkListItem`** (fixed slots: `year`, `title`+href, `tags[]`, arrow) with the editions-row chrome: `borderTop: 'hairline'`, hover `paddingLeft` nudge, text-reset. Consumed by **homepage editions, press appearances, press releases**.
- **Press appearances:** drop the vimeo/youtube/soundcloud host-icon logic **entirely** (`iconForUrl`, `RiVimeoLine`, etc. removed). The medium (video/audio) becomes a normal **`outline` Badge** (Q14). Cells: year · title(+excerpt?) · tags (tag + medium badge) · arrow.
- **Press releases:** **show the `year`, not `pages`/`language`/`size`.** Drop the bespoke meta. Cells: year · title(link to pdf) · tags · arrow. Deletes `01` index + meta clutter.
- Deletes the bespoke `appRow`/`releaseRow`/`appType`/`releaseMeta` styles.
- ✅ Caveat resolved (schema-verified): **no schema add needed.** `pressRelease` has `publishedAt` (date) + a `publishedAtDesc` order — derive the year from `publishedAt`. `pressAppearance` has explicit `year`, plus `excerpt`, a single `tag`, and `medium`.
- **`excerpt` decision:** the field exists on appearances (only). Give `LinkListItem` an **optional `excerpt`/subtitle slot** (rendered under the title), used by appearances, omitted by editions + releases. This is content, not layout drift — one component, optional slot. Appearance tags cell = `[tag, medium-badge]`.

**"posters four double badge":** unresolved design reference (not found in code) — superseded by the normalization above (tags become `outline` Badges). Flag if a specific double-badge treatment is still wanted.

---

### ✅ Q18 — Headings effect: reuse the existing `enter()` reveal (no GSAP/SplitText)

**Reversed (second-pass).** SplitText is redundant — the reveal already ships in CSS:
- **`enter()` cva + `enter` keyframe** (`src/components/enter.ts`) is "the one entrance-reveal contract": CSS-only, `prefers-reduced-motion` → `animation: none`, reduced to a `className` so it works on **server** components with no client island.
- **pageTitle already reveals via `enter()`** — `PageHero` `<h1>` (PageHero.tsx:27) and the home hero `<h1>`s (page.tsx:93/122). Nothing to add there.

**Decision (Gap 4 → Option A, made cheap by Q20):** headings reveal via the `enter` animationStyle (Q20), not GSAP. The in-view mechanism is now a first-class style — `enter.inView` — so this is no longer a bespoke contract.
- **pageTitle:** already reveals on paint — swap `enter()` → `css({ animationStyle: 'enter' })`, leave above-the-fold behavior as-is.
- **sectionTitle:** sits mostly below the fold, so first-paint firing is anticlimactic. Use **`animationStyle: 'enter.inView'`** (paused until an ancestor flips `[data-revealed]`). Generalize the existing `EditionsNavBand.tsx:27` IntersectionObserver into a **single shared reveal observer** mounted once in the site layout; it flips `data-revealed` on any `[data-reveal]` target and **defaults to revealed when `IntersectionObserver` is unavailable**.
- `SectionHeading` stays a **server** component — it emits `data-reveal` + `animationStyle: 'enter.inView'`; the lone client island is the one shared observer, not per-heading.
- **Scope:** `pageTitle` + `sectionTitle` (display type) only; not `cardTitle`/body.
- **Cost of no SplitText:** block-level reveal (the whole heading rises as one), **no per-line stagger** — per-line is the only thing that needed JS text-splitting, not worth a GSAP dep + client fan-out. a11y/SSR is free: real text always rendered; `enter.inView` is reduced-motion-safe.
- **Future pure-CSS upgrade (noted, not scoped):** CSS `animation-timeline: view()` could replace even the observer once Safari ships it; gate behind `@supports`, default to visible.

---

### ✅ Q19 — Scope locked

**In scope:** the full token layer (Q1–7); the **animation layer → `animationStyles`** (Q20: delete the `enter()` cva, unify reveal + continuous loops, bake reduced-motion guards, consolidate inline speeds); primitives Button / Badge / Eyebrow / EditionCard / LinkList (Q8–17); the **`sectionTitle` in-view reveal** via `enter.inView` + one shared reveal observer (Q18) — **no GSAP, no new client islands beyond that single observer**; the **global token-normalization sweep** across all recipes (raw grays→semantic roles, borders→`hairline`/composites, z-index→ladder, `0ms`→`transition:none`, stagger token) — Calendar included at the token level.

**Cut (was in scope, removed second-pass):** both GSAP text effects — the `ScrambleText` button/link flourish (Q11) and `SplitText` heading line-reveal (Q18). No `@gsap/react`; GSAP stays at its single existing PartnerBadge use.

**Out of scope (follow-up tickets):**
- `Calendar.recipe.ts` **structural decomposition** (the 561-line slot recipe) — its *token* normalization is in scope; breaking it up is a separate Calendar ticket.
- The **8 signature inline overlays** (Hero/EditionTheme/FeaturedEvents shadows/gradients) — left as deliberate one-offs; revisit only if they prove to be drift.
- Any net-new components beyond those listed.

---

## Implementation sequencing (atomic per-token slices)

**Principle (decided second-pass):** the unit of work is a **vertical slice** — a token change **plus every consumer it touches, in the same commit** — never "define/rename all tokens now, sweep consumers later." A horizontal split would leave the tree non-compiling between steps (e.g. deleting `canvas` breaks `Section` until a later step), which can't be reviewed or landed. Each slice ends green: `pnpm typecheck` + `pnpm panda codegen` clean.

- **Renames** (`canvas`→`surface`, `borderDark`→`hairline`, `scrim`→`surface.scrim`): rename token **and** sweep all its call sites in one commit.
- **Deletions** (`highlightFaint`, `onMedia`): migrate consumers to the replacement first, confirm zero refs, delete the token — all in one commit.
- No deprecated aliases are kept (rejected the additive-alias path: it leaves duplicate tokens and lets new code adopt the dead names).

Ordering still respects dependencies — foundational slices first, then primitives, then compositions, then pure consumer migrations:

1. **Core/semantic re-split** (Q1) — pure relocation, no behavior change; the type + numeric spacing scales move into `tokens`. Green on its own.
2. **Ground roles via CSS vars** (Q2, Q4) — introduce the `--ground-*` vars + flipping `surface`/`heading`/`body`/`hairline`; in the **same** slice convert `Section`/`Card` ground variants to set the vars and migrate every `*Light` / `canvas` / `surfaceLight` / `borderDark` call site. (This is the big one — it's one slice because the tokens and their consumers are inseparable.) Verify self-styling + nested-ground nearest-wins.
3. **Composite borders** (Q3) — `borders.hairline` (var-colored) + `borders.highlight`; sweep side-specific dividers + raw `gray.700/800` borders. `borders.primary` lands with the Button slice.
4. **Misc token slices** — z-index ladder + sweep `9998/9999/1001/1100` (Q6); radii cleanup (Q6); `durations.stagger` + `0ms`→`transition:none` (Q6); delete `highlightFaint`/`onMedia` per the deletion rule above (Q5).
5. **Primitives** — Button (4 variants, `borders.primary`, sizes, CTA remap) (Q8–12); Badge (Q13–14); Eyebrow (Q15); shared `subtleHover`/`colorShift` extraction into Button + Nav (Q9). Each primitive + its consumers = one slice.
4b. **Animation layer → `animationStyles`** (Q20) — add the `animationStyles` block (`enter.*`, `spin`, `shimmer`, `gradientBorder`, `tape`); delete the `enter()` cva and sweep its ~10 call sites; migrate the inline `2s`/`32s`/tape/shimmer declarations; bake reduced-motion guards. Folds in the `durations.stagger` token. *(Slot after the misc token slices, before primitives that compose entrances.)*
6. **sectionTitle reveal** — generalize the `EditionsNavBand` IntersectionObserver into one shared reveal observer (mounted in the site layout, defaults to revealed without `IntersectionObserver`); `SectionHeading` emits `data-reveal` + `animationStyle: 'enter.inView'`; fold the EditionsNav transition-reveal onto `enter.inView` too (Q18, Q20). *(No GSAP — pageTitle already reveals via the `enter` style.)*
7. **Compositions** — `EditionCard` (archive + editions-nav) (Q16); `LinkList` (editions + press appearances + releases) (Q17).
8. **Remaining consumer migrations** — migrate ad-hoc raw `<button>`s (Calendar, CalendarFilters, Navigation, MediaKitStrip); drop press host-icons; any stragglers.
9. **Verify** — `pnpm typecheck`, `pnpm lint`, `pnpm panda codegen`; visual pass on grounds, CTA tiers, badge `outline` over media, the three normalized lists.
