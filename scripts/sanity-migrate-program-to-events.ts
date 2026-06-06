/**
 * M2 / ZSB-37 — move the 2022–2025 program & venues out of the old format
 * (`program.blocks` + `program.films` + `program.sftfBanner`, `venues[]`) into
 * the new event/venue model (ADR 0014): `eventType` / `venueType` / `venue`
 * documents + each edition's nested `events[]` + a `programCallout`.
 *
 * Coarse / best-effort, because the old data is lossy (free-text dates, no
 * per-event venue, no addresses). The script does what it can deterministically
 * and FLAGS every gap for a human to finish in Studio — it never fabricates an
 * address or a precise time. New fields are written ALONGSIDE the old ones,
 * which stay dormant until the calendar ships and are removed in ZSB-38.
 *
 * What it writes:
 *   1. Taxonomy — 3 `venueType` + 6 `eventType` documents (stable ids).
 *   2. Venues — ~15 `venue` documents; CFP's galleries/courtyard/studios carry
 *      `partOf: CFP` (ZSB-32 roll-up). Addresses/map links left empty.
 *   3. Editions — for 2022–2025, a best-effort `events[]` and `programCallout`.
 *
 * Idempotent: taxonomy + venues use stable `_id`s and are created only when
 * missing; an edition is patched only when it has no `events` (events) /
 * `programCallout` yet. Re-runs are a no-op. `raw` perspective so published and
 * any `drafts.` copies are both seen.
 *
 * Usage:
 *   pnpm exec tsx scripts/sanity-migrate-program-to-events.ts --dry   # preview, no writes
 *   pnpm exec tsx scripts/sanity-migrate-program-to-events.ts         # apply
 */

import './_load-env'

import { createClient } from '@sanity/client'

const YEARS = [2022, 2023, 2024, 2025] as const

// ── Taxonomy (locked with the user) ─────────────────────────────────────────
const VENUE_TYPES = [
  { _id: 'venue-type-partner-venue', title: 'Partner venue', slug: 'partner-venue' },
  { _id: 'venue-type-partner-gallery', title: 'Partner gallery', slug: 'partner-gallery' },
  { _id: 'venue-type-artist-studio', title: 'Artist studio', slug: 'artist-studio' },
] as const

const EVENT_TYPES = [
  { _id: 'event-type-opening', title: 'Opening', slug: 'opening' },
  { _id: 'event-type-talk', title: 'Talk', slug: 'talk' },
  { _id: 'event-type-workshop', title: 'Workshop', slug: 'workshop' },
  { _id: 'event-type-open-studio', title: 'Open Studio', slug: 'open-studio' },
  { _id: 'event-type-film', title: 'Film', slug: 'film' },
  { _id: 'event-type-exhibition', title: 'Exhibition', slug: 'exhibition' },
] as const

// ── Venues (canonical set; names deduped to the team's existing org choices) ──
const CFP = 'venue-cfp'
interface VenueSeed {
  _id: string
  name: string
  type: string
  partOf?: string
}
const VENUES: VenueSeed[] = [
  { _id: CFP, name: 'Combinatul Fondului Plastic', type: 'venue-type-partner-venue' },
  {
    _id: 'venue-galeria-senat',
    name: 'Galeria SENAT',
    type: 'venue-type-partner-gallery',
    partOf: CFP,
  },
  {
    _id: 'venue-the-institute',
    name: 'The Institute',
    type: 'venue-type-partner-gallery',
    partOf: CFP,
  },
  {
    _id: 'venue-galeria-iomo',
    name: 'Galeria IOMO',
    type: 'venue-type-partner-gallery',
    partOf: CFP,
  },
  { _id: 'venue-courtyard', name: 'Courtyard', type: 'venue-type-partner-venue', partOf: CFP },
  { _id: 'venue-unagaleria', name: 'UNAgaleria', type: 'venue-type-partner-gallery', partOf: CFP },
  // ⚠ best-effort type — confirm in Studio
  { _id: 'venue-sector-1', name: 'Sector 1', type: 'venue-type-artist-studio', partOf: CFP },
  {
    _id: 'venue-studio-zidaru',
    name: 'Marian & Victoria Zidaru Studio',
    type: 'venue-type-artist-studio',
    partOf: CFP,
  },
  {
    _id: 'venue-studio-ana-zoe-pop',
    name: 'Ana Zoe Pop Studio',
    type: 'venue-type-artist-studio',
    partOf: CFP,
  },
  {
    _id: 'venue-studio-pentelescu',
    name: 'Cristian Pentelescu Studio',
    type: 'venue-type-artist-studio',
    partOf: CFP,
  },
  // ⚠ best-effort type — confirm in Studio
  { _id: 'venue-artsafe', name: 'ArtSafe', type: 'venue-type-partner-venue', partOf: CFP },
  { _id: 'venue-galeria-simeza', name: 'Galeria Simeza', type: 'venue-type-partner-gallery' },
  { _id: 'venue-nicodim-gallery', name: 'Nicodim Gallery', type: 'venue-type-partner-gallery' },
  { _id: 'venue-gallery-studio-76', name: 'Gallery Studio 76', type: 'venue-type-partner-gallery' },
  { _id: 'venue-hdu', name: 'H.D.U. Cultural Center', type: 'venue-type-partner-venue' },
]
const VENUE_NAME = new Map(VENUES.map((v) => [v._id, v.name]))

