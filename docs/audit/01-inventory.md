# PASS 1 — Inventory

One row per component/recipe. Columns: slots, inline `css()`/`cx()` count, then
the five leak counts (raw / textstyle / layerstyle / anim / local-keyframes),
primitives adopted, cited line ranges, notable patterns. Cite this file's
`line_ranges` in later passes instead of re-scanning. Companion histograms +
repeated-pattern map: [`01-usage.json`](./01-usage.json).

Leak columns key: **raw** = raw_value · **ts** = textstyle_inline · **ls** =
layerstyle_inline · **anim** = anim_inline · **kf** = keyframes_local.

| component | recipe | slots | css/cx | raw | ts | ls | anim | kf | primitives | line_ranges | notable_patterns |
|---|---|--:|--:|--:|--:|--:|--:|--:|---|---|---|
| Calendar.tsx | Calendar.recipe.ts | 70 | 0 | 17 | 0 | 0 | 2 | 0 | none | recipe:126, 144-174, 247, 269, 322, 336, 516, 555, 572, 584-597, 613, 672, 707; anim 225/240/295/614 (2s), 222 (ease) | OVERSIZED 718 lines/70 slots; conflates header/ongoing-grid/agenda/event-row/now-marker/recap/archive; hand-rolled chip 584-597 ≈Badge; reimplements card hairline+hover 199-242; dup data-past block 234-238/370-374; literal 2s ×3; raw ease; rgba boxShadow 613 |
| CalendarFilters.tsx | CalendarFilters.recipe.ts | 9 | 0 | 6 | 0 | 0 | 0 | 0 | none | recipe:36, 44, 76, 80, 95-114 | hand-rolled checkbox chip 65-114 ≈Badge+check; raw grays 300/700/800 (dark-board, self-flagged exception) |
| CalendarShare.tsx | — | 0 | 3 | 0 | 0 | 0 | 0 | 0 | button | tsx:13, 19, 41 (cx) | clean — Button adopted; adds icon-nudge+copied accent via css(); token color highlight |
| ComingSoon.tsx | ComingSoon.recipe.ts | 16 | 0 | 1 | 0 | 0 | 0 | 0 | none | recipe:50, 97 | follow-link block 84-111 ≈ Calendar recapLink 658-677 (dup hand-rolled link) |
| EventModal.tsx | EventModal.recipe.ts | 16 | 3 | 3 | 0 | 0 | 0 | 0 | button | tsx:17, 22, 27, 123 (cx); recipe:55 (rgba), 87, 110, 173 | Button adopted; type chips 113-125 ≈Badge (3rd copy); rgba boxShadow 55; link block 160-186 dup |
| RoutedEventModal.tsx | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | n/a | — | logic-only router bridge; no styling |
| VenuesView.tsx | VenuesView.recipe.ts | 31 | 0 | 4 | 0 | 0 | 0 | 0 | none | recipe:106, 149, 187-200, 218 | hand-rolled chip 187-200 (≈Badge, 4th copy); native &lt;details&gt; dup of Calendar archive disclosure; mapLink ≈textLink |
| VisitFaq.tsx | VisitFaq.recipe.ts | 8 | 0 | 0 | 0 | 0 | 0 | 0 | none | — | CLEANEST — fully tokenized, layerStyle+textStyle |
| VisitSection.tsx | VisitSection.recipe.ts | 25 | 1 | 5 | 1 | 1 | 0 | 0 | textLink | tsx:21-29 (css directionsLink ≈labelText); recipe:44 (split section pad), 67, 88, 94, 116, 135 | inline css replicates labelText/button typography; section splits padding vs layerStyle; raw letterSpacing 2px/0.15em/0.1em; raw grays |
| Hero.tsx | Hero.recipe.ts | 12 | 0 | 14 | 2 | 1 | 6 | 0 | none | recipe rgba 57/64/84/123/155-156/200; px 99/119/133/166/193-197; tape fonts 110-121/143-154; padTop 35/38; anim 75 (1.3s)/88 (1.2s,ease-out,0.3s)/127 (0.9s)/160 (0.9s)/203 (1s) | OVERSIZED 244 lines; hand-rolled eyebrow ×2 (tapeDate/tapeEdition near-identical); raw white/black/blackPure; ease-out literal; dup reduced-motion ×3; tapeTheme ≈display textStyle |
| HeroSlideshow.tsx | HeroSlideshow.recipe.ts | 14 | 1 | 6 | 0 | 0 | 5 | 0 | iconButton | tsx:71 (animationDuration {interval}ms); recipe rgba 65/74/105/123; px 97/105; anim 55 (1.2s,ease-in-out)/107 (0.5s/0.3s ease)/118 (0.4s)/120-123 | raw rgba(255 255 255/*) white-alpha (no token); literal ease/ease-in-out; mixes {easings.expo} with literal 0.4s/0.5s |
| FeaturedEvents.tsx | FeaturedEvents.recipe.ts | 24 | 1 | 8 | 1 | 0 | 1 | 0 | card | tsx:70, 75 (cx); recipe gray.700/800/300/900 78/113/207/124/145; blackPure 124/145; rgba 158; name fonts 178-183; anim cardIn 98 (+90ms delay) | OVERSIZED 243 lines; hand-rolled chip 226-241 ≈Badge; hand-rolled eyebrow 53-61; name ≈cardTitle; calendarLink ≈textLink; raw grays+blackPure |
| FeaturedSpotlight.tsx | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | none | — | logic-only client filter wrapper; clean |
| Manifesto.tsx | Manifesto.recipe.ts | 6 | 0 | 1 | 1 | 1 | 0 | 0 | none | recipe:37 (black), 52 (gradient), 41 (padTop 20px); title 34-39 | title ≈sectionHeadline; raw black; uses layerStyle sectionLight + own paddingBlock/Inline |
| AccentSplit.tsx | — | 0 | 1 | 0 | 0 | 0 | 0 | 0 | none | tsx:4 (css color action) | clean — single tokenized accent class |
| Carousel.tsx | Carousel.recipe.ts | 4 | 0 | 2 | 0 | 0 | 5 | 0 | none (→StripControls) | recipe:38/68 (gray.900); anim 42 (1.2s/0.6s ease)/45/46 (2s)/64 (0.4s ease) | raw gray.900 ×2 (placeholder, self-flagged); literal ease/0.6s/2s/0.4s mixed with {easings.expo}; gradientBorderShift ref |
| StripControls.tsx | StripControls.recipe.ts + strip.recipe.ts | 5 | 1 | 0 | 0 | 0 | 0 | 0 | iconButton | tsx:39 (cx) | clean — well-normalized shared chrome; eyebrow hand-rolled but tokenized |
| MediaKitStrip.tsx | MediaKitStrip.recipe.ts | 2 | 0 | 1 | 0 | 0 | 1 | 0 | iconButton (via StripControls) | recipe:19/31 (gray.900); anim 32 (0.8s) | raw gray.900 (placeholder, self-flagged); literal 0.8s with {easings.expo} |
| EditionsNav.tsx | EditionsNav.recipe.ts | 8 | 0 | 5 | 2 | 0 | 1 | 0 | card | recipe:59-88 (soon/viewing dup), 38-39 (60ms), 71-72, 86-87, 91-121 | reimplements badge (soon/viewing boxed chips dup outline-pill); dup soon/viewing blocks; year/theme ≈label/title textStyles; raw 60ms stagger |
| EditionsNavBand.tsx | — | 0 | 1 | 0 | 0 | 0 | 0 | 0 | card | tsx:92-95 (cx) | adopts card correctly; clean |
| ArtistsBanner.tsx | ArtistsBanner.recipe.ts | 9 | 1 | 4 | 2 | 0 | 0 | 0 | badge | tsx:20 (css mb); recipe:92 (3px accent), 57-66 (title), 75-81 (ctaText) | adopts Badge; title/ctaText hand-roll display+uppercase+letterSpacing ≈sectionTitle/labelText |
| ArtistsTable.tsx | ArtistsTable.recipe.ts | 12 | 1 | 3 | 0 | 0 | 0 | 0 | none | tsx:29 (cx); recipe:40/119/120 (color:black anchor), 127 (rgba barcode), 120 (8px) | raw black anchor used repeatedly (≈heading/onMedia role); barcode rgba; hand-rolled table hairlines (legit grid) |
| ThemeArtists.tsx | ThemeArtists.recipe.ts | 6 | 0 | 1 | 1 | 1 | 0 | 0 | none (→ArtistsTable) | recipe:16 (layerStyle section), 45-50 (headline), 27 (maxWidth 525px) | headline ≈sectionHeadline/sectionTitle; maxWidth literal ambiguous |
| ExternalGallery.tsx | ExternalGallery.recipe.ts | 19 | 1 | 3 | 2 | 1 | 0 | 0 | card, badge | tsx:31 (css textStyle sectionTitle OK), 38 (cx); recipe:36 (layerStyle section), 165 (rgb white-alpha), 55 (gap 12px), 83-90 (title), 120-136 (ctaIcon) | adopts card+Badge; OVERSIZED 193 lines/19 slots; ctaIcon 120-136 ≈IconButton (not adopted); rgb white-alpha; title ≈display; bespoke edition-plate 151-191 |
| Credits.tsx | Credits.recipe.ts | 18 | 0 | 1 | 0 | 2 | 1 | 0 | none (uses IsdayBadge) | recipe:40-41 (layerStyles), 79 (all 0.4s ease), 12-17 (labelBase shared OK) | literal 0.4s ease; labelBase shared-block = good normalization |
| IsdayBadge.tsx | IsdayBadge.recipe.ts | 6 | 1 | 1 | 0 | 0 | 0 | 0 | badge | tsx:8, 12 (cx); recipe:24-31 (card-like surface), 25-26 (gradient color-mix), title ls -0.5px | adopts Badge for pill (good); card slot bespoke gradient surface reimplements card (border+boxShadow:card hand-rolled, NOT card recipe) |
| PartnerBadge.tsx | PartnerBadge.recipe.ts | 6 | 0 | 0 | 0 | 0 | 4 | 0 | none | recipe:23-52 (GSAP durations/ease, JS-legit), 46 (spin 32s), 48/68 (white/black fill) | NOT a badge — magnetic circular link (misnamed); GSAP literals legit; spin keyframe global |
| Figure.tsx | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | none (skeleton util) | tsx:2 (skeleton import) | clean; no styling |
| FallbackImage.tsx | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | none | — | clean; no styling |
| Lightbox.tsx | Lightbox.recipe.ts | 9 | 3 | 4 | 0 | 0 | 3 | 0 | iconButton | tsx:186/217/226 (cx), 164 (transition 0.3s expo/0.3s ease), 184 (rgba inline); recipe:29 (rgba 0.95), 36 (0.4s ease), 50 (0.3s ease) | adopts IconButton (good); raw 0.3s/0.4s ease; rgba black backdrop ×2; var(--easings-expo) raw-string ref 164 |
| Navigation.tsx | Navigation.recipe.ts | 5 | 0 | 0 | 0 | 0 | 3 | 0 | none | recipe:47 (0.3s ease), 129 (transform 0.3s/opacity 0.2s) | bespoke nav chrome (documented, intentional); literal 0.3s/0.2s; raw ease |
| Footer.tsx | Footer.recipe.ts | 12 | 1 | 1 | 0 | 0 | 0 | 0 | textLink | tsx:27 (cx); recipe:128 (gray.500), 132 (9px 13px pad) | adopts TextLink (draw/quiet); stamp raw gray.500 (→ muted role) |
| CookieBanner.tsx | CookieBanner.recipe.ts | 7 | 0 | 1 | 0 | 0 | 2 | 0 | button | recipe:26 (rgba shadow), 29-30 (280ms, expo token) | adopts Button (ghost/solid); animationDuration literal 280ms; raw rgba box-shadow |
| CookieSettingsButton.tsx | — | 0 | 0 | 0 | 0 | 0 | 0 | 0 | button | tsx:13 | thin Button consumer OK |
| MagneticButton.tsx | MagneticButton.recipe.ts | 2 | 1 | 1 | 0 | 0 | 2 | 0 | button | tsx:24-31 (css ripple), 29 (0.6s), 27 (rgba); recipe:30 (0.4s), 50 (pink/chartreuse), 55 (0.4s), 63 (4s) | thin motion wrapper over button OK; ripple css literal 0.6s + rgba; gradientBorder raw pink/chartreuse anchors (intentional conic ring); 4s spin |
| PageHero.tsx | PageHero.recipe.ts | 4 | 0 | 0 | 1 | 2 | 1 | 0 | none | recipe:16 (pageHero layerStyle), 17 (sectionInner), 18 (pageTitle textStyle), 21 (1s expo) | MODEL CITIZEN — pure layerStyle+textStyle; only the 1s entrance is a literal duration |
| skeleton.ts | — | 0 | 1 | 0 | 0 | 0 | 1 | 0 | none | file:11-19 (css), 15 (1.6s) | raw gray.800 base (documented exception); literal 1.6s; shared skeletonPulse keyframe |
| ui/Badge/Badge.tsx | — | 0 | 1 | 0 | 0 | 0 | 0 | 0 | badge | tsx:20 (cx) | thin wrapper OK |
| ui/Button/Button.tsx | — | 0 | 1 | 0 | 0 | 0 | 0 | 0 | button | tsx:16 (cx) | thin wrapper OK |
| ui/Card/Card.tsx | — | 0 | 1 | 0 | 0 | 0 | 0 | 0 | card | tsx:23 (cx) | thin wrapper OK |
| ui/Eyebrow/Eyebrow.tsx | — | 0 | 1 | 0 | 0 | 0 | 0 | 0 | eyebrow | tsx:19 (cx) | thin wrapper OK |
| ui/IconButton/IconButton.tsx | — | 0 | 1 | 0 | 0 | 0 | 0 | 0 | iconButton | tsx:16 (cx) | thin wrapper OK |
| ui/TextLink/TextLink.tsx | — | 0 | 1 | 0 | 0 | 0 | 0 | 0 | textLink | tsx:19 (cx) | thin wrapper OK |
| (site)/page.tsx | page.recipe.ts | 29 | 5 | 4 | 1 | 0 | 6 | 0 | badge | tsx:87/114/143/154 (cx), 121 (css heroLead), 145 (css sectionTitle), 159 (css); recipe:96 (1s), 124 (sectionY pad→layerStyle), 146/154/237 (1px solid divider), 157 (0.4s), 168 (40px/60px), 178/184 (0.3s ease) | OVERSIZED 29 slots; editions section hand-rolls section padding (124); heroTitle dup of PageHero entrance (1s); literal 0.3s/0.4s ease |
| (site)/about/page.tsx | about/page.recipe.ts | 28 | 1 | 2 | 2 | 3 | 0 | 0 | eyebrow | tsx:109 (css mb 32px); recipe:45/114/123/173 (layerStyles), 82-83/122/214 (clamp/px font), 103 (gradient token), 214 (clamp 34-60px), 217 (lineHeight 0.96) | OVERSIZED 28 slots; statementHeadline overrides sectionTitle with clamp+lineHeight 0.96; projectTitle/pillars hand-roll body type; px 32px mb |
| (site)/editions/page.tsx | editions/page.recipe.ts | 17 | 3 | 3 | 0 | 0 | 0 | 0 | badge, card, textLink | tsx:85 (cx), 127 (css color action); recipe:55 (900ms), 83/132 (rgba gradients), 93 (600/900ms), 127-128 (theme tape px) | adopts Card/Badge/TextLink well; literal 900ms/600ms reveals; rgba gradient literals (the 'Five #' lead copy tsx:130 is intentional editions-hashtag branding, not a bug) |
| (site)/editions/[year]/loading.tsx | loading.recipe.ts | 16 | 14 | 1 | 0 | 0 | 1 | 0 | none | tsx:12-55 (14×cx); recipe:32 (black), 34 (gray.900 documented), 45 (rgba), 47 (shimmer 1.8s) | skeleton bones via cx (expected); literal 1.8s shimmer; raw gray.900 (documented exception) |
| (site)/partners/page.tsx | partners/page.recipe.ts | 22 | 4 | 3 | 2 | 1 | 0 | 0 | eyebrow | tsx:83 (css sectionTitle+pad), 97-101 (css inline section padding→layerStyle), 106 (css mb 32px); recipe:155 (clamp 48-106px), 163 (15px font), 167 | page.tsx INLINES section padding 97-101 (worst case); ctaHeading hand-rolls clamp font; ctaBody raw 15px; 32px mb |
| (site)/press/page.tsx | press/page.recipe.ts | 29 | 3 | 0 | 3 | 0 | 0 | 0 | badge | tsx:131/179 (css sectionTitle+pad), 153 (css); recipe:46/50/127 (paddingTop 3xl etc) | OVERSIZED 29 slots; kit/appearances/releases each hand-roll asymmetric section padding (3× dup) — **drift, normalize to sectionY (no press exception)**; 3× inline sectionTitle |
| (site)/privacy/page.tsx | privacy/page.recipe.ts | 4 | 1 | 0 | 1 | 1 | 0 | 0 | none | tsx:73 (css sectionInner); recipe:15-19 (sectionDark+pad), 21-55 (article prose type) | legal page hand-rolls prose type (fontSize base/lineHeight body + h2 xl) — expected long-form; uses sectionDark correctly |
| (site)/error.tsx | error.recipe.ts | 10 | 1 | 2 | 0 | 0 | 1 | 0 | none | tsx:32 (cx); recipe:105 (all normal ease), 110-111 (color-mix action) | btn/btnPrimary REIMPLEMENT button (documented intentional boundary chrome) — fold-into-Button candidate; color-mix over action (good); 'all ... ease' literal |

## Column totals (51 rows)

| raw | textstyle | layerstyle | anim | local-kf | **total leaks** |
|--:|--:|--:|--:|--:|--:|
| 108 | 22 | 14 | 46 | 0 | **190** |
