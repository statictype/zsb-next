/** Usage: pnpm exec tsx scripts/sanity-migrate-beller-map-points.ts [--dry]. */

import '@scripts/_load-env'

import { randomUUID } from 'node:crypto'
import { createClient } from '@sanity/client'
import { deriveEventSlugs, type EventSlugInput } from '@/sanity/lib/editions-mappers'

interface OldPoint {
  id: string
  kind: 'work' | 'stand' | 'atelier' | 'proiectie' | 'food' | 'info'
  ref?: number
  label?: string
  note?: string
  coordinates: string
  events?: string[]
}

const POINTS: OldPoint[] = [
  {
    id: 'proiectie',
    kind: 'proiectie',
    label: 'Zona de proiecție',
    coordinates: '44.462869, 26.095197',
    events: ['proiectie-scrisoare-imaginara-brancusi', 'galeria-beller-noaptea-alba-a-galeriilor'],
  },
  {
    id: 'stand-1',
    kind: 'stand',
    label: 'Stand 1 · Sculptură de mici dimensiuni',
    coordinates: '44.461913, 26.095001',
    events: ['sculptura-mici-dimensiuni-sambata', 'sculptura-mici-dimensiuni-duminica'],
  },
  {
    id: 'stand-2',
    kind: 'stand',
    label: 'Stand 2 · Sculptură de mici dimensiuni',
    coordinates: '44.461881, 26.094758',
    events: ['sculptura-mici-dimensiuni-sambata', 'sculptura-mici-dimensiuni-duminica'],
  },
  {
    id: 'stand-3',
    kind: 'stand',
    label: 'Stand 3 · Sculptură de mici dimensiuni',
    coordinates: '44.461776, 26.094957',
    events: ['sculptura-mici-dimensiuni-sambata', 'sculptura-mici-dimensiuni-duminica'],
  },
  {
    id: 'stand-4',
    kind: 'stand',
    label: 'Stand 4 · Sculptură de mici dimensiuni',
    coordinates: '44.461126, 26.094513',
    events: ['sculptura-mici-dimensiuni-sambata', 'sculptura-mici-dimensiuni-duminica'],
  },
  {
    id: 'prim-ajutor',
    kind: 'info',
    label: 'Punct de prim ajutor',
    coordinates: '44.461499, 26.09488',
  },
  {
    id: 'lucrare-colectiva',
    kind: 'atelier',
    label: 'Lucrare colectivă · Lasă-ți urma',
    coordinates: '44.460941, 26.094465',
    events: ['lasa-ti-urma-sambata', 'lasa-ti-urma-duminica', 'ultimul-gest'],
  },
  {
    id: 'atelier',
    kind: 'atelier',
    label: 'Atelier pentru copii',
    coordinates: '44.460827, 26.094428',
    events: [
      'modeleaza-sesiunea-1',
      'mana-devine-forma-sesiunea-1',
      'mana-devine-forma-sesiunea-2',
      'modeleaza-sesiunea-2',
    ],
  },
  {
    id: 'detectivii-de-forme',
    kind: 'atelier',
    label: 'Detectivii de forme',
    note: 'Piața Dorobanți',
    coordinates: '44.459806, 26.093621',
    events: ['detectivii-de-forme-sambata', 'detectivii-de-forme-duminica'],
  },
  { id: 'lucrare-1', kind: 'work', ref: 1, coordinates: '44.462767, 26.095086' },
  { id: 'lucrare-2', kind: 'work', ref: 2, coordinates: '44.46268, 26.095213' },
  { id: 'lucrare-3', kind: 'work', ref: 3, coordinates: '44.462642, 26.095045' },
  { id: 'lucrare-4', kind: 'work', ref: 4, coordinates: '44.462555, 26.095172' },
  { id: 'lucrare-5', kind: 'work', ref: 5, coordinates: '44.462516, 26.095004' },
  { id: 'lucrare-6', kind: 'work', ref: 6, coordinates: '44.462429, 26.095131' },
  { id: 'lucrare-7', kind: 'work', ref: 7, coordinates: '44.462391, 26.094963' },
  { id: 'lucrare-8', kind: 'work', ref: 8, coordinates: '44.462304, 26.09509' },
  { id: 'lucrare-9', kind: 'work', ref: 9, coordinates: '44.462266, 26.094922' },
  { id: 'lucrare-10', kind: 'work', ref: 10, coordinates: '44.462178, 26.095049' },
  { id: 'lucrare-11', kind: 'work', ref: 11, coordinates: '44.46214, 26.094882' },
  { id: 'lucrare-12', kind: 'work', ref: 12, coordinates: '44.462053, 26.095008' },
  { id: 'lucrare-13', kind: 'work', ref: 13, coordinates: '44.462015, 26.094841' },
  { id: 'lucrare-14', kind: 'work', ref: 14, coordinates: '44.461928, 26.094967' },
  { id: 'lucrare-15', kind: 'work', ref: 15, coordinates: '44.461889, 26.0948' },
  { id: 'lucrare-16', kind: 'work', ref: 16, coordinates: '44.461802, 26.094927' },
  { id: 'lucrare-17', kind: 'work', ref: 17, coordinates: '44.461764, 26.094759' },
  { id: 'lucrare-18', kind: 'work', ref: 18, coordinates: '44.461677, 26.094886' },
  { id: 'lucrare-19', kind: 'work', ref: 19, coordinates: '44.461639, 26.094718' },
  { id: 'lucrare-20', kind: 'work', ref: 20, coordinates: '44.461552, 26.094845' },
  { id: 'lucrare-21', kind: 'work', ref: 21, coordinates: '44.461513, 26.094677' },
  { id: 'lucrare-22', kind: 'work', ref: 22, coordinates: '44.461426, 26.094804' },
  { id: 'lucrare-23', kind: 'work', ref: 23, coordinates: '44.461388, 26.094637' },
  { id: 'lucrare-24', kind: 'work', ref: 24, coordinates: '44.461301, 26.094763' },
  { id: 'lucrare-25', kind: 'work', ref: 25, coordinates: '44.461262, 26.094596' },
  { id: 'lucrare-26', kind: 'work', ref: 26, coordinates: '44.461175, 26.094722' },
  { id: 'lucrare-27', kind: 'work', ref: 27, coordinates: '44.461137, 26.094555' },
  { id: 'lucrare-28', kind: 'work', ref: 28, coordinates: '44.46105, 26.094682' },
  {
    id: 'partener-1',
    kind: 'food',
    label: 'Partener 1',
    note: 'Nume și adresă de completat',
    coordinates: '44.4625, 26.09528',
  },
  {
    id: 'partener-2',
    kind: 'food',
    label: 'Partener 2',
    note: 'Nume și adresă de completat',
    coordinates: '44.46175, 26.0947',
  },
  {
    id: 'partener-3',
    kind: 'food',
    label: 'Partener 3',
    note: 'Nume și adresă de completat',
    coordinates: '44.46095, 26.09472',
  },
]

