import { sva } from 'styled-system/css'

/**
 * PartnerBadge — co-located slot recipe.
 *
 * Size scales off the `--partner-badge-scale` custom prop set by the parent
 * (home / Footer), with a `1` fallback. The `variant` axis (light | dark) only
 * swaps the rotating ring's text fill — the center heart is always the accent.
 * The elastic hover-scale lives on `body` below (a `linear()` spring), which
 * is what lets the component itself stay a server component.
 */
export const partnerBadge = sva({
  slots: ['wrap', 'link', 'body', 'textRing', 'arrow', 'icon'],
  base: {
    wrap: {
      width: {
        base: 'calc(72px * var(--partner-badge-scale, 1))',
        md: 'calc(96px * var(--partner-badge-scale, 1))',
        xl: 'calc(125px * var(--partner-badge-scale, 1))',
      },
      height: {
        base: 'calc(72px * var(--partner-badge-scale, 1))',
        md: 'calc(96px * var(--partner-badge-scale, 1))',
        xl: 'calc(125px * var(--partner-badge-scale, 1))',
      },
      zIndex: '10',
    },
    link: {
      display: 'block',
      width: '100%',
      height: '100%',
      color: 'inherit',
      textDecoration: 'none',
    },
    body: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      willChange: 'transform',
      // Elastic hover-scale (formerly two gsap.to calls): a springy bezier
      // everywhere, upgraded to a `linear()` elastic — overshoot + one
      // bounce-back — where supported. `body` fills the link, so hovering
      // anywhere on the badge triggers it.
      transition: 'transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      '@supports (transition-timing-function: linear(0, 1))': {
        transitionTimingFunction:
          'linear(0, 0.43 5%, 0.85 10%, 1.11 15%, 1.2 20%, 1.18 25%, 1.1 30%, 1.03 35%, 0.98 42.5%, 0.96 47.5%, 0.99 60%, 1.005 70%, 1)',
      },
      _hover: { transform: 'scale(1.12)' },
      _motionReduce: { transition: 'none' },
    },
    textRing: {
      position: 'absolute',
      inset: '0',
      animationStyle: 'spin',
      '& svg': { width: '100%', height: '100%' },
      '& text': { fill: 'white', fontFamily: 'body' },
    },
    arrow: { position: 'relative', zIndex: '1', display: 'flex' },
    icon: {
      color: 'action',
      width: {
        base: 'calc(20px * var(--partner-badge-scale, 1))',
        md: 'calc(26px * var(--partner-badge-scale, 1))',
        xl: 'calc(36px * var(--partner-badge-scale, 1))',
      },
      height: {
        base: 'calc(20px * var(--partner-badge-scale, 1))',
        md: 'calc(26px * var(--partner-badge-scale, 1))',
        xl: 'calc(36px * var(--partner-badge-scale, 1))',
      },
    },
  },
  variants: {
    variant: {
      light: {},
      dark: { textRing: { '& text': { fill: 'black' } } },
    },
  },
  defaultVariants: { variant: 'light' },
})
