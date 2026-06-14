# Sanity assets for authored images; Vercel Blob retained for the static edition and fallbacks

Amends [ADR 0005](./0005-vercel-blob-for-image-originals.md).

> **Amended by [ADR 0018](./0018-2021-as-normal-edition-optional-program.md).** 2021 was migrated into Sanity (ZSB-20); its hero is now a Sanity asset, so **no** live page serves Blob in normal operation. Blob remains only the upload source for the `sanity-*` migration scripts. The "permanently-static 2021" notes below are historical.

Images authored in the Studio are stored as **Sanity assets** and served from Sanity's image CDN (`cdn.sanity.io`) via `urlFor()` in `src/sanity/lib/image.ts`. This is the primary image path: every published edition (hero, carousel), the homepage slideshow, and the about/partners/visit images render this way. The runtime shape stays `{ src, alt }`.

This shift happened implicitly during the CMS migration — putting an image field in a Sanity schema means editor uploads land in Sanity's asset store, not in Vercel Blob. ADR 0005 predates that and described Blob as *the* image system; this ADR records the actual current state.

**Vercel Blob (ADR 0005) is retained, with a shrunken footprint:**

- The permanently-static **2021** edition (`src/data/editions/2021.ts`) renders its images via `blobUrl()` — the one live page that still serves Blob in normal operation.
- The `sanity-*` migration / seed scripts read from Blob and upload into Sanity assets.

A missing CMS image (only possible on an un-seeded dataset, since the singleton image fields are `required()`) falls back to a neutral **local** placeholder — `src/lib/placeholder.ts` → `public/img/placeholder.jpg` — generated at build-from-SVG via `sharp`, served through `next/image` without enabling `dangerouslyAllowSVG`. Not Blob.

`next.config.ts` whitelists both `cdn.sanity.io` and `*.public.blob.vercel-storage.com` in `remotePatterns` for this reason.

Considered alternatives:

- **Migrate 2021 + fallbacks off Blob too, then remove Blob entirely.** Since done in part: 2021 was migrated into Sanity ([ADR 0018](./0018-2021-as-normal-edition-optional-program.md)) and the per-page `FALLBACK` constants are gone — a missing *page* singleton now 404s and a missing *image* uses a local placeholder, neither needing Blob. Blob remains only as the `sanity-*` migration upload source; not worth the churn to delete a small, working dependency.
- **Keep authoring images in Blob and only reference them from Sanity.** Fights the grain of the Studio (image fields want assets), loses hotspot/crop and asset metadata, and gives editors no upload UX. Rejected.

Reversibility: the two paths are isolated behind `urlFor()` (Sanity) and `blobUrl()` (Blob), so either can be swapped or retired independently.
