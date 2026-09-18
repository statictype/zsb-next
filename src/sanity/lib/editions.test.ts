import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  editionFacts,
  mapCredits,
  mapEdition,
  mapEditionSummary,
  mapEvents,
} from '@/sanity/lib/editions-mappers'
import { findEvent } from '@/types/edition'

const table = new Map<string, (params?: Record<string, unknown>) => unknown>()

vi.mock('server-only', () => ({}))
vi.mock('@/sanity/lib/live', () => ({
  PUBLISHED: { perspective: 'published' },
  queryData: async ({ query }: { query: string }, _o: unknown, params?: Record<string, unknown>) =>
    table.get(query)?.(params) ?? null,
}))

import { getAllEditionYearParams, getFeaturedEvents } from '@/sanity/lib/editions'
import { EDITION_BY_YEAR, EDITION_SUMMARIES } from '@/sanity/lib/queries'

type RawEvents = Parameters<typeof mapEvents>[0]
type RawCredits = Parameters<typeof mapCredits>[0]
type RawEdition = Parameters<typeof mapEdition>[0]
type RawSummary = Parameters<typeof mapEditionSummary>[0]

// A well-formed Sanity asset ref so the image adapters can build a CDN URL.
const ASSET = { asset: { _ref: 'image-abc123def456-1200x800-jpg' }, alt: 'an alt' }

const logoWithAspect = (aspectRatio: number) => ({
  ...ASSET,
  dimensions: { width: 1200, height: Math.round(1200 / aspectRatio), aspectRatio },
})

const LOGO = logoWithAspect(1.5)

// Minimal raw event — only the fields the mapper reads; the cast keeps
// fixtures small without reconstructing the full generated query type.
function ev(fields: Record<string, unknown> = {}) {
  return {
    _key: `k-${JSON.stringify(fields).length}`,
    name: 'Opening',
    startDate: '2026-05-15',
    description: '',
    types: [{ title: 'Opening', slug: 'opening' }],
    venue: { name: 'CFP' },
    ...fields,
  }
}

function events(...items: ReturnType<typeof ev>[]): RawEvents {
  return items as unknown as RawEvents
}

describe('mapEvents — slug derivation (ADR 0015)', () => {
  it('derives date · venue · shortened-name slugs', () => {
    const [event] = mapEvents(events(ev({ name: 'Opening of the Main Exhibition Hall Tonight' })))!
    // Name capped at five words; venue falls back to its slugified name.
    expect(event?.slug).toBe('15-may-cfp-opening-of-the-main-exhibition')
  })

  it('prefers the venue document slug over its name when set', () => {
    const [event] = mapEvents(
      events(ev({ venue: { name: 'Combinatul Fondului Plastic', slug: 'cfp' } })),
    )!
    expect(event?.slug).toBe('15-may-cfp-opening')
  })

  it('takes an editor slug override, slugified, as-is', () => {
    const [event] = mapEvents(events(ev({ slug: 'My Special Night!' })))!
    expect(event?.slug).toBe('my-special-night')
  })

  it('disambiguates colliding slugs with a deterministic counter', () => {
    const list = mapEvents(events(ev({ _key: 'a' }), ev({ _key: 'b' }), ev({ _key: 'c' })))!
    expect(list.map((e) => e.slug)).toEqual([
      '15-may-cfp-opening',
      '15-may-cfp-opening-2',
      '15-may-cfp-opening-3',
    ])
  })

  it('returns [] for a missing or empty list', () => {
    expect(mapEvents(null as unknown as RawEvents)).toEqual([])
    expect(mapEvents(events())).toEqual([])
  })

  it('omits optional keys instead of spreading undefined into them', () => {
    const [bare] = mapEvents(events(ev()))!
    expect(bare && 'startTime' in bare).toBe(false)
    expect(bare && 'endDate' in bare).toBe(false)
    expect(bare && 'image' in bare).toBe(false)
    const [timed] = mapEvents(events(ev({ startTime: '18:00', endDate: '2026-05-20' })))!
    expect(timed?.startTime).toBe('18:00')
    expect(timed?.endDate).toBe('2026-05-20')
  })
})

