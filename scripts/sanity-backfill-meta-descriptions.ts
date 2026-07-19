/**
 * Backfill `metaDescription` on the page singletons with the descriptions that
 * used to be hardcoded in the page files. After this runs, the CMS is the sole
 * source of those descriptions (the field is required in the schema and the
 * code defaults are removed).
 *
 * Editions are intentionally NOT included — their description derives from the
 * manifesto at render time, which stays accurate, so `metaDescription` remains
 * an optional override there.
 *
 * Idempotent: skips a singleton that already has `metaDescription` set
 * (re-run with --force to overwrite).
 *
 * Usage:
 *   pnpm exec tsx scripts/sanity-backfill-meta-descriptions.ts          # apply
 *   pnpm exec tsx scripts/sanity-backfill-meta-descriptions.ts --dry    # preview
 *   pnpm exec tsx scripts/sanity-backfill-meta-descriptions.ts --force  # overwrite
 */

import '@scripts/_load-env'

import { createClient } from '@sanity/client'

// The canonical meta description for each page singleton. Mostly the strings
// previously hardcoded in the page files; homepage was rewritten to drop the
// inaccurate "open-air museum / transforming the city" claim (the work is
// largely indoor).
const DESCRIPTIONS: Record<string, string> = {
  homepage:
    'Bucharest Sculpture Days is Romania’s annual contemporary sculpture event — discover editions, artists, and exhibitions across Bucharest since 2021.',
  aboutPage:
    'Bucharest Sculpture Days — an annual platform for Romanian contemporary sculpture, born online in 2021.',
  visitPage:
    'Plan your visit to Bucharest Sculpture Days at Combinatul Fondului Plastic — address, hours, transport, and amenities.',
  partnersPage:
    'Partner with Bucharest Sculpture Days — Romania’s annual platform for contemporary sculpture.',
  pressPage:
    'Press kit, official posters, releases, and media coverage for Bucharest Sculpture Days — across every edition.',
  privacyPage: 'How Bucharest Sculpture Days handles your data and which cookies we use.',
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!projectId || !dataset || !apiVersion || !token) {
    throw new Error(
      'Missing env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, NEXT_PUBLIC_SANITY_API_VERSION, SANITY_API_WRITE_TOKEN',
    )
  }

  const dryRun = process.argv.includes('--dry')
  const force = process.argv.includes('--force')
  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

  const existing = await client.fetch<Array<{ _id: string; metaDescription: string | null }>>(
    '*[_id in $ids]{ _id, metaDescription }',
    { ids: Object.keys(DESCRIPTIONS) },
  )
  const hasValue = new Map(existing.map((d) => [d._id, Boolean(d.metaDescription)]))

  for (const [id, description] of Object.entries(DESCRIPTIONS)) {
    if (hasValue.get(id) && !force) {
      console.log(`– ${id}: already set, skipping`)
      continue
    }
    if (dryRun) {
      console.log(`(dry) ${id} ← "${description.slice(0, 60)}…" (${description.length} chars)`)
      continue
    }
    await client.patch(id).set({ metaDescription: description }).commit()
    console.log(`✓ ${id} set (${description.length} chars)`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
