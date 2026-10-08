/** Usage: pnpm exec tsx scripts/sanity-migrate-credittext-names.ts [--dry]. */

import '@scripts/_load-env'

import { createClient } from '@sanity/client'

interface CreditRow {
  _key: string
  _type: string
  label?: string
  value?: string
  names?: string[]
}
interface EditionDoc {
  _id: string
  year?: number
  credits?: CreditRow[]
}

function splitNames(value: string): string[] {
  return value
    .split('\n')
    .map((n) => n.trim())
    .filter(Boolean)
}

function needsMigration(row: CreditRow): boolean {
  if (row._type !== 'creditText') return false
  const hasNames = Array.isArray(row.names) && row.names.some((n) => n?.trim())
  return !hasNames && Boolean(row.value?.trim())
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
    `*[_type == "edition" && count(credits[_type == "creditText"]) > 0]{
      _id, year, credits[]{ _key, _type, label, value, names }
    }`,
  )

  const editsByDoc = docs
    .map((e) => ({ doc: e, rows: (e.credits ?? []).filter(needsMigration) }))
    .filter((e) => e.rows.length > 0)
  const totalRows = editsByDoc.reduce((n, e) => n + e.rows.length, 0)

  console.log(
    `${editsByDoc.length} edition document(s) with ${totalRows} creditText row(s) to migrate.`,
  )
  if (!totalRows) {
    console.log('Nothing to migrate.')
    return
  }

  if (dryRun) {
    for (const { doc, rows } of editsByDoc) {
      console.log(`  ZSB ${doc.year ?? '?'}  [${doc._id}]`)
      for (const r of rows) {
        console.log(`    "${r.label ?? '?'}"  →  [${splitNames(r.value ?? '').join(', ')}]`)
      }
    }
    console.log(`\n(dry run — no writes. ${totalRows} row(s) across ${editsByDoc.length} doc(s).)`)
    return
  }

  let tx = client.transaction()
  for (const { doc, rows } of editsByDoc) {
    for (const r of rows) {
      const names = splitNames(r.value ?? '')
      tx = tx.patch(doc._id, (p) => p.set({ [`credits[_key=="${r._key}"].names`]: names }))
    }
  }
  await tx.commit()
  console.log(
    `✓ Migrated ${totalRows} creditText row(s) across ${editsByDoc.length} edition document(s).`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
