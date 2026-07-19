/**
 * Type the free-text `edition.dateTape` into `dateStart` / `dateEnd` /
 * `venueLine` (Step 6 #2).
 *
 * The four live editions' `dateTape` strings have no consistent format
 * ("16–18 April 2022" vs "16.04-11.05", separator "·" vs "///"), so instead of
 * parsing we apply an explicit per-year map — deterministic for this fixed set.
 * The legacy `dateTape` value is left in place (the schema field is removed in
 * the contract phase); the runtime composes the hero string from the typed
 * fields, falling back to `dateTape` until then.
 *
 * Run order: AFTER the expand commit is deployed. No frontend downtime — the
 * mapper prefers the typed fields when present and falls back otherwise.
 *
 * Idempotent: only patches editions in the map that don't yet have `dateStart`.
 * `raw` perspective catches published docs and any `drafts.` versions (each
 * keyed by its own `year`).
 *
 * Usage:
 *   pnpm exec tsx scripts/sanity-migrate-datetape.ts        # apply
 *   pnpm exec tsx scripts/sanity-migrate-datetape.ts --dry  # preview
 */

import '@scripts/_load-env'

import { createClient } from '@sanity/client'

const VENUE = 'Combinatul Fondului Plastic'

// Explicit per-year map (ISO YYYY-MM-DD). Source: the existing dateTape values.
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
  // Only editions in the map that haven't been typed yet.
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
