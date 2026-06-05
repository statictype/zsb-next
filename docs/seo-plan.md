# SEO / AEO improvement plan

Tracking doc for the search-optimization audit and follow-up work. Born from an
audit on 2026-06-04. Update the status column as items land.

**Verdict from the audit:** the site was already in strong SEO shape — clean
metadata inheritance, per-page canonicals, dynamic sitemap + robots, stega
stripping before `<head>`/JSON-LD, one semantic `<h1>` per page, `next/image`
throughout, and real structured data (Organization, WebSite, Event,
BreadcrumbList, ItemList). The items below are refinements, grouped by impact.

Status legend: ✅ done · 🟡 partial · ⬜ not started

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

## Tier 2 — AEO & content modeling 🟡 partial

| # | Item | Status | Notes |
|---|------|--------|-------|
| 5 | **Editable SEO copy in CMS** | ✅ | Both axes now editor-controlled. **Share image:** the OG system above. **Meta descriptions:** a `metaDescription` field (`metaDescriptionField` helper, soft 160-char warning). On the **six page singletons** it is **required** and the CMS is now the sole source — the old hardcoded strings were backfilled into Sanity (`scripts/sanity-backfill-meta-descriptions.ts`) and removed from the page files; `pageMetadata` just takes the final string (`page.metaDescription ?? SITE_DESCRIPTION`, the latter a single global safety net for a missing doc). On **editions** it stays an **optional override** — the default there is the manifesto truncation (a live derivation, not a stale string), so it's left as a fallback in `editionMetadata`. The two static index pages (`/artists`, `/editions`) have no singleton, so their descriptions necessarily stay code-sourced. |
| 4 | **Visit page → FAQ + `FAQPage` JSON-LD** (the highest-value AEO move) | ✅ | Hybrid source (see resolved decision below): the opening-hours and location Q&As are **derived** from the existing `hoursLines`/`street`/`city` fields at render time — single source, can't drift, scoped to "during the event" so event hours aren't mistaken for the venue's year-round schedule. A new optional `faq[]` array (`faqItem` object) on `visitPage` holds **editorial** Q&As the fields can't answer (tickets, accessibility, the year-round venue). Both feed one visible `VisitFaq` section (question-shaped headings) and one `visitFaqJsonLd` (`FAQPage`). *Note: Google restricted FAQ rich results to gov/health sites in 2023, so this is an **AEO** play (ChatGPT / Perplexity / AI Overviews parse the visible Q&A + JSON-LD), not a Google rich-snippet one.* |
| 6 | **Artist entity pages** (`/artists/[slug]`) | ⬜ | `ARTIST_BY_SLUG_QUERY` + `artist.slug` already exist but no route consumes them. Per-artist pages (schema.org `Person`/`VisualArtist`) are strong long-tail, entity-rich content and would justify adding artists to the sitemap. A feature, not a fix. |

### Open decisions (resolved)

1. ~~**Visit FAQ source** — derive vs explicit Q&A fields?~~ **Resolved: hybrid.**
   Derive the facts already modeled as fields (hours, location) so they can't
   drift; add an optional `faq[]` array only for what the fields can't express.
   The venue (Combinatul Fondului Plastic) is a year-round complex of galleries
   + studios — deliberately **not** modeled as its own entity (out of scope;
   not our data to own). Practical info stays event-scoped; the year-round
   acknowledgment lives in an editorial `faq[]` entry. (Tier 2 #4 above.)
2. ~~**Meta descriptions** — make them editor-editable in Sanity?~~ **Resolved:**
   added the optional `metaDescription` field across all six page singletons +
   editions, resolved with the hardcoded defaults as fallback (Tier 2 #5 above).

---

## Tier 3 — Polish ⬜ not started

| Item | Notes |
|------|-------|
| **Web manifest + `apple-icon`** | Better mobile "add to home screen" and richer mobile share UI. |
| **Drop the dead `keywords` meta** | In `layout.tsx` and `editionMetadata`; Google has ignored it since 2009. Harmless but dead weight. |
| **`robots` → disallow `/api/`** | Conventionally excluded; currently only `/studio/` is. The allow-all AI-crawler stance is intentional (more crawl access → more AEO citations). |
| **LQIP blur on hero/carousel/edition-card images** | `EDITIONS_PRESS_KIT_QUERY` already fetches `metadata.lqip`, but the most-viewed images (hero, carousel, edition cards) don't — adding it improves perceived LCP/CLS, which feeds Core Web Vitals. |

---

## Not pursued (conscious non-goals)

- **hreflang / i18n** — the site is intentionally single-language (`en`).
- **Blocking AI crawlers** — left allow-all on purpose to maximize AEO
  citations; revisit if content strategy changes.
