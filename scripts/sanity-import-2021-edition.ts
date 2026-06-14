/**
 * Import the inaugural 2021 edition into Sanity, retiring the last static edition
 * file (ZSB-20, ADR 0018). 2021 is the online-only year: no program, no venues,
 * no carousel — modelled as an ordinary `edition` with `hasProgram: false`. Its
 * off-site photo gallery link stays a static constant in code, not a field.
 *
 * What it does:
 *   1. Resolves the 90 artist references by name (all already exist as docs).
 *   2. Uploads the 2021 hero from Vercel Blob into a Sanity image asset.
 *   3. Builds credits against the existing organization docs.
 *   4. Creates the published `edition-2021` document (status live).
 *   5. Backfills `hasProgram: true` on every other edition (setIfMissing) so the
 *      new conditional `hidden` doesn't hide their events from editors.
 *
 * Idempotent: stable `_id` of `edition-2021`; re-runs skip creation. The backfill
 * uses setIfMissing, so it never clobbers an editor's choice.
 *
 * Usage:
 *   pnpm exec tsx scripts/sanity-import-2021-edition.ts          # apply
 *   pnpm exec tsx scripts/sanity-import-2021-edition.ts --dry    # preview, no writes
 */

import { createClient } from '@sanity/client'

if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile('.env.local')
  } catch {
    // .env.local is optional
  }
}

const dryRun = process.argv.includes('--dry')

const EDITION_ID = 'edition-2021'

// Source: master spreadsheet, 2021 column (was src/data/editions/2021.ts). Two
// names were normalized there to match later columns: "Ovidu" → "Ovidiu Toader"
// and "Duicu Valentin" → "Valentin Duicu".
const ARTISTS_2021 = [
  'Alina Aldea',
  'Ciprian Ariciu',
  'Catalin Badarau',
  'Andrei Balan',
  'Irina Maria Balan',
  'George Bilan',
  'Ion Bolocan',
  'Alvaro Botez',
  'Alina Buga',
  'Dinu Campeanu',
  'Alin Carpen',
  'Titi Ceara',
  'Vlad Ciobanu',
  'Chifu Panaite',
  'Florin Codre',
  'Tudor Codre',
  'Dumitru Cojocaru',
  'Mihai Cujba',
  'Valentin Duicu',
  'Elena Bobi Dumitrescu',
  'Reka Csapo Dup',
  'Darie Dup',
  'Claudiu Filimon',
  'Catalin Geana',
  'Raluca Ghideanu',
  'Emil Cristian Ghita',
  'Elena Gheorghe',
  'Dan Gavris',
  'Cosmin Hiristea',
  'Costel Iacob',
  'Adrian Ilfoveanu',
  'Cristina Iliescu',
  'Eugen Ilina',
  'Istoc Ionel',
  'Albert Kaan',
  'Marius Leonte',
  'Dorin Lupea',
  'Bianca Mann',
  'Traian Marcu',
  'Octavian Mardale',
  'Petre Marian',
  'Andrei Marina',
  'Ioan Medrut',
  'Laura Mihai',
  'Sorina Mihalache',
  'Razvan Mincu',
  'Grigore Minea',
  'Laurentiu Mogosanu',
  'Aurel Olteanu',
  'Alexandru Papuc',
  'Neculai Paduraru',
  'Cristian Pentelescu',
  'Vlad Perianu',
  'Daniel Petria',
  'Adrian Pirvu',
  'Ana Zoe Pop',
  'Maria Pop Timaru',
  'Nicolae Popa',
  'Cora Giodac Postelnicu',
  'Maria Raducanu',
  'Alexandru Ranga',
  'Anton Ratiu',
  'Mircea Roman',
  'Ana Rus',
  'Mihai Rusen',
  'Emilian Savinescu',
  'Daiana Savopol',
  'Elena Scutaru',
  'Marcel Scutaru',
  'Oana Sidea',
  'Alexandru Siminic',
  'Stefan Siminic',
  'Teodor Siminic',
  'Laura Soneriu',
  'Elena Surdu Stanescu',
  'Nicolae Stoica',
  'David Taicutu',
  'Florica Tanase',
  'George Tanase',
  'Patricia Teodorescu',
  'Napoleon Tiron',
  'Ovidiu Toader',
  'Bogdan Turcea',
  'Catalin Udrea',
  'Teodora Varzaru',
  'Serban Vrabiescu',
  'Gheorghe Zaharia',
  'Florin Zhu',
  'Marian Zidaru',
  'Victoria Zidaru',
]

const MANIFESTO = {
  title: "Sculpture didn't stop. It shifted.",
  highlight: 'shifted',
  body: 'In 2021, the inaugural edition of Bucharest Sculpture Days opened entirely online, not as a workaround for a closed city, but as a deliberate proposition. Launched on International Sculpture Day, ZSB gathered ninety contemporary sculptors into a shared digital territory. The exhibition framed sculpture not as a fixed object, but as a way of thinking about form, body, material, and presence: fluid, experimental, and collective from the start.',
}

