# CMS rollout plan

Rolling content authoring for the homepage, static pages, and press content from hardcoded React into Sanity. Editions are already partly wired. This document is **rollout state** — what's shipped, what's queued, what's deferred. Once everything ships, archive (or delete) it; the system reference lives in [`cms.md`](./cms.md).

## Goal

Editors can author every visible page (except the blog, which is out of scope) without a code change. Existing editor friction in the current Studio is fixed in the same pass.

## Locked decisions

Captured before coding started, won't re-litigate without a new decision in this file:

| # | Question | Choice | Rationale / Reference |
|---|---|---|---|
| 1 | Homepage scope | Everything editable — copy, CTA, slideshow images + crop positions, editions intro paragraph | User decision (max content control) |
| 2 | Media kit asset location | On each Edition document (`edition.pressKit`) | [ADR 0008](./adr/0008-derive-edition-listings-from-status.md) (related: same instinct — assets belong to the year) |
| 3 | Rich text shape | Plain paragraph arrays everywhere; Portable Text only on `privacyPage` | [ADR 0007](./adr/0007-plain-paragraphs-over-portable-text.md) |
| 4 | Edition schema cleanups | Folded into this rollout (not a separate later effort) | [ADR 0010](./adr/0010-collapse-carousel-slide-types.md), plus split `dateTape`, validate `themeHighlight ⊂ theme`, store credit lists as arrays |
| 5 | Singleton enforcement | Structure tree + `document.actions` / `newDocumentOptions` guards | [ADR 0009](./adr/0009-singleton-pattern.md) |
| 6 | Editions list derivation | Derive from `edition.status: upcoming \| live`, not an explicit array on the homepage doc | [ADR 0008](./adr/0008-derive-edition-listings-from-status.md) |

## Out of scope

- **Blog** — coming later, separate effort.
- **Localization** — site is English-only today, no `i18n` plans in this rollout.

## Steps

Status legend: `[ ]` pending · `[~]` in progress · `[x]` shipped · `[!]` blocked.

### `[x]` Step 1 — Studio plumbing

Foundation everything else depends on.

**Shipped:**
- `SINGLETON_TYPES` registry + `singletonListItem` structure helper (`src/sanity/lib/singleton.ts`).
- Structure tree with grouping + auto-include of non-singleton types (`src/sanity/structure.ts`).
- Presentation tool wired with `edition` + `artist` document locations (`src/sanity/lib/presentation.ts`).
- `document.actions` strips `delete` / `unpublish` / `duplicate` from singletons; `document.newDocumentOptions` hides them from the global "Create new" menu (`sanity.config.ts`).
- `/api/draft-mode/enable` (via `defineEnableDraftMode`) + `/api/draft-mode/disable` routes.
- `stegaClean` applied at the SEO boundary in `src/lib/seo.ts` — fixes invisible-character leak into `<title>`, OG tags, and JSON-LD `name` / `description`.
- `readToken` typed as `string` (was `string | undefined` and silently broke consumers).

**Verified:** `pnpm typecheck`, `pnpm lint`, `pnpm typegen` all pass.

### `[x]` Step 1.5 — Live preview wiring

**Shipped:**
- `next-sanity` 12.4.5 → 13.0.7 (plus `sanity` 5.26 → 5.28, `@sanity/client` 7.22.0 → 7.22.1, `@sanity/vision` 5.26 → 5.28). No v12 → v13 code migrations needed; we hadn't yet wired any `sanityFetch` calls or `<SanityLive>` props that the v13 release removed.
- `next.config.ts`: `cacheLife: { default: sanity }` so `sanityFetch` calls invalidate via Sanity sync tags, not a 15-minute timer.
- `src/sanity/lib/live.ts` rewritten with `strict: true` + three helpers required by the v13 cache-components pattern: `getDynamicFetchOptions()`, `sanityFetchStaticParams()`, `sanityFetchMetadata()`.
- `src/sanity/lib/client.ts`: `perspective: 'published'` explicit.
- `src/sanity/lib/editions.ts`: `getEditionFromSanity` now takes `DynamicFetchOptions` and uses `sanityFetch` under `'use cache'`. `src/data/editions/index.ts` threads the options through.
- Route restructure: every content route moved into `src/app/(site)/`. Root layout is now bare HTML + fonts; `src/app/(site)/layout.tsx` holds `<Footer />`, `<CookieBanner />`, `<JsonLd />`, `<SanityLive />` (always — drives sync-tag invalidation), and `<VisualEditing />` + `<DisableDraftMode />` when draft mode is on.
- `src/app/(site)/editions/[year]/page.tsx` uses the 3-layer pattern via the `loading.tsx`-sibling shortcut. `src/app/(site)/editions/page.tsx` uses inline `<Suspense>`.
- `src/components/DisableDraftMode/` — floating "Exit preview" button outside the Presentation Tool iframe.
- `src/app/studio/[[...tool]]/page.tsx` — Studio wrapped in a server component that touches `cookies()` inside `<Suspense>`, resolving the cacheComponents conflict between Studio's request-dependent metadata and the static page shell.

