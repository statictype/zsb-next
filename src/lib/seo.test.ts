import { describe, expect, it, vi } from 'vitest'
import { rollUpVenue } from '@/lib/venues'
import type { CalendarEvent, Edition } from '@/types/edition'

// seo.ts imports the live data layer at module load; defineLive() throws
// outside React Server Components, and the functions under test are pure and
// never touch it. Stub the module so the import resolves.
vi.mock('@/sanity/lib/live', () => ({
  getDynamicFetchOptions: async () => ({ perspective: 'published', stega: false }),
}))

import {
  editionBreadcrumbJsonLd,
  editionEventJsonLd,
  editionMetadata,
  organizationJsonLd,
  pressAppearancesJsonLd,
  visitFaqJsonLd,
} from './seo'

// A minimal event at a venue. `parent` sets the bigger place it sits inside (a
// studio inside CFP) — which is what the JSON-LD rolls Places up to.
function event(venueName: string, parent?: string): CalendarEvent {
  return {
    key: `${venueName}-${parent ?? ''}`,
    slug: 'event',
    name: `Event at ${venueName}`,
    startDate: '2024-04-16',
    types: [],
    venue: {
      name: venueName,
      type: 'Gallery',
      ...(parent ? { partOf: { name: parent, type: 'Cultural centre' } } : {}),
      rollUp: rollUpVenue({
        name: venueName,
        type: 'Gallery',
        ...(parent ? { partOf: { name: parent, type: 'Cultural centre' } } : {}),
      }),
    },
    description: '',
    featured: false,
  }
}

function makeEdition(overrides: Partial<Edition> = {}): Edition {
  return {
    year: 2024,
    theme: 'Common Ground',
    themeHighlight: 'Ground',
    title: 'ZSB 2024 — Common Ground',
    heroImage: { src: 'https://cdn.example/hero.jpg', alt: 'hero' },
    dateTape: '16 April – 11 May 2024 · Bucharest',
    dateStart: '2024-04-16',
    dateEnd: '2024-05-11',
    venueLine: 'Combinatul Fondului Plastic',
    manifesto: { title: 'A title', highlight: 'title', body: 'The manifesto body.' },
    themeSection: { body: 'Theme body.' },
    artists: ['Mircea Roman', 'Ana Rus'],
    events: [event('Combinatul Fondului Plastic'), event('Partner Venues')],
    credits: [{ type: 'primary', label: 'Curator', value: 'Reka Csapo Dup' }],
    ...overrides,
  }
}

describe('editionEventJsonLd', () => {
  it('emits a schema.org Event with the core fields', () => {
    const ld = editionEventJsonLd(makeEdition())
    expect(ld['@type']).toBe('Event')
    expect(ld.name).toBe('Bucharest Sculpture Days 2024 — Common Ground')
    expect(ld.startDate).toBe('2024-04-16')
    expect(ld.endDate).toBe('2024-05-11')
    expect(ld.url).toBe('https://sculpturedays.com/editions/2024')
    expect(ld.image).toEqual(['https://cdn.example/hero.jpg'])
  })

  it('maps artists to performers', () => {
    const ld = editionEventJsonLd(makeEdition())
    expect(ld.performer).toEqual([
      { '@type': 'Person', name: 'Mircea Roman' },
      { '@type': 'Person', name: 'Ana Rus' },
    ])
  })

  it('emits one distinct Place per top-level venue, as an array when multi-site', () => {
    const ld = editionEventJsonLd(
      makeEdition({
        // Two events roll up to CFP (one directly, one via a sub-venue), one to
        // a partner venue → two distinct Places.
        events: [
          event('Combinatul Fondului Plastic'),
          event('Studio 3', 'Combinatul Fondului Plastic'),
          event('Partner Venues'),
        ],
      }),
    )
    expect(Array.isArray(ld.location)).toBe(true)
    expect((ld.location as Array<{ name: string }>).map((p) => p.name)).toEqual([
      'Combinatul Fondului Plastic',
      'Partner Venues',
    ])
  })

  it('uses a single Place object when there is one location', () => {
    const ld = editionEventJsonLd(makeEdition({ events: [event('Sole Venue')] }))
    expect(Array.isArray(ld.location)).toBe(false)
    expect((ld.location as { '@type': string; name: string })['@type']).toBe('Place')
    expect((ld.location as { name: string }).name).toBe('Sole Venue')
  })

  it('falls back to venueLine then "Bucharest" when no events are authored', () => {
    const fromLine = editionEventJsonLd(makeEdition({ events: [], venueLine: 'Some Hall' }))
    expect((fromLine.location as { name: string }).name).toBe('Some Hall')

    const fallback = editionEventJsonLd(makeEdition({ events: [], venueLine: '' }))
    expect((fallback.location as { name: string }).name).toBe('Bucharest')
  })

  it('omits start/end dates when they are empty', () => {
    const ld = editionEventJsonLd(makeEdition({ dateStart: '', dateEnd: '' }))
    expect(ld).not.toHaveProperty('startDate')
    expect(ld).not.toHaveProperty('endDate')
  })
})

