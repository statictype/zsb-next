/**
 * Contract step of the about-page "manifesto" rename.
 *
 * Unsets the legacy `notFestivalTitle` / `notFestivalBody` fields once the
 * renamed schema/query is live and the expand step
 * (sanity-migrate-manifesto-rename.ts) has copied their values onto
 * `manifestoTitle` / `manifestoBody`. Run this AFTER the new code is deployed —
 * until then, the old fields are the live frontend's source, so dropping them
 * early would blank the About page.
 *
 * Idempotent: only targets docs that still carry a legacy field. `raw`
 * perspective catches the published doc and any `drafts.` version.
 *
 * Usage:
 *   pnpm exec tsx scripts/sanity-migrate-drop-notfestival-fields.ts --dry
 *   pnpm exec tsx scripts/sanity-migrate-drop-notfestival-fields.ts
 */

import '@scripts/_load-env'

import { createClient } from '@sanity/client'

interface AboutDoc {
  _id: string
  notFestivalTitle?: string
  notFestivalBody?: string[]
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

  const docs = await client.fetch<AboutDoc[]>(
    `*[_type == "aboutPage" && (defined(notFestivalTitle) || defined(notFestivalBody))]{
      _id, notFestivalTitle, notFestivalBody
    }`,
  )

  const plan = docs.map((d) => {
    // GROQ projects missing fields as `null` (not `undefined`) — test nullish.
    const paths: string[] = []
    if (d.notFestivalTitle != null) paths.push('notFestivalTitle')
    if (d.notFestivalBody != null) paths.push('notFestivalBody')
    return { doc: d, paths }
  })
  const totalPaths = plan.reduce((n, p) => n + p.paths.length, 0)

  console.log(`${docs.length} aboutPage document(s) with ${totalPaths} legacy field(s) to unset.`)
  if (!totalPaths) {
    console.log('Nothing to clean up.')
    return
  }

  if (dryRun) {
    for (const { doc, paths } of plan) {
      console.log(`  [${doc._id}]`)
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
  console.log(`✓ Unset ${totalPaths} legacy field(s) across ${docs.length} aboutPage document(s).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
