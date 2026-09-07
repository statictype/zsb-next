import { sva } from 'styled-system/css'

// Full-screen image viewer: layout, controls, and gesture feedback. Dialog owns
// the modal state and shell; the backdrop alpha + drag transform stay inline.
export const lightbox = sva({
  slots: [
    'lightbox',
    'bar',
    'barNav',
    'counter',
    'caption',
    'stage',
    'imageLayer',
    'image',
    'dissolve',
    'preload',
    'preloadFrame',
  ],
  base: {
    lightbox: {
      display: 'grid',
      gridTemplateRows: '[auto minmax(0, 1fr)]',
      width: 'full',
      height: 'full',
      background: 'surface.scrim',
      overscrollBehavior: 'contain',
    },
    bar: {
      display: 'grid',
      gridTemplateColumns: '[auto minmax(0, 1fr) auto]',
      alignItems: 'center',
      gap: 'md',
      height: 'touch',
      paddingInline: 'sm',
      borderBottom: 'hairline',
    },
    barNav: {
      display: 'flex',
      alignItems: 'center',
      gap: 'xs',
    },
    counter: {
      textStyle: 'label',
      color: 'muted',
      fontVariantNumeric: 'tabular-nums',
      paddingInline: 'sm',
    },
    caption: {
      textStyle: 'label',
      color: 'body',
      textAlign: 'end',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    stage: {
      position: 'relative',
      minHeight: '0',
      overflow: 'hidden',
      cursor: 'zoom-out',
      touchAction: 'none',
      willChange: 'transform, opacity',
    },
    imageLayer: { position: 'absolute', inset: '0' },
    image: { objectFit: 'contain', userSelect: 'none' },
    dissolve: {
      position: 'absolute',
      inset: '0',
      pointerEvents: 'none',
      overflow: 'hidden',
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
