import { sva } from 'styled-system/css'

/**
 * GalleryCarousel — authored slide content inside the shared rail Carousel.
 *
 * The shared Carousel owns interaction and controls; this recipe owns only the
 * authored image-grid layouts and lightbox-trigger presentation.
 */
export const galleryCarousel = sva({
  slots: ['slide', 'item', 'frame', 'itemImage'],
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
      md: { '--slide-gap': 'token(spacing.md)' },
    },

    item: {
      display: 'block',
      border: 'hairline',
      position: 'relative',
      cursor: 'pointer',
      background: 'surface',
      '--photo-inset': '0px',
      '& img': {
        transition: 'develop',
      },
      _hover: {
        '--photo-inset': 'calc(token(spacing.sm) * 1.5)',
        '& img': { transform: 'scale(1.12)' },
      },
    },
    frame: {
      position: 'absolute',
      inset: '0',
      overflow: 'hidden',
      // exception: image placeholder fallback, raised-dark surface
      background: 'gray.900',
      clipPath: 'inset(var(--photo-inset, 0px))',
      transition: 'develop',
    },
    // Drag prevention comes from the Figure's `draggable={false}` attribute.
    itemImage: { objectFit: 'cover', background: 'gray.900' },
  },
  variants: {
    size: {
      default: {
        slide: {
          '--slide-w-max': '[clamp(320px, 92vw, 540px)]',
          '--slide-h-max': '[clamp(180px, 40vh, 340px)]',
          md: {
            '--slide-w-max': '[clamp(600px, 81vw, 990px)]',
            '--slide-h-max': '[clamp(240px, 42vh, 400px)]',
          },
          lg: {
            '--slide-w-max': '[clamp(730px, 73vw, 1140px)]',
            '--slide-h-max': '[clamp(280px, 44vh, 440px)]',
          },
          xl: {
            '--slide-w-max': '[clamp(830px, 62vw, 1250px)]',
            '--slide-h-max': '[clamp(300px, 45vh, 480px)]',
          },
          '2xl': {
            '--slide-w-max': '[clamp(940px, 59vw, 1350px)]',
            '--slide-h-max': '[clamp(320px, 46vh, 520px)]',
          },
          '4xl': {
            '--slide-w-max': '[clamp(1040px, 55vw, 1460px)]',
            '--slide-h-max': '[clamp(340px, 47vh, 560px)]',
          },
        },
      },
      large: {
        slide: {
          '--slide-w-max': '[clamp(320px, 92vw, 600px)]',
          '--slide-h-max': '[clamp(200px, 48vh, 400px)]',
          md: {
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
        },
      },
    },
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
          _hover: { '& img': { filter: '[token(assets.monoReveal)]' } },
        },
      },
      color: {
        item: {
          '& img': { filter: '[token(assets.color)]' },
        },
      },
    },
  },
  defaultVariants: { treatment: 'mono', size: 'default' },
})
