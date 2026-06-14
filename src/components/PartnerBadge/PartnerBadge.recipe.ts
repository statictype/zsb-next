import { sva } from 'styled-system/css'

/**
 * PartnerBadge — co-located slot recipe (Panda migration).
 *
 * Size scales off the `--partner-badge-scale` custom prop set by the parent
 * (home / Footer), with a `1` fallback, so the badge keeps reading it while
 * those containers are still CSS Modules. The `variant` axis (light | dark) only
 * swaps the rotating ring's text fill — the center heart is always the accent.
 * GSAP magnetic/elastic motion stays in the component.
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
    },
    textRing: {
      position: 'absolute',
      inset: '0',
      animation: 'spin 32s linear infinite',
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
