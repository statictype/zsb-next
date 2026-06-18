import { sva } from 'styled-system/css'

/**
 * HeroSlideshow — co-located slot recipe.
 *
 * A crossfade stage with a control bar below: pagination dots, prev /
 * play-pause / next, and a per-slide progress hairline. The nav cluster adopts
 * `<Button variant="icon">` (white→action); the
 * per-control icon motion (arrow nudge, toggle emphasis, press-scale) layers on
 * via the `control*` slots. Everything else (stage, dots, progress) is bespoke.
 *
 * Active slide → `data-active`; active dot reuses its `aria-current`.
 */
export const heroSlideshow = sva({
  slots: [
    'slideshow',
    'stage',
    'slide',
    'vignette',
    'progressTrack',
    'progressFill',
    'controlBar',
    'dots',
    'dot',
    'nav',
    'control',
    'controlPrev',
    'controlNext',
    'controlToggle',
  ],
  base: {
    slideshow: {
      position: 'relative',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
    },

    // Ratio is overridable via --stage-aspect so a host (the full-bleed
    // homepage hero) can request a different crop.
    stage: {
      position: 'relative',
      width: '100%',
      aspectRatio: 'var(--stage-aspect, 4 / 5)',
      overflow: 'hidden',
      background: 'black',
      cursor: 'pointer',
      md: { aspectRatio: 'var(--stage-aspect, 16 / 9)' },
    },
    slide: {
      position: 'absolute',
      inset: 0,
      opacity: 0,
      transition: 'opacity {durations.entrance} {easings.quint}',
      '& img': { objectFit: 'cover', background: 'gray.900' },
      '&[data-active=true]': { opacity: 1 },
      '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
    },
    vignette: {
      position: 'absolute',
      inset: 0,
      zIndex: 1,
      pointerEvents: 'none',
      background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.45) 100%)',
    },

    // Hairline at the stage's bottom edge; fills over one interval (scaleX, GPU).
    progressTrack: {
      position: 'absolute',
      inset: '0 0 auto 0',
      zIndex: 2,
      height: '1px',
      background: 'borderLight',
      pointerEvents: 'none',
    },
    progressFill: {
      height: '100%',
      width: '100%',
      transform: 'scaleX(0)',
      transformOrigin: 'left center',
      background: 'action',
      animationName: 'heroProgress',
      animationTimingFunction: 'linear',
      animationFillMode: 'forwards',
      // animation-duration is set inline from the `interval` prop.
      '@media (prefers-reduced-motion: reduce)': { animation: 'none', transform: 'scaleX(1)' },
    },

    controlBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'lg',
      flexWrap: 'wrap',
    },
    dots: { display: 'flex', alignItems: 'center', gap: '10px' },
    // Slim neutral ticks; the active one elongates and takes the brand accent.
    dot: {
      width: '14px',
      height: '2px',
      padding: 0,
      border: 'none',
      borderRadius: 0,
      background: 'rgba(255, 255, 255, 0.28)',
      cursor: 'pointer',
      transition:
        'width {durations.slow} {easings.expo}, background {durations.normal} {easings.quint}',
      _hover: { background: 'action' },
      _focusVisible: { outline: '2px solid token(colors.action)', outlineOffset: '4px' },
      '&[aria-current=true]': { width: '28px', background: 'highlight' },
    },

    nav: { display: 'flex', alignItems: 'center', gap: '2px' },

    // Shared nav-control motion layered onto Button variant="icon".
    control: {
      _active: { transform: 'scale(0.9)' },
      '& svg': { transition: 'transform {durations.medium} {easings.expo}' },
    },
    controlPrev: { _hover: { '& svg': { transform: 'translateX(-2px)' } } },
    controlNext: { _hover: { '& svg': { transform: 'translateX(2px)' } } },
    // The key a11y control — held a touch brighter so it reads as primary.
    controlToggle: { color: 'rgba(255, 255, 255, 0.85)', marginInline: '2px' },
  },
})
