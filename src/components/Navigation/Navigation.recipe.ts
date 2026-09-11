import { defineSlotRecipe } from '@/design-system/define-recipe'

/**
 * Navigation — co-located slot recipe.
 *
 * Floating logo + pill menu, no top bar. Desktop navigation is a plain nav;
 * mobile placement lives inside the shared fullscreen Dialog. Active state is
 * visual `data-active`; exact page state also gets semantic
 * `aria-current="page"`. The private Ark Swap icon is styled below.
 */
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
  ],
  base: {
    logo: {
      position: 'absolute',
      top: 'md',
      left: 'gutter',
      width: '[40px]',
      height: '[40px]',
      zIndex: 'nav',
      display: 'flex',
      md: { top: '[24px]', width: 'touch', height: 'touch' },
      lg: { width: '[56px]', height: '[56px]' },
      xl: { width: '[60px]', height: '[60px]' },
    },
    logoImg: { width: 'full', height: 'full', objectFit: 'contain', display: 'block' },

    desktopNav: {
      display: 'none',
      md: {
        display: 'flex',
        position: 'absolute',
        top: '[32px]',
        right: 'gutter',
        gap: '0',
        // Match the logo's z-index so the menu paints above positioned hero
        // content (home/edition heroes are `position: relative`; without this
        // they paint over the z-auto nav and hide the links).
        zIndex: 'nav',
      },
      lg: { top: '[40px]' },
      '&:has([data-pending]) [data-active=true]:not(:has([data-pending]))': { color: '[inherit]' },
    },
    mobileShell: {
      position: 'relative',
      width: 'full',
      height: 'full',
      background: 'black',
      '&:has([data-pending]) [data-active=true]:not(:has([data-pending]))': { color: '[inherit]' },
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
      // Label roll — the muted label exits up while an identical pink copy
      // enters from below, clipped by a mask snug to the line box so nothing
      // leaks into the link's padding.
      '& [data-nav-mask]': { display: 'block', overflow: 'hidden' },
      '& [data-nav-label]': {
        '--nav-roll-offset': 'token(sizes.rollOffset)',
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
      '&:not([data-active=true]):hover [data-nav-label], &:not([data-active=true]):focus-visible [data-nav-label]':
        {
          transform: 'translateY(calc(var(--nav-roll-offset) * -1))',
        },
      '&:active:not(:disabled), &:active:not(:disabled) [data-nav-copy]': { color: 'highlight' },
      '&[data-active=true], &:has([data-pending])': { color: 'highlight' },
      '&[data-active=true] [data-nav-label], &:has([data-pending]) [data-nav-label]': {
        transition: 'none',
        transform: 'none',
      },
      '&:has([data-pending])::after': {
        content: '""',
        position: 'absolute',
        left: '0',
        bottom: '0',
        width: '[40%]',
        height: '[2px]',
        background: 'action',
        opacity: '0',
        animationName: 'progressSweep',
        animationDuration: 'sweep',
        animationTimingFunction: '[linear]',
        animationIterationCount: 'infinite',
        animationDelay: 'fast',
      },
    },
    desktopNavLink: {
      paddingBlock: 'sm',
      paddingInline: 'md',
      marginRight: '[calc(token(borderWidths.hairline) * -1)]',
      '&:last-child': { marginRight: '0' },
    },
    mobileNavLink: {
      paddingBlock: 'md',
      paddingInline: 'xl',
    },
    dialogLogo: { zIndex: '1' },
  },
})

/** Private Ark Swap anatomy for the hamburger/close glyph transition. */
export const navigationSwap = defineSlotRecipe({
  className: 'nav-swap',
  jsx: ['NavigationIcon'],
  slots: ['root', 'indicator'],
  base: {
    root: {
      width: 'navIcon',
      height: 'navIcon',
      placeItems: 'center',
      '& [data-type]': {
        opacity: 0,
      },
      '&[data-swap=off] [data-type=off], &[data-swap=on] [data-type=on]': {
        opacity: 1,
      },
    },
    indicator: {
      width: 'navIcon',
      height: 'navIcon',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      transition: 'develop',
      '&[hidden]': { display: 'inline-flex!' },
      '&[data-type=off]': { flexDirection: 'column', gap: 'xs' },
      '&[data-type=off] > span': {
        display: 'block',
        width: '[18px]',
        height: '[2px]',
        background: 'white',
      },
      '& svg': { width: 'full', height: 'full' },
    },
  },
})
