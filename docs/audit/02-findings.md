# PASS 2 — Leak & Drift Findings

Judgment pass over [`01-inventory.md`](./01-inventory.md) +
[`01-usage.json`](./01-usage.json). Every finding cites file:line. Fixes are
proposals only — no source edits. Abstraction *shapes* are sketched here and
fully specified in PASS 3 (`03-abstractions.md`) / PASS 4 (`04-slots.md`).

## Severity counts

| Critical | High | Medium | Low |
|:--:|:--:|:--:|:--:|
| 2 | 9 | 10 | 6 |

## Top 5 (highest-leverage)

1. **F07 — The type scale is defined-but-not-adopted.** 6 of 10 `textStyles` have
   zero `textStyle:` usage; the look is hand-rolled at 7 sites. The single biggest
   integrity breach: "one source of truth for type" is nominal, not real.
2. **F01 — Hand-rolled chip reimplements `Badge` ×4 (+2).** The exact duplication
   the Badge primitive (which collapsed 8 legacy variants) was built to end has
   silently re-accreted in the Calendar/Venues/Events surfaces.
3. **F12 — Pages re-add section padding by hand ×6** despite `layerStyle:'section'`
   existing — the worst case (`partners/page.tsx:97-101`) inlines it in JSX.
4. **F20 — 46 inline motion literals bypass the duration/easing tokens**, and
   several entrance/sweep durations have *no* token to map to (missing-token flag).
5. **F03 — `card` surface reimplemented ×2** (Calendar event-row, IsdayBadge seal)
   — the ZSB "hairline box" signature drifts off its one primitive.

---

## Owner rulings (PASS 2 review — BINDING for PASS 3/4)

These supersede the "Recommended fix" cells below where they conflict.

| # | Ref | Ruling |
|---|-----|--------|
| **R1** | F07 | **Reduce the type scale** to `xs, sm, base, md, lg, xl` (+ maybe `2xl`). Drop `2xs, 3xl, 4xl, 5xl`. The per-breakpoint stepped overrides (base/2xs/xs/sm) and the "weird" `clamp()` values are regularised into a clean modular scale. |
| **R2** | F01 | CalendarFilters: build a real **`Checkbox` component**, NOT a selectable-Badge compound. Plain type chips elsewhere still adopt `<Badge>`. |
| **R3** | F02 | **Drop the trailing arrow entirely** from text links. No consumer arrow-nudge `css()`. |
| **R4** | F03 | **All cards share ONE hover** = the `card` primitive's `interactive` border-warm. Drop bespoke gradient/hover `css()` (Calendar event-row etc.). No per-card hover drift. |
| **R5** | F04 | **BUTTON CONSOLIDATION.** Button variants reduce to **`primary, secondary, ghost, text`** (solid→primary, outline→secondary, keep ghost, link→text). **Fold the `textLink` primitive into button's `text` variant** (retire textLink as a separate recipe). **Fold `MagneticButton` into a `magnetic` behavior modifier** on button (no glow/nudge hovers). Modifiers: `size` (sm/md/lg), `magnetic` (bool), `icon` (leading/trailing/none). → **registered primitives go 6 → 5** (badge, eyebrow, button, iconButton, card). |
| **R6** | F05, F07 | Hero **tapes are badges, not eyebrows** → adopt `<Badge elevated>` (the `elevated` variant already rotates + adds the pinned-paper shadow). The edition **"theme" display style** (Hero `tapeTheme`) is **reused on editions-page cards in an interactive variant** → **extract it as a reusable shared style/component** (`EditionTheme`, with a static + interactive variant). This is the "special edition-card-title treatment" to preserve. |
| **R7** | F15 | Don't add precision media tokens. **Normalize all hairlines to two roles: `borderDark` + `borderLight`** (today's divider/dividerLight). Map the white-alpha-on-media rgba literals → `borderLight`. Iterate visually. |
| **R8** | F16 | **One true black only = `#000`** (OKLCH form). Redefine `black` neutral and **delete the tinted magenta black**; merge `black`/`blackPure` → one token (~44 refs, mechanical). **Remove `lightPink`** (confirmed 0 usage). Gray ramp keeps its warm 345° hue. |
| **R9** | F18 | The `2px`/`0.15em`/`0.1em` letterSpacing spread is **accidental → collapse to ONE value/token**. |
| **R10** | F08 | Per case: ArtistsBanner ctaText → **Badge**; VisitSection directionsLink → **button variant**; EditionsNav year/theme → **DO NOT TOUCH** (structural refactor coming; theme = R6); Footer → **button variant** (text). |
| **R11** | F11, F25-prose | **Adopt existing textStyles** — `statementHeadline` and all prose (privacy/about/partners ctaBody `15px`) map to `lead`/`base`/`body`. No new textStyles. |
| **R12** | F09, F10 | `labelText`/`labelSmall` (both 0-adoption) **collapse to ONE label textStyle**. Delete `heroBody` (≡ `lead`). |
| **R13** | F12, F25 | Section padding is drift. **Promote a `sectionShell`** layerStyle/component bundling ground + section padding, with exactly **two rhythm variants** = `sectionY` (normal) and `sectionYLg` (manifesto/About looser). **No press exception** — the press page's asymmetric 3xl–4xl padding is drift and normalizes to `sectionY`. Replaces the 6 inline sites + the press padding. |

