/**
 * Rename the `edition.status` value "published" → "live".
 *
 * Why: "published" collided with Sanity's own document publish/draft state
 * (a published document could still be an "upcoming" edition). The schema now
 * offers `upcoming | live`; this migrates the stored value on existing docs so
 * the Studio radio shows a valid selection and the required-when-live
 * validation keeps working.
 *
 * Frontend safety: the public edition route matches `status != "upcoming"`
 * (not `== "live"`), so editions stay reachable before, during, and after this
 * migration — there is no deploy/migrate ordering window. This patch is purely
 * for Studio correctness and stored-value hygiene.
 *
 * Idempotent: only targets docs still on "published", so re-runs are no-ops.
 * Uses the `raw` perspective so both published docs and any drafts are caught.
 *
 * Usage:
 *   pnpm exec tsx scripts/sanity-migrate-edition-status-live.ts        # apply
 *   pnpm exec tsx scripts/sanity-migrate-edition-status-live.ts --dry  # preview
 */

import '@scripts/_load-env'

import { createClient } from '@sanity/client'

interface EditionDoc {
  _id: string
  year?: number
  status?: string
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

  // `raw` perspective catches published docs and any "drafts." versions.
  const targets = await client.fetch<EditionDoc[]>(
    `*[_type == "edition" && status == "published"]{ _id, year, status }`,
  )
  console.log(`${targets.length} edition document(s) still on "published".`)
  if (!targets.length) {
    console.log('Nothing to migrate.')
    return
  }

  if (dryRun) {
    for (const e of targets) {
      console.log(`  ZSB ${e.year ?? '?'}  →  status "live"  [${e._id}]`)
    }
    console.log(`\n(dry run — no writes. ${targets.length} would be patched.)`)
    return
  }

  let tx = client.transaction()
  for (const e of targets) {
    tx = tx.patch(e._id, (p) => p.set({ status: 'live' }))
  }
  await tx.commit()
  console.log(`✓ Patched ${targets.length} edition document(s) to status "live".`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
