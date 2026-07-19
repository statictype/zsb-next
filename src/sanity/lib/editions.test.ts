import { describe, expect, it } from 'vitest'
import { mapCredits, mapEdition, mapEvents } from '@/sanity/lib/editions-mappers'

type RawEvents = Parameters<typeof mapEvents>[0]
type RawCredits = Parameters<typeof mapCredits>[0]
type RawEdition = Parameters<typeof mapEdition>[0]

// A well-formed Sanity asset ref so the image adapters can build a CDN URL.
const ASSET = { asset: { _ref: 'image-abc123def456-1200x800-jpg' }, alt: 'an alt' }

// Minimal raw event — only the fields the mapper reads; the cast keeps
// fixtures small without reconstructing the full generated query type.
function ev(fields: Record<string, unknown> = {}) {
  return {
    _key: `k-${JSON.stringify(fields).length}`,
    name: 'Opening',
    startDate: '2026-05-15',
    description: '',
    types: [{ title: 'Opening', slug: 'opening' }],
    venue: { name: 'CFP', type: 'Partner venue' },
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
      events(ev({ venue: { name: 'Combinatul Fondului Plastic', type: 'v', slug: 'cfp' } })),
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

  it('returns undefined for a missing or empty list', () => {
    expect(mapEvents(null as unknown as RawEvents)).toBeUndefined()
    expect(mapEvents(events())).toBeUndefined()
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
    const [event] = mapEvents(events(ev({ venue: { name: 'Galeria Simeza', type: 'gallery' } })))!
    expect(event?.venue.rollUp).toEqual({
      name: 'Galeria Simeza',
      slug: 'galeria-simeza',
      type: 'gallery',
    })
  })

  it('stamps the parent identity for a sub-venue so it rolls up to CFP', () => {
    const [event] = mapEvents(
      events(
        ev({
          venue: {
            name: 'UNAgaleria',
            type: 'Partner gallery',
            partOf: { name: 'Combinatul Fondului Plastic', type: 'Partner venue' },
          },
        }),
      ),
    )!
    expect(event?.venue.rollUp).toEqual({
      name: 'Combinatul Fondului Plastic',
      slug: 'combinatul-fondului-plastic',
      type: 'Partner venue',
    })
  })
})

describe('mapCredits — row type dispatch', () => {
  it('maps an organization row, with the logo flattened when present', () => {
    const rows = [
      {
        _type: 'creditOrg',
        type: 'organizer',
        label: 'Organized by',
        organization: { name: 'Aurora', logo: ASSET },
      },
      {
        _type: 'creditOrg',
        type: 'partner',
        label: 'Partner',
        organization: { name: 'No Logo Org' },
      },
    ] as unknown as RawCredits
    const [withLogo, without] = mapCredits(rows)
    expect(withLogo?.value).toBe('Aurora')
    expect(withLogo?.logo).toContain('abc123def456-1200x800.jpg')
    expect(withLogo?.logoAlt).toBe('an alt')
    expect(without?.value).toBe('No Logo Org')
    expect(without && 'logo' in without).toBe(false)
  })

  it('skips an organization row whose reference is unresolved', () => {
    const rows = [
      { _type: 'creditOrg', type: 'organizer', label: 'Organized by', organization: null },
    ] as unknown as RawCredits
    expect(mapCredits(rows)).toEqual([])
  })

  it('joins an organization-list row with newlines', () => {
    const rows = [
      {
        _type: 'creditOrgList',
        type: 'partners',
        label: 'Partners',
        organizations: [{ name: 'A' }, { name: 'B' }],
      },
    ] as unknown as RawCredits
    expect(mapCredits(rows)[0]?.value).toBe('A\nB')
  })

  it('filters blank names out of a text row', () => {
    const rows = [
      { _type: 'creditText', type: 'team', label: 'Team', names: ['Ana', '  ', null, 'Bogdan'] },
    ] as unknown as RawCredits
    expect(mapCredits(rows)[0]?.value).toBe('Ana\nBogdan')
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
    expect(edition.dateTape).toBe('10–20 May 2026')
    expect(edition.title).toBe('')
    expect(edition.manifesto).toEqual({ title: '', highlight: '', body: '' })
    expect(edition.artists).toEqual([])
    expect(edition.credits).toEqual([])
    expect('events' in edition).toBe(false)
    expect('carousel' in edition).toBe(false)
    expect(edition.heroImage.src).toContain('abc123def456-1200x800.jpg')
  })

  it('appends the venue line to the date tape when set', () => {
    expect(mapEdition(rawEdition({ venueLine: 'CFP' })).dateTape).toBe('10–20 May 2026 · CFP')
  })

  it('defaults hasProgram to true for docs predating the field, honours an explicit false', () => {
    expect(mapEdition(rawEdition()).hasProgram).toBe(true)
    expect(mapEdition(rawEdition({ hasProgram: false })).hasProgram).toBe(false)
  })
})
