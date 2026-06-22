# Design System Refactor — Decision Log

Live decision log for the brutal DRY/maintainability refactor of the Panda CSS
architecture (`src/design-system/preset.ts` + component recipes). External-consultant
grilling session; **all prior decisions, including ADRs, are treated as arbitrary.**

Status legend: ✅ settled · 🔶 proposed (awaiting confirmation) · ⏳ deferred (downstream dependency)

---

## Governing principle — normalization is intentional, by default

**Aggressive normalization is the point of this refactor, not a side effect.** Collapsing variants, unifying compositions, and **intentionally cutting per-instance content** to make things look and behave the same are *deliberate design decisions* — accepted with eyes open. Wherever two things do similar jobs, they become one shape; the loser's distinctive content/affordances are shed on purpose.

This applies to **content**, not just chrome: dropping a list's bespoke metadata (Q17), making edition cards uniform across surfaces (Q16), collapsing tone/size sub-variants (Q13–15) — all intentional. **Do not re-litigate "is this normalization wanted?" per component** — yes, it is. The only open questions worth raising are *mechanical soundness* (does the build emit correctly, does a token resolve, is there a dependency-ordering hazard) and *genuinely irreversible data/UX loss the author may not have noticed*. Taste-level "but the old one showed more" objections are already answered: normalize.

---

## Token layer

### ✅ Q1 — Core vs semantic split principle

**A value that needs a condition must live in `semanticTokens`.** Panda only allows conditions — breakpoints included — in `semanticTokens`; a stepped/breakpoint value in plain `tokens` crashes codegen (`value.match is not a function`) and fails typecheck (Panda reads `{ base, lg }` as a nested token *group*, not a responsive value). Some stepped steps also can't be flattened to `clamp()` — `fontSizes.base` is non-monotonic (`16→15→16px`). *(Verified at build, Panda 1.11.3.)*

The split rule:

- **Core (`tokens`)** = position-named **static** values, incl. `clamp()` strings: `gray.*`, brand anchors, fontSizes `md`–`5xl`, spacing `xs`/`sm`/`lg`/`xl`.
- **Semantic (`semanticTokens`)** = role/intent names **or any value needing a condition** (responsive-stepped *or* ground-flip). The stepped scale steps — fontSizes `base`/`2xs`/`xs`/`sm`; spacing `md`/`2xl`/`3xl`/`4xl`; role-named `sectionY`/`gridGap`/`gutter`/`nav` — live here because Panda requires it, not because they're roles.

The `fontSizes` clamp-vs-stepped split across both layers is the **required** shape, not drift. Migration moves only the static/clamp type + spacing steps into `tokens`; the stepped ones stay in `semanticTokens` (≈ where they already are).

### ✅ Q2 — Ground roles: the `light` ground variant overrides Panda's token vars (collapse the `*Light` pairs)

The four parallel pairs (`heading/headingLight`, `body/bodyLight`, `borderDark/borderLight`, `canvas/surfaceLight`) exist only because there are two grounds. Collapse each pair to **one** flipping role token: `heading`, `body`, `surface`, and `divider` (the hairline color). 8 roles → 4; all ~24 `*Light` call sites stop hand-picking a ground.

**Mechanism — className-only token-var override.** The role tokens are plain semantic tokens carrying their **dark base values** (`heading: '{colors.white}'`, etc. — no conditions, no fallback wrappers). The `light` ground variant in the `Section`/`Card` recipes redefines Panda's own emitted token vars locally:

```ts
ground: { light: {
  '--colors-surface': '{colors.white}', '--colors-heading': '{colors.black}',
  '--colors-body': '{colors.gray.700}', '--colors-divider': '{colors.gray.200}',
} }
```

