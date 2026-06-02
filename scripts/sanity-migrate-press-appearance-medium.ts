/**
 * One-off migration: rename pressAppearance.type → pressAppearance.medium.
 *
 * Old enum mixed platform (youtube/vimeo/soundcloud) with medium
 * (article/tv); see ADR or commit history for the split. This script:
 *   - Finds pressAppearance docs that still carry the old `type` field
 *     and have no `medium` set
 *   - Sets medium from a fixed mapping (audio/video/article)
 *   - Unsets `type`
 *
 * Idempotent: docs that already have `medium` set are skipped.
 *
 * Usage:
 *   pnpm exec tsx scripts/sanity-migrate-press-appearance-medium.ts          # apply
 *   pnpm exec tsx scripts/sanity-migrate-press-appearance-medium.ts --dry    # preview
 */

import './_load-env'

import { createClient } from '@sanity/client'

type OldType = 'youtube' | 'vimeo' | 'soundcloud' | 'article' | 'tv'
type NewMedium = 'article' | 'video' | 'audio'

const MAPPING: Record<OldType, NewMedium> = {
  youtube: 'video',
  vimeo: 'video',
  soundcloud: 'audio',
  article: 'article',
  tv: 'video',
}

interface Row {
  _id: string
  title: string
  type: OldType
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

  const rows = await client.fetch<Row[]>(
    `*[_type == "pressAppearance" && defined(type) && !defined(medium)]{ _id, title, type }`,
  )
  if (!rows.length) {
    console.log('Nothing to migrate.')
    return
  }
  console.log(`Will migrate ${rows.length} doc(s):`)
  for (const r of rows) console.log(`  • ${r._id} (${r.type} → ${MAPPING[r.type]}) — ${r.title}`)

  if (dryRun) {
    console.log('(dry run — no writes)')
    return
  }

  for (const r of rows) {
    const medium = MAPPING[r.type]
    if (!medium) {
      console.log(`  ⚠ skipping ${r._id}: no mapping for type "${r.type}"`)
      continue
    }
    await client.patch(r._id).set({ medium }).unset(['type']).commit()
    console.log(`  ✓ ${r._id} — medium=${medium}, type unset`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
