import { describe, expect, it } from 'vitest'
import { flattenKit } from '@/sanity/lib/press-mappers'

type RawKit = Parameters<typeof flattenKit>[0]

// Minimal raw press-kit edition — only the fields flattenKit reads; the cast
// keeps fixtures small without reconstructing the full generated query type.
function kit(fields: Record<string, unknown>): RawKit[number] {
  return fields as unknown as RawKit[number]
}

const asset = (url: string, lqip?: string) => ({
  asset: { url, ...(lqip ? { metadata: { lqip } } : {}) },
})

describe('flattenKit', () => {
  it('emits a cover and a poster item per edition, year-tagged', () => {
    const items = flattenKit([
      kit({
        year: 2024,
        coverPhoto: asset('https://cdn/c.jpg'),
        poster: asset('https://cdn/p.jpg'),
      }),
    ])
    expect(items).toEqual([
      {
        year: 2024,
        label: 'Photography',
        name: 'Exhibition Cover',
        image: { src: 'https://cdn/c.jpg', alt: 'ZSB 2024 cover' },
      },
      {
        year: 2024,
        label: 'Key Visual',
        name: 'Official Poster',
        image: { src: 'https://cdn/p.jpg', alt: 'ZSB 2024 poster' },
      },
    ])
  })

  it('prefers an authored alt and carries the LQIP through as a blur source', () => {
    const [cover] = flattenKit([
      kit({ year: 2024, coverPhoto: { ...asset('https://cdn/c.jpg', 'data:blur'), alt: 'Hall' } }),
    ])
    expect(cover?.image).toEqual({
      src: 'https://cdn/c.jpg',
      alt: 'Hall',
      blurDataURL: 'data:blur',
    })
  })

  it('skips an edition with no year and an asset with no url', () => {
    expect(flattenKit([kit({ coverPhoto: asset('https://cdn/c.jpg') })])).toEqual([])
    expect(flattenKit([kit({ year: 2024, poster: { asset: {} } })])).toEqual([])
  })
})
