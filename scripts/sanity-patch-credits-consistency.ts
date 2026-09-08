/**
 * Credit-ledger corrections, in one pass:
 *
 * 1. "Under the Aegis of" — the edition page used to hard-code an #ISDay row in
 *    `Credits.tsx`, which duplicated the row 2021 already carried in the CMS.
 *    The component now renders credits only; this adds the missing row to every
 *    edition that lacks it, typed so it lands in the team block.
 * 2. Rosters the CMS had dropped, from the editions' own press releases.
 * 3. Names spelled two ways across editions are canonicalised to one spelling.
 * 4. `organization.kind` backfilled — galleries are credited by name, not logo.
 * 5. The Sculpture Branch logo alt repeated another organization's alt ("UAPR").
 *
 * Idempotent: each step targets only documents that still need it.
 *
 * Usage:
 *   pnpm exec tsx scripts/sanity-patch-credits-consistency.ts --dry
 *   pnpm exec tsx scripts/sanity-patch-credits-consistency.ts
 */

import '@scripts/_load-env'

import { createClient } from '@sanity/client'

const AEGIS_ORG = 'org-international-sculpture-day-isday'
const AEGIS_CENTER = 'org-international-sculpture-center'
const AEGIS_LABEL = 'Under the Aegis of'
const AEGIS_KEY = 'credit-aegis'

// The aegis credit reads as a role, not a partnership: `secondary` is what puts
// a row in the team block, where it is credited by name rather than by logo.
const AEGIS_TYPE = 'secondary'

const GALLERY_ORGS = [
  'org-galeria-senat',
  'org-the-institute',
  'org-galeria-iomo',
  'org-unagaleria',
  'org-gallery-studio-76',
]

const SCHOOL_ORGS = ['org-tonitza-high-school', 'org-paciurea-high-school']
const SCHOOL_ROW_BY_YEAR: Record<number, string> = {
  2021: 'Partners',
  2022: 'Partners',
  2023: 'Cultural Partners',
  2024: 'Cultural Partners',
  2025: 'Cultural Partners',
}

const NAME_FIXES: Record<string, string> = {
  'Aurora Carstea': 'Aurora Cârstea',
  'Horatiu Lipot': 'Horațiu Lipot',
}

const ORG_NAME_FIXES: Record<string, string> = {
  'org-ferma-de-arta': 'Ferma de Artă',
}

// Rosters taken from the edition's own press release, where the CMS list had
// dropped a partner.
const REQUIRED_MEMBERS: { year?: number; label: string; orgIds: string[] }[] = [
  { label: AEGIS_LABEL, orgIds: [AEGIS_ORG] },
  { year: 2024, label: 'Cultural Partners', orgIds: ['org-doi-joi', 'org-sl-jazzing'] },
]

const SCULPTURE_BRANCH_ALT = 'Uniunea Artiștilor Plastici din România'

interface CreditRow {
  _key: string
  _type: string
  type?: string
  label?: string
  names?: string[]
  orgIds?: string[]
}

interface EditionDoc {
  _id: string
  year?: number
  credits?: CreditRow[]
}

function orgRef(orgId: string) {
  return { _key: orgId.replace(/^org-/, 'ref-'), _type: 'reference', _ref: orgId }
}

function orgListRow(key: string, label: string, type: string, orgIds: string[]) {
  return {
    _key: key,
    _type: 'creditOrgList',
    type,
    label,
    organizations: orgIds.map(orgRef),
  }
}

function aegisRow() {
  return orgListRow(AEGIS_KEY, AEGIS_LABEL, AEGIS_TYPE, [AEGIS_ORG])
}

