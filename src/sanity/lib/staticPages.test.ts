import { describe, expect, it } from 'vitest'
import {
  buildFaq,
  mapVisit,
  normalizeAbout,
  normalizePartners,
  normalizePrivacy,
  type VisitPage,
} from '@/sanity/lib/staticPages-mappers'

// buildFaq / mapVisit only read a handful of fields off the page; the cast
// keeps fixtures small without reconstructing the full generated query type.
function page(fields: Record<string, unknown>): VisitPage {
  return fields as unknown as VisitPage
}

describe('buildFaq', () => {
  it('returns no entries for a null page', () => {
    expect(buildFaq(null)).toEqual([])
  })

  it('returns no entries when the page has no editorial FAQ', () => {
    expect(buildFaq(page({}))).toEqual([])
  })

  it('does not restate the structured fields the facts block already renders', () => {
    expect(
      buildFaq(page({ hoursLines: ['Daily 10–18'], street: '15 Foo St', city: 'Bucharest' })),
    ).toEqual([])
  })

  it('keeps editorial entries in order, skipping incomplete rows', () => {
    const entries = buildFaq(
      page({
        faq: [
          { question: 'Tickets?', answer: 'Free entry.' },
          { question: 'Missing answer?', answer: '' },
          { question: '', answer: 'Missing question' },
          { question: 'Parking?', answer: 'On site.' },
        ],
      }),
    )
    expect(entries).toEqual([
      { question: 'Tickets?', answer: 'Free entry.' },
      { question: 'Parking?', answer: 'On site.' },
    ])
  })
})

describe('mapVisit', () => {
  it('defaults absent fields to empty strings/arrays and omits optionals', () => {
    const result = mapVisit(page({}))
    expect(result.venueName).toEqual([])
    expect(result.street).toBe('')
    expect(result.city).toBe('')
    expect(result.hoursLines).toEqual([])
    expect(result.amenities).toEqual([])
    expect(result.transport).toEqual([])
    expect('mapsUrl' in result).toBe(false)
    expect('image' in result).toBe(false)
  })

  it('passes structured fields through and omits a missing image', () => {
    const result = mapVisit(
      page({
        venueName: ['Combinatul Fondului Plastic'],
        street: '15 Foo St',
        city: 'Bucharest',
        mapsUrl: 'https://maps.test/x',
        hoursLines: ['Daily 10–18'],
        amenities: [{ label: 'Cafe', icon: 'cafe' }],
        transport: [{ stop: 'Bd. Poligrafiei', lines: 'Bus 112', walk: '5 min walk' }],
      }),
    )
    expect(result.venueName).toEqual(['Combinatul Fondului Plastic'])
    expect(result.street).toBe('15 Foo St')
    expect(result.mapsUrl).toBe('https://maps.test/x')
    expect(result.amenities).toEqual([{ label: 'Cafe', icon: 'cafe' }])
    expect(result.transport).toEqual([
      { stop: 'Bd. Poligrafiei', lines: 'Bus 112', walk: '5 min walk' },
    ])
    expect('image' in result).toBe(false)
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
    expect(view.hero).toEqual({ title: '', lead: '' })
    expect(view.manifestoTitle).toBe('')
    expect(view.manifestoBody).toBe('')
    expect(view.pillars).toEqual([])
    expect(view.curatorLetter).toEqual([])
    expect(view.carousel).toEqual([])
    expect(view.carouselEyebrow).toBe('From the archive') // the real default lives in the layer
    expect('placeImage' in view).toBe(false)
    expect('metaDescription' in view).toBe(false)
  })

  it('passes present fields through', () => {
    const view = normalizeAbout(
      raw({
        hero: { title: 'About', lead: 'Lead.' },
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
    expect(view.hero).toEqual({ title: 'About', lead: '' })
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
    expect(view.hero).toEqual({ title: '', lead: '' })
    expect(view.eventBody).toEqual([])
    expect(view.whyPoints).toEqual([])
    expect(view.ctaLabel).toBe('')
    expect('eventImage' in view).toBe(false)
    expect('ogImage' in view).toBe(false)
  })

  it('maps whyPoints down to title/text, dropping the _key', () => {
    const view = normalizePartners(
      raw({
        whyPoints: [
          { _key: 'k', title: 'T', text: 'x' },
          { _key: 'k2', title: 'T2', text: 'y' },
        ],
      }),
    )
    expect(view.whyPoints).toEqual([
      { title: 'T', text: 'x' },
      { title: 'T2', text: 'y' },
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
    expect(view.hero).toEqual({ title: '', lead: '' })
  })
})