const THEME_SECTION = {
  body: 'The first edition did not impose a single curatorial theme. Instead, it proposed a shared question and let ninety sculptors answer in their own languages. The works traversed materiality, gesture, digital mediation, memory, and the body, often at the intersection between object, image, and concept. Without a physical space, sculpture expanded into screens, fragments, and new forms of presence.',
}

function normalize(name: string): string {
  return name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim()
}

interface NamedDoc {
  _id: string
  name: string
}

function ref(_ref: string, _key: string) {
  return { _type: 'reference', _ref, _key }
}

async function uploadHero(client: ReturnType<typeof createClient>): Promise<string> {
  const base = process.env.NEXT_PUBLIC_BLOB_URL
  if (!base) throw new Error('Missing NEXT_PUBLIC_BLOB_URL')
  const url = `${base}/2021/digitalfield-02.png`
  console.log(`  Fetching hero from ${url}…`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Hero fetch failed: ${res.status} ${res.statusText}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buffer, { filename: 'digitalfield-02.png' })
  return asset._id
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

  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

  // --- Resolve artist references by name ---
  const artistDocs = await client.fetch<NamedDoc[]>(`*[_type == "artist"]{_id, name}`)
  const byName = new Map(artistDocs.map((a) => [normalize(a.name), a._id]))
  const artistRefs: ReturnType<typeof ref>[] = []
  const missing: string[] = []
  ARTISTS_2021.forEach((name, i) => {
    const id = byName.get(normalize(name))
    if (id) artistRefs.push(ref(id, `artist-${i}`))
    else missing.push(name)
  })
  if (missing.length) {
    throw new Error(`Missing artist docs for: ${missing.join(', ')}`)
  }
  console.log(`Resolved all ${artistRefs.length} artist references.`)

  // --- Resolve credit organizations (must already exist) ---
  const orgIds = [
    'org-sculpture-branch',
    'org-international-sculpture-center',
    'org-international-sculpture-day-isday',
  ]
  const foundOrgs = await client.fetch<string[]>(`*[_id in $ids]._id`, { ids: orgIds })
  const missingOrgs = orgIds.filter((id) => !foundOrgs.includes(id))
  if (missingOrgs.length) throw new Error(`Missing organization docs: ${missingOrgs.join(', ')}`)

  const credits = [
    {
      _key: 'credit-0',
      _type: 'creditOrg',
      type: 'primary',
      label: 'Organizer',
      organization: { _type: 'reference', _ref: 'org-sculpture-branch' },
      detail: 'Union of Visual Artists of Romania',
    },
    {
      _key: 'credit-1',
      _type: 'creditText',
      type: 'primary',
      label: 'Curator',
      names: ['Reka Csapo Dup'],
    },
    {
      _key: 'credit-2',
      _type: 'creditOrgList',
      type: 'partner',
      label: 'Under the Aegis of',
      organizations: [
        ref('org-international-sculpture-center', 'credit-2-org-0'),
        ref('org-international-sculpture-day-isday', 'credit-2-org-1'),
      ],
    },
    {
      _key: 'credit-3',
      _type: 'creditText',
      type: 'secondary',
      label: 'Communication & PR',
      names: ['Aurora Cârstea'],
    },
  ]

  // --- Backfill hasProgram on the existing editions ---
  const otherEditions = await client.fetch<string[]>(`*[_type == "edition" && _id != $id]._id`, {
    id: EDITION_ID,
  })

  // --- Existing-doc guard ---
  const exists = await client.fetch<boolean>(
    `defined(*[_id == $id][0]) || defined(*[_id == $draft][0])`,
    { id: EDITION_ID, draft: `drafts.${EDITION_ID}` },
  )

  if (dryRun) {
    console.log('\n(dry run)')
    console.log(
      `  edition ${EDITION_ID} ${exists ? 'EXISTS — would skip create' : 'would be created'}`,
    )
    console.log(`  ${artistRefs.length} artist refs, ${credits.length} credit rows`)
    console.log(`  would setIfMissing hasProgram=true on ${otherEditions.length} editions`)
    console.log('  would upload hero from Blob')
    return
  }

  // --- Upload hero + create edition ---
  if (exists) {
    console.log(`Edition ${EDITION_ID} already exists — skipping create.`)
  } else {
    const heroAssetId = await uploadHero(client)
    await client.create({
      _id: EDITION_ID,
      _type: 'edition',
      year: 2021,
      status: 'live',
      theme: '#digitalfield',
      themeHighlight: 'field',
      title: 'ZSB 2021 - #digitalfield | Bucharest Sculpture Days',
      dateStart: '2021-04-24',
      dateEnd: '2021-04-24',
      venueLine: 'Online',
      heroImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: heroAssetId },
        alt: 'ZSB 2021 #digitalfield',
      },
      manifesto: MANIFESTO,
      themeSection: THEME_SECTION,
      hasProgram: false,
      artists: artistRefs,
      credits,
    })
    console.log(`Created ${EDITION_ID}.`)
  }

  // --- Backfill ---
  let patched = 0
  for (const id of otherEditions) {
    await client.patch(id).setIfMissing({ hasProgram: true }).commit()
    patched += 1
  }
  console.log(`Backfilled hasProgram on ${patched} existing editions (setIfMissing).`)
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
