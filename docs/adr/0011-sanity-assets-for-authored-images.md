# Authored images are Sanity assets

Images authored in the Studio are stored as **Sanity assets** and served from Sanity's image CDN (`cdn.sanity.io`) via `urlFor()` in `src/sanity/lib/image.ts`. This is the single image path: every edition (hero, carousel), the homepage slideshow, and the about/partners/visit images render this way. The runtime shape is `{ src, alt }`. Putting an image field in a Sanity schema means editor uploads land in Sanity's asset store, with hotspot/crop and asset metadata for free.

A missing CMS image (only possible on an un-seeded dataset, since the singleton image fields are `required()`) falls back to a neutral **local** placeholder — `src/lib/placeholder.ts` → `public/img/placeholder.jpg` — generated at build-from-SVG via `sharp`, served through `next/image` without enabling `dangerouslyAllowSVG`.

`next.config.ts` whitelists `cdn.sanity.io` in `remotePatterns`.

Considered alternatives:

- **Reference externally-hosted image originals from Sanity instead of uploading.** Fights the grain of the Studio (image fields want assets), loses hotspot/crop and asset metadata, and gives editors no upload UX. Rejected.
