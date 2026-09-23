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
  md: { minWidth: px(breakpoints.md), gap: 20, width: [685, 89, 1162], height: [311, 58, 540] },
  lg: { minWidth: px(breakpoints.lg), gap: 20, width: [918, 90, 1464], height: [393, 66, 655] },
  xl: { minWidth: px(breakpoints.xl), gap: 20, width: [1071, 83, 1661], height: [437, 70, 721] },
  '2xl': {
    minWidth: px(breakpoints['2xl']),
    gap: 20,
    width: [1224, 81, 1857],
    height: [481, 72, 787],
  },
  '4xl': {
    minWidth: px(breakpoints['4xl']),
    gap: 20,
    width: [1398, 76, 2054],
    height: [524, 74, 852],
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
        '--slide-w-max': '[clamp(685px, 89vw, 1162px)]',
        '--slide-h-max': '[clamp(311px, 58vh, 540px)]',
      },
      lg: {
        '--slide-w-max': '[clamp(918px, 90vw, 1464px)]',
        '--slide-h-max': '[clamp(393px, 66vh, 655px)]',
      },
      xl: {
        '--slide-w-max': '[clamp(1071px, 83vw, 1661px)]',
        '--slide-h-max': '[clamp(437px, 70vh, 721px)]',
      },
      '2xl': {
        '--slide-w-max': '[clamp(1224px, 81vw, 1857px)]',
        '--slide-h-max': '[clamp(481px, 72vh, 787px)]',
      },
      '4xl': {
        '--slide-w-max': '[clamp(1398px, 76vw, 2054px)]',
        '--slide-h-max': '[clamp(524px, 74vh, 852px)]',
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
      _portraitPhone: { scrollSnapAlign: 'center' },
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
