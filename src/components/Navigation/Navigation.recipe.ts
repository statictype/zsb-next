import { sva } from 'styled-system/css'

/**
 * Navigation — co-located slot recipe.
 *
 * Floating logo + pill menu, no top bar. Desktop navigation is a plain nav;
 * mobile placement lives inside the shared fullscreen Dialog. Active state is
 * semantic `aria-current="page"`; the private Ark Swap icon is styled below.
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
    'navLink',
  ],
  base: {
    logo: {
      position: 'absolute',
      top: 'md',
      left: 'gutter',
      width: '40px',
      height: '40px',
      zIndex: 1001,
      md: { top: '24px', width: '48px', height: '48px' },
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
        gap: 0,
      },
      lg: { top: '40px' },
    },
    mobileShell: {
      position: 'relative',
      width: '100%',
      height: '100%',
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
    navLink: {
      display: 'block',
      fontFamily: 'display',
      fontSize: 'lg',
      textTransform: 'uppercase',
      textDecoration: 'none',
      color: 'surfaceLight',
      padding: '12px 32px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'borderDark',
      letterSpacing: 'label',
      transition:
        'background-color {durations.fast} {easings.quint}, color {durations.fast} {easings.quint}',
      _hover: { background: 'action', color: 'white' },
      _focusVisible: { outline: '2px solid token(colors.action)', outlineOffset: '2px' },
      // Active tab gets the highlight fill; siblings stay outlined.
      '&[aria-current=page]': { background: 'highlight', color: 'black' },
      '&[aria-current=page]:hover': { background: 'highlight', color: 'black' },
    },
    desktopNavLink: {
      fontSize: 'sm',
      padding: '8px 20px',
      marginRight: '-1px',
      borderRadius: '0',
      '&:last-child': { marginRight: '0' },
    },

    // Hamburger — the <button> is the full 48px touch surface (transparent); the
    // visible mark is a smaller dark box drawn by ::before, so the tap target
    // stays generous while the chrome reads compact.
    toggle: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '5px',
      position: 'fixed',
      top: 'md',
      right: 'gutter',
      width: '48px',
      height: '48px',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      zIndex: 1002,
      padding: 0,
      WebkitTapHighlightColor: 'transparent',
      _before: {
        content: '""',
        position: 'absolute',
        inset: '6px',
        zIndex: -1,
        background: 'black',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'borderDark',
        transition: 'border-color {durations.fast} {easings.quint}',
      },
      color: 'white',
      _hover: { color: 'action' },
      '&:focus-visible::before': {
        outline: '2px solid token(colors.action)',
        outlineOffset: '2px',
      },
      '&[aria-expanded=true]': { color: 'highlight' },
      md: { display: 'none' },
    },
    dialogLogo: { zIndex: 1 },
    dialogToggle: { zIndex: 1, md: { display: 'flex' } },
  },
})

/** Private Ark Swap anatomy for the hamburger/close glyph transition. */
export const navigationSwap = sva({
  slots: ['root', 'indicator'],
  base: {
    root: {
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
      width: '24px',
      height: '24px',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'currentColor',
      transition: 'opacity',
      transitionDuration: 'fast',
      transitionTimingFunction: 'quint',
      '&[hidden]': { display: 'inline-flex!' },
      '&[data-type=off]': { flexDirection: 'column', gap: '4px' },
      '&[data-type=off] > span': {
        display: 'block',
        width: '18px',
        height: '2px',
        background: 'currentColor',
      },
      _motionReduce: { transitionDuration: '0ms' },
    },
  },
})
