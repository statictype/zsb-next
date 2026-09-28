import { describe, expect, it } from 'vitest'
import { mapGaleriaBeller, paragraphs } from '@/sanity/lib/galeria-beller-mappers'

type Raw = Parameters<typeof mapGaleriaBeller>[0]

const ASSET = { asset: { _ref: 'image-abc123def456-1200x800-png' }, alt: 'Galeria Beller' }

function raw(fields: Partial<Record<keyof Raw, unknown>> = {}): Raw {
  return {
    title: 'Galeria Beller',
    heroColor: '#e89124',
    wordmark: ASSET,
    keyVisual: ASSET,
    facts: { period: '3–4 octombrie 2026', location: 'strada Radu Beller', theme: 'Strada' },
    info: { title: 'Titlu', body: 'Text' },
    programIntro: null,
    artists: [
      { _id: 'a', name: 'Alin Carpen', sortName: null, slug: 'alin-carpen', hasPage: true },
      { _id: 'b', name: 'Fără Lucrări', sortName: null, slug: 'fara-lucrari', hasPage: false },
    ],
    events: null,
    credits: null,
    pressKit: { title: 'Press kit', body: null, buttonLabel: 'Descarcă', file: null },
    footerText: null,
    ogImage: null,
    metaDescription: null,
    ...fields,
  } as Raw
}

describe('mapGaleriaBeller', () => {
  it('links only artists that have a page', () => {
    const { artists } = mapGaleriaBeller(raw())
    expect(artists).toEqual([
      { _id: 'a', name: 'Alin Carpen', href: '/artists/alin-carpen' },
      { _id: 'b', name: 'Fără Lucrări' },
    ])
  })

  it('reads the hero image dimensions from the asset ref', () => {
    const { wordmark, keyVisual } = mapGaleriaBeller(raw())
    expect(wordmark).toMatchObject({ width: 1200, height: 800 })
    expect(keyVisual).toMatchObject({ width: 1200, height: 800 })
  })

  it('derives the artist count fact', () => {
    const { facts } = mapGaleriaBeller(raw())
    expect(facts.map((f) => f.label)).toEqual(['Perioada', 'Locație', 'Artiști', 'Temă'])
    expect(facts[2]?.value).toBe('2')
  })

  it('omits the press kit until a file is uploaded', () => {
    expect(mapGaleriaBeller(raw()).pressKit).toBeUndefined()
    const withFile = mapGaleriaBeller(
      raw({
        pressKit: {
          title: 'Press kit',
          body: 'Unu\n\nDoi',
          buttonLabel: 'Descarcă',
          file: {
            url: 'https://cdn.sanity.io/files/x.zip',
            size: 2_500_000,
            originalFilename: 'kit beller.zip',
          },
        },
      }),
    )
    expect(withFile.pressKit).toEqual({
      title: 'Press kit',
      body: ['Unu', 'Doi'],
      buttonLabel: 'Descarcă',
      href: 'https://cdn.sanity.io/files/x.zip?dl=kit%20beller.zip',
      sizeBytes: 2_500_000,
    })
  })

  it('falls back to the key visual for the share image', () => {
    expect(mapGaleriaBeller(raw()).ogImage?.url).toContain('cdn.sanity.io')
  })
})

describe('paragraphs', () => {
  it('splits on blank lines and drops empties', () => {
    expect(paragraphs('a\n\n  \nb\nc\n\n')).toEqual(['a', 'b\nc'])
    expect(paragraphs(null)).toEqual([])
  })
})
