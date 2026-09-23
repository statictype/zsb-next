import { sva } from 'styled-system/css'
import { breakpoints } from '@/design-system/tokens'

type Clamp = [min: number, preferredViewportPercent: number, max: number]

interface SlideBand {
  minWidth: number
  gap: number
  width: Clamp
  height: Clamp
}

const px = (value: string) => Number.parseInt(value, 10)

export const SLIDE_BANDS = {
  base: { minWidth: 0, gap: 8, width: [320, 92, 600], height: [200, 48, 400] },
  md: { minWidth: px(breakpoints.md), gap: 20, width: [660, 86, 1120], height: [300, 56, 520] },
  lg: { minWidth: px(breakpoints.lg), gap: 20, width: [840, 82, 1340], height: [360, 60, 600] },
  xl: { minWidth: px(breakpoints.xl), gap: 20, width: [980, 76, 1520], height: [400, 64, 660] },
  '2xl': {
    minWidth: px(breakpoints['2xl']),
    gap: 20,
    width: [1120, 74, 1700],
    height: [440, 66, 720],
  },
  '4xl': {
    minWidth: px(breakpoints['4xl']),
    gap: 20,
    width: [1280, 70, 1880],
    height: [480, 68, 780],
  },
} satisfies Record<string, SlideBand>

export type SlideBandKey = keyof typeof SLIDE_BANDS

export const SLIDE_BAND_KEYS = Object.keys(SLIDE_BANDS) as SlideBandKey[]

export const SLIDE_ASPECT = 2.25

export const clampCss = ([min, viewport, max]: Clamp, unit: 'vw' | 'vh') =>
  `clamp(${min}px, ${viewport}${unit}, ${max}px)`

export function slideHeightCap(key: SlideBandKey) {
  const band = SLIDE_BANDS[key]
  const next = SLIDE_BAND_KEYS[SLIDE_BAND_KEYS.indexOf(key) + 1]
  const viewport = next ? SLIDE_BANDS[next].minWidth - 1 : Number.POSITIVE_INFINITY
  const width = Math.min(band.width[2], (band.width[1] / 100) * viewport)
  return Math.ceil(Math.min(band.height[2], (width - band.gap * 2) / SLIDE_ASPECT))
}

export const galleryCarousel = sva({
  slots: ['slide', 'item', 'itemImage', 'caption'],
  base: {
    slide: {
      display: 'grid',
      boxSizing: 'border-box',
      gridTemplateRows: '1fr',
      '--slide-gap': 'token(spacing.sm)',
      '--slide-h':
        'min(var(--slide-h-max), calc((var(--slide-w-max) - var(--slide-gap) * 2) / 2.25))',
      gap: '[var(--slide-gap)]',
      height: '[var(--slide-h)]',
      width: '[max-content]',
      '--slide-w-max': '[clamp(320px, 92vw, 600px)]',
      '--slide-h-max': '[clamp(200px, 48vh, 400px)]',
      md: {
        '--slide-gap': 'token(spacing.md)',
        '--slide-w-max': '[clamp(660px, 86vw, 1120px)]',
        '--slide-h-max': '[clamp(300px, 56vh, 520px)]',
      },
      lg: {
        '--slide-w-max': '[clamp(840px, 82vw, 1340px)]',
        '--slide-h-max': '[clamp(360px, 60vh, 600px)]',
      },
      xl: {
        '--slide-w-max': '[clamp(980px, 76vw, 1520px)]',
        '--slide-h-max': '[clamp(400px, 64vh, 660px)]',
      },
      '2xl': {
        '--slide-w-max': '[clamp(1120px, 74vw, 1700px)]',
        '--slide-h-max': '[clamp(440px, 66vh, 720px)]',
      },
      '4xl': {
        '--slide-w-max': '[clamp(1280px, 70vw, 1880px)]',
        '--slide-h-max': '[clamp(480px, 68vh, 780px)]',
      },
      _portraitPhone: {
        '--slide-gap': 'token(spacing.md)',
        '--slide-w': '[calc((100vw - token(spacing.gutter) - token(spacing.md)) / 1.125)]',
        gridTemplateColumns: '[none]',
        gridTemplateRows: '[1fr]',
        gridAutoFlow: 'column',
        gridAutoColumns: '[var(--slide-w)]',
        width: '[auto]',
        height: '[var(--slide-w)]',
      },
    },

    item: {
      border: 'hairline',
      _portraitPhone: { scrollSnapAlign: 'start' },
      position: 'relative',
      overflow: 'hidden',
      transition: 'develop',
      _hover: { '& [data-caption]': { opacity: 1, transform: 'none' } },
      _focusVisible: { '& [data-caption]': { opacity: 1, transform: 'none' } },
      '@media (hover: hover)': { _focusVisible: { outline: 'none' } },
    },
    // Drag prevention comes from the Figure's `draggable={false}` attribute.
    itemImage: { objectFit: 'cover', background: 'gray.900', transition: 'develop' },
    caption: {
      position: 'absolute',
      insetInline: '0',
      bottom: '0',
      zIndex: '1',
      display: 'none',
      paddingInline: 'sm',
      paddingBlock: 'xs',
      background: 'action',
      fontFamily: 'display',
      fontSize: 'sm',
      textTransform: 'uppercase',
      textAlign: 'left',
      color: 'gray.900',
      opacity: 0,
      transform: 'translateY(100%)',
      transition: 'develop',
      pointerEvents: 'none',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      '@media (hover: hover)': { display: 'block' },
      '[data-engine] [aria-roledescription="slide"]:not([data-current]) > [data-carousel-slide-content] &':
        { opacity: 0, transform: 'translateY(100%)' },
    },
  },
  variants: {
    layout: {
      trio: { slide: { gridTemplateColumns: '[repeat(3, calc(var(--slide-h) * 0.75))]' } },
      duo: { slide: { gridTemplateColumns: '[repeat(2, var(--slide-h))]' } },
      'featured-portrait': {
        slide: {
          gridTemplateColumns: '[calc(var(--slide-h) * 1.5) calc(var(--slide-h) * 0.75)]',
        },
      },
      'featured-stack': {
        slide: {
          gridTemplateColumns:
            '[calc(var(--slide-h) * 1.5) calc((var(--slide-h) - var(--slide-gap)) * 0.75)]',
          gridTemplateRows: '[1fr 1fr]',
          '& > *:first-child': { gridRow: '1 / -1' },
        },
      },
      full: { slide: { gridTemplateColumns: '[calc(var(--slide-h) * 1.5)]' } },
    },
    treatment: {
      mono: {
        item: {
          '& img': { filter: '[token(assets.mono)]' },
          '&:hover, &:focus-visible': { '& img': { filter: '[token(assets.monoReveal)]' } },
        },
      },
      color: {
        item: {
          '& img': { filter: '[token(assets.color)]' },
        },
      },
    },
  },
  defaultVariants: { treatment: 'mono' },
})
