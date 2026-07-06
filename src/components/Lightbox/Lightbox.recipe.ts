import { sva } from 'styled-system/css'

/**
 * Lightbox — co-located slot recipe.
 *
 * Full-screen image viewer with swipe/drag. The close + prev/next adopt the
 * `<Button variant="icon">` (white→action); their positioning
 * and per-control motion (close rotates, arrows nudge) layer on via the slot
 * classes. The backdrop alpha + drag transform stay inline (request-driven).
 *
 * Dialog owns modal state and the full-screen shell; this recipe owns only the
 * image-viewer layout, controls, and gesture feedback.
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
      position: 'relative',
      width: '100%',
      height: '100%',
      background: 'surface.scrim',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'zoom-out',
      touchAction: 'none',
      overscrollBehavior: 'contain',
    },
    frame: {
      position: 'relative',
      width: '90vw',
      height: '85vh',
      willChange: 'transform, opacity',
      md: { width: 'calc(100vw - 160px)', height: '90vh' },
    },
    // Drag prevention comes from the Image's `draggable={false}` attribute.
    image: {
      objectFit: 'contain',
      transition: 'opacity {durations.normal} {easings.quint}',
      userSelect: 'none',
    },

    // Positioned over the dark backdrop; Button supplies size + white→action.
    close: {
      position: 'absolute',
      top: 'md',
      right: 'md',
      zIndex: 'lightbox',
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
    // Arrows: desktop-only, each owns its full letterbox column (the 80px
    // strip beside the frame) so a near-miss navigates instead of falling
    // through to the close-on-click backdrop. insetBlock keeps the top-right
    // corner for the close control. The icon nudges on hover, not the strip.
    navPrev: {
      position: 'absolute',
      insetBlock: '96px',
      left: '0',
      width: '80px',
      height: 'auto',
      zIndex: 10,
      display: 'none',
      md: { display: 'inline-flex' },
      '& svg': { transition: 'transform {durations.normal} {easings.expo}' },
      _hover: { transform: 'none', '& svg': { transform: 'translateX(-2px)' } },
    },
    navNext: {
      position: 'absolute',
      insetBlock: '96px',
      right: '0',
      width: '80px',
      height: 'auto',
      zIndex: 10,
      display: 'none',
      md: { display: 'inline-flex' },
      '& svg': { transition: 'transform {durations.normal} {easings.expo}' },
      _hover: { transform: 'none', '& svg': { transform: 'translateX(2px)' } },
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