describe('editionBreadcrumbJsonLd', () => {
  it('builds a two-item Home → edition breadcrumb', () => {
    const ld = editionBreadcrumbJsonLd(makeEdition())
    expect(ld['@type']).toBe('BreadcrumbList')
    expect(ld.itemListElement).toHaveLength(2)
    expect(ld.itemListElement[1]).toMatchObject({
      position: 2,
      name: '2024 — Common Ground',
      item: 'https://sculpturedays.com/editions/2024',
    })
  })
})

describe('editionMetadata', () => {
  it('prefers the authored meta description', () => {
    const meta = editionMetadata(makeEdition({ metaDescription: 'Authored description.' }))
    expect(meta.description).toBe('Authored description.')
    expect(meta.title).toBe('2024 — Common Ground')
    expect(meta.alternates?.canonical).toBe('/editions/2024')
  })

  it('falls back to the manifesto body, truncated on a word boundary', () => {
    const body = `${'word '.repeat(60)}END`.trim() // > 155 chars
    // No metaDescription on the fixture → the manifesto-body fallback applies.
    const meta = editionMetadata(makeEdition({ manifesto: { title: 't', highlight: 'h', body } }))
    const description = meta.description as string
    expect(description.length).toBeLessThanOrEqual(156)
    expect(description.endsWith('…')).toBe(true)
    expect(description).not.toContain('  ') // cut at a space, no dangling double space
  })
})

describe('visitFaqJsonLd', () => {
  it('wraps each entry as a Question with an accepted Answer', () => {
    const ld = visitFaqJsonLd([{ question: 'When?', answer: 'In May.' }])
    expect(ld['@type']).toBe('FAQPage')
    expect(ld.mainEntity).toEqual([
      {
        '@type': 'Question',
        name: 'When?',
        acceptedAnswer: { '@type': 'Answer', text: 'In May.' },
      },
    ])
  })
})

describe('organizationJsonLd', () => {
  it('includes non-empty sameAs links and drops blanks', () => {
    const ld = organizationJsonLd({ sameAs: ['https://instagram.com/zsb', '', null, undefined] })
    expect(ld.sameAs).toEqual(['https://instagram.com/zsb'])
    expect(ld.alternateName).toBe('ZSB')
  })

  it('omits sameAs entirely when there are no links', () => {
    const ld = organizationJsonLd({ sameAs: [] })
    expect(ld).not.toHaveProperty('sameAs')
  })
})

describe('pressAppearancesJsonLd', () => {
  it('filters out rows missing url, title, or medium', () => {
    const ld = pressAppearancesJsonLd([
      { medium: 'article', title: 'Real', year: 2024, url: 'https://a.test' },
      { medium: null, title: 'No medium', year: 2024, url: 'https://b.test' },
      { medium: 'video', title: null, year: 2024, url: 'https://c.test' },
      { medium: 'audio', title: 'No url', year: 2024, url: null },
    ])
    expect(ld.itemListElement).toHaveLength(1)
    expect(ld.itemListElement[0]).toMatchObject({ position: 1 })
  })

  it('maps medium to the schema.org type and carries optional fields', () => {
    const ld = pressAppearancesJsonLd([
      { medium: 'video', title: 'V', year: 2023, url: 'https://v.test', excerpt: 'clip' },
      { medium: 'audio', title: 'A', year: null, url: 'https://a.test' },
      { medium: 'article', title: 'Art', year: 2022, url: 'https://art.test' },
    ])
    const types = ld.itemListElement.map((li) => (li.item as { '@type': string })['@type'])
    expect(types).toEqual(['VideoObject', 'AudioObject', 'Article'])

    const positions = ld.itemListElement.map((li) => li.position)
    expect(positions).toEqual([1, 2, 3])

    const video = ld.itemListElement[0]!.item as Record<string, unknown>
    expect(video.description).toBe('clip')
    expect(video.datePublished).toBe('2023')

    const audio = ld.itemListElement[1]!.item as Record<string, unknown>
    expect(audio).not.toHaveProperty('datePublished')
  })
})