type BellerDoc = Record<string, unknown> & {
  _id: string
  _type: string
  mapPoints?: unknown[]
}

type ProgramEvent = EventSlugInput & { _key: string }

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

  const published = await client.fetch<BellerDoc | null>('*[_id == "galeriaBeller"][0]')
  const draft = await client.fetch<BellerDoc | null>('*[_id == "drafts.galeriaBeller"][0]')
  if (!published) throw new Error('galeriaBeller is not published.')
  const target = draft ?? published
  if (target.mapPoints?.length) {
    throw new Error(
      `${target._id} already has ${target.mapPoints.length} map points. Not overwriting.`,
    )
  }

  const events = await client.fetch<ProgramEvent[]>(
    `*[_id == $id][0].events[]{ _key, name, "slug": slug.current, startDate, "venue": venue->{ name, "slug": slug.current } }`,
    { id: target._id },
  )
  const slugs = deriveEventSlugs(events)
  const keyBySlug = new Map(events.map((e, i) => [slugs[i], e._key]))

  const works = await client.fetch<{ _id: string; key: number }[]>(
    '*[_type == "work" && !(_id in path("drafts.**"))]{ _id, key }',
  )
  const workIdByKey = new Map(works.map((w) => [w.key, w._id]))

  const problems: string[] = []
  const mapPoints = POINTS.map((p) => {
    const eventKeys = (p.events ?? []).flatMap((slug) => {
      const key = keyBySlug.get(slug)
      if (!key) problems.push(`${p.id}: no event with slug ${slug}`)
      return key ? [key] : []
    })
    const base = {
      _key: randomUUID().replaceAll('-', '').slice(0, 12),
      _type: 'mapPoint',
      kind: p.kind,
      coordinates: p.coordinates,
      ...(eventKeys.length ? { events: eventKeys } : {}),
    }
    if (p.kind === 'work') {
      const ref = p.ref === undefined ? undefined : workIdByKey.get(p.ref)
      if (!ref) problems.push(`${p.id}: no published work with number ${p.ref}`)
      return { ...base, work: { _type: 'reference', _ref: ref ?? '' } }
    }
    return {
      ...base,
      pointId: { _type: 'slug', current: p.id },
      label: p.label,
      ...(p.note ? { note: p.note } : {}),
    }
  })

  if (problems.length) throw new Error(`Not migrating:\n  ${problems.join('\n  ')}`)

  console.log(
    `${mapPoints.length} map points → drafts.galeriaBeller (${draft ? 'existing draft' : 'new draft from the published document'}).`,
  )
  if (dryRun) {
    console.log('(dry run — no writes.)')
    return
  }

  const tx = client.transaction()
  if (!draft) {
    const { _rev, _createdAt, _updatedAt, ...fields } = published
    tx.createIfNotExists({ ...fields, _id: 'drafts.galeriaBeller' })
  }
  tx.patch('drafts.galeriaBeller', (p) => p.set({ mapPoints }))
  await tx.commit()
  console.log('✓ Draft written. Review it in Studio → Galeria Beller → Hartă, then publish.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
