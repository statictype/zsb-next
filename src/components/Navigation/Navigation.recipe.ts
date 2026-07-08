import { sva } from 'styled-system/css'

/**
 * Navigation — co-located slot recipe.
 *
 * Floating logo + pill menu, no top bar. Desktop navigation is a plain nav;
 * mobile placement lives inside the shared fullscreen Dialog. Active state is
 * semantic `aria-current="page"`; the private Ark Swap icon is styled below.
 * Bracketed values are chrome geometry: logo scale steps, pinning offsets,
 * glyph boxes.
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
    'mobileNav',
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
    },
    mobileShell: {
      position: 'relative',
      width: 'full',
      height: 'full',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'black',
    },
    mobileNav: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'md',
    },
    // Sizing (fontSize/padding) deliberately lives in the per-context slots
    // below, not here: base + override would emit two conflicting atomic
    // utilities on one element, and the winner follows global stylesheet
    // order — which reshuffles as unrelated styles come and go.
    navLink: {
      display: 'block',
      fontFamily: 'display',
      textTransform: 'uppercase',
      textDecoration: 'none',
      color: 'muted',
      border: 'hairline',
      letterSpacing: 'label',
      transitionProperty: 'colors',
      transitionDuration: 'fast',
      transitionTimingFunction: 'quint',
      _focusVisible: { outline: 'focus', outlineOffset: 'xs' },
      // Label roll — the muted label exits up while an identical pink copy
      // enters from below, clipped by a mask snug to the line box so nothing
      // leaks into the link's padding.
      '& [data-nav-mask]': { display: 'block', overflow: 'hidden' },
      '& [data-nav-label]': {
        display: 'block',
        position: 'relative',
        transitionProperty: '[transform]',
        transitionDuration: 'normal',
        transitionTimingFunction: 'expo',
        _motionReduce: { transitionDuration: 'instant' },
      },
      '& [data-nav-copy]': {
        position: 'absolute',
        top: '[110%]',
        left: '0',
        color: 'action',
      },
      '&:hover [data-nav-label], &:focus-visible [data-nav-label]': {
        transform: 'translateY(-110%)',
      },
      _motionReduce: {
        '&:hover [data-nav-label], &:focus-visible [data-nav-label]': { transform: 'none' },
        _hover: { color: 'action' },
      },
      // Active tab gets the highlight fill; siblings stay outlined. The roll
      // is suppressed — hover is a preview of elsewhere, not of here.
      '&[aria-current=page]': { background: 'highlight', color: 'black' },
      '&[aria-current=page]:hover': { background: 'highlight', color: 'black' },
      '&[aria-current=page]:hover [data-nav-label], &[aria-current=page]:focus-visible [data-nav-label]':
        { transform: 'none' },
    },
    desktopNavLink: {
      fontSize: 'sm',
      paddingBlock: 'sm',
      paddingInline: 'md',
      marginRight: '[-1px]',
      '&:last-child': { marginRight: '0' },
    },
    mobileNavLink: {
      fontSize: 'lg',
      paddingBlock: 'md',
      paddingInline: 'xl',
    },

    // Hamburger — the <button> is the full touch-size surface (transparent); the
    // visible mark is a smaller dark box drawn by ::before, so the tap target
    // stays generous while the chrome reads compact.
    toggle: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 'xs',
      position: 'fixed',
      top: 'md',
      right: 'gutter',
      width: 'touch',
      height: 'touch',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      zIndex: 'navToggle',
      padding: '0',
      WebkitTapHighlightColor: 'transparent',
      _before: {
        content: '""',
        position: 'absolute',
        inset: '[6px]',
        zIndex: '[-1]',
        background: 'black',
        border: 'hairline',
        transitionProperty: 'colors',
        transitionDuration: 'fast',
        transitionTimingFunction: 'quint',
      },
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
    dialogToggle: { zIndex: '1', md: { display: 'flex' } },
  },
})

/** Private Ark Swap anatomy for the hamburger/close glyph transition. */
export const navigationSwap = sva({
  slots: ['root', 'indicator'],
  base: {
    root: {
      width: '[24px]',
      height: '[24px]',
      placeItems: 'center',
      '& [data-type]': {
        opacity: 0,
      },
      '&[data-swap=off] [data-type=off], &[data-swap=on] [data-type=on]': {
        opacity: 1,
      },
    },
    indicator: {
      width: '[24px]',
      height: '[24px]',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'current',
      transitionProperty: '[opacity]',
      transitionDuration: 'fast',
      transitionTimingFunction: 'quint',
      '&[hidden]': { display: 'inline-flex!' },
      '&[data-type=off]': { flexDirection: 'column', gap: 'xs' },
      '&[data-type=off] > span': {
        display: 'block',
        width: '[18px]',
        height: '[2px]',
        background: 'current',
      },
      _motionReduce: { transitionDuration: 'instant' },
    },
  },
})
