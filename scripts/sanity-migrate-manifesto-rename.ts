/**
 * Expand step of the about-page "manifesto" rename (was the "Not a festival"
 * section).
 *
 * Copies the legacy `notFestivalTitle` / `notFestivalBody[]` values onto the new
 * single-paragraph `manifestoTitle` / `manifestoBody` fields, WITHOUT removing
 * the old ones. Run this BEFORE the renamed schema/query deploys, so the live
 * (old) frontend keeps reading `notFestival*` through the deploy window —
 * zero-downtime expand/contract. The contract step
 * (sanity-migrate-drop-notfestival-fields.ts) unsets the legacy fields once the
 * new code is live.
 *
 * The body is now a single paragraph: the live doc holds a one-entry array, so
 * we take `notFestivalBody[0]`. Idempotent: only patches docs missing a new
 * field. `raw` perspective catches the published doc and any `drafts.` version.
 *
 * Usage:
 *   pnpm exec tsx scripts/sanity-migrate-manifesto-rename.ts --dry
 *   pnpm exec tsx scripts/sanity-migrate-manifesto-rename.ts
 */

import '@scripts/_load-env'

import { createClient } from '@sanity/client'

interface AboutDoc {
  _id: string
  notFestivalTitle?: string
  notFestivalBody?: string[]
  manifestoTitle?: string
  manifestoBody?: string
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
    `*[_type == "aboutPage"]{
      _id, notFestivalTitle, notFestivalBody, manifestoTitle, manifestoBody
    }`,
  )

  const plan = docs
    .map((d) => {
      // GROQ projects missing fields as `null` (not `undefined`), so test
      // nullish — only copy when the new field is empty and the old one exists.
      const set: Record<string, string> = {}
      if (d.manifestoTitle == null && d.notFestivalTitle != null) {
        set.manifestoTitle = d.notFestivalTitle
      }
      if (d.manifestoBody == null && d.notFestivalBody?.[0] != null) {
        set.manifestoBody = d.notFestivalBody[0]
      }
      return { doc: d, set }
    })
    .filter(({ set }) => Object.keys(set).length > 0)

  console.log(`${docs.length} aboutPage document(s); ${plan.length} to expand.`)
  if (!plan.length) {
    console.log('Nothing to expand — new fields already set.')
    return
  }

  if (dryRun) {
    for (const { doc, set } of plan) {
      console.log(`  [${doc._id}]`)
      for (const [k, v] of Object.entries(set)) {
        console.log(`    set ${k} = ${JSON.stringify(v.slice(0, 60))}${v.length > 60 ? '…' : ''}`)
      }
    }
    console.log(`\n(dry run — no writes. ${plan.length} doc(s).)`)
    return
  }

  let tx = client.transaction()
  for (const { doc, set } of plan) {
    tx = tx.patch(doc._id, (p) => p.set(set))
  }
  await tx.commit()
  console.log(`✓ Expanded ${plan.length} aboutPage document(s) onto manifesto* fields.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
