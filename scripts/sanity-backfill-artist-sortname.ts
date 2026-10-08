/** Usage: pnpm exec tsx scripts/sanity-backfill-artist-sortname.ts [--dry]. */

import '@scripts/_load-env'

import { createClient } from '@sanity/client'
import { surnameSortKey } from '@/lib/format-utils'

interface ArtistDoc {
  _id: string
  name?: string
  sortName?: string
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
  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

  const artists = await client.fetch<ArtistDoc[]>(`*[_type == "artist"]{ _id, name, sortName }`)
  console.log(`Fetched ${artists.length} artist document(s).`)

  const targets = artists.filter((a) => a.name && !a.sortName)
  const skipped = artists.length - targets.length
  console.log(`${targets.length} need a sortName; ${skipped} skipped (already set or no name).`)
  if (!targets.length) {
    console.log('Nothing to backfill.')
    return
  }

  if (dryRun) {
    for (const a of targets) {
      console.log(`  ${a.name}  →  sortName "${surnameSortKey(a.name!)}"  [${a._id}]`)
    }
    console.log(`\n(dry run — no writes. ${targets.length} would be patched.)`)
    return
  }

  let tx = client.transaction()
  for (const a of targets) {
    tx = tx.patch(a._id, (p) => p.set({ sortName: surnameSortKey(a.name!) }))
  }
  await tx.commit()
  console.log(`✓ Patched ${targets.length} artist document(s).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