**Resolved boundary:** `iconButton` stays a distinct primitive (icon-only 44px
square — Lightbox/Slideshow/StripControls). Button's `icon` modifier = a
leading/trailing icon *beside text*. ExternalGallery `ctaIcon` (F04) → adopt
`iconButton`, drop the bespoke hairline + nudge.

---

## A. Co-located styles reimplementing a primitive

| ID | Sev | File:lines | Issue | Recommended fix |
|----|-----|-----------|-------|-----------------|
| F01 | **Critical** | Calendar.recipe.ts:584-597, EventModal.recipe.ts:113-125, VenuesView.recipe.ts:187-200, CalendarFilters.recipe.ts:65-114; related FeaturedEvents.recipe.ts:226-241, EditionsNav.recipe.ts:59-88 | Hand-rolled "type chip" (uppercase, `2xs`/`label`, `color:highlight`, `borderColor:highlightFaint`, ~3px/9px pad) duplicated 4× verbatim, +2 near-variants. `Badge` primitive bypassed entirely. | Adopt `<Badge tone="outline" size="sm">`. Remaining override = none for the 4 verbatim copies. CalendarFilters needs a check-indicator → add a `selectable` Badge compound or wrap. EditionsNav soon/viewing = `Badge tone="outline"` vs `tone="highlight"`. |
| F02 | High | Calendar.recipe.ts:658-677, ComingSoon.recipe.ts:84-111, EventModal.recipe.ts:160-186, VenuesView.recipe.ts:137-154; related FeaturedEvents.recipe.ts:63-83 | Hand-rolled "uppercase arrow-link" (color white→action, `borderBottom` divider, svg nudge) ×4 (+1). `textLink` primitive (and its `border` underline variant) never adopted. | Adopt `textLink({underline:'border'})`. Remaining override = the trailing-arrow svg translate, a 2-line consumer `css()` on `& svg`. |
| F03 | High | Calendar.recipe.ts:199-242 (event-row), IsdayBadge.recipe.ts:24-31 (seal) | `card` hairline-box + hover ring reimplemented. Calendar adds a gradient hover-ring; IsdayBadge hand-rolls `border + boxShadow:'card'` on a gradient ground. | Calendar event-row → `card({ground:'onDark', interactive:true})`, gradient ring as a utility `css()`. IsdayBadge → `card({ground:'onLight'})` base + gradient as a `css()` override on the root slot. |
| F04 | High | ExternalGallery.recipe.ts:120-136 (`ctaIcon`) | Hairline icon-square with hover border-warm + nudge — an `iconButton`-shaped control not using the primitive (contrast: Lightbox adopts it correctly). | Adopt `iconButton({tone:'default'})`; the hairline border is the only delta → a 1-line `css()`. |
| F05 | High | Hero.recipe.ts:110-142 + 143-174 (tapeDate/tapeEdition), FeaturedEvents.recipe.ts:53-61, StripControls.recipe.ts:24-30 | Hand-rolled eyebrow/kicker (body `2xs` uppercase `label` semibold) ×3. `eyebrow` primitive adopted in only 2 consumers site-wide. | Adopt `eyebrow({tone, size})`. Hero tape adds rotate + tape-bg as a consumer `css()`; the type/case/tracking come from the primitive. |
| F06 | Medium | error.recipe.ts (btn/btnPrimary, ~105-111) | `btn`/`btnPrimary` reimplement the `button` primitive. Documented as intentional boundary-route chrome (error page must not import app deps). | Verify the constraint still holds; if `button` is dependency-safe, fold into `button({variant})`. Else keep + keep the doc-comment. Low urgency. |

