import { sva } from 'styled-system/css'

/**
 * Lightbox — co-located slot recipe.
 *
 * Full-screen image viewer with swipe/drag. The close + prev/next adopt the
 * `<IconButton>` primitive (tone `default` = white→action); their positioning
 * and per-control motion (close rotates, arrows nudge) layer on via the slot
 * classes. The backdrop alpha + drag transform stay inline (request-driven).
 *
 * Open state → `data-active` on the backdrop.
 */
export const lightbox = sva({
  slots: [
    'lightbox',
    'frame',
    'image',
    'close',
    'caption',
    'navPrev',
    'navNext',
    'preload',
    'preloadFrame',
  ],
  base: {
    lightbox: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.95)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0,
      visibility: 'hidden',
      transition: 'opacity 0.4s ease, visibility 0.4s ease',
      cursor: 'zoom-out',
      touchAction: 'none',
      overscrollBehavior: 'contain',
      '&[data-active=true]': { opacity: 1, visibility: 'visible' },
    },
    frame: {
      position: 'relative',
      width: '90vw',
      height: '85vh',
      willChange: 'transform, opacity',
      md: { width: 'calc(100vw - 160px)', height: '90vh' },
    },
    // Drag prevention comes from the Image's `draggable={false}` attribute.
    image: { objectFit: 'contain', transition: 'opacity 0.3s ease', userSelect: 'none' },

    // Positioned over the dark backdrop; IconButton supplies size + white→action.
    close: {
      position: 'absolute',
      top: 'md',
      right: 'md',
      zIndex: 10,
      _hover: { transform: 'rotate(90deg)' },
      md: { top: '32px', right: '32px' },
    },
    caption: {
      position: 'absolute',
      bottom: 'lg',
      left: '50%',
      transform: 'translateX(-50%)',
      fontFamily: 'body',
      fontSize: 'xs',
      textTransform: 'uppercase',
      letterSpacing: 'wide',
      color: 'muted',
      pointerEvents: 'none',
      md: { bottom: '32px' },
    },
    // Arrows: desktop-only, vertically centered, nudge on hover.
    navPrev: {
      position: 'absolute',
      top: '50%',
      left: '16px',
      transform: 'translateY(-50%)',
      zIndex: 10,
      display: 'none',
      md: { display: 'inline-flex' },
      _hover: { transform: 'translateY(-50%) translateX(-2px)' },
    },
    navNext: {
      position: 'absolute',
      top: '50%',
      right: '16px',
      transform: 'translateY(-50%)',
      zIndex: 10,
      display: 'none',
      md: { display: 'inline-flex' },
      _hover: { transform: 'translateY(-50%) translateX(2px)' },
    },

    // Off-screen N±1 prefetch of optimized variants.
    preload: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '1px',
      height: '1px',
      overflow: 'hidden',
      opacity: 0,
      pointerEvents: 'none',
      zIndex: -1,
    },
    preloadFrame: { position: 'relative', width: '100vw', height: '100vh' },
  },
})
