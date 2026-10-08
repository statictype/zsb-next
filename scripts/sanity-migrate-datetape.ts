/** Usage: pnpm exec tsx scripts/sanity-migrate-datetape.ts [--dry]. */

import '@scripts/_load-env'

import { createClient } from '@sanity/client'

const VENUE = 'Combinatul Fondului Plastic'

const DATE_MAP: Record<number, { dateStart: string; dateEnd: string; venueLine: string }> = {
  2022: { dateStart: '2022-04-16', dateEnd: '2022-04-18', venueLine: VENUE },
  2023: { dateStart: '2023-04-18', dateEnd: '2023-04-29', venueLine: VENUE },
  2024: { dateStart: '2024-04-16', dateEnd: '2024-05-11', venueLine: VENUE },
  2025: { dateStart: '2025-04-16', dateEnd: '2025-05-11', venueLine: VENUE },
}

interface EditionDoc {
  _id: string
  year?: number
  dateStart?: string
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

  const years = Object.keys(DATE_MAP).map(Number)
  const targets = await client.fetch<EditionDoc[]>(
    `*[_type == "edition" && year in $years && !defined(dateStart)]{ _id, year, dateStart }`,
    { years },
  )

  console.log(`${targets.length} edition document(s) to type.`)
  if (!targets.length) {
    console.log('Nothing to migrate.')
    return
  }

  if (dryRun) {
    for (const e of targets) {
      const m = e.year ? DATE_MAP[e.year] : undefined
      if (!m) {
        console.log(`  ZSB ${e.year ?? '?'}  [${e._id}]  — no map entry, SKIPPED`)
        continue
      }
      console.log(`  ZSB ${e.year}  →  ${m.dateStart} … ${m.dateEnd} · ${m.venueLine}  [${e._id}]`)
    }
    console.log(`\n(dry run — no writes. ${targets.length} would be patched.)`)
    return
  }

  let tx = client.transaction()
  let count = 0
  for (const e of targets) {
    const m = e.year ? DATE_MAP[e.year] : undefined
    if (!m) continue
    tx = tx.patch(e._id, (p) => p.set(m))
    count++
  }
  await tx.commit()
  console.log(`✓ Typed ${count} edition document(s).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
