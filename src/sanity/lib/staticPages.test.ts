import { describe, expect, it } from 'vitest'
import {
  buildFaq,
  mapVisit,
  normalizeAbout,
  normalizePartners,
  normalizePrivacy,
  type VisitPage,
} from './staticPages-mappers'

// buildFaq / mapVisit only read a handful of fields off the page; the cast
// keeps fixtures small without reconstructing the full generated query type.
function page(fields: Record<string, unknown>): VisitPage {
  return fields as unknown as VisitPage
}

describe('buildFaq', () => {
  it('returns no entries for a null page', () => {
    expect(buildFaq(null)).toEqual([])
  })

  it('returns no entries when nothing derivable is present', () => {
    expect(buildFaq(page({}))).toEqual([])
  })

  it('derives an opening-hours entry scoped to the event', () => {
    const [entry] = buildFaq(page({ hoursLines: ['Mon–Fri 10–18', 'Sat 11–16'] }))
    expect(entry?.question).toBe('What are the opening hours during Bucharest Sculpture Days?')
    expect(entry?.answer).toBe('Mon–Fri 10–18. Sat 11–16. These hours apply during the event.')
  })

  it('derives a location entry from street + city', () => {
    const entries = buildFaq(page({ street: '15 Foo St', city: 'Bucharest' }))
    expect(entries).toHaveLength(1)
    expect(entries[0]?.question).toBe('Where is Bucharest Sculpture Days held?')
    expect(entries[0]?.answer).toContain('The main venue is at 15 Foo St, Bucharest.')
  })

  it('omits the location entry unless both street and city are present', () => {
    expect(buildFaq(page({ street: '15 Foo St' }))).toEqual([])
    expect(buildFaq(page({ city: 'Bucharest' }))).toEqual([])
  })

  it('appends editorial FAQ entries after the derived ones, skipping incomplete rows', () => {
    const entries = buildFaq(
      page({
        hoursLines: ['Daily 10–18'],
        faq: [
          { question: 'Tickets?', answer: 'Free entry.' },
          { question: 'Missing answer?', answer: '' },
          { question: '', answer: 'Missing question' },
        ],
      }),
    )
    expect(entries).toHaveLength(2)
    expect(entries[0]?.question).toBe('What are the opening hours during Bucharest Sculpture Days?')
    expect(entries[1]).toEqual({ question: 'Tickets?', answer: 'Free entry.' })
  })
})

