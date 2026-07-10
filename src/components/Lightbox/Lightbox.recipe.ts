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
      display: 'grid',
      gridTemplateColumns: '1fr',
      placeItems: 'center',
      width: 'full',
      height: 'full',
      background: 'surface.scrim',
      cursor: 'zoom-out',
      touchAction: 'none',
      overscrollBehavior: 'contain',
      // Letterbox columns: each nav arrow owns one full column beside the frame.
      md: { gridTemplateColumns: 'lightboxNavColumn minmax(0, 1fr) lightboxNavColumn' },
    },
    frame: {
      position: 'relative',
      width: 'lightboxFrameWidth',
      height: '[85vh]',
      willChange: 'transform, opacity',
      // Fills the grid's center track, clear of the two nav columns.
      md: { gridColumn: '2', width: 'full', height: '[90vh]' },
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
    // Sized to the WCAG touch target directly — Button's own centering keeps
    // the visible icon centered as the box grows past its default hitTarget.
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
    // zone (`lightboxNavHit`) — its letterbox grid column centers it on the
    // frame via the root's `placeItems: center`. Column (1 or 3) is set per-
    // arrow at the call site; the hover lift is Button's own `icon` variant.
    nav: {
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