**Verified:** `pnpm build` ships 22 routes — content routes prerender static, `/editions/[year]` partial-prerenders via `loading.tsx`, `/studio/[[...tool]]` partial-prerenders. Caching at 1y/1y with sync-tag invalidation.

**Follow-up shipped:** `/api/revalidate/tag` route (`src/app/api/revalidate/tag/route.ts`) — Sanity webhook target. Validates `SANITY_REVALIDATE_SECRET`, projects `{ tags }`, calls `revalidateTag(tag, { expire: 0 })` for each. Webhook setup documented in `cms.md` under "Caching & revalidation".

### `[x]` Step 2 — `siteSettings` singleton + footer

**Shipped:**
- `siteSettings` doc: `contactEmail` (required, email-validated), `instagramUrl`, `facebookUrl` (both optional, https-only). Registered, added to `SINGLETON_TYPES`, pinned at top of structure tree with `CogIcon`. Presentation location → homepage footer.
- `SITE_SETTINGS_QUERY` and `getSiteSettings(options)` in `src/sanity/lib/settings.ts` — cached fetcher following the 3-layer pattern.
- `Footer.tsx` rewritten: takes `fetchOptions`, calls `getSiteSettings` in a `'use cache'` child, falls back to no contact/no socials when the doc isn't published yet. Internal Connect links stay hardcoded (they're structural — renaming "Press" to something else would mislead, and editors don't author internal nav).
- `(site)/layout.tsx` resolves `fetchOptions` once via `getDynamicFetchOptions()` and passes them to Footer.

**Editions list in the Footer stays hardcoded** until step 3 derives it from `edition.status`.

**Seed note:** the singleton doesn't auto-create. On a fresh dataset, the first editor needs to publish `siteSettings` with the values currently hardcoded in `Footer.tsx` (`office@filialadesculptura.com`, the two social URLs). A `sanity create` script for this is worth adding once we have more singletons to seed.

### `[x]` Step 3 — `homepage` singleton + `edition.status` field

