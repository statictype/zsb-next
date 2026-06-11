import { describe, expect, it } from 'vitest'
import { mapCarousel } from './carousel'

function img(n: number) {
  return {
    caption: `caption ${n}`,
    image: { asset: { _ref: `image-slide${n}-100x100-jpg` }, alt: `alt ${n}` },
  }
}

describe('mapCarousel (ADR 0010)', () => {
  it('returns undefined for missing or empty input', () => {
    expect(mapCarousel(null)).toBeUndefined()
    expect(mapCarousel(undefined)).toBeUndefined()
    expect(mapCarousel([])).toBeUndefined()
  })

  it('keeps slides whose image count matches their layout', () => {
    const slides = mapCarousel([
      { layout: 'full', images: [img(1)] },
      { layout: 'duo', images: [img(2), img(3)] },
      { layout: 'trio', images: [img(4), img(5), img(6)] },
    ])
    expect(slides?.map((s) => s.layout)).toEqual(['full', 'duo', 'trio'])
    expect(slides?.[0]?.images[0]?.caption).toBe('caption 1')
    expect(slides?.[0]?.images[0]?.image.src).toContain('slide1-100x100.jpg')
  })

  it('drops slides with an unknown layout or a mismatched image count', () => {
    const slides = mapCarousel([
      { layout: 'mosaic', images: [img(1)] },
      { layout: 'duo', images: [img(2)] },
      { layout: 'full', images: [img(3)] },
    ])
    expect(slides).toHaveLength(1)
    expect(slides?.[0]?.layout).toBe('full')
  })

  it('returns undefined when every slide is dropped', () => {
    expect(mapCarousel([{ layout: 'nope', images: [img(1)] }])).toBeUndefined()
  })

  it('fails fast on a slide image without an asset (schema-required)', () => {
    expect(() => mapCarousel([{ layout: 'full', images: [{ caption: 'x', image: {} }] }])).toThrow(
      'Missing asset on carousel image',
    )
  })
})