describe('mapEvents — venue rollup stamp (ZSB-65)', () => {
  it('stamps the venue itself when it has no parent', () => {
    const [event] = mapEvents(events(ev({ venue: { name: 'Galeria Simeza' } })))!
    expect(event?.venue.rollUp).toEqual({
      name: 'Galeria Simeza',
      slug: 'galeria-simeza',
    })
  })

  it('stamps the parent identity for a sub-venue so it rolls up to CFP', () => {
    const [event] = mapEvents(
      events(
        ev({
          venue: { name: 'UNAgaleria', partOf: { name: 'Combinatul Fondului Plastic' } },
        }),
      ),
    )!
    expect(event?.venue.rollUp).toEqual({
      name: 'Combinatul Fondului Plastic',
      slug: 'combinatul-fondului-plastic',
    })
  })
})

const org = (name: string, fields: Record<string, unknown> = {}) => ({ name, ...fields })
const creditOrg = (type: string, label: string, organization: unknown, fields = {}) => ({
  _type: 'creditOrg',
  type,
  label,
  organization,
  ...fields,
})
const creditOrgList = (type: string, label: string, organizations: unknown[], fields = {}) => ({
  _type: 'creditOrgList',
  type,
  label,
  organizations,
  ...fields,
})
const creditText = (type: string, label: string, names: unknown[]) => ({
  _type: 'creditText',
  type,
  label,
  names,
})
const credits = (...rows: unknown[]) => mapCredits(rows as unknown as RawCredits)

describe('mapCredits — the logo wall', () => {
  it('puts a logo-bearing partner on the wall with its mark and link', () => {
    const { marks } = credits(
      creditOrg('partner', 'Partner', org('Aurora', { url: 'https://example.org', logo: LOGO })),
    )
    expect(marks.map((m) => m.name)).toEqual(['Aurora'])
    expect(marks[0]?.url).toBe('https://example.org')
    expect(marks[0]?.mark.src).toContain('abc123def456-1200x800.jpg')
    expect(marks[0]?.mark.alt).toBe('an alt')
  })

  it('scales a mark to equal area, clamped at both ends', () => {
    const scaleOf = (aspectRatio: number) =>
      credits(creditOrg('partner', 'Partner', org('Org', { logo: logoWithAspect(aspectRatio) })))
        .marks[0]?.mark.scale
    expect(scaleOf(1)).toBe(1)
    expect(scaleOf(4)).toBe(0.5)
    expect(scaleOf(6.59)).toBe(0.39)
    expect(scaleOf(0.5)).toBe(1)
    expect(scaleOf(16)).toBe(0.35)
  })

  it('draws a lead row larger, up to its own cap', () => {
    const scaleOf = (aspectRatio: number, lead: boolean) =>
      credits(
        creditOrgList(
          'partner',
          'Supported by',
          [org('Org', { logo: logoWithAspect(aspectRatio) })],
          {
            lead,
          },
        ),
      ).marks[0]?.mark.scale
    expect(scaleOf(3.14, false)).toBe(0.56)
    expect(scaleOf(3.14, true)).toBe(0.79)
    expect(scaleOf(1, true)).toBe(1.15)
  })

  it('keeps a secondary row off the wall and a primary row on it', () => {
    const { marks } = credits(
      creditOrg('secondary', 'Under the aegis of', org('Aegis', { logo: LOGO })),
      creditOrg('primary', 'Organized by', org('Organizer', { logo: logoWithAspect(2) })),
    )
    expect(marks.map((m) => m.name)).toEqual(['Organizer'])
  })

  it('shows each mark once, keyed by its image', () => {
    const { marks } = credits(
      creditOrg('primary', 'Organized by', org('Aurora', { logo: LOGO })),
      creditOrgList('partner', 'Partners', [
        org('Aurora', { logo: LOGO }),
        org('Other', { logo: LOGO }),
      ]),
    )
    expect(marks.map((m) => m.name)).toEqual(['Aurora'])
  })
})

describe('mapCredits — the partner name list', () => {
  it('names a partner without a logo, and a gallery even with one, each once', () => {
    const { marks, named } = credits(
      creditOrgList('partner', 'Partners', [
        org('A', { logo: LOGO }),
        org('B'),
        org('C', { kind: 'gallery', logo: LOGO }),
      ]),
      creditOrg('partner', 'Partner', org('B')),
    )
    expect(marks.map((m) => m.name)).toEqual(['A'])
    expect(named).toEqual(['B', 'C'])
  })

  it('never names a primary or secondary organization', () => {
    const { named } = credits(
      creditOrg('primary', 'Organized by', org('Organizer')),
      creditOrg('secondary', 'Under the aegis of', org('Aegis')),
    )
    expect(named).toEqual([])
  })
})

