# Sanity Studio is embedded in the Next.js app

The Studio lives inside this Next.js app at `/studio` (route `src/app/studio/[[...tool]]/page.tsx`), with `sanity.config.ts` and `sanity.cli.ts` at the repo root and schema/queries under `src/sanity/`. The same Vercel project deploys both the public site and the Studio.

The site has one frontend, one maintainer, and one deploy target. In a headless CMS the schema is tightly coupled to the components that read it — every field exists because some component wants to query it. Physical separation doesn't decouple them logically; it just makes drift more likely. Embedded lets a single PR land the schema change, the GROQ query, and the component that consumes them atomically, with one TypeGen pipeline emitting `sanity.types.ts` next to the code that uses it.

Considered alternatives:

- **Standalone Studio in a sibling folder.** Two deploys, two CORS surfaces, two `.env` files for a project that ships from one repo. The only thing it buys over embedded is the ability to deploy Studio independently of the site, which has no concrete use case here. Skipped.
- **Monorepo (`apps/web` + `apps/studio` with pnpm workspaces).** Reasonable when a second frontend is plausibly coming (mobile app, partner microsite) or when content authors need a release cadence independent of the web team. Neither applies to ZSB today. Cost is real: workspace restructuring, cross-package TypeGen config, and a schema-vs-frontend drift window every time the two are deployed out of sync. Skipped — convertible later if a second frontend ever appears, since the schema is portable.
- **Studio bundle cost on the public site.** Not a real concern — `/studio` is a route-isolated chunk that Next.js code-splits; it doesn't ship in the homepage bundle.

Reversibility: moderate. The schema files in `src/sanity/schemaTypes/` are the source of truth and move cleanly to any layout; the work is in restructuring the repo (extracting an `apps/studio` workspace, wiring CORS, splitting env vars and deploys) rather than rewriting content or schema.
