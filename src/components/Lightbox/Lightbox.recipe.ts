import { sva } from 'styled-system/css'

// Full-screen image viewer: layout, controls, and gesture feedback. Dialog owns
// the modal state and shell; the backdrop alpha + drag transform stay inline.
export const lightbox = sva({
  slots: [
    'lightbox',
    'frame',
    'image',
    'close',
    'caption',
    'nav',
    'navPrev',
    'navNext',
    'preload',
    'preloadFrame',
  ],
  base: {
    lightbox: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateRows: '1fr',
      placeItems: 'center',
      width: 'full',
      height: 'full',
      background: 'surface.scrim',
      cursor: 'zoom-out',
      touchAction: 'none',
      overscrollBehavior: 'contain',
      md: {
        gridTemplateColumns:
          'token(sizes.lightboxNavColumn) minmax(0, 1fr) token(sizes.lightboxNavColumn)',
      },
    },
    frame: {
      position: 'relative',
      width: 'lightboxFrameWidth',
      height: '[85vh]',
      willChange: 'transform, opacity',
      md: { gridColumn: '2', width: 'full', height: '[90vh]' },
    },
    image: {
      objectFit: 'contain',
      transition: 'develop',
      userSelect: 'none',
    },

    // zIndex above the arrows (`nav`) so a near-miss resolves to close, not nav.
    close: {
      position: 'absolute',
      top: 'md',
      right: 'md',
      width: 'touch',
      height: 'touch',
      zIndex: '20',
      _hover: { transform: 'rotate(90deg)' },
      md: { top: 'lg', right: 'lg' },
    },
    caption: {
      position: 'absolute',
      bottom: 'lg',
      left: '[50%]',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
    },
    nav: {
      width: 'lightboxNavColumn',
      height: 'lightboxNavHit',
      zIndex: '10',
      display: 'none',
      // Explicit row: auto-placement has moved past the frame (column 2), so a
      // column-only arrow lands on an implicit row 2, clipped below the dialog.
      md: { display: 'inline-flex', gridRow: '1' },
    },
    navPrev: { gridColumn: '1' },
    navNext: { gridColumn: '3' },

    // Off-screen N±1 prefetch of optimized variants.
    preload: {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '[1px]',
      height: '[1px]',
      overflow: 'hidden',
      opacity: 0,
      pointerEvents: 'none',
      zIndex: '[-1]',
    },
    preloadFrame: { position: 'relative', width: '[100vw]', height: '[100vh]' },
  },
})
