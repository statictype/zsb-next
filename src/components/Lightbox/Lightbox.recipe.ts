import { sva } from 'styled-system/css'

/**
 * Lightbox — co-located slot recipe.
 *
 * Full-screen image viewer with swipe/drag. The close + prev/next adopt the
 * `<Button variant="icon">` (white→action); their positioning
 * and per-control motion (close rotates, arrows nudge) layer on via the slot
 * classes. The backdrop alpha + drag transform stay inline (request-driven).
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
      width: '[90vw]',
      height: '[85vh]',
      willChange: 'transform, opacity',
      md: { width: '[calc(100vw - 160px)]', height: '[90vh]' },
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
    // shares the top local layer with the arrows, which it never overlaps.
    close: {
      position: 'absolute',
      top: 'md',
      right: 'md',
      zIndex: '10',
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
    // Arrows: desktop-only, each owns its full letterbox column (the 80px
    // strip beside the frame) so a near-miss navigates instead of falling
    // through to the close-on-click backdrop. insetBlock keeps the top-right
    // corner for the close control. On hover the strip cancels Button's own
    // icon-hover transform (`transform: none`) and nudges the `svg` instead,
    // so only the arrow glyph moves. Side (left/right) + nudge direction
    // (`--nav-nudge`) are set per-arrow at the call site; the rest is shared.
    nav: {
      position: 'absolute',
      insetBlock: 'xl',
      width: '[80px]',
      height: 'auto',
      zIndex: '10',
      display: 'none',
      md: { display: 'inline-flex' },
      '& svg': {
        transitionProperty: '[transform]',
        transitionDuration: 'normal',
        transitionTimingFunction: 'expo',
      },
      _hover: { transform: 'none', '& svg': { transform: 'translateX(var(--nav-nudge, 0px))' } },
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