Consumers everywhere use `heading`/`body`/`surface`/`borders.hairline` (→ `var(--colors-heading)` …). Inside a light ground the variant's local var redefinition flips them by CSS inheritance — **self-styling** (the var is set on the declaring element, so its own `background: surface` etc. flip too) and **nearest-wins** both come for free. It is **className-only**: drop-in for the existing raw `section({ ground })` call sites, no `data-ground` attribute, and the ground can't desync from a separate attribute.

- Trade-off: it references Panda's generated var names (`--colors-heading`), a stable `--{category}-{token}` convention, from the preset that owns those tokens. Token interpolation inside the custom-property value is verified to emit (`.section--ground_light { --colors-heading: var(--colors-black); … }`, Panda 1.11.3).
- **No nested-opposite handling** — nested opposite grounds (light Section ⊃ dark Card, or the reverse) never occur, so only the dark base + the `light` override exist. There is no `_dark` reset.
- This is an authoring-time ground scope, **not** a user theme switcher.

### ✅ Q3 — Composite `borders.*` tokens; no border color/width tokens at all

All hairlines are `1px`; Button's `2px` is the only other weight. Side-specific hairlines dominate (`borderTopWidth: 1px` ×14, plus others).

- **Only composite border tokens exist.** No standalone border-color tokens, **no `borderWidths` token** — width is baked into each composite value:

```ts
borders: {
  hairline:  { value: { width: '1px', style: 'solid', color: '{colors.divider}' } },   // divider flips via Q2
  highlight: { value: { width: '1px', style: 'solid', color: '{colors.chartreuse}' } },
}
```

