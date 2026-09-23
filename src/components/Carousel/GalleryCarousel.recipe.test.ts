import { describe, expect, it } from 'vitest'
import {
  clampCss,
  galleryCarousel,
  SLIDE_ASPECT,
  SLIDE_BAND_KEYS,
  SLIDE_BANDS,
  slideHeightCap,
} from '@/components/Carousel/GalleryCarousel.recipe'

const slide = galleryCarousel.raw({}).slide as Record<string, unknown>

const bandStyles = (band: string) =>
  (band === 'base' ? slide : slide[band]) as Record<string, string>

describe('gallery slide bands', () => {
  it('match the clamps the recipe declares', () => {
    expect(slide['--slide-h']).toBe(
      `min(var(--slide-h-max), calc((var(--slide-w-max) - var(--slide-gap) * 2) / ${SLIDE_ASPECT}))`,
    )
    for (const band of SLIDE_BAND_KEYS) {
      expect(bandStyles(band)['--slide-w-max']).toBe(`[${clampCss(SLIDE_BANDS[band].width, 'vw')}]`)
      expect(bandStyles(band)['--slide-h-max']).toBe(
        `[${clampCss(SLIDE_BANDS[band].height, 'vh')}]`,
      )
    }
  })

  it('cap the slide height at the top of each band', () => {
    expect(SLIDE_BAND_KEYS.map((band) => [band, slideHeightCap(band)])).toEqual([
      ['base', 260],
      ['md', 387],
      ['lg', 494],
      ['xl', 514],
      ['2xl', 627],
      ['4xl', 852],
    ])
  })
})