describe('mapCredits — the team block', () => {
  it('credits primary and secondary organizations by label, with the detail line', () => {
    const { teamOrgs } = credits(
      creditOrg('primary', 'Organized by', org('Organizer'), { detail: 'Sculpture branch' }),
      creditOrg('secondary', 'Under the aegis of', org('Aegis')),
      creditOrgList('secondary', 'With', [org('X'), org('Y')]),
      creditOrg('partner', 'Partner', org('P', { logo: LOGO })),
    )
    expect(teamOrgs).toEqual([
      { kind: 'org', label: 'Organized by', name: 'Organizer', detail: 'Sculpture branch' },
      { kind: 'org', label: 'Under the aegis of', name: 'Aegis' },
      { kind: 'names', label: 'With', names: ['X', 'Y'] },
    ])
  })

  it('keeps text rows apart, filtering blank names', () => {
    const { teamNames } = credits(creditText('secondary', 'Team', ['Ana', '  ', null, 'Bogdan']))
    expect(teamNames).toEqual([{ kind: 'names', label: 'Team', names: ['Ana', 'Bogdan'] }])
  })

  it('skips an organization row whose reference is unresolved', () => {
    expect(credits(creditOrg('primary', 'Organized by', null))).toEqual({
      marks: [],
      named: [],
      teamOrgs: [],
      teamNames: [],
    })
  })

  it('returns empty buckets for missing rows', () => {
    expect(mapCredits(null as unknown as RawCredits).marks).toEqual([])
  })
})

// Minimal raw edition; mapEdition's empty-string/array fallbacks are the
// belt-and-suspenders contract for fields TypeGen marks nullable.
function rawEdition(fields: Record<string, unknown> = {}): RawEdition {
  return {
    year: 2026,
    theme: 'Theme',
    dateStart: '2026-05-10',
    dateEnd: '2026-05-20',
    heroImage: ASSET,
    ...fields,
  } as unknown as RawEdition
}

describe('mapEdition', () => {
  it('fails fast when the required hero image has no asset', () => {
    expect(() => mapEdition(rawEdition({ heroImage: null }))).toThrow('Missing asset on heroImage')
  })

  it('maps a minimal edition with the documented fallbacks', () => {
    const edition = mapEdition(rawEdition())
    expect(edition.year).toBe(2026)
    expect(edition.dateLine).toBe('10–20 May 2026')
    expect(edition.manifesto).toEqual({ title: '', highlight: '', body: '' })
    expect(edition.artists).toEqual([])
    expect(edition.credits.teamNames).toEqual([])
    expect(edition.events).toEqual([])
    expect(edition.carousel).toEqual([])
    expect(edition.heroImage.src).toContain('abc123def456-1200x800.jpg')
  })

  it('appends the venue line to the date line when set', () => {
    expect(mapEdition(rawEdition({ venueLine: 'CFP' })).dateLine).toBe('10–20 May 2026 · CFP')
  })

  it('stamps dateRange as the venue-less range face', () => {
    expect(mapEdition(rawEdition({ venueLine: 'CFP' })).dateRange).toBe('10–20 May 2026')
  })

  it('defaults hasProgram to true for docs predating the field, honours an explicit false', () => {
    expect(mapEdition(rawEdition()).hasProgram).toBe(true)
    expect(mapEdition(rawEdition({ hasProgram: false })).hasProgram).toBe(false)
  })

  it('derives the facts from the date range, the venue line, and the mapped lists', () => {
    const edition = mapEdition(rawEdition({ venueLine: 'CFP', artists: [{ _id: 'a', name: 'A' }] }))
    expect(edition.facts).toEqual([
      { kind: 'dates', text: '10–20 May 2026' },
      { kind: 'venue', text: 'CFP' },
      { kind: 'artists', count: 1 },
    ])
  })
})

