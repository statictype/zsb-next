# PASS 4 — Composition & Slot Reorganization

Two levers per flagged component: **composition** (between components) and
**slots** (within). Bias hard toward fewer/simpler. Proposals only — no code.
Builds on `02-findings.md` (rulings R1–R13) + `03-abstractions.md`.

Lever legend: **SPLIT** · **RECOMPOSE** · **MERGE** · **DELETE** · **RESLOT**.

---

## A. Composition (between components)

### A1. Calendar — **SPLIT** (F23; 718 lines / 70 slots)

The single worst structural offender: one `sva` is ≥7 components. Decompose:

```
Calendar/                         (orchestrator: header counts, past-toggle, grid layout)
├── EventRow      = card({interactive}) + Badge(type) + button({variant:'text'})   ← was slots 199-242,555-597,658-677
├── OngoingGrid   = grid of EventRow                                               ← was the ongoing card-grid
├── AgendaList    = day groups of EventRow                                         ← was the agenda timeline
├── ArchivePanel  = <Disclosure>                                                   ← was slots 680-715
└── (now-marker)  = static accent, NO pulse                                        ← pulse deleted (motion ruling)
CalendarFilters/  = <Checkbox> rows  (A4)
```

**What shrinks:** ~70 slots → ~22 across Calendar + EventRow; the chip, the link,
the card hairline, and the disclosure all leave for shared pieces. The 4 raw `2s`
animation literals + the now-dot `pulse` go.

### A2. MagneticButton — **DELETE → modifier** (R5)

Folds into `button({magnetic:true})`. Component folder + `MagneticButton.recipe.ts`
removed; the GSAP magnet becomes the behavior modifier. Ripple dropped.

### A3. textLink — **DELETE → `button({variant:'text'})`** (R5)

Recipe retired. Adopters (Footer, VisitSection, editions page) + the 5 hand-rolled
arrow-links re-point to `button` `text`. Arrows dropped (R3).

### A4. CalendarFilters — **RECOMPOSE → `Checkbox`** (R2, F01)

The hand-rolled selectable chip (65-114) becomes a real `<Checkbox>` (box + check
indicator + label). Filter facets = stacks of `<Checkbox>`. No Badge hack.

### A5. VisitFaq — **RECOMPOSE → `Disclosure`** (F25)

VisitFaq's `list/item/question/answer` slots *are* a disclosure list. Recompose
onto the shared `<Disclosure>` (A-side new component). VisitFaq becomes a thin
data→Disclosure map.

### A6. IsdayBadge — **RECOMPOSE → `card` + `Badge`** (F03)

It is a `card` (the seal surface) wrapping a `Badge` (the pill). Recompose: `card`
root + `Badge` + content; the gradient seal becomes a one-line `css()` override on
the card root (not a reimplemented surface). Misleading name aside, it stays one
small component.

### A7. error — **MERGE btn/btnPrimary → `button`** (F06)

If `button` is dependency-safe at the boundary route, delete the two reimplemented
button slots. Else keep + document the constraint.

### A8. New shared components (created, not reorganized)

`Disclosure`, `SectionHeading`, `Checkbox`, `EditionTheme`, `section` recipe — full
specs in `03-abstractions.md §1c–1d`. Each has ≥2 real call sites.

### A9. **DEFERRED — EditionsNav / EditionsNavBand** (R10)

Do not touch — a structural refactor is already planned. Its `soon`/`viewing`
badge-dup and `year`/`theme` title-dup are noted for that work, not this audit.

---

## B. Slots (within a component)

### B1. Hero.recipe — **RESLOT** (12 slots → ~5)

Current conflates media, three "tapes," lead, controls. The tapes are not Hero
internals — they are positioned `Badge`s + an `EditionTheme`.

```
Proposed slots:  root · media · overlay · leadGroup
Move OUT:  tapeDate/tapeEdition → <Badge elevated>   (Hero positions them; Badge owns type)
           tapeTheme            → <EditionTheme>       (shared; also on editions cards)
Sibling-layout (tape placement, rotation offset) stays Hero's; type/case/shadow leave.
Kills: hand-rolled eyebrow ×2, the display-title block, dup reduced-motion ×3.
```

### B2. FeaturedEvents.recipe — **RESLOT** (24 → ~10)

```
section · header(= Eyebrow + SectionHeading) · grid · EventCard
EventCard = card({ground:'onDark', interactive}) + Badge(chip) + cardTitle(name) + button.text(calendarLink)
```
Move OUT: chip→Badge, eyebrow→Eyebrow, name→`cardTitle`, calendarLink→`button.text`,
card hairline→`card`. The poster becomes a *composition*, not a 24-slot recipe.

