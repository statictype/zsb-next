# SEO / AEO improvement plan

Tracking doc for the search-optimization audit and follow-up work. Born from an
audit on 2026-06-04. Update the status column as items land.

**Verdict from the audit:** the site was already in strong SEO shape — clean
metadata inheritance, per-page canonicals, dynamic sitemap + robots, stega
stripping before `<head>`/JSON-LD, one semantic `<h1>` per page, `next/image`
throughout, and real structured data (Organization, WebSite, Event,
BreadcrumbList, ItemList). The items below are refinements, grouped by impact.

Status legend: ✅ done · 🟡 partial · ⬜ not started · ⏸ deferred

---

## Tier 1 — Concrete SEO fixes ✅ done

| # | Item | Status | Commit |
|---|------|--------|--------|
| 1 | **Sitemap `lastModified`** — was `new Date()` on every request (a false freshness signal Google learns to distrust). Now emits real per-entry dates: each edition's Sanity `_updatedAt`, each page singleton's `_updatedAt`, newest artist for `/artists`; static 2021 uses a frozen constant; unknown dates omitted rather than faked. | ✅ | `33b97e5` |
| 3 | **Event JSON-LD enrichment** — `editionEventJsonLd` now emits `startDate`/`endDate` (effectively required for Google Event rich results), `image`, canonical `url`, `eventStatus`, and the real venue as the `Place`. Raw ISO dates + `venueLine` are kept on the `Edition` type (previously folded into the display `dateTape` and dropped). | ✅ | `0a05d96` |
| 2 | **Default social image** — grew into the full system below. | ✅ | `187ebe1`, `c61b606` |

### Open Graph image system (delivered as part of Tier 1 #2)

A branded, editor-controllable share-image system:

- **Default card** (`src/app/opengraph-image.tsx`) — generated via `next/og`
  with the ZSB logo + Dela Gothic One wordmark on the brand palette, 1200×630.
  At the app root so the homepage can override it without a same-segment
  collision.
- **Per-edition card** (`src/app/(site)/editions/[year]/opengraph-image.tsx`)
  — hero photo cropped to 1200×630 with a gradient scrim, white logo, year,
  theme (Dela Gothic), and dates. Fixed the previous 2:1 untagged hero.
- **Editor override** — optional "Custom share image" field on all six page
  singletons and editions (`ogImageField` helper, in a "Social" field group).
  When set it wins (cropped to 1200×630); otherwise the branded fallback
  applies. Static pages resolve it in `generateMetadata`; editions resolve it
  inside the image route (single source, no duplication).
- Fonts/logo load via `new URL(..., import.meta.url)` so Turbopack traces only
  those assets (a bare `process.cwd()` path traced the whole project).

Verified on the dev server: one `og:image` per page, overrides win, editions
keep their hero, all 1200×630. Production build clean.

---

## Tier 2 — AEO & content modeling 🟡 (#4, #5 done · #6 deferred)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 5 | **Editable SEO copy in CMS** | ✅ `3f21e00` | Both axes now editor-controlled. **Share image:** the OG system above. **Meta descriptions:** a `metaDescription` field (`metaDescriptionField` helper, soft 160-char warning). On the **six page singletons** it is **required** and the CMS is now the sole source — the old hardcoded strings were backfilled into Sanity (`scripts/sanity-backfill-meta-descriptions.ts`) and removed from the page files; `pageMetadata` just takes the final string (`page.metaDescription ?? SITE_DESCRIPTION`, the latter a single global safety net for a missing doc). On **editions** it stays an **optional override** — the default there is the manifesto truncation (a live derivation, not a stale string), so it's left as a fallback in `editionMetadata`. The two static index pages (`/artists`, `/editions`) have no singleton, so their descriptions necessarily stay code-sourced. |
| 4 | **Visit page → FAQ + `FAQPage` JSON-LD** (the highest-value AEO move) | ✅ `3f21e00` | Hybrid source (see resolved decision below): the opening-hours and location Q&As are **derived** from the existing `hoursLines`/`street`/`city` fields at render time — single source, can't drift, scoped to "during the event" so event hours aren't mistaken for the venue's year-round schedule. A new optional `faq[]` array (`faqItem` object) on `visitPage` holds **editorial** Q&As the fields can't answer (tickets, accessibility, the year-round venue). Both feed one visible `VisitFaq` section (question-shaped headings) and one `visitFaqJsonLd` (`FAQPage`). *Note: Google restricted FAQ rich results to gov/health sites in 2023, so this is an **AEO** play (ChatGPT / Perplexity / AI Overviews parse the visible Q&A + JSON-LD), not a Google rich-snippet one.* |
| 6 | **Artist entity pages** (`/artists/[slug]`) | ⏸ deferred | The plumbing exists (`ARTIST_BY_SLUG_QUERY` + `artist.slug`), but the artist documents aren't authored yet — bios, portraits, disciplines, and external links are mostly empty. Shipping the route now would produce **thin/empty pages**, which is worse than no page: search engines treat low-content entity pages as doorway/thin content and can discount them (and the crawl budget they consume). **Re-open when** artist docs carry enough substance to stand alone (at minimum a real `shortBio` + `portrait`, ideally works/links) — then it becomes strong long-tail, entity-rich content (schema.org `Person`/`VisualArtist`) that also justifies adding artists to the sitemap. |

