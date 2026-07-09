import { sva } from 'styled-system/css'

/**
 * Lightbox — co-located slot recipe.
 *
 * Full-screen image viewer with swipe/drag. The close + prev/next adopt the
 * `<Button variant="icon">` (white→action); their positioning and per-control
 * motion (close rotates, arrows use the icon variant's own lift) layer on via
 * the slot classes. The backdrop alpha + drag transform stay inline
 * (request-driven).
 * Bracketed values are viewer geometry: letterbox columns, viewport frames,
 * chrome offsets.
 *
 * Dialog owns modal state and the full-screen shell; this recipe owns only the
 * image-viewer layout, controls, and gesture feedback.
 */
export const lightbox = sva({
  slots: ['lightbox', 'frame', 'image', 'close', 'caption', 'nav', 'preload', 'preloadFrame'],
  base: {
    lightbox: {
      position: 'relative',
      width: 'full',
      height: 'full',
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
      width: 'lightboxFrameWidth',
      height: '[85vh]',
      willChange: 'transform, opacity',
      // Leaves one `lightboxNavColumn` clear on each side for the nav arrows.
      md: { width: '[calc(100vw - (token(sizes.lightboxNavColumn) * 2))]', height: '[90vh]' },
    },
    // Drag prevention comes from the Image's `draggable={false}` attribute.
    image: {
      objectFit: 'contain',
      transitionProperty: '[opacity]',
      transitionDuration: 'normal',
      transitionTimingFunction: 'quint',
      userSelect: 'none',
    },

    // Positioned over the dark backdrop; Button supplies size + white→action.
    // zIndex is local to the lightbox root's stacking context (the whole
    // viewer already sits at the global `lightbox` layer via Dialog) — it
    // sits above the arrows (`nav`) so a near-miss between the two always
    // resolves to close, never a navigation.
    close: {
      position: 'absolute',
      top: 'md',
      right: 'md',
      zIndex: '20',
      _hover: { transform: 'rotate(90deg)' },
      md: { top: 'lg', right: 'lg' },
      // Hit-slop: grows the clickable area beyond the visible icon without
      // shifting it (the pseudo-element expands symmetrically around the
      // button's own box).
      _before: {
        content: '""',
        position: 'absolute',
        inset: '[calc({sizes.hitSlop} * -1)]',
      },
    },
    // Type is the shared `Eyebrow` recipe (body/xs/uppercase/wide/muted),
    // applied at the call site; the slot owns only placement.
    caption: {
      position: 'absolute',
      bottom: 'lg',
      left: '[50%]',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
    },
    // Arrows: desktop-only, each owns a generous but bounded vertical click
    // zone (`lightboxNavHit`), centered on the frame — tall enough to be an
    // easy target, short enough to stay clear of the close button's corner.
    // Side (left/right) is set per-arrow at the call site; the hover lift is
    // Button's own `icon` variant.
    nav: {
      position: 'absolute',
      top: '[50%]',
      translate: '[0 -50%]',
      width: 'lightboxNavColumn',
      height: 'lightboxNavHit',
      zIndex: '10',
      display: 'none',
      md: { display: 'inline-flex' },
    },

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