### B3. ExternalGallery.recipe — **RESLOT** (19 → ~10)

```
section · header · card(= card primitive) · ctaIcon(= iconButton) · plate-group
```
Move OUT: ctaIcon→`iconButton`, title→`sectionTitle`/`pageTitle`, card→`card`.
**OVERENGINEERED flag:** the decorative edition-plate (`plateMonogram/plateZsb/
plateYear/plateMeta`, 151-191) is 4 slots for one call site — collapse to a single
`plate` slot with inline children; do **not** extract an `EditionPlate` component
(abstraction pays off in <2 sites).

### B4. VenuesView.recipe — **RESLOT** (31 → ~18)

Move OUT: chip→`Badge`, mapLink→`button.text`, the `<details>` venue disclosure→
`Disclosure`. Remaining slots are genuine venue-list layout.

### B5. EventModal.recipe — **RESLOT** (16, adopt-only)

Type chips (113-125)→`Badge`; the back/recap links (160-186)→`button.text`. Modal
shadow→`shadows.modal`; backdrop→`colors.scrim`. Slots mostly stay (real modal
chrome); the chip/link leave.

### B6. Page recipes — **RESLOT** via `section` + `SectionHeading`

| Page | slots now | After | Lever |
|------|-----------|-------|-------|
| `press/page.recipe` | 29 | ~12 | 3 hand-rolled **asymmetric** section blocks → 3 `section({rhythm:'normal'})` (the asymmetry is drift — **no press exception**, use `sectionY`); 2 inline sectionTitle → `SectionHeading` |
| home `page.recipe` | 29 | ~18 | editions-section padding → `section`; heroTitle entrance dedup; inline sectionTitle → `SectionHeading` |
| `about/page.recipe` | 28 | ~18 | grounds+padding → `section({rhythm:'lg'})`; statementHeadline → existing textStyle; prose → `lead`/`base` |
| `partners/page.recipe` | 22 | ~14 | un-inline the JSX section padding (97-101) → `section`; ctaBody `15px` → `base` |
| `editions/page.recipe` | 17 | ~15 | already adopts Card/Badge/TextLink; section padding → `section`; reveals → `durations.entrance` |

### B7. Light adopt-only (RESLOT, minor)

- **ComingSoon** — follow-links → `button.text` (dedup with Calendar recap).
- **Manifesto** — `title` → `sectionTitle`; ground+padding → `section({rhythm:'lg'})`; raw `black`→role.
- **ThemeArtists** — `headline` → `sectionTitle`; already uses `section`/`ArtistsTable`.
- **ArtistsBanner** — `title`→`sectionTitle`, `ctaText`→`Badge` (R10).
- **StripControls** — hand-rolled eyebrow → `eyebrow`.
- **ArtistsTable** — raw `black` color anchor (×4) → `headingLight`/role; keep the table-grid hairlines (legit).

---

## C. OVERENGINEERED register

| Component | Symptom | Action |
|-----------|---------|--------|
| Calendar.recipe | 70 slots / ≥7 components in one `sva` | SPLIT (A1) |
| home/about/press page recipes | 29/28/29 slots; per-section type+padding | RESLOT via `section`+`SectionHeading` (B6) |
| FeaturedEvents.recipe | 24 slots; chip+eyebrow+title+card inlined | RESLOT to compositions (B2) |
| ExternalGallery edition-plate | 4 slots, 1 call site, decorative | collapse to 1 slot; do NOT extract a component (B3) |
| MagneticButton | whole component for a hover behavior | DELETE → modifier (A2) |
| textLink | separate primitive overlapping button | DELETE → `button.text` (A3) |

---

## Checkpoint digest — components with proposed reorgs

**23** components/recipes flagged (EditionsNav **deferred**, not counted), by
**primary** lever:

| Lever | Count | Components |
|-------|------:|-----------|
| SPLIT | 1 | Calendar |
| RECOMPOSE | 3 | CalendarFilters, VisitFaq, IsdayBadge |
| MERGE | 1 | error (btn→button) |
| DELETE | 2 | MagneticButton, textLink |
| RESLOT | 16 | Hero, FeaturedEvents, ExternalGallery, VenuesView, EventModal, ComingSoon, Manifesto, ThemeArtists, ArtistsBanner, StripControls, ArtistsTable, + home/about/press/partners/editions pages (5) |

(Plus **5 new shared pieces** created: Disclosure, SectionHeading, Checkbox,
EditionTheme, `section` recipe.)
