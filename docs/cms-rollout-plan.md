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

### `[ ]` Step 1.5 — Live preview wiring (blocked on package upgrade)

Click-to-edit overlays + real-time draft preview on the public site. Held out of step 1 because `next-sanity` v12.4.5 has rough edges with `cacheComponents: true`; v13 (May 2026) ships first-class support and clean draft-mode interop.

**Needs user approval** (per project memory: don't patch `package.json` unilaterally).

**Scope:**
1. Bump `next-sanity` 12.4.5 → 13.x. Apply migration: rename `tag` → `requestTag`, drop removed `<SanityLive>` props (`refreshOnFocus`, `refreshOnReconnect`, `refreshOnMount`, `fetchOptions`, `stega`), rename type exports.
2. Create `app/(site)/` route group. Move every content route into it: `page.tsx`, `about/`, `artists/`, `editions/`, `partners/`, `press/`, `privacy/`, `visit/`, `error.tsx`. (Route groups don't affect URLs.)
3. `app/(site)/layout.tsx` mounts `<Footer />`, `<CookieBanner />`, `<JsonLd />`, `<SanityLive />`, conditional `<VisualEditing />` + `<DisableDraftMode />`. Strip those from `app/layout.tsx`.
4. Switch `src/sanity/lib/editions.ts` from raw `client.fetch` to `sanityFetch` + `cacheLife('hours')` (or `'max'` with tag-based revalidation).
5. Sanity webhook → `/api/revalidate/tag` for on-demand revalidation.

**Why not now:** v12 can't satisfy both static prerender (the journal entry `static-prerender-via-segment-layouts.md` is explicit about this) AND live drafts without compromises. v13 resolves the tension.

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
| Step 1.5 | #11 |
| Step 2 | #6 |
| Step 3 | #7 |
| Step 4 | #8 |
| Step 5 | #9 |
| Step 6 | #10 |
| typegen watch | #12 |