## B. Raw values → semantic token (or missing-token flag)

| ID | Sev | File:lines | Issue | Recommended fix |
|----|-----|-----------|-------|-----------------|
| F14 | High | Calendar.recipe.ts:613, EventModal.recipe.ts:55, CookieBanner.recipe.ts:26, MagneticButton.tsx:27, Lightbox.recipe.ts:29 + Lightbox.tsx:184 | rgba box-shadow / backdrop literals. `shadows.{card,badge}` exist but no modal-shadow or scrim token; 5 ad-hoc opacities. | Add `shadows.modal` (the EventModal/Calendar lift) and a `colors.scrim` semantic (the Lightbox/backdrop `rgba(0 0 0 / .9–.95)`). Map all 5. |
| F15 | Medium | Hero.recipe.ts:57/64/84/123/155-156/200, HeroSlideshow.recipe.ts:65/74/105/123, ExternalGallery.recipe.ts:165 | Raw `rgba(255 255 255 / x)` hairlines/overlays over media. `onMedia` exists but is a *foreground* role only — no alpha-hairline-on-media token. | Add `colors.hairlineOnMedia` (+ maybe `overlayOnMedia`) semantic tokens; collapse the ~11 white-alpha literals onto them. Missing-token flag. |
| F16 | Medium | Hero.recipe.ts:117/150/183/191/192, Manifesto.recipe.ts:37, ArtistsTable.recipe.ts:40/119/120, Footer.recipe.ts:128, FeaturedEvents.recipe.ts:124/145 | Raw color *anchors* used where a role exists: `black`/`white`/`blackPure` as heading/canvas grounds; `gray.500` as muted; `black` as heading-on-light. | Map: `black`→`canvas`/`headingLight`, `white`→`heading`, `blackPure`→`canvas`/`sectionDark` bg, `gray.500`→`muted`. Genuine role leaks, not exceptions. |
| F18 | Low | VisitSection: tsx:27 (`2px`), recipe:88 (`0.15em`), 116 (`0.1em`) | Raw `letterSpacing` literals instead of `label`(1.2px)/`wide`(4px)/`subtle`(0.6px) tokens. | Map to nearest letterSpacing token, or add a `15em`-ish token if the value is deliberate. |
| F19 | Low | ThemeArtists.recipe.ts:27 (`525px` maxWidth), ExternalGallery.recipe.ts:55 (`12px` gap) | One-off geometry literals where a `sizes`/`spacing` token could live. | Judgment: acceptable one-offs, or add a `measure` size token if the 525px text-measure recurs. |
| F17 | Low | Calendar.recipe.ts:144-174 (+others), CalendarFilters.recipe.ts:36/44/76/80, skeleton.ts, loading.recipe.ts:34, Carousel.recipe.ts:38/68, MediaKitStrip.recipe.ts:19/31 | Raw `gray.*` on dark schedule-board / image placeholders. **Sanctioned** by the system map ("raw gray scale = utility for rare exceptions") and self-flagged in doc-comments. | Leave. These inflate the raw-value count (~30 of 108) but are policy-allowed. ZSB-75 lint should fence *unintended* raw grays without breaking these. |

## C. Inline fontSize/lineHeight → textStyle (or missing-textStyle)