describe('editionFacts', () => {
  it('keeps dates, venue, artists, events order and omits empty text and zero counts', () => {
    expect(editionFacts({ dates: '', venue: 'Online', artistCount: 0, eventCount: 3 })).toEqual([
      { kind: 'venue', text: 'Online' },
      { kind: 'events', count: 3 },
    ])
  })
})

function rawSummary(fields: Record<string, unknown> = {}): RawSummary {
  return {
    year: 2026,
    theme: 'Theme',
    dateStart: '2026-05-10',
    dateEnd: '2026-05-20',
    venueLine: 'CFP',
    artistCount: 44,
    eventCount: 13,
    ...fields,
  } as unknown as RawSummary
}

describe('mapEditionSummary', () => {
  it('leaves the venue out of the facts for an edition with a program', () => {
    expect(mapEditionSummary(rawSummary({ hasProgram: true })).facts).toEqual([
      { kind: 'dates', text: '10–20 May' },
      { kind: 'artists', count: 44 },
      { kind: 'events', count: 13 },
    ])
  })

  it('includes the venue in the facts for an edition without a program', () => {
    const card = mapEditionSummary(
      rawSummary({ hasProgram: false, venueLine: 'Online', eventCount: null }),
    )
    expect(card.facts).toEqual([
      { kind: 'dates', text: '10–20 May' },
      { kind: 'venue', text: 'Online' },
      { kind: 'artists', count: 44 },
    ])
  })
})

// The slugs `mapEvents` stamps are the only event identity — static params
// enumerate them and `findEvent` resolves them, so the loop must close on the
// same mapped objects (ADR 0015, D4).
describe('event slug round trip — derive then resolve', () => {
  const edition = mapEdition(
    rawEdition({
      events: events(
        ev({ _key: 'a', slug: 'My Special Night!' }),
        ev({ _key: 'b' }),
        ev({ _key: 'c' }),
        ev({ _key: 'd' }),
      ),
    }),
  )

  it('resolves an editor override slug back to its event', () => {
    expect(findEvent(edition, 'my-special-night')?.key).toBe('a')
  })

  it('resolves -2/-3 deduped slugs back to distinct events', () => {
    expect(findEvent(edition, '15-may-cfp-opening')?.key).toBe('b')
    expect(findEvent(edition, '15-may-cfp-opening-2')?.key).toBe('c')
    expect(findEvent(edition, '15-may-cfp-opening-3')?.key).toBe('d')
  })

  it('returns null for an unknown slug', () => {
    expect(findEvent(edition, '15-may-cfp-opening-4')).toBeNull()
  })
})

describe('edition gateway — composition over the summaries', () => {
  const OPTIONS = { perspective: 'published' as const }
  const summaries = [
    rawSummary({ year: 2027, status: 'announced', dateStart: '2027-05-10', dateEnd: '2027-05-20' }),
    rawSummary({ year: 2026, status: 'live' }),
    rawSummary({ year: 2021, status: 'live', dateStart: null, dateEnd: null }),
  ]

  const list = summaries.map(mapEditionSummary)

  beforeEach(() => {
    table.clear()
    table.set(EDITION_SUMMARIES.query, () => summaries)
  })

  it('sources featured events from the newest live edition, not the newest edition', async () => {
    const fetched: unknown[] = []
    table.set(EDITION_BY_YEAR.query, (params) => {
      fetched.push(params?.year)
      return rawEdition({
        year: 2026,
        events: events(ev({ _key: 'a', featured: true }), ev({ _key: 'b' })),
      })
    })
    const featured = await getFeaturedEvents(list, OPTIONS)
    expect(fetched).toEqual([2026])
    expect(featured?.year).toBe(2026)
    expect(featured?.events.map((e) => e.key)).toEqual(['a'])
  })

  it('returns nothing when no edition is live, without fetching one', async () => {
    const announced = [mapEditionSummary(rawSummary({ year: 2027, status: 'announced' }))]
    table.set(EDITION_BY_YEAR.query, () => {
      throw new Error('must not fetch')
    })
    expect(await getFeaturedEvents(announced, OPTIONS)).toBeUndefined()
  })

  it('enumerates live years only as route params', async () => {
    expect(await getAllEditionYearParams()).toEqual([{ year: '2026' }, { year: '2021' }])
  })
})
