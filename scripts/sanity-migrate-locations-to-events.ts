/** Usage: pnpm exec tsx scripts/sanity-migrate-locations-to-events.ts [--dry]. */

import '@scripts/_load-env'

import { createClient } from '@sanity/client'

const YEARS = [2022, 2023, 2024, 2025] as const

const CFP = 'venue-cfp'
const V = {
  cfp: CFP,
  senat: 'venue-galeria-senat',
  institute: 'venue-the-institute',
  iomo: 'venue-galeria-iomo',
  courtyard: 'venue-courtyard',
  una: 'venue-unagaleria',
  sector1: 'venue-sector-1',
  artsafe: 'venue-artsafe',
  simeza: 'venue-galeria-simeza',
  nicodim: 'venue-nicodim-gallery',
  studio76: 'venue-gallery-studio-76',
  hdu: 'venue-hdu',
} as const

const T = {
  exhibition: 'event-type-exhibition',
  talk: 'event-type-talk',
  workshop: 'event-type-workshop',
  openStudio: 'event-type-open-studio',
  film: 'event-type-film',
  opening: 'event-type-opening',
} as const

const norm = (s: string | null | undefined) => (s ?? '').trim().toLowerCase()

const NAME_TO_VENUE: Record<string, string> = {
  'senat gallery': V.senat,
  'galeria senat': V.senat,
  'the institute gallery': V.institute,
  'the institute': V.institute,
  'iomo gallery': V.iomo,
  'galeria iomo': V.iomo,
  'inner courtyard': V.courtyard,
  courtyard: V.courtyard,
  'una gallery': V.una,
  unagaleria: V.una,
  'sector 1': V.sector1,
  'sector 21': V.sector1,
  artsafe: V.artsafe,
  'galeria simeza': V.simeza,
  'nicodim gallery': V.nicodim,
  'gallery studio 76': V.studio76,
  'h.d.u. cultural center': V.hdu,
}

const GROUP_TO_VENUE: Record<string, string> = {
  'una gallery': V.una,
  'galeria simeza': V.simeza,
  'combinatul fondului plastic': CFP,
}

const SUBGROUP_TO_TYPE: Record<string, string> = {
  'main exhibition': T.exhibition,
  'partner exhibition': T.exhibition,
  'solo exhibition': T.exhibition,
  'student exhibition': T.exhibition,
  exhibition: T.exhibition,
  'round table': T.talk,
  'open doors 7': T.openStudio,
  'open doors': T.openStudio,
}

const PROGRAM_ALIAS: Record<string, string> = {
  '#celălaltcorp': '#theotherbody',
  'monuments in bucharest': 'Monuments in Bucharest: From Becoming to Protection',
}

const DURATIONAL = new Set<string>([T.exhibition, T.openStudio])

interface Location {
  _key: string
  group?: string | null
  name?: string | null
  program?: string | null
  subgroup?: string | null
}
interface ExistingEvent {
  _key: string
  name: string
  venueRef: string | null
}
interface RawEdition {
  _id: string
  year: number
  dateStart?: string | null
  dateEnd?: string | null
  locations?: Location[] | null
  events?: ExistingEvent[] | null
  eventDates?: Array<{ startDate?: string | null; endDate?: string | null }> | null
}

function ref(id: string, key?: string): Record<string, string> {
  return { _type: 'reference', _ref: id, ...(key ? { _key: key } : {}) }
}

const short = (id: string) => id.replace('venue-', '')

const canonicalName = (program: string) => PROGRAM_ALIAS[norm(program)] ?? program

function mapVenue(loc: Location): { id: string; confident: boolean } {
  const byName = NAME_TO_VENUE[norm(loc.name)]
  if (byName) return { id: byName, confident: true }
  const byGroup = GROUP_TO_VENUE[norm(loc.group)]
  if (byGroup) return { id: byGroup, confident: byGroup !== CFP }
  return { id: CFP, confident: false }
}

function mapType(loc: Location): { id: string; fallback: boolean } {
  if (/screening|documentary/i.test(loc.program ?? '')) return { id: T.film, fallback: true }
  const t = SUBGROUP_TO_TYPE[norm(loc.subgroup)]
  if (t) return { id: t, fallback: false }
  return { id: T.exhibition, fallback: true }
}

function nameMatches(eventName: string, program: string): boolean {
  const p = norm(program)
  if (norm(eventName) === p) return true
  const alias = PROGRAM_ALIAS[p]
  return alias ? norm(eventName) === norm(alias) : false
}

function editionWindow(ed: RawEdition): { start: string; end: string } | null {
  let start: string | null = ed.dateStart ?? null
  let end: string | null = ed.dateEnd ?? null
  for (const d of ed.eventDates ?? []) {
    if (d.startDate && (!start || d.startDate < start)) start = d.startDate
    const e = d.endDate ?? d.startDate
    if (e && (!end || e > end)) end = e
  }
  return start && end ? { start, end } : null
}

interface BuiltEvent {
  _type: 'event'
  _key: string
  name: string
  startDate: string
  endDate?: string
  types: Array<Record<string, string>>
  venue: Record<string, string>
  description: string
  featured: boolean
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
  const reviews: string[] = []
  const tx = client.transaction()
  let opCount = 0

  const nicodim = await client.fetch<{ partOf: string | null } | null>(
    `*[_id == $id][0]{ "partOf": partOf._ref }`,
    { id: V.nicodim },
  )
  if (nicodim && nicodim.partOf !== CFP) {
    console.log(`\n── Venue fixes ──\n  Nicodim Gallery → partOf CFP`)
    if (!dryRun) tx.patch(V.nicodim, (p) => p.set({ partOf: ref(CFP) }))
    opCount += 1
  } else {
    console.log(`\n── Venue fixes ──\n  Nicodim already partOf CFP — skipped`)
  }
  reviews.push(
    'Verify venue "Sector 1": confirm its name ("Sector 21"?) and type — it is `artist-studio` but hosts the main exhibition (likely a gallery). Fix in Studio.',
  )