describe('mapVisit', () => {
  it('returns an empty object for a null page', () => {
    expect(mapVisit(null)).toEqual({})
  })

  it('passes structured fields through and nulls a missing image', () => {
    const result = mapVisit(
      page({
        venueName: ['Combinatul Fondului Plastic'],
        street: '15 Foo St',
        city: 'Bucharest',
        mapsUrl: 'https://maps.test/x',
        hoursLines: ['Daily 10–18'],
        amenities: [{ label: 'Cafe', icon: 'cafe' }],
        transport: [{ from: 'Piața Unirii', lines: 'M2', walk: '5 min' }],
      }),
    )
    expect(result.venueName).toEqual(['Combinatul Fondului Plastic'])
    expect(result.street).toBe('15 Foo St')
    expect(result.mapsUrl).toBe('https://maps.test/x')
    expect(result.amenities).toEqual([{ label: 'Cafe', icon: 'cafe' }])
    expect(result.transport).toEqual([{ from: 'Piața Unirii', lines: 'M2', walk: '5 min' }])
    expect(result.image).toBeNull()
  })

  it('resolves an authored image to a Sanity CDN url', () => {
    const result = mapVisit(
      page({
        image: {
          _type: 'image',
          alt: 'Venue',
          asset: { _type: 'reference', _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg' },
        },
      }),
    )
    expect(result.image?.src).toContain('cdn.sanity.io')
    expect(result.image?.alt).toBe('Venue')
  })
})

describe('normalizeAbout', () => {
  const raw = (fields: Record<string, unknown>) =>
    fields as unknown as Parameters<typeof normalizeAbout>[0]

  it('coalesces text to "" and lists to [], leaves genuine optionals absent', () => {
    const view = normalizeAbout(raw({}))
    expect(view.hero).toEqual({ title: '', titleAccent: '', lead: '' })
    expect(view.manifestoTitle).toBe('')
    expect(view.manifestoBody).toBe('')
    expect(view.pillars).toEqual([])
    expect(view.curatorLetter).toEqual([])
    expect(view.carouselEyebrow).toBe('Gallery') // the real default lives in the layer
    expect('placeImage' in view).toBe(false)
    expect('carousel' in view).toBe(false)
    expect('metaDescription' in view).toBe(false)
  })

  it('passes present fields through', () => {
    const view = normalizeAbout(
      raw({
        hero: { title: 'About', titleAccent: 'us', lead: 'Lead.' },
        manifestoTitle: 'Not a festival',
        manifestoBody: 'One paragraph.',
        pillars: [{ label: 'A', body: 'b' }],
        metaDescription: 'desc',
      }),
    )
    expect(view.hero.title).toBe('About')
    expect(view.manifestoTitle).toBe('Not a festival')
    expect(view.manifestoBody).toBe('One paragraph.')
    expect(view.pillars).toEqual([{ label: 'A', body: 'b' }])
    expect(view.metaDescription).toBe('desc')
  })

  it('coalesces a partial hero (missing nested fields → "")', () => {
    const view = normalizeAbout(raw({ hero: { title: 'About' } }))
    expect(view.hero).toEqual({ title: 'About', titleAccent: '', lead: '' })
  })

  it('coalesces nullish nested pillar fields to ""', () => {
    const view = normalizeAbout(raw({ pillars: [{ label: null, body: 'text' }] }))
    expect(view.pillars).toEqual([{ label: '', body: 'text' }])
  })

  it('drops null/empty entries from string lists', () => {
    const view = normalizeAbout(raw({ curatorLetter: [null, 'x'] }))
    expect(view.curatorLetter).toEqual(['x'])
  })
})

describe('normalizePartners', () => {
  const raw = (fields: Record<string, unknown>) =>
    fields as unknown as Parameters<typeof normalizePartners>[0]

  it('coalesces text/lists and leaves images + SEO absent', () => {
    const view = normalizePartners(raw({}))
    expect(view.hero).toEqual({ title: '', titleAccent: '', lead: '' })
    expect(view.eventBody).toEqual([])
    expect(view.whyPoints).toEqual([])
    expect(view.ctaLabel).toBe('')
    expect('eventImage' in view).toBe(false)
    expect('ogImage' in view).toBe(false)
  })

  it('maps whyPoints down to title/text, coalescing nullish nested fields', () => {
    const view = normalizePartners(
      raw({
        whyPoints: [
          { _key: 'k', title: 'T', text: 'x' },
          { _key: 'k2', title: null, text: 'y' },
        ],
      }),
    )
    expect(view.whyPoints).toEqual([
      { title: 'T', text: 'x' },
      { title: '', text: 'y' },
    ])
  })

  it('drops null/empty entries from eventBody', () => {
    const view = normalizePartners(raw({ eventBody: ['a', null, '', 'b'] }))
    expect(view.eventBody).toEqual(['a', 'b'])
  })
})

describe('normalizePrivacy', () => {
  const raw = (fields: Record<string, unknown>) =>
    fields as unknown as Parameters<typeof normalizePrivacy>[0]

  it('coalesces body to [] and updatedAt to ""', () => {
    const view = normalizePrivacy(raw({}))
    expect(view.body).toEqual([])
    expect(view.updatedAt).toBe('')
    expect(view.hero).toEqual({ title: '', titleAccent: '', lead: '' })
  })
})