**Shipped:**
- `homepage` doc with fields grouped into Hero (title, accented portion, lead, CTA label, CTA target reference, slideshow array) and Editions section (intro paragraph). Title-accent enforced as substring via custom validation; CTA label and target mutually require each other.
- `heroSlide` object (image with hotspot + alt + crop position) used by the slideshow array.
- `edition.status: 'upcoming' | 'live'` (radio, `initialValue: 'upcoming'`, required). _(Shipped initially as `'upcoming' | 'published'`; the value was renamed `published → live` on 2026-06-03 to stop colliding with Sanity's document publish/draft state — see the "Status value rename" note below.)_ All existing edition docs (2022-2025) now have `status: 'live'`; 2026 is `upcoming`. The backfill is done.
- `HOMEPAGE_QUERY` + `EDITIONS_LIST_QUERY` in `src/sanity/lib/queries.ts`. `getHomepage(options)` fetcher in `src/sanity/lib/homepage.ts`; `getEditionsListFromSanity(options)` + `getEditionListItems(options)` merge helpers in `src/sanity/lib/editions.ts` / `src/data/editions/index.ts`. Static fallback editions are always `'live'` (the page exists).
- `src/app/(site)/page.tsx` rewritten with the 3-layer pattern (inline Suspense — no sibling `loading.tsx`). Renders fallback defaults when the homepage doc isn't published yet (keeps a fresh dataset presentable).

**The footer's hardcoded `EXPLORE_LINKS`** can now be swapped for `getEditionListItems` too. Held until step 4 so footer wiring lands in one pass with the other static pages.

**Heads up:** the hero title accent uses the same substring pattern as `edition.themeHighlight`. ADR 0007's drift concern applies — editor needs to keep both fields in sync. Step 6 will backport stricter substring validation to the existing edition fields.

### `[x]` Step 4 — `aboutPage`, `partnersPage`, `visitPage`, `privacyPage`

Four singletons in two commits.

**Commit A — paragraph-array singletons:**
- `pageHero` shared object (title + accented substring + lead) used by About, Partners, Visit, Privacy. The homepage hero stays its own thing because it carries a CTA target + slideshow.
- `aboutPage`: hero, "Not a festival" prose (paragraph array), pillars array (label + body; numbers derived from order), curator letter (eyebrow + headline + portrait + name + role + paragraph array).
- `partnersPage`: hero, event section + image (paragraph array), "Why Sculpture" section + image + points array, "Become a partner" CTA (heading + accented portion + body + button label). Mailto target sources from `siteSettings.contactEmail`.
- `visitPage`: `venueName` (per-line array — "COMBINATUL" / "FONDULUI" / "PLASTIC" is three lines), street, city, mapsUrl, image, `hoursLines` (per-line array), `amenities` (label + fixed-enum icon), `transport` routes.
- VisitSection becomes a pure renderer taking props with fallbacks; page handles the 3-layer fetch.
- Footer `EXPLORE` column now derives from `getEditionListItems` (published only, top 4). Hardcoded list deleted — closes the step-3 loose end.

**Commit B — `privacyPage` with Portable Text:**
- Narrow PT surface: `h2` + `normal` block styles, `bullet` + `number` lists, `strong` + `em` marks, `link` annotation with `href` + `newTab`. Documented as the single project-wide exception in the schema description.
- Renderer uses `@portabletext/react` with custom serializers in `src/app/(site)/privacy/page.tsx`. "Change your mind" cookie-settings button rendered automatically below the body — editors don't author it (it's interactive client code).
- Fallback `FallbackBody` component captures the current static text so a fresh dataset still renders presentable.
- `updatedAt` field, formatted `en-GB` ("24 April 2026").

**Seed note:** five new singletons (about, partners, visit, privacy, plus homepage from step 3) won't auto-create. On a fresh dataset, the editor publishes each with the values currently hardcoded in each page's fallback. A bulk seed script is worth adding once all singletons are settled.

### `[x]` Step 5 — Press: `pressPage`, `pressAppearance`, `pressRelease`, `edition.pressKit`

