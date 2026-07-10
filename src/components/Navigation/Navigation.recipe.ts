import { sva } from 'styled-system/css'

/**
 * Navigation — co-located slot recipe.
 *
 * Floating logo + pill menu, no top bar. Desktop navigation is a plain nav;
 * mobile placement lives inside the shared fullscreen Dialog. Active state is
 * visual `data-active`; exact page state also gets semantic
 * `aria-current="page"`. The private Ark Swap icon is styled below.
 */
export const navigation = sva({
  slots: [
    'logo',
    'logoImg',
    'toggle',
    'dialogLogo',
    'dialogToggle',
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
      width: 'navLogoBase',
      height: 'navLogoBase',
      zIndex: 'nav',
      md: { top: 'navLogoTopMd', width: 'touch', height: 'touch' },
      lg: { width: 'navLogoLg', height: 'navLogoLg' },
      xl: { width: 'navLogoXl', height: 'navLogoXl' },
    },
    logoImg: { width: 'full', height: 'full', objectFit: 'contain', display: 'block' },

    desktopNav: {
      display: 'none',
      md: {
        display: 'flex',
        position: 'absolute',
        top: 'navDesktopTop',
        right: 'gutter',
        gap: '0',
        // Match the logo's z-index so the menu paints above positioned hero
        // content (home/edition heroes are `position: relative`; without this
        // they paint over the z-auto nav and hide the links).
        zIndex: 'nav',
      },
      lg: { top: 'navDesktopTopLg' },
    },
    mobileShell: {
      position: 'relative',
      width: 'full',
      height: 'full',
      background: 'black',
    },
    navLink: {
      display: 'block',
      textDecoration: 'none',
      border: 'hairline',
      transitionProperty: 'colors',
      transitionDuration: 'fast',
      transitionTimingFunction: 'quint',
      // Label roll — the muted label exits up while an identical pink copy
      // enters from below, clipped by a mask snug to the line box so nothing
      // leaks into the link's padding.
      '& [data-nav-mask]': { display: 'block', overflow: 'hidden' },
      '& [data-nav-label]': {
        '--nav-roll-offset': 'token(sizes.navRollOffset)',
        display: 'block',
        position: 'relative',
        transitionProperty: 'common',
        transitionDuration: 'normal',
        transitionTimingFunction: 'quint',
        _motionReduce: { transitionDuration: 'instant' },
      },
      '& [data-nav-copy]': {
        position: 'absolute',
        top: 'var(--nav-roll-offset)',
        left: '0',
        color: 'action',
      },
      '&:hover [data-nav-label], &:focus-visible [data-nav-label]': {
        transform: 'translateY(calc(var(--nav-roll-offset) * -1))',
      },
      _motionReduce: {
        '&:hover [data-nav-label], &:focus-visible [data-nav-label]': { transform: 'none' },
        _hover: { color: 'action' },
      },
      // Active tab gets the highlight fill; siblings stay outlined. The roll
      // is suppressed — hover is a preview of elsewhere, not of here.
      '&[data-active=true]': { background: 'highlight', color: 'black' },
      '&[data-active=true]:hover': { background: 'highlight', color: 'black' },
      '&[data-active=true]:hover [data-nav-label], &[data-active=true]:focus-visible [data-nav-label]':
        { transform: 'none' },
    },
    desktopNavLink: {
      paddingBlock: 'sm',
      paddingInline: 'md',
      marginRight: 'hairlineOverlap',
      '&:last-child': { marginRight: '0' },
    },
    mobileNavLink: {
      paddingBlock: 'md',
      paddingInline: 'xl',
    },

    // Hamburger — the <button> is the full touch-size surface (transparent); the
    // visible mark is a smaller dark box drawn by ::before, so the tap target
    // stays generous while the chrome reads compact.
    toggle: {
      flexDirection: 'column',
      gap: 'xs',
      position: 'fixed',
      top: 'md',
      right: 'gutter',
      zIndex: 'navToggle',
      WebkitTapHighlightColor: 'transparent',
      _before: {
        content: '""',
        position: 'absolute',
        inset: 'sm',
        zIndex: '0',
        background: 'black',
        border: 'hairline',
        pointerEvents: 'none',
        transitionProperty: 'colors',
        transitionDuration: 'fast',
        transitionTimingFunction: 'quint',
      },
      '& > *': { position: 'relative', zIndex: '1' },
      color: 'white',
      _hover: { color: 'action' },
      '&:focus-visible::before': {
        outline: 'focus',
        outlineOffset: 'xs',
      },
      '&[aria-expanded=true]': { color: 'highlight' },
      md: { display: 'none' },
    },
    dialogLogo: { zIndex: '1' },
    dialogToggle: { zIndex: '1', md: { display: 'inline-flex' } },
  },
})

/** Private Ark Swap anatomy for the hamburger/close glyph transition. */
export const navigationSwap = sva({
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
      color: 'current',
      transitionProperty: 'common',
      transitionDuration: 'normal',
      transitionTimingFunction: 'quint',
      '&[hidden]': { display: 'inline-flex!' },
      '&[data-type=off]': { flexDirection: 'column', gap: 'xs' },
      '&[data-type=off] > span': {
        display: 'block',
        width: 'navGlyph',
        height: 'navGlyphStroke',
        background: 'current',
      },
      '& svg': { width: 'full', height: 'full' },
      _motionReduce: { transitionDuration: 'instant' },
    },
  },
})
