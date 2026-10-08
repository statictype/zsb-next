/** Usage: pnpm exec tsx scripts/sanity-patch-credits-blocks.ts [--dry]. */

import '@scripts/_load-env'

import { createClient } from '@sanity/client'

const MUNICIPALITY_ID = 'org-municipality-of-bucharest'
const MUNICIPALITY_NAME = 'Municipality of Bucharest'
const MUNICIPALITY_SLUG = 'municipality-of-bucharest'
const MINISTRY_ID = 'org-ministry-of-culture'

const BRANCH_ID = 'org-sculpture-branch'

const AEGIS_LABEL = 'Under the Aegis of'
const ORGANIZER_LABEL = 'Organizer'

const YEARS_WITHOUT_PARTNERS = [2021]

interface Reference {
  _ref?: string
}

interface CreditRow {
  _key: string
  _type: string
  type?: string
  lead?: boolean
  label?: string
  names?: string[]
  organization?: Reference
}

interface EditionDoc {
  _id: string
  year?: number
  credits?: CreditRow[]
}

function isMunicipalityText(row: CreditRow): boolean {
  return row._type === 'creditText' && (row.names ?? []).includes(MUNICIPALITY_NAME)
}

function moveAegisAfterOrganizer(rows: CreditRow[]): CreditRow[] {
  const aegisIndex = rows.findIndex((row) => row.label === AEGIS_LABEL)
  const organizerIndex = rows.findIndex((row) => row.label === ORGANIZER_LABEL)
  if (aegisIndex < 0 || organizerIndex < 0 || aegisIndex === organizerIndex + 1) return rows
  const rest = rows.filter((_, i) => i !== aegisIndex)
  const target = rest.findIndex((row) => row.label === ORGANIZER_LABEL) + 1
  return [...rest.slice(0, target), rows[aegisIndex] as CreditRow, ...rest.slice(target)]
}

function rewrite(rows: CreditRow[], year?: number): CreditRow[] {
  const kept =
    year !== undefined && YEARS_WITHOUT_PARTNERS.includes(year)
      ? rows.filter((row) => row.type !== 'partner')
      : rows
  return moveAegisAfterOrganizer(kept).map((row) => {
    if (isMunicipalityText(row)) {
      const { names, ...rest } = row
      return {
        ...rest,
        _type: 'creditOrg',
        type: 'partner',
        lead: true,
        organization: { _type: 'reference', _ref: MUNICIPALITY_ID },
      }
    }
    const ref = row.organization?._ref
    if (row._type === 'creditOrg' && (ref === MINISTRY_ID || ref === MUNICIPALITY_ID)) {
      return { ...row, type: 'partner', lead: true }
    }
    return row
  })
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

  const steps: string[] = []
  let tx = client.transaction()

  const municipality = await client.fetch<string | null>(`*[_id == $id][0]._id`, {
    id: MUNICIPALITY_ID,
  })
  if (!municipality) {
    steps.push(`create organization ${MUNICIPALITY_ID} "${MUNICIPALITY_NAME}"`)
    tx = tx.create({
      _id: MUNICIPALITY_ID,
      _type: 'organization',
      name: MUNICIPALITY_NAME,
      slug: { _type: 'slug', current: MUNICIPALITY_SLUG },
      kind: 'institution',
    })
  }

  const branchLogo = await client.fetch<unknown>(`*[_id == $id][0].logo`, { id: BRANCH_ID })
  if (branchLogo) {
    steps.push(`unset ${BRANCH_ID} logo`)
    tx = tx.patch(BRANCH_ID, (p) => p.unset(['logo']))
  }

  const editions = await client.fetch<EditionDoc[]>(
    `*[_type == "edition"] | order(year asc){ _id, year, credits }`,
  )

  for (const edition of editions) {
    const rows = edition.credits ?? []
    const next = rewrite(rows, edition.year)
    if (JSON.stringify(next) === JSON.stringify(rows)) continue
    const year = `ZSB ${edition.year ?? '?'}`
    for (const row of next) {
      const before = rows.find((r) => r._key === row._key)
      if (!before || JSON.stringify(row) === JSON.stringify(before)) continue
      steps.push(`${year}: "${row.label ?? '?'}" → ${row._type} / ${row.type}`)
    }
    const order = next.map((r) => r.label ?? '?').join(' · ')
    if (order !== rows.map((r) => r.label ?? '?').join(' · ')) {
      steps.push(`${year}: order → ${order}`)
    }
    tx = tx.patch(edition._id, (p) => p.set({ credits: next }))
  }

  if (steps.length === 0) {
    console.log('Nothing to patch.')
    return
  }
  for (const step of steps) console.log(`  ${step}`)

  if (dryRun) {
    console.log(`\n(dry run — no writes. ${steps.length} change(s).)`)
    return
  }
  await tx.commit()
  console.log(`\n✓ Applied ${steps.length} change(s).`)
}

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
