import { describe, expect, it } from 'vitest'
import {
  editionFacts,
  mapCredits,
  mapEdition,
  mapEditionCard,
  mapEvents,
} from '@/sanity/lib/editions-mappers'
import {
  type CreditNamesRow,
  type CreditOrgRow,
  type CreditPartnersRow,
  findEvent,
} from '@/types/edition'

type RawEvents = Parameters<typeof mapEvents>[0]
type RawCredits = Parameters<typeof mapCredits>[0]
type RawEdition = Parameters<typeof mapEdition>[0]
type RawCard = Parameters<typeof mapEditionCard>[0]

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

describe('mapCredits — row type dispatch', () => {
  it('maps an organization row, carrying the mark when the logo has dimensions', () => {
    const rows = [
      {
        _type: 'creditOrg',
        type: 'organizer',
        label: 'Organized by',
        organization: { name: 'Aurora', url: 'https://example.org', logo: LOGO },
      },
      {
        _type: 'creditOrg',
        type: 'partner',
        label: 'Partner',
        organization: { name: 'No Logo Org' },
      },
    ] as unknown as RawCredits
    const [withLogo, without] = mapCredits(rows) as CreditOrgRow[]
    expect(withLogo?.name).toBe('Aurora')
    expect(withLogo?.url).toBe('https://example.org')
    expect(withLogo?.mark?.src).toContain('abc123def456-1200x800.jpg')
    expect(withLogo?.mark?.alt).toBe('an alt')
    expect(without?.name).toBe('No Logo Org')
    expect(without && 'mark' in without).toBe(false)
  })

  it('scales a mark to equal area, clamped at both ends', () => {
    const scaleOf = (aspectRatio: number) => {
      const rows = [
        {
          _type: 'creditOrg',
          type: 'partner',
          label: 'Partner',
          organization: { name: 'Org', logo: logoWithAspect(aspectRatio) },
        },
      ] as unknown as RawCredits
      return (mapCredits(rows)[0] as CreditOrgRow).mark?.scale
    }
    expect(scaleOf(1)).toBe(1)
    expect(scaleOf(4)).toBe(0.5)
    expect(scaleOf(6.59)).toBe(0.39)
    expect(scaleOf(0.5)).toBe(1)
    expect(scaleOf(16)).toBe(0.35)
  })

  it('draws a lead row larger, up to its own cap', () => {
    const scaleOf = (aspectRatio: number, lead: boolean) => {
      const rows = [
        {
          _type: 'creditOrgList',
          type: 'partner',
          lead,
          label: 'Supported by',
          organizations: [{ name: 'Org', logo: logoWithAspect(aspectRatio) }],
        },
      ] as unknown as RawCredits
      return (mapCredits(rows)[0] as CreditPartnersRow).partners[0]?.mark?.scale
    }
    expect(scaleOf(3.14, false)).toBe(0.56)
    expect(scaleOf(3.14, true)).toBe(0.79)
    expect(scaleOf(1, true)).toBe(1.15)
  })

  it('skips an organization row whose reference is unresolved', () => {
    const rows = [
      { _type: 'creditOrg', type: 'organizer', label: 'Organized by', organization: null },
    ] as unknown as RawCredits
    expect(mapCredits(rows)).toEqual([])
  })

  it('keeps an organization-list row as one partner per organization', () => {
    const rows = [
      {
        _type: 'creditOrgList',
        type: 'partners',
        label: 'Partners',
        organizations: [
          { name: 'A', logo: LOGO },
          { name: 'B' },
          { name: 'C', kind: 'gallery', logo: LOGO },
        ],
      },
    ] as unknown as RawCredits
    const row = mapCredits(rows)[0] as CreditPartnersRow
    expect(row.partners.map((p) => p.name)).toEqual(['A', 'B', 'C'])
    expect(row.partners[0]?.mark?.scale).toBe(0.82)
    expect(row.partners[1]?.mark).toBeUndefined()
    expect(row.partners.map((p) => p.gallery)).toEqual([false, false, true])
  })

  it('filters blank names out of a text row', () => {
    const rows = [
      { _type: 'creditText', type: 'team', label: 'Team', names: ['Ana', '  ', null, 'Bogdan'] },
    ] as unknown as RawCredits
    expect((mapCredits(rows)[0] as CreditNamesRow).names).toEqual(['Ana', 'Bogdan'])
  })

  it('returns an empty list for missing rows', () => {
    expect(mapCredits(null as unknown as RawCredits)).toEqual([])
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
    expect(edition.credits).toEqual([])
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

function rawCard(fields: Record<string, unknown> = {}): RawCard {
  return {
    year: 2026,
    theme: 'Theme',
    dateStart: '2026-05-10',
    dateEnd: '2026-05-20',
    venueLine: 'CFP',
    artistCount: 44,
    eventCount: 13,
    ...fields,
  } as unknown as RawCard
}

describe('mapEditionCard', () => {
  it('leaves the venue out of the facts for an edition with a program', () => {
    expect(mapEditionCard(rawCard({ hasProgram: true })).facts).toEqual([
      { kind: 'dates', text: '10–20 May' },
      { kind: 'artists', count: 44 },
      { kind: 'events', count: 13 },
    ])
  })

  it('includes the venue in the facts for an edition without a program', () => {
    const card = mapEditionCard(
      rawCard({ hasProgram: false, venueLine: 'Online', eventCount: null }),
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
