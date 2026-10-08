import { defineSlotRecipe } from '@/design-system/define-recipe'

export const navigation = defineSlotRecipe({
  className: 'nav',
  jsx: ['Navigation', 'MobileMenu'],
  slots: [
    'logo',
    'logoImg',
    'dialogLogo',
    'desktopNav',
    'desktopNavLink',
    'mobileShell',
    'mobileNavLink',
    'navLink',
    'progress',
  ],
  base: {
    logo: {
      position: 'absolute',
      top: 'md',
      left: 'gutter',
      width: '40px',
      height: '40px',
      zIndex: 'nav',
      display: 'flex',
      md: { top: '24px', width: 'touch', height: 'touch' },
      lg: { width: '56px', height: '56px' },
      xl: { width: '60px', height: '60px' },
    },
    logoImg: { width: '100%', height: '100%', objectFit: 'contain', display: 'block' },

    desktopNav: {
      display: 'none',
      md: {
        display: 'flex',
        position: 'absolute',
        top: '32px',
        right: 'gutter',
        gap: '0',
        // Same z-index as the logo: positioned hero content would otherwise paint over the links.
        zIndex: 'nav',
      },
      lg: { top: '40px' },
    },
    mobileShell: {
      position: 'relative',
      width: '100%',
      height: '100%',
      background: 'black',
    },
    navLink: {
      pressable: 'fill',
      display: 'block',
      position: 'relative',
      overflow: 'hidden',
      textDecoration: 'none',
      background: 'black',
      border: 'hairline',
      transition: 'interactive',
      '& [data-nav-mask]': { display: 'block', overflow: 'hidden' },
      '& [data-nav-label]': {
        '--nav-roll-offset': '110%',
        display: 'block',
        position: 'relative',
        transition: 'develop',
      },
      '& [data-nav-copy]': {
        position: 'absolute',
        top: 'var(--nav-roll-offset)',
        left: '0',
        color: 'action',
      },
      '&:not([aria-current=page]):hover [data-nav-label], &:not([aria-current=page]):focus-visible [data-nav-label]':
        {
          transform: 'translateY(calc(var(--nav-roll-offset) * -1))',
        },
      _focusVisible: { outline: 'none' },
      '&:active:not(:disabled), &:active:not(:disabled) [data-nav-copy]': { color: 'highlight' },
      '&[data-active=true]': { color: 'highlight' },
      '&[aria-current=page] [data-nav-label]': {
        transition: 'none',
        transform: 'none',
      },
    },
    desktopNavLink: {
      paddingBlock: 'sm',
      paddingInline: 'md',
      marginRight: 'calc(token(borderWidths.hairline) * -1)',
      '&:last-child': { marginRight: '0' },
    },
    mobileNavLink: {
      paddingBlock: 'md',
      paddingInline: 'xl',
    },
    dialogLogo: { zIndex: '1' },
    progress: {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '2px',
      zIndex: 'progress',
      overflow: 'hidden',
      pointerEvents: 'none',
      _after: {
        content: '""',
        position: 'absolute',
        inset: '0',
        width: '40%',
        background: 'action',
        opacity: '0',
        animationName: 'progressSweep',
        animationDuration: 'sweep',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        animationDelay: 'fast',
      },
      _motionReduce: {
        _after: { animation: 'none', opacity: '1', width: '100%' },
      },
    },
  },
})

export const navigationSwap = defineSlotRecipe({
  className: 'nav-swap',
  jsx: ['NavigationIcon'],
  slots: ['root', 'indicator'],
  base: {
    root: {
      display: 'inline-grid',
      width: '24px',
      height: '24px',
      placeItems: 'center',
      '& [data-type]': {
        opacity: 0,
      },
      '&[data-swap=off] [data-type=off], &[data-swap=on] [data-type=on]': {
        opacity: 1,
      },
    },
    indicator: {
      display: 'inline-flex',
      gridArea: '1 / 1',
      width: '24px',
      height: '24px',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      transition: 'develop',
      '&[data-type=off]': { flexDirection: 'column', gap: 'xs' },
      '&[data-type=off] > span': {
        display: 'block',
        width: '18px',
        height: '2px',
        background: 'white',
      },
      '& svg': { width: '100%', height: '100%' },
    },
  },
})