function fixNames(names: string[]): string[] | null {
  const fixed = names.map((n) => NAME_FIXES[n] ?? n)
  return fixed.some((n, i) => n !== names[i]) ? fixed : null
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

  const editions = await client.fetch<EditionDoc[]>(
    `*[_type == "edition"] | order(year asc){
      _id, year, credits[]{ _key, _type, type, label, names, "orgIds": organizations[]._ref }
    }`,
  )

  type Transaction = ReturnType<typeof client.transaction>
  const plan: { describe: string; apply: (tx: Transaction) => Transaction }[] = []

  for (const edition of editions) {
    const rows = edition.credits ?? []
    const label = `ZSB ${edition.year ?? '?'}`

    if (!rows.some((r) => r.orgIds?.includes(AEGIS_ORG))) {
      const firstPartner = rows.find((r) => r.type === 'partner')
      const position = firstPartner ? 'before' : 'after'
      const at = firstPartner ? `credits[_key=="${firstPartner._key}"]` : 'credits[-1]'
      plan.push({
        describe: `${label}: insert "${AEGIS_LABEL}" ${firstPartner ? `before "${firstPartner.label ?? '?'}"` : 'at the end'}`,
        apply: (tx) =>
          tx.patch(edition._id, (p) =>
            p.setIfMissing({ credits: [] }).insert(position, at, [aegisRow()]),
          ),
      })
    }

    for (const row of rows) {
      const fixed = row.names ? fixNames(row.names) : null
      if (!fixed) continue
      plan.push({
        describe: `${label}: "${row.label ?? '?'}" → [${fixed.join(', ')}]`,
        apply: (tx) =>
          tx.patch(edition._id, (p) => p.set({ [`credits[_key=="${row._key}"].names`]: fixed })),
      })
    }

    for (const rule of REQUIRED_MEMBERS) {
      if (rule.year !== undefined && rule.year !== edition.year) continue
      const row = rows.find((r) => r.label === rule.label)
      if (!row) continue
      const missing = rule.orgIds.filter((id) => !row.orgIds?.includes(id))
      if (missing.length === 0) continue
      plan.push({
        describe: `${label}: "${rule.label}" += ${missing.join(', ')}`,
        apply: (tx) =>
          tx.patch(edition._id, (p) =>
            p.insert(
              'after',
              `credits[_key=="${row._key}"].organizations[-1]`,
              missing.map(orgRef),
            ),
          ),
      })
    }

    const aegis = rows.find((r) => r.label === AEGIS_LABEL)
    if (aegis && aegis.type !== AEGIS_TYPE) {
      plan.push({
        describe: `${label}: "${AEGIS_LABEL}" type "${aegis.type ?? '?'}" → "${AEGIS_TYPE}"`,
        apply: (tx) =>
          tx.patch(edition._id, (p) =>
            p.set({ [`credits[_key=="${aegis._key}"].type`]: AEGIS_TYPE }),
          ),
      })
    }
    if (aegis?.orgIds?.includes(AEGIS_CENTER)) {
      plan.push({
        describe: `${label}: "${AEGIS_LABEL}" -= ${AEGIS_CENTER}`,
        apply: (tx) =>
          tx.patch(edition._id, (p) =>
            p.unset([`credits[_key=="${aegis._key}"].organizations[_ref=="${AEGIS_CENTER}"]`]),
          ),
      })
    }

    const schoolLabel = edition.year ? SCHOOL_ROW_BY_YEAR[edition.year] : undefined
    if (schoolLabel) {
      const row = rows.find((r) => r.label === schoolLabel)
      const missing = SCHOOL_ORGS.filter(
        (id) => !rows.some((r) => r.type === 'partner' && r.orgIds?.includes(id)),
      )
      if (missing.length > 0) {
        plan.push({
          describe: `${label}: "${schoolLabel}"${row ? '' : ' (new row)'} += ${missing.join(', ')}`,
          apply: (tx) =>
            tx.patch(edition._id, (p) =>
              row
                ? p.insert(
                    'after',
                    `credits[_key=="${row._key}"].organizations[-1]`,
                    missing.map(orgRef),
                  )
                : p.insert('after', 'credits[-1]', [
                    orgListRow('credit-partners', schoolLabel, 'partner', missing),
                  ]),
            ),
        })
      }
    }
  }

  const orgKinds = await client.fetch<{ _id: string; kind?: string }[]>(
    `*[_type == "organization"] | order(_id asc){ _id, kind }`,
  )
  for (const org of orgKinds) {
    const wanted = GALLERY_ORGS.includes(org._id) ? 'gallery' : 'institution'
    if (org.kind === wanted) continue
    plan.push({
      describe: `Organization ${org._id}: kind "${org.kind ?? ''}" → "${wanted}"`,
      apply: (tx) => tx.patch(org._id, (p) => p.set({ kind: wanted })),
    })
  }

  const orgNames = await client.fetch<{ _id: string; name?: string }[]>(
    `*[_id in $ids]{ _id, name }`,
    { ids: Object.keys(ORG_NAME_FIXES) },
  )
  for (const org of orgNames) {
    const fixed = ORG_NAME_FIXES[org._id]
    if (!fixed || org.name === fixed) continue
    plan.push({
      describe: `Organization ${org._id}: "${org.name ?? ''}" → "${fixed}"`,
      apply: (tx) => tx.patch(org._id, (p) => p.set({ name: fixed })),
    })
  }

  const branchAlt = await client.fetch<string | null>(
    `*[_id == "org-sculpture-branch"][0].logo.alt`,
  )
  if (branchAlt !== SCULPTURE_BRANCH_ALT) {
    plan.push({
      describe: `Sculpture Branch: logo alt "${branchAlt ?? ''}" → "${SCULPTURE_BRANCH_ALT}"`,
      apply: (tx) =>
        tx.patch('org-sculpture-branch', (p) => p.set({ 'logo.alt': SCULPTURE_BRANCH_ALT })),
    })
  }

  if (plan.length === 0) {
    console.log('Nothing to patch.')
    return
  }
  for (const step of plan) console.log(`  ${step.describe}`)

  if (dryRun) {
    console.log(`\n(dry run — no writes. ${plan.length} patch(es).)`)
    return
  }

  let tx = client.transaction()
  for (const step of plan) tx = step.apply(tx)
  await tx.commit()
  console.log(`\n✓ Applied ${plan.length} patch(es).`)
}

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
