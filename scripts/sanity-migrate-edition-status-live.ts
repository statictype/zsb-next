/** Usage: pnpm exec tsx scripts/sanity-migrate-edition-status-live.ts [--dry]. */

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
