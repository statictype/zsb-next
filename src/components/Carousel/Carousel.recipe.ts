import { sva } from 'styled-system/css'

/**
 * Carousel — co-located slot recipe.
 *
 * Gallery scroll-snap strip. Viewport + track come from the shared `strip`
 * recipe; this owns the slide grid (a `layout` variant per slide shape), the
 * gallery item, and its gradient-border hover. `controlsSpacing` is the
 * placement override handed to <StripControls>.
 */
export const carousel = sva({
  slots: ['controlsSpacing', 'slide', 'item', 'itemImage'],
  base: {
    controlsSpacing: { marginTop: '3xl' },

    slide: {
      flex: '0 0 auto',
      width: 'clamp(360px, 92vw, 540px)',
      height: '28vh',
      display: 'grid',
      gap: 'sm',
      boxSizing: 'border-box',
      gridTemplateRows: '1fr',
      scrollSnapAlign: 'start',
      // Landscape phones get a much taller strip.
      '@media (max-width: 767px) and (orientation: landscape)': { height: '73vh' },
      md: { width: 'clamp(600px, 81vw, 990px)', height: '35vh', gap: 'md' },
      lg: { width: 'clamp(730px, 73vw, 1140px)', height: '40vh' },
      xl: { width: 'clamp(830px, 62vw, 1250px)', height: '42vh' },
      '2xl': { width: 'clamp(940px, 59vw, 1350px)', height: '43vh' },
      '4xl': { width: 'clamp(1040px, 55vw, 1460px)', height: '44vh' },
    },

    item: {
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      // exception: image placeholder fallback, raised-dark surface
      background: 'gray.900',
      '& img': {
        transition:
          'transform {durations.entrance} {easings.expo}, filter {durations.reveal} {easings.quint}',
        filter: 'brightness(0.9) contrast(1)',
      },
      _hover: {
        '& img': { transform: 'scale(1.05)', filter: 'brightness(1) contrast(1.1)' },
        '&::before': { opacity: 1, animation: 'gradientBorderShift 2s linear infinite' },
      },
      // Gradient border hover effect (masked ring).
      _before: {
        content: '""',
        position: 'absolute',
        inset: 0,
        padding: '2px',
        background:
          'linear-gradient(90deg, token(colors.action) 0%, token(colors.highlight) 50%, token(colors.action) 100%)',
        backgroundSize: '200% 100%',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        opacity: 0,
        zIndex: 2,
        pointerEvents: 'none',
        transition: 'opacity {durations.medium} {easings.quint}',
      },
    },
    // Drag prevention comes from the Figure's `draggable={false}` attribute.
    itemImage: { objectFit: 'cover', background: 'gray.900', pointerEvents: 'none' },
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
