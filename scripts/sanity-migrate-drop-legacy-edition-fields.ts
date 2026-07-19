/**
 * Drop the orphaned legacy fields left behind by the Step 6 migrations:
 * `edition.dateTape` and `edition.credits[_type == "creditText"].value`.
 *
 * Those fields were superseded by `dateStart`/`dateEnd`/`venueLine` and
 * `names[]` respectively. The earlier migrations only *added* the new fields
 * (keeping the old values as a rollback safety net); the contract commit
 * removed them from the schema and queries. This script unsets the now-unused
 * stored values so raw queries / dataset exports don't carry stale duplicates.
 *
 * Safe to run any time after the contract deploy — the frontend reads none of
 * these fields. Idempotent: only targets docs that still carry a legacy value.
 * `raw` perspective catches published docs and any `drafts.` versions.
 *
 * Usage:
 *   pnpm exec tsx scripts/sanity-migrate-drop-legacy-edition-fields.ts        # apply
 *   pnpm exec tsx scripts/sanity-migrate-drop-legacy-edition-fields.ts --dry  # preview
 */

import '@scripts/_load-env'

import { createClient } from '@sanity/client'

interface CreditRow {
  _key: string
  _type: string
  value?: string
}
interface EditionDoc {
  _id: string
  year?: number
  dateTape?: string
  credits?: CreditRow[]
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
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    perspective: 'raw',
  })

  const docs = await client.fetch<EditionDoc[]>(
    `*[_type == "edition" && (defined(dateTape) || count(credits[_type == "creditText" && defined(value)]) > 0)]{
      _id, year, dateTape, credits[]{ _key, _type, value }
    }`,
  )

  const plan = docs.map((e) => {
    const paths: string[] = []
    if (e.dateTape !== undefined) paths.push('dateTape')
    for (const r of e.credits ?? []) {
      if (r._type === 'creditText' && r.value !== undefined) {
        paths.push(`credits[_key=="${r._key}"].value`)
      }
    }
    return { doc: e, paths }
  })
  const totalPaths = plan.reduce((n, p) => n + p.paths.length, 0)

  console.log(`${docs.length} edition document(s) with ${totalPaths} legacy field(s) to unset.`)
  if (!totalPaths) {
    console.log('Nothing to clean up.')
    return
  }

  if (dryRun) {
    for (const { doc, paths } of plan) {
      console.log(`  ZSB ${doc.year ?? '?'}  [${doc._id}]`)
      for (const p of paths) console.log(`    unset ${p}`)
    }
    console.log(`\n(dry run — no writes. ${totalPaths} field(s) across ${docs.length} doc(s).)`)
    return
  }

  let tx = client.transaction()
  for (const { doc, paths } of plan) {
    if (paths.length) tx = tx.patch(doc._id, (p) => p.unset(paths))
  }
  await tx.commit()
  console.log(`✓ Unset ${totalPaths} legacy field(s) across ${docs.length} edition document(s).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
