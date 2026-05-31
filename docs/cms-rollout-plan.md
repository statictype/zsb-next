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
| 6 | Editions list derivation | Derive from `edition.status: upcoming \| published`, not an explicit array on the homepage doc | [ADR 0008](./adr/0008-derive-edition-listings-from-status.md) |

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
- `edition.status: 'upcoming' | 'published'` (radio, `initialValue: 'upcoming'`, required). Existing edition docs in Sanity (2022-2025) will need status set on first edit — a one-shot migration to set `'published'` on all existing docs is scoped to step 6 (where the other edition migrations live).
- `HOMEPAGE_QUERY` + `EDITIONS_LIST_QUERY` in `src/sanity/lib/queries.ts`. `getHomepage(options)` fetcher in `src/sanity/lib/homepage.ts`; `getEditionsListFromSanity(options)` + `getEditionListItems(options)` merge helpers in `src/sanity/lib/editions.ts` / `src/data/editions/index.ts`. Static fallback editions are always `'published'` (the page exists).
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

### `[ ]` Step 5 — Press: `pressAppearance`, `pressRelease`, `edition.pressKit`

- **`pressAppearance` doc:** `type` enum (youtube / vimeo / soundcloud / article / tv) — drives the icon, same fixed-enum pattern as `visitPage.amenities`; `title`, `year`, `tag`, `url`, optional `excerpt`. Listed in `Press` group in structure tree.
- **`pressRelease` doc:** `edition` reference, `language` (EN / RO), `title`, `pdf` (Sanity file asset), `pages` (number), `size` (string, editor-authored — Sanity file metadata doesn't reliably carry size). Same `Press` group.
- **`edition.pressKit` object:** `poster` image, `coverPhoto` image. Sits inside the existing Edition document — additive, no migration needed.
- **Queries:** `PRESS_APPEARANCES_QUERY`, `PRESS_RELEASES_QUERY` (with edition year de-referenced), and `EDITIONS_PRESS_KIT_QUERY` aggregating all editions that have a `pressKit`.
- **Wires:** `src/app/(site)/press/page.tsx` switches from `PRESS_APPEARANCES` / `PRESS_RELEASES` / `MEDIA_KIT` (deletable from `src/data/`) to the new queries via the 3-layer pattern. Per-row icon rendering moves to a renderer-side enum→component map (mirrors VisitSection's `ICONS` map).

### `[ ]` Step 6 — Edition schema cleanups + migration

The audit surfaced UX issues in the existing edition schema worth fixing before any more editions are authored against it. Step 3 added `edition.status` without backfilling existing docs — that backfill happens here.

**Schema changes:**
1. Collapse the five `slide*` document types (`slideFull`, `slideDuo`, `slideFeaturedPortrait`, `slideTrio`, `slideFeaturedStack`) into one `carouselSlide` object with a `layout` enum + length-validated images. See [ADR 0010](./adr/0010-collapse-carousel-slide-types.md).
2. Split `dateTape` ("16.04-11.05 · Combinatul Fondului Plastic") into structured `{start, end, venueLine}`. Renderer handles the bullet glyph.
3. Validate that `themeHighlight ⊂ theme` and `manifesto.highlight ⊂ manifesto.title` (currently editors can drift silently). Extract the substring-validation closure into a shared `substringValidator(parentFieldName)` helper in `src/sanity/schemaTypes/shared/` since this pattern is now in **five** places (homepage hero, `pageHero`, partners CTA, plus the two edition fields above). Apply the helper to all five.
4. Store credit org lists as arrays, not newline-joined strings. Renderer decides the separator.
5. Add reverse-reference view on `artist` documents → which editions they appeared in (via `S.view.component` or `referencingDocuments`).

**Migrations** (one `sanity migration run` per change, dry-run first, then `--no-dry-run`):
- Carousel slide collapse: walk every `edition.carousel[]`, derive `layout` from `_type`, rename `_type` to `carouselSlide`.
- `dateTape` split: parse the existing string into `{start, end, venueLine}`. May need a manual review pass for atypical formats.
- `edition.status` backfill: set `status: 'published'` on every edition doc that doesn't have a status yet. Clears the step-3 follow-up where editors otherwise see a validation prompt on first edit of an existing doc.

Static `src/data/editions/{2022..2025}.ts` are unaffected (they're the fallback shape, not stored in Sanity).

### `[ ]` Cross-cutting follow-ups

Items that emerged during execution and don't belong to a single step.

**`[ ]` Singleton seed script.** Six singletons now exist (siteSettings, homepage, aboutPage, partnersPage, visitPage, privacyPage) and none auto-create. On a fresh dataset, each page renders fallback values until the editor publishes the corresponding singleton. A `pnpm exec tsx scripts/seed-singletons.ts` script that creates each with the current hardcoded fallback values would close this gap once and for all — and would let us delete the per-page `FALLBACK` blocks afterwards. Needs `SANITY_API_WRITE_TOKEN`.

**`[ ]` Extract `HeroTitle` shared component.** The "split a title on its accent substring, render the accent in a span" logic is now duplicated in `src/app/(site)/page.tsx`, `about/page.tsx`, `partners/page.tsx`, `privacy/page.tsx`. One `<HeroTitle title accent>` component would cover all four. Trivial refactor, no behaviour change.

**`[ ]` Extract image-with-required-alt schema helper.** The pattern `image + alt field with conditional-required validation` is repeated in ~10 schema files (`edition.heroImage`, `edition.thumbImage`, `artist.portrait`, `organization.logo`, `carouselImage`, `heroSlide.image`, `aboutPage.placeImage` + `curatorPortrait`, `partnersPage.eventImage` + `whyImage`, `visitPage.image`). A `imageFieldWithAlt(opts)` helper in `src/sanity/schemaTypes/shared/` would deduplicate it. Pure DX, no editor-visible change.

**`[ ]` Editor first-time-setup checklist** in `cms.md`. Six singletons to publish in order (settings → homepage → about → partners → visit → privacy), plus the upcoming-edition convention. A short ordered list in the docs would beat reverse-engineering it from the rollout plan. Could ship alongside the seed script (the script's docstring + the checklist link to each other).

### `[ ]` Follow-up — `typegen --watch` script

Add `pnpm typegen:watch` running `sanity typegen --watch` so `sanity.types.ts` regenerates as queries/schemas change. Optionally combine with `pnpm dev` via `concurrently`. **Needs `package.json` change → user approval.**

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
| Step 5 | #9 |
| Step 6 | #10 |
| Singleton seed script | #13 |
| typegen watch | #12 |

`HeroTitle` extraction, image-with-alt helper, and editor first-time-setup checklist don't have their own tasks — they're cleanup/docs that land alongside step 5/6 or the seed-script PR, whichever happens first.
