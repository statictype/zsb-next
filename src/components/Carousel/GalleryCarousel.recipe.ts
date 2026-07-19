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
      layerStyle: 'galleryRailFrame',
      display: 'grid',
      gap: 'sm',
      boxSizing: 'border-box',
      gridTemplateRows: '1fr',
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
        filter: '[token(assets.galleryDevelopRest)]',
      },
      _hover: {
        '& img': { transform: 'scale(1.05)', filter: '[token(assets.galleryDevelopHover)]' },
        '&::before': { opacity: 1, animationStyle: 'gradientBorder' },
      },
      // Gradient border hover effect (masked ring).
      _before: {
        content: '""',
        layerStyle: 'gradientBorder',
        padding: '[token(borderWidths.gradientRing)]',
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
  },
})