**Shipped:**
- `pressPage` singleton (`hero: pageHero` + `mediaKitEyebrow`). Sixth singleton; added to `SINGLETON_TYPES`, pinned in the structure tree between Visit and Privacy with `DocumentsIcon`, presentation location at `/press`.
- `pressAppearance` doc: `title`, `medium` enum (Article / Video / Audio — drives the row label), `year`, `tag`, `url`, optional `excerpt`. The icon is derived from the URL host (youtube/vimeo/soundcloud) with a medium-based fallback for other outlets. Ordered year-desc then title-asc. _(Refined after the initial ship — `565bcf2` — from a `type` enum to this `medium` enum + host-derived icon.)_
- `pressRelease` doc: `title`, `edition` reference, `publishedAt` (date — sort key + JSON-LD `datePublished`), `language` radio (EN / RO), `pdf` file (accepts only `application/pdf`), `pages` number. File size is **derived** from `pdf.asset->size` (`sizeBytes` in the query), not an authored field. Ordered by `publishedAt` desc, then language asc. _(The `edition` reference is intentionally **not** filtered to live editions — `b9bc60f`: press releases for an upcoming edition are a real workflow, and the release renders only a year label + PDF, never a link to the edition page, so there's no broken-link risk. The "footgun" framing in the original plan was wrong.)_
- `edition.pressKit` object on Edition: `poster` + `coverPhoto` images, each with conditional-required alt. New "Press kit" group on the Edition form between Carousel and Credits. Additive — no migration needed.
- Structure tree gains a "Press" group containing Appearances + Releases; types filtered from the auto-include catch-all to avoid duplicates.
- Queries (`src/sanity/lib/queries.ts`): `PRESS_PAGE_QUERY`, `PRESS_APPEARANCES_QUERY`, `PRESS_RELEASES_QUERY` (de-references `edition->year` and `pdf.asset->url`), `EDITIONS_PRESS_KIT_QUERY` (aggregates editions where either poster or coverPhoto is set, ordered year-desc).
- Fetchers in `src/sanity/lib/press.ts` (kept separate from the singleton fetchers in `staticPages.ts` since press has multiple data sources and a multi-doc shape). All follow the 3-layer pattern; multi-doc fetchers default to `[]` instead of `null`.
- `src/app/(site)/press/page.tsx` rewritten with the 3-layer pattern. Hero/eyebrow read from `pressPage` with `FALLBACK` defaults; appearances/releases/media-kit sections only render when their data source returns rows. Media-kit strip flattens editions into `{ year, label, name, image }` items (cover photo before poster within a year, matching previous static order).
- Deleted: `src/data/press-appearances.ts`, `src/data/press-releases.ts`, `src/data/media-kit.ts`.

**Verified:** `pnpm typegen` (15 queries), `pnpm typecheck`, `pnpm lint` all pass.

**Seed note:** sixth singleton (`pressPage`) won't auto-create. On a fresh dataset, editor publishes it with the values currently in `FALLBACK` (`heroTitle: 'Press room'`, accent `'room'`, lead about "reference desk", eyebrow `'Media'`). Belongs in the seed script alongside the other five.

**Heads-up:** the press page's `HeroTitle` helper is now the **5th** copy of the accent-split pattern (homepage, about, partners, privacy, press). AccentSplit extraction follow-up should land soon to avoid this drifting further.

### `[x]` Step 6 — Edition schema cleanups + migration

_Update 2026-06-03: **all of Step 6 shipped.** Substring validation (#3) and the artist reverse-reference view (#5) landed earlier; carousel collapse (#1), `dateTape` typing (#2), and `creditText`→`names[]` (#4) shipped via the zero-downtime expand → migrate → contract pass below (expand `1fb621b`, migration scripts `07accf5`, contract committed alongside this doc update)._

_Decisions locked 2026-06-03 (production data audited first — all four live editions 2022–2025 carry `dateTape`, carousel, and multi-line `creditText`):_
- _**#2 `dateTape` → typed, not free-text.** Split into `dateStart` (date) + `dateEnd` (date, `≥ dateStart`) + `venueLine` (string), all required-when-live. The four stored values have **no consistent format** (`"16–18 April 2022"` vs `"16.04-11.05"`, separator `·` vs `///`), so the migration uses an **explicit per-year map** (not a parser) — deterministic for N=4. The mapper composes these back into the runtime `Edition.dateTape` string, so `Hero.tsx` and the runtime type are unchanged; the renderer/mapper now own a single canonical format (en-GB written month: `16–18 April 2022` same-month, `16 April – 11 May 2024` cross-month) and a single `·` glyph. 2024/2025 visibly switch from `16.04-11.05` to the unified written form — intended normalization._
- _**#4 `creditText` → `names[]`.** Authoring-ergonomics only (the mapper already newline-joins and the renderer splits on `\n`); included in this pass. Migration splits `value` on `\n` into `names`._

**Zero-downtime sequence — applies to all three.** The key property: every change is absorbed by the mapper in `src/sanity/lib/editions.ts`, so the runtime `Edition` type and all renderers stay untouched. Only schema + GROQ query + mapper move.

1. **Commit 1 — Expand (one deploy).** New shape added *alongside* old; query selects both; mapper dual-reads (`slide.layout ?? SLIDE_LAYOUTS[slide._type]`, `dateStart ? format(...) : dateTape`, `names?.length ? names.join('\n') : value`). Site renders correctly whether or not a doc is migrated, so there's no deploy/migrate ordering window — but expand **must** deploy before the migration runs (the scripts patch published docs).
2. **Migrate.** Three idempotent scripts, `raw` perspective (catches drafts), `--dry` then apply. Publishing fires the existing revalidate webhook → affected edition pages re-render automatically.
3. **Commit 2 — Contract (later deploy, batchable).** Drop old fields/types from schema, query, and mapper fallbacks; mark new fields required-when-live. Site is never broken if this slips.

**Shipped.** All three phases ran cleanly with no frontend downtime. The three dry-runs matched the production audit exactly (22 carousel slides, 4 dateTapes, 16 creditText rows; no draft versions); applying them and the contract deploy verified live — 2024/2025 now render `16 April – 11 May …` from the typed fields. A follow-up cleanup (`scripts/sanity-migrate-drop-legacy-edition-fields.ts`) then `unset` the orphaned `dateTape` / `creditText.value` *data* the additive migrations had left behind (20 fields across 4 docs) — the dataset now carries only the new shapes.

The audit surfaced UX issues in the existing edition schema worth fixing before any more editions are authored against it.

**Schema changes:**
1. `[x]` **Shipped.** Collapsed the five `slide*` types into one `carouselSlide` object (`layout` enum + `images` array whose required count is derived from the layout via a custom rule). See [ADR 0010](./adr/0010-collapse-carousel-slide-types.md). `carouselSlide.ts` now exports only `carouselSlide`; `edition.carousel.of` and `schemaTypes/index.ts` register only it. The mapper reads `slide.layout` directly (the legacy `_type`→layout map is gone). _(`carouselImage` was **not** folded into `imageFieldWithAlt` — it's an array member wrapping `{image, caption}`, a different shape; stays as its own follow-up if wanted.)_
2. `[x]` **Shipped.** Typed `dateTape` into `dateStart` (date) + `dateEnd` (date, validated `≥ dateStart`) + `venueLine` (string), all required-when-live. The mapper composes them into the runtime `Edition.dateTape` string with a single canonical en-GB written-month format + `·` glyph; `Hero.tsx` and the `Edition` type are unchanged. The legacy `dateTape` schema field is removed.
3. `[x]` **Shipped 2026-06-03.** Extracted the substring-validation closure into `isSubstringOf(siblingField, siblingLabel)` in `src/sanity/schemaTypes/shared/substringValidator.ts` and applied it to **four** places: homepage hero, `pageHero`, partners CTA, and `edition.themeHighlight` (chained after `requiredWhenLive`). **Divergence from the original plan:** `manifesto.highlight` is intentionally **excluded** — a production check showed the live 2022 edition's highlight (`"it is assumed."`) is appended text, not a substring of its title (`"Perspective is not observed, "`), and the Manifesto renderer supports that (`split()` returns the whole title, then appends the highlight span). A strict substring check there would wrongly flag valid content. The helper's docstring records this.
4. `[x]` **Shipped.** Store credit org lists as arrays, not newline-joined strings. `creditOrgList` (array of organization references) shipped earlier; now `creditText.value` (newline-joined string) is replaced by a `names[]` string array (`required().min(1).unique()`). **Authoring-surface change only** — the mapper joins `names` with `\n` into the runtime `value`, so the renderer and `CreditEntry` type are unaffected. The legacy `value` schema field is removed.
5. `[x]` **Shipped 2026-06-03.** Added an "Editions" document-view tab on `artist` via `S.view.component`. The artist node in `structure.ts` now resolves to `S.document().views([S.view.form(), S.view.component(ArtistEditionsView)…])`. `src/sanity/components/ArtistEditionsView.tsx` queries `*[_type == "edition" && references($id) && !(_id in path("drafts.**"))]`, lists referencing editions year-desc, and links into each via `IntentLink`. Built with `@sanity/ui` primitives (see the `@sanity/ui` note under Cross-cutting follow-ups).

**Migrations** (run *after* Commit 1 deploys; each an idempotent `tsx` script using the `raw` perspective like `sanity-migrate-edition-status-live.ts`; `--dry` first, then apply):
- `[x]` Carousel slide collapse (`scripts/sanity-migrate-carousel-slide.ts`): set each item's `layout` from `_type`, then `_type` → `carouselSlide`. 22 slides across 4 editions.
- `[x]` `dateTape` typing (`scripts/sanity-migrate-datetape.ts`): explicit per-year `{dateStart, dateEnd, venueLine}` map (2022: 04-16→04-18; 2023: 04-18→04-29; 2024: 04-16→05-11; 2025: 04-16→05-11; venueLine "Combinatul Fondului Plastic" for all). Deterministic, no parsing. 4 editions.
- `[x]` `creditText` → array (`scripts/sanity-migrate-credittext-names.ts`): split `value` on `\n` into `names`. 16 rows across 4 editions.
- `[x]` Legacy-field cleanup (`scripts/sanity-migrate-drop-legacy-edition-fields.ts`): after the contract deploy, `unset` the orphaned `dateTape` + `creditText.value` data the additive migrations left behind. 20 fields across 4 editions. Idempotent.
- `[x]` `edition.status` backfill — **done.** All editions carry a status (2022-2025 `live`, 2026 `upcoming`); see the rename note below. The script `scripts/sanity-migrate-edition-status-live.ts` is the published→live value migration (idempotent).

Static `src/data/editions/{2022..2025}.ts` are unaffected (they're the fallback shape, not stored in Sanity).

### `[x]` Status value rename (`published` → `live`)

Not in the original plan — surfaced during the docs audit. The `edition.status` value `published` collided with Sanity's own document publish/draft lifecycle ("a published document that's an upcoming edition" / "publish a release for a published edition" were genuinely ambiguous). Renamed the value to `live`; the field name stays `status`, enum is now `'upcoming' | 'live'`.

**Shipped (`6f9115e`, `b8087bf`):**
- Schema radio value `Published → Live`; `requiredWhenPublished` → `requiredWhenLive` (its `status !== 'published'` check would otherwise have silently stopped enforcing required-when-live validation).
- `EDITION_BY_YEAR_QUERY` gates on `status != "upcoming"` rather than `== "live"`, so the public route never 404s during the value migration — deploy and data migration need no ordering coordination. `upcoming` is the single special-cased value.
- `EditionListItem` union, list mappings (`editions.ts`, `data/editions/index.ts`), and the Footer Explore filter updated. `sanity.types.ts` regenerated.
- Data migrated in `production`: 2022-2025 → `live`, 2026 stays `upcoming` (after the deploy went green).
- Docs updated: `CONTEXT.md` (Edition status), `CLAUDE.md`, [ADR 0008](./adr/0008-derive-edition-listings-from-status.md) (dated update note).

**Lesson:** run `pnpm typegen` as the **last** step after any query edit, before committing — the first push shipped stale types keyed to the old query string and failed `next build` on Vercel.

**Lesson (2026-06-03):** `sanity typegen` formats its emitted `sanity.types.ts` with **Prettier** (hardcoded in the CLI), but this repo formats with **Biome**. So every regen shows a large phantom diff — semicolons + double quotes — even when the types are semantically unchanged. Always follow `pnpm typegen` with `pnpm exec biome format --write sanity.types.ts` (or `pnpm format`); a clean schema change then leaves an empty diff, which doubles as the check that you didn't alter any types.

### `[ ]` Cross-cutting follow-ups

Items that emerged during execution and don't belong to a single step.

**`[x]` Singleton seed script — shipped** as `scripts/sanity-import-singletons.ts` (idempotent; `--dry` preview, `--only <ids>` filter; downloads referenced images from their Blob/`public` URL and re-uploads them as Sanity assets). Covers all seven singletons (siteSettings, homepage, aboutPage, partnersPage, visitPage, pressPage, privacyPage). The per-page `FALLBACK` / `FallbackBody` blocks have since been **removed** — a missing singleton now degrades to empty fields + a local image placeholder rather than carrying hardcoded defaults (see `cms.md` → missing-singleton rendering). Needs `SANITY_API_WRITE_TOKEN`.

**`[x]` Extract `AccentSplit` shared component — shipped.** `src/components/AccentSplit/AccentSplit.tsx` (`text`, `accent`, optional `className`, optional `lineBreak`). Replaced all **six** hand-rolled HeroTitle / CtaHeading helpers (homepage, about, partners ×2, privacy, press). The six reduced to two render modes — inline, and line-break (trims the preceding text + inserts `<br/>`, used by the homepage hero and partners CTA); `className` defaults to `shared.accent` and the partners CTA passes its own. No behaviour change.

**`[x]` Filter `homepage.heroCtaEdition` reference picker to live editions — shipped.** Added `options: { filter: 'status == "live"' }` to the reference field so the hero CTA can't point at an upcoming edition (whose `/editions/YYYY` route is a hard 404). _(Deliberately **not** applied to `pressRelease.edition` — see Step 5 — because releases only render a year label, never a link to the edition page.)_

**`[x]` Extract image-with-required-alt schema helper — shipped 2026-06-03.** `imageFieldWithAlt(opts)` in `src/sanity/schemaTypes/shared/imageFieldWithAlt.ts` (opts: `name`, `title`, `description?`, `altDescription?`, `altNoun?` for the exact required-message wording, `hotspot?`, `group?`, `validation?` passthrough for the outer presence rule). Applied to the **8** clean sites: `edition.heroImage` / `thumbImage` / `pressKit.poster` / `pressKit.coverPhoto`, `artist.portrait`, `organization.logo`, `heroSlide.image`, `aboutPage.placeImage` + `curatorPortrait`, `partnersPage.eventImage` + `whyImage`, `visitPage.image`. Per-site alt wording preserved via `altNoun`, so no editor-visible change — `pnpm typegen` produced a byte-identical `sanity.types.ts`. **`carouselImage` deliberately left out** — it lives inside `carouselSlide` and will be folded in during the carousel-collapse migration (#1).

**`@sanity/ui` is now a direct dependency (`^3.2.0`).** Added 2026-06-03 for `ArtistEditionsView` (#5). Sanity's docs make `@sanity/ui` the canonical toolkit for custom Studio components (every Studio/form-component example imports from it; it inherits the Studio theme — dark/light, tokens, focus rings, a11y — for free). Pinned to dedupe with the copy `sanity@5.28.0` already pulls (`^3.1.14`), so there's a **single** physical `@sanity/ui@3.2.0` and one theme context — two copies would render components outside the Studio `ThemeProvider` and silently break styling. Convention going forward: any new custom Studio input/preview/tool imports from `@sanity/ui`. (Schema `prepare()` previews and `@sanity/icons` icons are default Sanity UI and stay as-is.)

**`[x]` Editor first-time-setup checklist — shipped** in `cms.md` (§ Singleton pattern → First-time setup). Ordered singleton seeding (Site settings first, since the footer + partners CTA read `siteSettings.contactEmail`), the automated vs manual paths, and the upcoming→live edition convention. _(Loose end: `scripts/sanity-import-singletons.ts`'s docstring still says it builds docs from in-page `FALLBACK` constants, which were since removed — the script now carries the content itself. Worth a docstring fix next time that file is touched.)_

### `[ ]` Follow-up — `typegen --watch` script

Add `pnpm typegen:watch` running `sanity typegen --watch` so `sanity.types.ts` regenerates as queries/schemas change. Optionally combine with `pnpm dev` via `concurrently`. **Needs `package.json` change → user approval.**

## Tracking

Active tasks live in the local task tracker (`TaskList`). Map between this doc and tasks:

| Doc step | Task # |
|---|---|
| Step 1 (shipped) | #5 |
| Step 1.5 (shipped) | #11 |
| Step 2 (shipped) | #6 |
| Step 3 (shipped) | #7 |
| Step 4 (shipped) | #8 |
| Step 5 (shipped) | #9 |
| Step 6 (shipped) | #10 |
| Singleton seed script (shipped) | #13 |
| typegen watch | #12 |

`HeroTitle` extraction, image-with-alt helper, and editor first-time-setup checklist don't have their own tasks — they're cleanup/docs that land alongside step 5/6 or the seed-script PR, whichever happens first.