| ID | Sev | File:lines | Issue | Recommended fix |
|----|-----|-----------|-------|-----------------|
| F07 | **Critical** | Manifesto.recipe.ts:34-39, ThemeArtists.recipe.ts:45-50, FeaturedEvents.recipe.ts:178-183, Hero.recipe.ts:183-241, ArtistsBanner.recipe.ts:57-66, ExternalGallery.recipe.ts:83-90, about/page.recipe.ts:209-217 | 7 hand-rolled display titles (fontFamily display + raw clamp fontSize + numeric lineHeight + uppercase) that replicate `sectionHeadline`/`cardTitle`/`subsectionTitle` — which have **0 adoption**. | Apply `textStyle:` at each site; delete the inline type. Manifesto/ThemeArtists→`sectionHeadline`; FeaturedEvents.name→`cardTitle`; ArtistsBanner.title→`sectionTitle`. |
| F08 | High | ArtistsBanner.recipe.ts:75-81 (ctaText), VisitSection.tsx:21-29 (directionsLink), EditionsNav.recipe.ts:91-121 (year/theme), Footer label | Hand-rolled label kickers replicate `labelText`/`labelSmall` (also 0-adoption). | Apply `textStyle:'labelText'` or adopt `eyebrow`. |
| F11 | Medium | about/page.recipe.ts:209-217 | `statementHeadline` = `textStyle:'sectionTitle'` **then** overrides with a `clamp()` fontSize + `lineHeight:0.96`. Adopts a textStyle and immediately fights it. | Either add a `statement` textStyle for this size, or accept the override as a one-off and document. Flag as drift. |
| F09 | Medium | panda.config.ts:681-686 | `heroBody` textStyle is byte-identical to `lead` (body/base/body/color body). | Delete `heroBody`, alias consumers to `lead` (PASS 3). |
| F10 | Medium | panda.config.ts:687-704 | `labelText` vs `labelSmall` differ only in `letterSpacing` (wide=4px vs label=1.2px). | Merge to one label textStyle + a tracking variant, or keep one (PASS 3). |
| F25-prose | Low | privacy/page.recipe.ts:21-55, about projectMain/pillarBody, partners ctaBody (recipe:163 `15px`) | Long-form prose hand-rolls body type. Expected for legal/editorial, but `partners` ctaBody uses a raw `15px`. | Legal prose acceptable; map `partners` ctaBody to `lead`/`base`. |

## D. Inline section/page padding → layerStyle

| ID | Sev | File:lines | Issue | Recommended fix |
|----|-----|-----------|-------|-----------------|
| F12 | High | page.recipe.ts:124, partners/page.tsx:97-101, press/page.recipe.ts:46/50/127, editions/page.recipe.ts:38-39, partners/page.recipe.ts:42-45/138-142, VisitSection.recipe.ts:44 | `paddingBlock:sectionY + paddingInline:content` re-added by hand after a `sectionDark`/`sectionLight` ground, ×6. `layerStyle:'section'` exists but pages bypass it (worst: inlined in JSX at partners:97-101; press re-rolls *asymmetric* 3xl/4xl padding 3×). | Promote a `section` recipe bundling ground+padding (PASS 3). **Press's asymmetric padding is drift — NOT an exception:** normalize it to `sectionY` (`rhythm:'normal'`). The only two padding-Y rhythms are `sectionY` and `sectionYLg`; no third/`tall` token. |
| F13 | Medium | page.tsx:145, partners/page.tsx:83, press/page.tsx:131 + 179 | `css({textStyle:'sectionTitle', marginBottom:'xl'})` idiom repeated 4× in JSX. | Promote a `SectionHeading` component/slot (PASS 4). |

## E. Motion drift (Motion philosophy applied)

Keyframes: **no deletions** — all 16 are referenced ≥1× (usage histogram in
`01-usage.json`); consolidation is the lever and is specified in PASS 3. The
PASS 2 drift is the **46 inline duration/easing literals**:

| ID | Sev | File:lines | Issue | Recommended fix |
|----|-----|-----------|-------|-----------------|
| F20a | High | literal easings where `expo`/`quint` exist: Hero.recipe.ts:88 (ease-out), HeroSlideshow.recipe.ts:55/107 (ease/ease-in-out), Carousel.recipe.ts:42/64, Navigation.recipe.ts:47/129, Lightbox.recipe.ts:36/50 + Lightbox.tsx:164, page.recipe.ts:157/178/184, Credits.recipe.ts:79, error.recipe.ts:105, Calendar.recipe.ts:222 | Raw `ease`/`ease-in-out`/`ease-out` bypass the easing tokens. Many genuinely want plain `ease` — for which **no token exists**. | Add `easings.standard` (= `ease`) so the common micro-transition has a token; map the rest to `expo`/`quint`. Lightbox.tsx:164 raw `var(--easings-expo)` → `token(easings.expo)`. |
| F20b | High | durations mapping to existing tokens: 0.2s→fast, 0.3s→normal, 0.4s→medium, 0.5s→slow, 0.6s→reveal — across Navigation:47/129, Lightbox:36/50/164, Carousel:64, page:157/178/184, Credits:79, MagneticButton.recipe:30/55 | Literal durations that have an exact token. | Replace each with `{durations.x}`. |
| F20c | Medium | durations with **no token** (>600ms): 0.8s (MediaKit:32), 0.9s/900ms (Hero:127/160, editions:55/93), 1s (Hero:203, PageHero:21, page:96), 1.2s/1.3s (Hero:75/88, HeroSlideshow:55, Carousel:42), 1.6s/1.8s (skeleton:15, loading:47), 2s/4s/32s (Calendar:225/295/614, MagneticButton:63, PartnerBadge:46) | Entrance, sweep, and loop durations beyond the 600ms ceiling. Missing-token. | Add `durations.entrance` (~900ms) for reveals and `durations.sweep` (~1.6s) for skeletons. Loop durations (2s/4s/32s) are intentionally bespoke — accept as literals OR add a `durations.loop` family. PageHero:21 + page:96 are the *same* 1s entrance duplicated. |
| F20d | Low | stagger delays: FeaturedEvents.recipe.ts:98 (90ms), EditionsNav.recipe.ts:38-39 (60ms) | Per-item stagger steps, no token. | Acceptable as literals, or add a `durations.stagger` step. |
| F21 | Low | PartnerBadge.recipe.ts:23-52, MagneticButton.tsx GSAP | GSAP JS durations/eases (`power2.out`, `0.4/0.5/0.7s`). | Out of Panda token reach (JS land). No fix; note the boundary. |

## F. Specificity / `!important` / layer misuse

| ID | Sev | File:lines | Issue | Recommended fix |
|----|-----|-----------|-------|-----------------|
| F22 | Low | Lightbox.tsx:164 | Raw-string `var(--easings-expo)` instead of `token(easings.expo)` — works but bypasses the type-safe reference. | Use `token()`. |
| — | ✅ | site-wide | **No `!important`, no specificity hacks, no layer-order violations found.** Co-located `sva`/`cva` correctly emit into `utilities` and beat config `recipes` by layer order. | Positive finding — the cascade-layer discipline is intact. |

## Structural (severity noted here; full proposals in PASS 4)

| ID | Sev | File:lines | Issue | Lever |
|----|-----|-----------|-------|-------|
| F23 | High | Calendar.recipe.ts (718 lines, 70 slots) | One `sva` conflates ≥7 sub-components (header/counts, past-toggle, ongoing-grid, agenda, event-row, now-marker, recap, archive-disclosure). | Split into Calendar + EventRow(card) + Disclosure + Chip(Badge) + Link(textLink). |
| F24 | Medium | Hero.recipe.ts (244/12), FeaturedEvents.recipe.ts (243/24), ExternalGallery.recipe.ts (193/19), page/about/press recipes (29/28/29 slots) | Oversized recipes carrying type/eyebrow/chip that belong to primitives. | Extract primitives (F01/F05/F07) → slot counts shrink. |
| F25 | Medium | Calendar.recipe.ts:680-715, VenuesView.recipe.ts:78-120 | Native `<details>` rotating-chevron disclosure duplicated ×2. | Shared `disclosure` recipe. |
| F26 | Low | panda.config.ts:474 | `radii.pill` (100px) — **0 usage**, dead token. | Delete (PASS 3). |

## Out of scope (not a finding)

- The editions lead copy at `src/app/(site)/editions/page.tsx:130` ("Five past
  editions. Five #, …") is **intentional** — the `#` references the editions'
  hashtag naming convention, not a placeholder. No action.
