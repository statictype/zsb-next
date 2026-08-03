import { sva } from 'styled-system/css'

/**
 * GalleryCarousel — authored slide content inside the shared rail Carousel.
 *
 * The shared Carousel owns interaction and controls; this recipe owns only the
 * authored image-grid layouts and lightbox-trigger presentation.
 */
export const galleryCarousel = sva({
  slots: ['slide', 'item', 'itemImage'],
  base: {
    slide: {
      display: 'grid',
      gap: 'sm',
      boxSizing: 'border-box',
      gridTemplateRows: '1fr',
      width: {
        base: '[clamp(360px, 92vw, 540px)]',
        md: '[clamp(600px, 81vw, 990px)]',
        lg: '[clamp(730px, 73vw, 1140px)]',
        xl: '[clamp(830px, 62vw, 1250px)]',
        '2xl': '[clamp(940px, 59vw, 1350px)]',
        '4xl': '[clamp(1040px, 55vw, 1460px)]',
      },
      height: {
        base: '[28vh]',
        md: '[35vh]',
        lg: '[40vh]',
        xl: '[42vh]',
        '2xl': '[43vh]',
        '4xl': '[44vh]',
      },
      '@media (max-width: 767px) and (orientation: landscape)': { height: '[73vh]' },
      md: { gap: 'md' },
    },

    item: {
      // Native <button> without preflight — strip the UA chrome.
      display: 'block',
      border: 'none',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      // exception: image placeholder fallback, raised-dark surface
      background: 'gray.900',
      '& img': {
        transition: 'develop',
      },
      _hover: {
        '& img': { transform: 'scale(1.05)' },
        '&::before': { opacity: 1, animationStyle: 'gradientBorder' },
      },
      // Gradient border hover effect (masked ring).
      _before: {
        content: '""',
        layerStyle: 'gradientBorder',
        padding: '[token(borderWidths.hairline)]',
      },
    },
    // Drag prevention comes from the Figure's `draggable={false}` attribute.
    itemImage: { objectFit: 'cover', background: 'gray.900' },
  },
  variants: {
    layout: {
      trio: { slide: { gridTemplateColumns: 'repeat(3, 1fr)' } },
      duo: { slide: { gridTemplateColumns: 'repeat(2, 1fr)' } },
      'featured-portrait': { slide: { gridTemplateColumns: '2fr 1fr' } },
      'featured-stack': {
        slide: {
          gridTemplateColumns: '2fr 1fr',
          gridTemplateRows: '1fr 1fr',
          '& > *:first-child': { gridRow: '1 / -1' },
        },
      },
      full: { slide: { gridTemplateColumns: '1fr' } },
    },
    treatment: {
      mono: {
        item: {
          '& img': { filter: '[token(assets.mono)]' },
          _hover: { '& img': { filter: '[token(assets.monoHover)]' } },
        },
      },
      color: {
        item: {
          '& img': { filter: '[token(assets.color)]' },
          _hover: { '& img': { filter: '[token(assets.colorHover)]' } },
        },
      },
    },
  },
  defaultVariants: { treatment: 'mono' },
})