  const editions = await client.fetch<RawEdition[]>(
    `*[_type == "edition" && year in $years]{
      _id, year, dateStart, dateEnd,
      "locations": venues[]{_key, group, name, program, subgroup},
      "events": events[]{_key, name, "venueRef": venue._ref},
      "eventDates": events[]{startDate, endDate}
    } | order(year asc)`,
    { years: YEARS },
  )

  let edPatched = 0

  for (const ed of editions) {
    console.log(`\n── ZSB ${ed.year}  [${ed._id}] ──`)
    const locations = ed.locations ?? []
    if (locations.length === 0) {
      console.log('  no Locations entries — skipped')
      continue
    }
    const window = editionWindow(ed)
    if (!window) {
      reviews.push(
        `ZSB ${ed.year}: no edition window (dates) — cannot place durational shows; skipped`,
      )
      console.log('  ⚠ no edition window — skipped')
      continue
    }

    const existing = ed.events ?? []
    const existingKeys = new Set(existing.map((e) => e._key))
    const claimed = new Set<string>()
    const repoints: Array<{ key: string; venueId: string; durational: boolean }> = []
    const inserts: BuiltEvent[] = []

    for (const loc of locations) {
      const program = (loc.program ?? '').trim()
      if (!program) {
        reviews.push(`ZSB ${ed.year}: Locations entry ${loc._key} has no program — skipped`)
        continue
      }
      const venue = mapVenue(loc)
      const type = mapType(loc)
      const durational = DURATIONAL.has(type.id)

      if (!venue.confident)
        reviews.push(
          `ZSB ${ed.year}: venue defaulted to CFP for "${program}" (${loc.name ?? loc.group ?? '—'})`,
        )
      if (type.fallback)
        reviews.push(
          `ZSB ${ed.year}: type guessed (${type.id.replace('event-type-', '')}) for "${program}" (subgroup ${loc.subgroup ?? '—'})`,
        )

      const match = existing.find(
        (e) => !e._key.startsWith('loc-') && !claimed.has(e._key) && nameMatches(e.name, program),
      )
      if (match) {
        claimed.add(match._key)
        if (match.venueRef === CFP) {
          repoints.push({ key: match._key, venueId: venue.id, durational })
          console.log(
            `  ↻ re-point "${match.name}" → ${short(venue.id)}${durational ? `  (${window.start}…${window.end})` : ''}`,
          )
        } else if (match.venueRef === venue.id) {
          console.log(`  = "${match.name}" already @ ${short(venue.id)} — left as-is`)
        } else {
          reviews.push(
            `ZSB ${ed.year}: "${program}" matched an event already @ ${short(match.venueRef ?? '?')}; Locations says ${short(venue.id)} — left as-is`,
          )
          console.log(
            `  = "${match.name}" @ ${short(match.venueRef ?? '?')} (Locations: ${short(venue.id)}) — left as-is`,
          )
        }
        continue
      }

      const name = canonicalName(program)
      const key = `loc-${ed.year}-${loc._key}`
      if (existingKeys.has(key)) {
        console.log(`  = ${name} @ ${short(venue.id)} — exists, left as-is`)
        continue
      }
      if (!durational)
        reviews.push(
          `ZSB ${ed.year}: "${name}" is ${type.id.replace('event-type-', '')} (single-day) but Locations has no date → placeholder ${window.start}; set by hand`,
        )

      inserts.push({
        _type: 'event',
        _key: key,
        name,
        startDate: window.start,
        ...(durational ? { endDate: window.end } : {}),
        types: [ref(type.id, `${key}-t0`)],
        venue: ref(venue.id),
        description: `Part of the ${ed.year} edition.`,
        featured: false,
      })
      console.log(
        `  + ${name} @ ${short(venue.id)}${durational ? `  (${window.start}…${window.end})` : `  (${window.start})`}  ·  ${type.id.replace('event-type-', '')}`,
      )
    }

    if (repoints.length === 0 && inserts.length === 0) {
      console.log('  nothing to do — already migrated')
      continue
    }
    reviews.push(
      `ZSB ${ed.year}: ${inserts.length} created, ${repoints.length} re-pointed — placeholder descriptions, review names/dates in Studio`,
    )

    if (!dryRun) {
      tx.patch(ed._id, (p) => {
        for (const r of repoints) {
          p = p.set({ [`events[_key=="${r.key}"].venue`]: ref(r.venueId) })
          if (r.durational)
            p = p.set({
              [`events[_key=="${r.key}"].startDate`]: window.start,
              [`events[_key=="${r.key}"].endDate`]: window.end,
            })
        }
        if (inserts.length)
          p = p.setIfMissing({ events: [] }).insert('after', 'events[-1]', inserts)
        return p
      })
    }
    opCount += repoints.length + inserts.length
    edPatched += 1
  }

  if (!dryRun && opCount > 0) {
    await tx.commit()
    console.log(`\n✓ Committed — ${edPatched} edition(s) patched.`)
  }

  if (reviews.length) {
    console.log(`\n── Needs human review (${reviews.length}) ──`)
    for (const r of reviews) console.log(`  ⚠ ${r}`)
  }

  console.log(
    dryRun
      ? `\n(dry run — no writes. Would apply ${opCount} change(s) across ${edPatched} edition(s).)`
      : `\nDone.`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
