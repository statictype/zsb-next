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
- **Visual Editing of editions** — depends on `next-sanity` v13 upgrade (step 1.5).

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

### `[ ]` Step 2 — `siteSettings` singleton + footer

Smallest singleton, validates the pattern end-to-end before applying it to bigger schemas.

**Schema fields:** contact email, social links (Instagram, Facebook), footer "Explore" + "Connect" labels (link sources stay derived), legal/tagline strings.

**Wires:** `src/components/Footer/Footer.tsx` reads from Sanity instead of hard-coded `EXPLORE_LINKS` / `CONNECT_LINKS` / `SOCIAL_LINKS`.

**Adds:** `siteSettings` to `SINGLETON_TYPES`, appears in structure tree above the Editions divider.

### `[ ]` Step 3 — `homepage` singleton + `edition.status` field

**Schema fields:** hero H1 + lead + CTA (reference to edition), slideshow images array (image + `position: top | center | bottom`), editions intro paragraph.

**Edition change:** add `status: 'upcoming' | 'published'` (radio, default `'published'`). Powers the "Coming soon" badge on the homepage editions list and the footer "Explore" links.

**Wires:** `src/app/page.tsx` reads homepage doc; editions list derived from `*[_type=="edition"] | order(year desc)` with `status` controlling the rendered row.

### `[ ]` Step 4 — `aboutPage`, `partnersPage`, `visitPage`, `privacyPage`

Four singletons in one step (same shape, no inter-dependencies).

- **`aboutPage`**: hero copy, "Not a festival" paragraph array, `pillar` objects (label + body), curator letter (paragraph array + portrait + name + role).
- **`partnersPage`**: hero copy, event paragraph (with optional stat overrides for "X editions, Y artists, Z works, W visitors" — defaults derived), `whySculpturePoint` objects, hero image, CTA email.
- **`visitPage`**: venue (name, street, city, mapsUrl), opening hours, `transport` array (from, lines, walk), `amenity` array (icon + label), image.
- **`privacyPage`**: hero copy, body as **Portable Text** (the exception — see [ADR 0007](./adr/0007-plain-paragraphs-over-portable-text.md)), last-updated date.

### `[ ]` Step 5 — Press: `pressAppearance`, `pressRelease`, `edition.pressKit`

- **`pressAppearance` doc:** type enum (youtube / vimeo / soundcloud / article / tv), title, year, tag, url, optional excerpt.
- **`pressRelease` doc:** edition reference, language (EN / RO), title, PDF asset, pages, size.
- **`edition.pressKit` object:** poster image, exhibition cover image. Press page aggregates posters + covers across all editions.

**Wires:** `src/app/press/page.tsx` swaps `PRESS_APPEARANCES` / `PRESS_RELEASES` / `MEDIA_KIT` for Sanity queries.

### `[ ]` Step 6 — Edition schema cleanups + migration

The audit surfaced UX issues in the existing edition schema worth fixing before any more editions are authored against it.

**Changes:**
1. Collapse the five `slide*` document types (`slideFull`, `slideDuo`, `slideFeaturedPortrait`, `slideTrio`, `slideFeaturedStack`) into one `carouselSlide` object with a `layout` enum + length-validated images. See [ADR 0010](./adr/0010-collapse-carousel-slide-types.md).
2. Split `dateTape` ("16.04-11.05 · Combinatul Fondului Plastic") into structured `{start, end, venueLine}`. Renderer handles the bullet glyph.
3. Validate that `themeHighlight ⊂ theme` and `manifesto.highlight ⊂ manifesto.title` (currently editors can drift silently).
4. Store credit org lists as arrays, not newline-joined strings. Renderer decides the separator.
5. Add reverse-reference view on `artist` documents → which editions they appeared in (via `S.view.component` or `referencingDocuments`).

**Migration:** one `sanity migration run` script per change. Drafts first, dry-run, then `--no-dry-run`. Static `src/data/editions/{2022..2025}.ts` are unaffected (they're the fallback).

### `[ ]` Follow-up — `typegen --watch` script

Add `pnpm typegen:watch` running `sanity typegen --watch` so `sanity.types.ts` regenerates as queries/schemas change. Optionally combine with `pnpm dev` via `concurrently`. **Needs `package.json` change → user approval.**

## Tracking

Active tasks live in the local task tracker (`TaskList`). Map between this doc and tasks:

| Doc step | Task # |
|---|---|
| Step 1 (shipped) | #5 |
| Step 1.5 (shipped) | #11 |
| Step 2 | #6 |
| Step 3 | #7 |
| Step 4 | #8 |
| Step 5 | #9 |
| Step 6 | #10 |
| typegen watch | #12 |
