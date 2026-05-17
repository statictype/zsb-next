# Vercel Blob for image originals; Next image optimizer for delivery

Image originals live in Vercel Blob (paths like `YYYY/<basename>.{jpg,png}`) and are served via Next.js's built-in image optimizer, which handles resizing, AVIF/WebP negotiation, and edge caching on demand. The runtime image shape is just `{ src, alt }` where `src` is a full Blob URL built by `blobUrl()` in `src/lib/blob.ts`.

Considered alternatives:

- **Cloudinary / imgix / similar CDN.** Adds a vendor and a billing dimension for a feature Vercel already provides as part of the platform we deploy on. Skipped.
- **Commit originals to the repo (`public/img/`).** Was the previous setup. Originals are large (multi-MB), make the repo heavy to clone and slow to deploy, and force a commit cycle for every image swap. Migrated off (`pnpm exec tsx scripts/blob-upload.ts`).
- **Self-host on the Next.js server.** Same delivery story but loses Blob's separation between content and code, and adds storage/backup concerns.

This is moderately reversible (the abstraction is `blobUrl()` in `src/lib/blob.ts` — swap that and the remote-patterns whitelist in `next.config.ts`), but the integration is platform-coupled enough to be worth recording.