### Open decisions (resolved)

1. ~~**Visit FAQ source** — derive vs explicit Q&A fields?~~ **Resolved: hybrid.**
   Derive the facts already modeled as fields (hours, location) so they can't
   drift; add an optional `faq[]` array only for what the fields can't express.
   The venue (Combinatul Fondului Plastic) is the **main** venue, not the whole
   event — ZSB also runs at partner venues and public locations across the city,
   and CFP itself is a year-round complex of galleries + studios. CFP is
   deliberately **not** modeled as its own entity (out of scope; not our data to
   own). Practical info stays event-scoped; the year-round + multi-site framing
   lives in editorial `faq[]` entries. (Tier 2 #4 above.)
2. ~~**Meta descriptions** — make them editor-editable in Sanity?~~ **Resolved,
   then taken further:** the `metaDescription` field is now **required** on the
   six singletons with the CMS as the **sole** source (backfilled + code
   defaults removed), and an **optional** manifesto-fallback override on
   editions. (Tier 2 #5 above.)

---

## Drift watch & follow-ups (surfaced shipping Tier 2)

New work this push moved real copy into Sanity, which creates editor-owned
surfaces that can silently go wrong, plus a few accuracy gaps worth a later fix.

### Follow-ups

| Item | Notes |
|------|-------|
| ✅ **Multi-site Event JSON-LD** | **Done.** `editionEventJsonLd` now emits one `Place` per distinct venue `group` (deduped, first-appearance order) instead of a single `Place` from `venueLine` — reflecting that ZSB is multi-site (main venue + partner venues + public locations). `group` is the place-level label that the edition page's "Locations" accordion already renders as headers, so the JSON-LD mirrors the visible content. One location → a single `Place` object; multiple → an array (both valid schema.org, degrades for first-only consumers). Falls back to `venueLine`, then `"Bucharest"`, when `venues` is empty. Real output: 2025/2024 → 3 places, 2022 → 2, 2023 → 1. Per-venue street addresses aren't modeled, so each `Place` keeps the Bucharest/RO locality. |
| **Static index pages can't be edited** | `/artists` and `/editions` descriptions are code-only (no singleton behind them). If editors should own them, model each as a small singleton (`artistsPage` / `editionsPage`) + add `metaDescriptionField`. |
| **Editions meta description stays optional** | Future editions fall back to the truncated manifesto, which can cut mid-thought or be weak for search. Revisit making it `requiredWhenLive` (so `upcoming` drafts still save) + backfill the existing editions if hand-written descriptions become worth enforcing. |
| **Stale hosted schema manifest** | The MCP-validated content tools (`patch_document_from_json`) reject writes because the deployed schema manifest predates recent fields (no `ogImage`, no `faqItem`). Content writes went through `@sanity/client` scripts instead. A `deploy_schema` (via the normal deploy pipeline) realigns it. |

### Drift risks (now editor-owned)

- **Derived FAQ assumes `hoursLines` = event hours.** The "These hours apply
  during the event" scoping is hardcoded in `buildFaq`. If an editor ever puts
  *year-round* hours in `hoursLines`, the scoping line becomes wrong.
- **Derived FAQ prose joins fields.** Hours/location answers `join()` the raw
  field strings; unusual `hoursLines` entries can read awkwardly in prose. The
  question strings + multi-site boilerplate ("partner venues and public
  locations across Bucharest") live in code (`buildFaq`), not the CMS — changing
  that framing is a code change.
- **`SITE_DESCRIPTION` vs homepage `metaDescription`.** Independent now (code
  fallback vs CMS value). Currently aligned; they can diverge — `SITE_DESCRIPTION`
  is only the missing-doc safety net, so divergence is low-impact but real.
- **Seed scripts are one-shot.** `sanity-patch-visit-faq.ts` and
  `sanity-backfill-meta-descriptions.ts` are idempotent but `--force` clobbers
  editor edits. Once editors own this copy in Studio, do **not** re-run with
  `--force`.
- **New singleton page types** must add `metaDescriptionField({ required: true })`
  + backfill the value, or publishing is blocked by the required-field error.

---

## Tier 3 — Polish 🟡 (keywords + robots done)

| Item | Notes |
|------|-------|
| **Web manifest + `apple-icon`** | Better mobile "add to home screen" and richer mobile share UI. |
| ✅ **Drop the dead `keywords` meta** | **Done.** Removed from `layout.tsx` and `editionMetadata`; Google has ignored it since 2009. |
| ✅ **`robots` → disallow `/api/`** | **Done.** `disallow` is now `['/studio/', '/api/']`. The allow-all AI-crawler stance elsewhere stays intentional (more crawl access → more AEO citations). |
| **LQIP blur on hero/carousel/edition-card images** | `EDITIONS_PRESS_KIT_QUERY` already fetches `metadata.lqip`, but the most-viewed images (hero, carousel, edition cards) don't — adding it improves perceived LCP/CLS, which feeds Core Web Vitals. |

---

## Not pursued (conscious non-goals)

- **hreflang / i18n** — the site is intentionally single-language (`en`).
- **Blocking AI crawlers** — left allow-all on purpose to maximize AEO
  citations; revisit if content strategy changes.