- The hairline ground-flip rides one `divider` semantic color token (dark base `{colors.gray.900}`), which the `light` ground variant overrides to `{colors.gray.200}` (Q2). The composite itself is **flat** — no conditional value. *(A conditional composite border is verified to work in Panda 1.11.3, but it's unnecessary here and the flat composite is consistent with the other role tokens.)*
- `hairline` replaces all `borderColor: borderDark` borders **and** the ~22 side-specific dividers (`borderBottom: 'hairline'`, etc. — composites apply to any single edge).
- `highlight` covers the chartreuse accent incl. the **fixed** Badge `outline`.
- Raw `gray.700`/`gray.800` borders (checkbox + 1 other) are drift → normalize to `hairline`.
- **Button border is also a token — nothing inline.** Its border composite (`borders.primary`, `2px solid {action}`) lands with the Button slice (Q12).

### ✅ Q4 — `canvas`+`surfaceLight` → `surface`; selective nesting only

- **(a)** Collapse `canvas` (black) + `surfaceLight` (white) → one flipping `surface` token. They're the same role on two grounds.
- **(b)** Nesting earns its place **only** where a genuine `DEFAULT` + modifier relationship exists — not as a blanket reorg (it would only make call sites longer).
  - Nest: `surface` → children (see Q5), `borders` → `hairline`/`highlight`.
  - Keep flat (distinct siblings): `heading`, `body`, `muted`, `action`.

### ✅ Q5 — surface/scrim/onMedia normalization

- **`highlightFaint`: removed.** Drift. It has **two** consumers (not one): Badge `outline` (`borderColor: highlightFaint`) **and** the EditionsNav `viewing` status plate (`EditionsNav.recipe.ts:84`, the chartreuse current-edition chip). Both switch to the `borders.highlight` composite. (The EditionsNav plate is already being relocated into `EditionCard` by Q16 — its border becomes `borders.highlight` there.)
- **`scrim` → `surface.scrim`.** Genuinely reused (dialog + lightbox backdrops). It's a full-bleed fill, so it joins the `surface` group — but as a **fixed dark overlay that does NOT ground-flip** (modals dim to black even over a light page):
  ```ts
  surface: {
    DEFAULT: { value: '{colors.black}' },        // dark base; flips via the ground variant (Q2)
    scrim:   { value: 'rgb(0 0 0 / 0.95)' },      // fixed — no flip
  }
  ```
- **`onMedia`: deleted.** Single consumer (inactive carousel indicator dash). Active dash is `highlight`, so inactive normalizes to `muted` (gray). The indicators render in the carousel **control bar below the stage** (`Carousel.tsx:210` — `controls` renders *after* the `ItemGroup` in stage mode), on the section's black background, **never over imagery** — so the `muted` (gray-on-black) normalization is unconditionally safe. The old token's name/comment (*"dimmed control foreground over imagery"*) misdescribed the placement.
- The **8 inline translucent overlays** (Hero/EditionTheme/FeaturedEvents signature gradients/shadows) are deferred to the component pass.

### ✅ Q6 — z-index ladder + radii cleanup + motion micro-values

**z-index** — introduce a role-named semantic ladder; kill the `9998/9999`/`1001`/`1100` bidding war. Every cross-component layer gets a named rung:
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
- **The broader animation cleanup (inline `2s`/`32s`/tape delays, the `enter()` cva → animationStyles, the missing reduced-motion guard) is owned by [Q20], not here.** Q6 keeps only the `durations.stagger` token + the Navigation `0ms` fix.

### ✅ Q7 — token scale depth: NO trimming needed

Audited adoption: every `fontWeight` (semibold 41×, others 1–5× but all real), every `duration` (incl. thin `sweep`/`reveal`), and every `lineHeight` is referenced with **zero inline drift**. The scales are *adopted*, not bloated.

**Conclusion: the token "mess" was never bloat.** It was (1) the layer split — and per Q1 the clamp-vs-stepped split is Panda-mandated, so the only relocation is moving static/clamp steps into `tokens`; (2) missing composite/ladder tokens — borders & z-index [Q3, Q6]; and (3) component-level drift (raw grays, inline values), handled in the component pass. Keep all existing scales.

---

## Animation layer

### ✅ Q20 — Adopt Panda `animationStyles` as the one animation home

The animation layer has the same drift the token layer had: inline literals (`gradientBorderShift 2s`, `spin 32s`, tape delays `0.35s`/`0.75s`), an inconsistent reduced-motion guard (`skeleton.ts` has one; `loading.recipe.ts:46` shimmer doesn't), and dead `enter()` variants (`soft`, `rise:sm` — zero call sites). Fix it the same way: one named home.

**Move all named animations into `theme.extend.animationStyles`.** Keyframes (`enter`, `tapeIn`, `spin`, `gradientBorderShift`, `shimmer`) stay as-is — `animationStyles` is the *consumption* layer bundling `animationName` + duration + easing + fill-mode + **a baked-in `_motionReduce` guard**, consumed via `css({ animationStyle: 'enter' })`.

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
  },
  // Continuous loops — one-off speeds live here as literals, single-sourced (no single-use tokens).
  spin:           { value: { animationName: 'spin', animationDuration: '32s', animationTimingFunction: 'linear', animationIterationCount: 'infinite', _motionReduce: { animationPlayState: 'paused' } } },
  shimmer:        { value: { animationName: 'shimmer', animationDuration: 'sweep', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite', _motionReduce: { animation: 'none' } } },
  gradientBorder: { value: { animationName: 'gradientBorderShift', animationDuration: '2s', animationTimingFunction: 'linear', animationIterationCount: 'infinite', _motionReduce: { animation: 'none' } } },
  // Signature diagonal tape entrance — per-instance delay via --tape-delay.
  tape: { value: { animationName: 'tapeIn', animationDuration: 'entrance', animationTimingFunction: 'expo', animationFillMode: 'forwards', animationDelay: 'var(--tape-delay, 0s)', _motionReduce: { animation: 'none' } } },
}
```

**Naming:** type/family-based with nested `DEFAULT` + variants — `enter` (+ `.fade`/`.zoom`/`.snappy`), `spin`, `shimmer`, `gradientBorder`, `tape`. The orthogonal `enter()` axes become a handful of enumerated combos; only ~4 are used.

**What this folds in / fixes:**
- **`enter()` cva deleted** (`src/components/enter.ts` removed). ~12 call sites swap `cx(x, enter())` → `cx(x, css({ animationStyle: 'enter' }))`, `enter({ rise:'none', zoom:true })` → `'enter.zoom'`, `enter({ rise:'none' })` → `'enter.fade'`, `enter({ speed:'normal' })` → `'enter.snappy'`. Dead `soft`/`rise:sm` dropped. `pageTitle` swaps `enter()` → `css({ animationStyle: 'enter' })`.
- **`--i` stagger** baked into the entrance styles via `animationDelay: calc(var(--i,0) * {durations.stagger})`; consumers only set `--i`. FeaturedEvents/editions stop hand-rolling the delay. (`durations.stagger` is the one shared token here — Q6.)
- **Reduced-motion guard on every style**, incl. continuous loops (spin/shimmer pause; fixes the `loading.recipe.ts` shimmer that lacked one).
- **Inline literals consolidated**: `2s`/`32s`/tape delays now live once inside their animationStyle.

**No in-view reveal.** There is no `enter.inView` style, no shared reveal observer, and no section-title reveal (see Q18). `EditionsNavBand` keeps its own self-contained observer + transition-reveal + nav-local stagger, untouched — leaving one first-paint reveal (`enter`) and one in-view reveal (EditionsNav), each used once.

**Sharp edge to verify at build:** `animationDelay: calc(var(--i,0) * {durations.stagger})` baked into `enter` default means non-staggered consumers get `--i: 0` → `0s` delay (correct). Confirm Panda token interpolation inside `calc()` in an animationStyle value.

---

## Component layer

### ✅ Q8 — Interactive taxonomy: 4 variants, `ghost` eliminated

Button variants are **`primary` · `secondary` · `link` · `icon`**.
- Rename current `text` → `link`. Delete `ghost`; it was an under-defined "quiet button" catch-all whose 5 uses map to real roles:
  | site | was | becomes |
  |---|---|---|
  | `CalendarShare` share | ghost | secondary |
  | `CookieBanner` reject | ghost sm | secondary |
  | `EventModal` close (`EventModal.tsx:59`) | ghost sm | secondary |
  | `EventModal` share (`:64`) | ghost sm | secondary |
  | `error.tsx` go-home (`asChild`) | ghost | link |

  - Both EventModal controls are **labeled** buttons — close is `← Back to programme` (icon **+ text**, relabeled from ✕ in ZSB-50) — so they map to `secondary` (the back one may be `link`); neither can be `icon` (an `icon` variant is icon-only, 44×44, no label).
  - `CalendarShare` layers its own icon-nudge hover transform via `cx`. After `ghost → secondary` (which is motion-free, Q10) that nudge stays as a **call-site** addition, not part of the `secondary` variant.
- **Single `secondary` look — no emphasis sub-dimension** (Option A). "Quieter than secondary" = a `link`, not a secondary sub-variant. Chips stay on the existing facet/checkbox chip recipe; icon-ish group members are `icon`.
- The 1 leftover `primary` (CookieBanner accept) stays primary; the CTAs become primary too (Q12).
- Ad-hoc raw `<button>`s to migrate onto the primitive: **Calendar, CalendarFilters, Navigation, MediaKitStrip** (all confirmed present).

### ✅ Q9 — Shared interaction treatments (secondary is subtle)

Effects are extracted **once** and spread into both the Button recipe and the Nav recipe — no copy-paste. The current bold pink fill-on-hover is eliminated as a secondary/nav treatment.

- **Shared objects** (single source of truth for "what a hover means"):
  - `subtleHover` — the new **secondary + nav** treatment (subtle; defined in Q10).
  - `colorShift` — `_hover: { color: 'action' }` for **link + icon**.
- **link** → `colorShift` **+ underline on hover** (links should read as links; today they're color-only).
- **icon** → `colorShift` + its existing small transform.
- **nav** → mirrors the *subtle* secondary treatment, not the old bold fill.
- The old `bg→action, color:white` fill is no longer used by secondary/nav. (Nav current-page active state keeps its `highlight`/black indicator — that's a state, not a hover.)
- **⚠️ Intended visual change:** nav links rest at `surfaceLight` (white) today; to share `subtleHover` (gray→white) they rest at `muted` (gray) and brighten to `heading` (white) on hover — a deliberate dimming of the resting nav. The border already matches (rests `hairline` → hover `heading`). Accepted, not a side effect. (The fixed nav isn't a descendant of any light section, so these flipping roles keep their dark-ground values regardless of what scrolls under it.)

### ✅ Q10 — primary/secondary effects (reassigned)

- **primary** = the **current secondary look**: resting pink *outline* (transparent bg, `action` border, `action` text) → hover **fills** (`bg: action, color: white`). The bold fill isn't deleted — it's *repurposed* as primary. One per section (hero CTA, partner CTA, visit directions, banners).
  - Open: should primary *rest* solid-filled (more prominent for a hero CTA) rather than outline? Recorded as a minor option; default = take the outline→fill as-is.
- **secondary** = muted monochrome: resting `muted`/gray text + `hairline` (gray) border → hover text **and** border become `heading` (white on dark, flips on light). **No `action` color, no fill, no motion.** GPU-safe (color + border-color).
- **nav** mirrors secondary's gray→white shift.
- The reusable `subtleHover` from Q9 is now this gray→white treatment (secondary + nav); the pink fill lives only in `primary`.

### ✅ Q11 — Button/link text effect: CUT (no GSAP)

The GSAP `ScrambleText` flourish is dropped entirely. Reasons:
- It forces a client boundary onto every `primary`/`link` — including ones in pure **server** trees (footer link, `error.tsx` go-home) — to chase a hover flourish. Not worth complicating site architecture.
- Scramble mutates `textContent` frame-by-frame, so the "accessible name unchanged" contract needs a two-layer `sr-only` + `aria-hidden` DOM. Real cost, cosmetic payoff.
- Buttons/links already get their full interaction language from the **Q9/Q10 CSS hover treatments** (primary fill, link underline, icon/link color-shift) — GPU-safe, zero JS, server-safe.

**Decision: no `<ScrambleText>`, no `@gsap/react`, no plugin registration.** GSAP stays confined to its single existing use (PartnerBadge rotating ring), untouched and out of scope. Interactive feedback is CSS-only.

### ✅ Q12 — Button border tokens, sizing, CTA reassignment

**Border tokens** (the Button border composite Q3 leaves to this slice):
- **primary** → new composite **`borders.primary` = `2px solid {action}`** (2px baked in; nothing inline). Resting outline → hover fills `bg: action, color: white`.
- **secondary** → **reuses `borders.hairline`** (1px) + `_hover: { borderColor: 'heading' }` (gray→white).
- **link / icon** → no border.
- Weight hierarchy: primary 2px, secondary 1px (heavier = louder).

**Sizing:** keep **sm / md / lg** (all responsive). `lg` is live — it's the home hero CTA size and the intended primary-CTA size (CTAs use `button({ size: 'lg' })` object syntax).

**primary resting state:** outline → fill on hover. Not solid-resting.

**CTA reassignment (secondary → primary, large):**
- Home hero CTA (responsive md→lg) → **primary**, lg.
- Become-a-partner CTA → **primary**, lg.

**Ad-hoc migration priority:**
- *Real* ad-hoc = raw `<button>` no recipe → **Calendar, CalendarFilters, Navigation, MediaKitStrip** (migrate to primitive/recipe).
- `button({…})`-on-`<a>` (hero, partner, footer) already use the recipe; standardize to `<Button asChild>` (lower priority, cosmetic).

### ✅ Q13–14 — Badge

- **`elevated`: removed** — appears only in comments + the recipe def; **no consumer ever sets it** (not "always true" — never applied). The rotate + shadow go.
- **One size — the existing `md`; the `size` variant is deleted.** Consumers split 5 `sm` / 5 `md`; **port every `sm` occurrence to `md`** and bake `md`'s values into `base`. The five `sm` sites grow to `md`: homepage edition pill (`page.tsx:167`), EventModal chip, Calendar type-chip, VenuesView chip, FeaturedEvents tag. No density sub-size — uniform `md` everywhere, including dense Calendar contexts (the `md` `fontSize` is already responsive, `10px`→`13px`). Drop the `size` prop from all call sites.
- **tones: `highlight` (default) + `outline`; `dark` removed.**
  - `highlight` = solid chartreuse fill + black text (ground-independent).
  - **`outline`** = **fixed-`black` bg backing + chartreuse hairline (`borders.highlight`) + chartreuse text**, *always* — no ground-flip. The dark backing guarantees legibility on every ground (dark section ≈ transparent; over imagery = legible base; white IsdayBadge card = crisp dark chip, replacing old `dark`). `bg` is an overridable default (consumer `css({bg})` wins by cascade). Fixes "outline renders no border" — it pointed at the now-removed `highlightFaint` (see Q5).
- IsdayBadge (lone `dark` consumer) → `outline`.

### ✅ Q15 — Eyebrow: `rule`-only

From `tone × size × rule` (8 combos) → **just `rule`** (2 states).
- One size = the carousel `md` (already responsive `fontSize: xs`); baked into base. FeaturedEvents' `sm` grows to `md`.
- `tone: highlight` removed → FeaturedEvents becomes `muted`; since `muted` is the only tone left, the `tone` variant is deleted and `color: muted` baked into base.
- `rule` (the `_before` hairline) stays.
- Cleanup: Carousel + FeaturedEvents drop `tone`/`size` props.

### ✅ Q16 — Extract one `EditionCard`; editions-nav is its imageless/small variant

**This normalizes edition-card content across surfaces, not just chrome** (governing principle). The archive card and the nav card carry different content today — archive: `<EditionTheme>` tape title, year-as-Badge, artists/`dateTape`/"Explore" cta; nav: plain text year+theme, Soon/Viewing plate. One `EditionCard` makes them the same card at different sizes: the nav becomes an imageless small `EditionCard` with the same title + status model, and archive-only extras that don't fit the small/imageless form are shed by the `size`/`media` variants. The shared `Card` primitive stays the chrome; `EditionCard` adds the unified edition composition (year · theme · status) on top.

EditionsNav's reveal/observer (IntersectionObserver + transition-reveal + nav-local stagger) is untouched (Q20); only the *card composition* inside the rail migrates here.

Today the edition card exists as **two copy-pasted compositions** — the archive page assembles it inline, EditionsNav reassembles a smaller imageless version in its own `editionsNav` sva — both wrapping the same `Card` primitive.

- Extract **one `EditionCard`** owning chrome + content, variants **`media` (image | none) × `size` (lg | md | sm)**.
  - Archive → `<EditionCard media="image" size={isFeature ? 'lg' : 'md'}>` (deletes inline composition + most card styles in `editions/page.recipe.ts`).
  - EditionsNav → `<EditionCard media="none" size="sm">` (deletes duplicated chrome/content from `editionsNav` sva).
- **Boundary:** `status` (live | current | upcoming → chartreuse hairline + soon/viewing plates) lives **in EditionCard** (it's about the card). The full-bleed black band, the Carousel rail, and the entrance stagger stay **nav-local**. `editionsNav` sva shrinks to `band` + rail/stagger.

### ✅ Q17 — One normalized `LinkList`; all three lists share cells (not just chrome)

**Deliberate editorial + visual normalization** (governing principle): all three lists look identical, and the per-list extra content is intentionally cut, not preserved.

- **Deliberately dropped:** press-release `language` / `pages` / `size` meta and the `01` index; press-appearance host-icons (vimeo/youtube/soundcloud) and the medium glyph. The "Download PDF" / external-vs-internal affordance distinction collapses into the shared arrow.
- The single fixed-slot `LinkListItem` is the target even though it carries a few optional dimensions (int/ext-link, optional excerpt, optional tags, editions upcoming-disabled state). Uniform shape wins over per-list fidelity by choice.

Every list item is the same shape — **`year · title (link) · tags · arrow`** — styled like the canonical homepage editions list.

- Extract **one `LinkList` / `LinkListItem`** (fixed slots: `year`, `title`+href, `tags[]`, arrow) with the editions-row chrome: `borderTop: 'hairline'`, hover `paddingLeft` nudge, text-reset. Consumed by **homepage editions, press appearances, press releases**.
- **Press appearances:** drop the vimeo/youtube/soundcloud host-icon logic **entirely** (`iconForUrl`, `RiVimeoLine`, etc. removed). The medium (video/audio) becomes a normal **`outline` Badge** (Q14). Cells: year · title(+excerpt?) · tags (tag + medium badge) · arrow.
- **Press releases:** **show the `year`, not `pages`/`language`/`size`.** Drop the bespoke meta. Cells: year · title(link to pdf) · tags · arrow. Deletes `01` index + meta clutter.
- Deletes the bespoke `appRow`/`releaseRow`/`appType`/`releaseMeta` styles.
- ✅ Caveat resolved (schema-verified): **no schema add needed.** `pressRelease` has `publishedAt` (date) + a `publishedAtDesc` order — derive the year from `publishedAt`. `pressAppearance` has explicit `year`, plus `excerpt`, a single `tag`, and `medium`.
- **`excerpt` decision:** the field exists on appearances (only). Give `LinkListItem` an **optional `excerpt`/subtitle slot** (rendered under the title), used by appearances, omitted by editions + releases. This is content, not layout drift — one component, optional slot. Appearance tags cell = `[tag, medium-badge]`.

**"posters four double badge":** unresolved design reference (not found in code) — superseded by the normalization above (tags become `outline` Badges). Flag if a specific double-badge treatment is still wanted.

---

### ❌ Q18 — No section-title scroll-reveal (cut)

Section titles stay static — the refactor's mandate is DRY/maintainability, not new choreography, and an in-view reveal would add new motion to 18 currently-static section titles plus the plan's only net-new client island. `SectionHeading` remains a plain server component: no `data-reveal`, no in-view animation, no `enter.inView` style, no shared observer. `pageTitle` keeps its existing first-paint reveal (via `animationStyle: 'enter'`, Q20). `EditionsNavBand` keeps its existing reveal untouched. If section-title scroll-reveal is wanted later, do it with CSS `animation-timeline: view()` (`@supports`-gated, visible fallback) — JS-free, no observer.

---

### ✅ Q19 — Scope locked

**In scope:** the full token layer (Q1–7); the **animation layer → `animationStyles`** (Q20: delete the `enter()` cva, consolidate continuous loops + inline speeds, bake reduced-motion guards); primitives Button / Badge / Eyebrow / EditionCard / LinkList (Q8–17); the **global token-normalization sweep** across all recipes (raw grays→semantic roles, borders→`hairline`/composites, z-index→ladder, `0ms`→`transition:none`, stagger token) — Calendar included at the token level. **No GSAP, no new client islands.**

**Cut:** both GSAP text effects — the `ScrambleText` button/link flourish (Q11) and the `SplitText` heading line-reveal; the section-title in-view reveal + shared observer (Q18). No `@gsap/react`; GSAP stays at its single existing PartnerBadge use.

**Out of scope (follow-up tickets):**
- `Calendar.recipe.ts` **structural decomposition** (the 561-line slot recipe) — its *token* normalization is in scope; breaking it up is a separate Calendar ticket.
- The **8 signature inline overlays** (Hero/EditionTheme/FeaturedEvents shadows/gradients) — left as deliberate one-offs; revisit only if they prove to be drift.
- Any net-new components beyond those listed.

---

## Implementation sequencing (atomic per-token slices)

**Principle:** the unit of work is a **vertical slice** — a token change **plus every consumer it touches, in the same commit** — never "define/rename all tokens now, sweep consumers later." A horizontal split would leave the tree non-compiling between steps (e.g. deleting `canvas` breaks `Section` until a later step), which can't be reviewed or landed. Each slice ends green: `pnpm typecheck` + `pnpm panda codegen` clean.

- **Renames** (`canvas`→`surface`, `borderDark`→`hairline`, `scrim`→`surface.scrim`): rename token **and** sweep all its call sites in one commit.
- **Deletions** (`highlightFaint`, `onMedia`): migrate consumers to the replacement first, confirm zero refs, delete the token — all in one commit.
- No deprecated aliases are kept (rejected the additive-alias path: it leaves duplicate tokens and lets new code adopt the dead names).

Ordering still respects dependencies — foundational slices first, then primitives, then compositions, then pure consumer migrations:

1. **Core/semantic re-split** (Q1) — pure relocation, no behavior change; the *static/clamp* type + spacing steps move into `tokens` (stepped steps stay in `semanticTokens`). Green on its own.
2. **Ground roles via token-var override** (Q2, Q4) — add plain dark-base `surface`/`heading`/`body` semantic tokens; make the `Section`/`Card` `light` ground variant redefine `--colors-surface`/`--colors-heading`/`--colors-body` locally, and migrate every `*Light` / `canvas` / `surfaceLight` text/background call site to the plain role token. **Border colors (`borderDark`/`borderLight`) are NOT touched here — they stay defined and in use until slice 3** (migrating them before `hairline`/`divider` exist couldn't go green). className-only — no `data-ground` attribute, no `--ground-*` aliases, no nested-opposite handling.
3. **Composite borders + divider flip** (Q3) — add the `divider` semantic color (dark base) and **its `--colors-divider` override into the `light` ground variant**; add `borders.hairline` (references `divider`) + `borders.highlight`; migrate `borderDark`/`borderLight` → `divider`/`hairline`, sweep side-specific dividers + raw `gray.700/800` borders, then delete `borderDark`/`borderLight`. `borders.primary` lands with the Button slice.
4. **Misc token slices** — z-index ladder + sweep `9998/9999/1001/1100` (Q6); radii cleanup (Q6); `durations.stagger` + `0ms`→`transition:none` (Q6); delete `highlightFaint`/`onMedia` per the deletion rule above (Q5).
5. **Animation layer → `animationStyles`** (Q20) — add the `animationStyles` block (`enter.*`, `spin`, `shimmer`, `gradientBorder`, `tape`); delete the `enter()` cva and sweep its ~12 call sites; migrate the inline `2s`/`32s`/tape/shimmer declarations; bake reduced-motion guards. Folds in the `durations.stagger` token.
6. **Primitives** — Button (4 variants, `borders.primary`, sizes, CTA remap) (Q8–12); Badge (Q13–14); Eyebrow (Q15); shared `subtleHover`/`colorShift` extraction into Button + Nav (Q9). Each primitive + its consumers = one slice.
7. **Compositions** — `EditionCard` (archive + editions-nav) (Q16); `LinkList` (editions + press appearances + releases) (Q17).
8. **Remaining consumer migrations** — migrate ad-hoc raw `<button>`s (Calendar, CalendarFilters, Navigation, MediaKitStrip); drop press host-icons; any stragglers.
9. **Verify** — `pnpm typecheck`, `pnpm lint`, `pnpm panda codegen`; visual pass on grounds, CTA tiers, badge `outline` over media, the three normalized lists.