// ── Mapping tables for the lossy bits ────────────────────────────────────────

// Old `block.location` free-text → venue id (normalized: lowercased, trimmed).
const LOCATION_TO_VENUE: Record<string, string> = {
  'combinatul fondului plastic': CFP, // parent — specific gallery unknown, so flagged
  unagaleria: 'venue-unagaleria',
  'una gallery': 'venue-unagaleria',
}

// 2025 "Studio Visit" blocks carry the artist in the description → studio venue.
const STUDIO_BY_ARTIST: Array<[RegExp, string]> = [
  [/zidaru/i, 'venue-studio-zidaru'],
  [/ana zoe pop/i, 'venue-studio-ana-zoe-pop'],
  [/pentelescu/i, 'venue-studio-pentelescu'],
]

// A film whose note names a venue → that venue (`${year}|${title}`).
const FILM_VENUE_OVERRIDE: Record<string, string> = {
  '2025|About Portraits #3': 'venue-gallery-studio-76',
}

const MONTHS: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  sept: 9,
  oct: 10,
  nov: 11,
  dec: 12,
}

// ── Source shapes (raw program data) ─────────────────────────────────────────
interface Block {
  type: string
  title: string
  dates: string
  description: string
  location?: string | null
  format?: string | null
}
interface Film {
  date: string
  title: string
  note?: string | null
}
interface Callout {
  tag: string
  title: string
  description: string
}
interface RawEdition {
  _id: string
  year: number
  blocks?: Block[] | null
  films?: Film[] | null
  sftf?: Callout | null
  hasEvents: boolean
  hasCallout: boolean
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function iso(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function monthNum(name: string): number | undefined {
  return MONTHS[name.toLowerCase().replace(/\.$/, '')]
}

/** The calendar day halfway between two ISO dates (rounded down to a day). */
function midpoint(startIso: string, endIso: string): string {
  const mid = new Date(
    (Date.parse(`${startIso}T00:00:00Z`) + Date.parse(`${endIso}T00:00:00Z`)) / 2,
  )
  return mid.toISOString().slice(0, 10)
}

interface ParsedDates {
  startDate?: string
  endDate?: string
  ok: boolean
  commaList: boolean
}

/**
 * Parse the small set of free-text date formats in the old data:
 *   "April 16—18, 2022" · "April 18, 2022" · "April 26—May 11, 2025" · "Apr 13"
 * Multi-date lists ("April 18, 22, 29") keep the first day and set `commaList`.
 * Year falls back to the edition's year when the string omits one (films).
 */
function parseDates(raw: string, fallbackYear: number): ParsedDates {
  let s = raw.trim().replace(/[—–]/g, '-')
  let year = fallbackYear
  const ym = s.match(/,?\s*(\d{4})\s*$/)
  if (ym) {
    year = Number(ym[1])
    s = s.slice(0, ym.index).replace(/,\s*$/, '').trim()
  }

  const parts = s
    .split('-')
    .map((p) => p.trim())
    .filter(Boolean)
  const left = parts[0] ?? ''
  const commaList = /,/.test(left)

  const lm = left.match(/^([A-Za-z.]+)\s+(\d{1,2})/)
  if (!lm) return { ok: false, commaList }
  const startMonth = monthNum(lm[1] ?? '')
  if (!startMonth) return { ok: false, commaList }
  const startDay = Number(lm[2])
  const startDate = iso(year, startMonth, startDay)

  if (parts.length < 2) return { startDate, ok: true, commaList }

  const right = parts[1] ?? ''
  const rm = right.match(/^([A-Za-z.]+)\s+(\d{1,2})/) // "May 11"
  if (rm) {
    const endMonth = monthNum(rm[1] ?? '')
    if (endMonth)
      return { startDate, endDate: iso(year, endMonth, Number(rm[2])), ok: true, commaList }
  }
  const rd = right.match(/(\d{1,2})/) // bare "18" → same month
  if (rd) return { startDate, endDate: iso(year, startMonth, Number(rd[1])), ok: true, commaList }

  return { startDate, ok: true, commaList }
}

/** Old block type (+ format) → eventType id(s). `fallback` flags a guess. */
function mapEventTypes(type: string, format?: string | null): { ids: string[]; fallback: boolean } {
  switch (type) {
    case 'Main Exhibition':
    case 'Student Exhibition':
    case 'Exhibition':
      return { ids: ['event-type-exhibition'], fallback: false }
    case 'Opening Event':
    case 'Special Event':
      return { ids: ['event-type-opening'], fallback: false }
    case 'Film Program':
      return { ids: ['event-type-film'], fallback: false }
    case 'Talks & Workshops':
      if (format === 'Roundtable') return { ids: ['event-type-talk'], fallback: false }
      if (format === 'Workshop') return { ids: ['event-type-workshop'], fallback: false }
      if (format === 'Open Studios') return { ids: ['event-type-open-studio'], fallback: false }
      return { ids: ['event-type-talk'], fallback: true }
    default:
      return { ids: ['event-type-exhibition'], fallback: true }
  }
}

function inferBlockVenue(block: Block): { venueId: string; confident: boolean } {
  const loc = block.location?.trim().toLowerCase()
  if (loc && LOCATION_TO_VENUE[loc]) {
    const id = LOCATION_TO_VENUE[loc]
    return { venueId: id, confident: id !== CFP } // CFP parent = specific space unknown
  }
  if (block.title === 'Studio Visit' && block.description) {
    for (const [re, id] of STUDIO_BY_ARTIST) {
      if (re.test(block.description)) return { venueId: id, confident: true }
    }
  }
  return { venueId: CFP, confident: false }
}

function ref(id: string, key?: string): Record<string, string> {
  return { _type: 'reference', _ref: id, ...(key ? { _key: key } : {}) }
}

// ── Build one edition's events[] from its raw program ────────────────────────
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

function buildEvents(ed: RawEdition): { events: BuiltEvent[]; notes: string[] } {
  const events: BuiltEvent[] = []
  const notes: string[] = []
  let seq = 0

  for (const block of ed.blocks ?? []) {
    if (block.type === 'Film Program') {
      notes.push(`skipped umbrella block "${block.title}" — its screenings come from films[]`)
      continue
    }
    const key = `evt-${ed.year}-${seq++}`
    const { ids, fallback } = mapEventTypes(block.type, block.format)
    if (fallback)
      notes.push(`type guessed for "${block.title}" (${block.type}/${block.format ?? '—'})`)

    const { startDate, endDate, ok, commaList } = parseDates(block.dates, ed.year)
    if (!ok || !startDate)
      notes.push(`UNPARSED date "${block.dates}" for "${block.title}" — set by hand`)
    if (commaList)
      notes.push(`multi-date "${block.dates}" → kept first (${startDate}) for "${block.title}"`)

    const { venueId, confident } = inferBlockVenue(block)
    if (!confident) notes.push(`venue defaulted to ${VENUE_NAME.get(venueId)} for "${block.title}"`)

    // A multi-day run only makes sense for an exhibition or open-studio. A talk
    // /workshop/opening that "spans" the festival inherited the span as a
    // placeholder date — collapse it to a mid-festival single day for a sane
    // default and flag so a reviewer can set the real date.
    const spanOk = ids.includes('event-type-exhibition') || ids.includes('event-type-open-studio')
    let evStart = startDate
    let evEnd = endDate
    if (startDate && endDate && !spanOk) {
      evStart = midpoint(startDate, endDate)
      evEnd = undefined
      notes.push(
        `"${block.title}" had a festival-span placeholder (${startDate}…${endDate}) → set to midpoint ${evStart}; confirm the real date`,
      )
    }

    const name =
      block.title === 'Studio Visit' && block.description
        ? `Studio Visit — ${block.description}`
        : block.title

    events.push({
      _type: 'event',
      _key: key,
      name,
      startDate: evStart ?? iso(ed.year, 1, 1),
      ...(evEnd ? { endDate: evEnd } : {}),
      types: ids.map((id, i) => ref(id, `${key}-t${i}`)),
      venue: ref(venueId),
      description: block.description,
      featured: false,
    })
  }

  for (const film of ed.films ?? []) {
    const key = `evt-${ed.year}-${seq++}`
    const { startDate, ok } = parseDates(film.date, ed.year)
    if (!ok || !startDate)
      notes.push(`UNPARSED film date "${film.date}" for "${film.title}" — set by hand`)

    const venueId = FILM_VENUE_OVERRIDE[`${ed.year}|${film.title}`] ?? CFP
    if (venueId === CFP) notes.push(`film "${film.title}" → CFP (no venue recorded)`)

    const description = film.note ?? `Screening — part of the ${ed.year} film program.`
    if (!film.note) notes.push(`film "${film.title}" had no note → placeholder description`)

    events.push({
      _type: 'event',
      _key: key,
      name: film.title,
      startDate: startDate ?? iso(ed.year, 1, 1),
      types: [ref('event-type-film', `${key}-t0`)],
      venue: ref(venueId),
      description,
      featured: false,
    })
  }

  return { events, notes }
}

// ── Main ─────────────────────────────────────────────────────────────────────
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

  // ── Phase 1+2: seed taxonomy + venues (one transaction) ────────────────────
  const seedIds = await client.fetch<string[]>(`*[_type in ["venueType","eventType","venue"]]._id`)
  const existing = new Set(seedIds)
  const seedTx = client.transaction()
  let seedCreated = 0
  let seedSkipped = 0

  const queueCreate = (doc: { _id: string; _type: string } & Record<string, unknown>) => {
    const id = doc._id
    if (existing.has(id) || existing.has(`drafts.${id}`)) {
      seedSkipped += 1
      return
    }
    seedTx.create(doc)
    seedCreated += 1
  }

  for (const vt of VENUE_TYPES) {
    queueCreate({
      _id: vt._id,
      _type: 'venueType',
      title: vt.title,
      slug: { _type: 'slug', current: vt.slug },
    })
  }
  for (const et of EVENT_TYPES) {
    queueCreate({
      _id: et._id,
      _type: 'eventType',
      title: et.title,
      slug: { _type: 'slug', current: et.slug },
    })
  }
  for (const v of VENUES) {
    queueCreate({
      _id: v._id,
      _type: 'venue',
      name: v.name,
      type: ref(v.type),
      ...(v.partOf ? { partOf: ref(v.partOf) } : {}),
    })
  }

  console.log(`\n── Taxonomy + venues ──`)
  console.log(
    `  ${VENUE_TYPES.length} venue types, ${EVENT_TYPES.length} event types, ${VENUES.length} venues`,
  )
  console.log(`  ${seedCreated} to create, ${seedSkipped} already present`)
  if (dryRun) {
    console.log('  Venue tree:')
    for (const v of VENUES.filter((x) => !x.partOf)) {
      console.log(`    ${v.name}  [${v.type.replace('venue-type-', '')}]`)
      for (const child of VENUES.filter((x) => x.partOf === v._id)) {
        console.log(`      └─ ${child.name}  [${child.type.replace('venue-type-', '')}]`)
      }
    }
  } else if (seedCreated > 0) {
    await seedTx.commit()
    console.log('  ✓ committed')
  }

  // ── Phase 3: editions → events[] + programCallout ──────────────────────────
  const editions = await client.fetch<RawEdition[]>(
    `*[_type == "edition" && year in $years]{
      _id, year,
      "blocks": program.blocks[]{type, title, dates, description, location, format},
      "films": program.films[]{date, title, note},
      "sftf": program.sftfBanner{tag, title, description},
      "hasEvents": defined(events),
      "hasCallout": defined(programCallout)
    } | order(year asc)`,
    { years: YEARS },
  )

  const editionTx = client.transaction()
  let edPatched = 0

  for (const ed of editions) {
    console.log(`\n── ZSB ${ed.year}  [${ed._id}] ──`)
    if (ed.hasEvents && ed.hasCallout) {
      console.log('  already migrated (events + callout present) — skipped')
      continue
    }

    const { events, notes } = buildEvents(ed)
    for (const n of notes) reviews.push(`ZSB ${ed.year}: ${n}`)

    for (const e of events) {
      const when = e.endDate ? `${e.startDate} … ${e.endDate}` : e.startDate
      const typeLabels = e.types.map((t) => (t._ref ?? '').replace('event-type-', '')).join('+')
      console.log(`  • ${e.name}`)
      console.log(`      ${when}  ·  ${typeLabels}  ·  @ ${VENUE_NAME.get(e.venue._ref ?? '')}`)
    }

    const patch: Record<string, unknown> = {}
    if (!ed.hasEvents) patch.events = events
    if (!ed.hasCallout && ed.sftf) {
      patch.programCallout = {
        tag: ed.sftf.tag,
        title: ed.sftf.title,
        description: ed.sftf.description,
      }
      console.log(`  programCallout ← "${ed.sftf.title}"`)
    }

    if (Object.keys(patch).length > 0) {
      editionTx.patch(ed._id, (p) => p.set(patch))
      edPatched += 1
    }
  }

  if (!dryRun && edPatched > 0) {
    await editionTx.commit()
    console.log(`\n✓ Patched ${edPatched} edition document(s).`)
  }

  // ── Review report ──────────────────────────────────────────────────────────
  if (reviews.length) {
    console.log(`\n── Needs human review (${reviews.length}) ──`)
    for (const r of reviews) console.log(`  ⚠ ${r}`)
  }

  console.log(
    dryRun
      ? `\n(dry run — no writes. Would create ${seedCreated} docs, patch ${edPatched} editions.)`
      : `\nDone.`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
