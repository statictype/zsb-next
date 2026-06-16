import { sva } from 'styled-system/css'

/**
 * Navigation — co-located slot recipe.
 *
 * Floating logo + pill menu, no top bar. Mobile: a full-screen overlay toggled
 * by the hamburger; desktop (md+): a top-right pill row with the hamburger
 * hidden. The nav-pill links and the 3-bar hamburger are bespoke nav chrome —
 * deliberately NOT folded into the Button/IconButton primitives (the
 * pill carries an active-fill state + connected-row overlap; the toggle has its
 * own X animation).
 *
 * Open/active live on attributes rather than variants: `data-open` on the nav,
 * `aria-current="page"` on the active link (the latter also improves a11y).
 */
export const navigation = sva({
  slots: ['logo', 'logoImg', 'toggle', 'nav', 'navLink'],
  base: {
    logo: {
      position: 'absolute',
      top: 'md',
      left: 'content',
      width: '40px',
      height: '40px',
      zIndex: 1001,
      md: { top: '24px', width: '48px', height: '48px' },
      lg: { width: '56px', height: '56px' },
      xl: { width: '60px', height: '60px' },
    },
    logoImg: { width: '100%', height: '100%', objectFit: 'contain', display: 'block' },

    nav: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 'md',
      background: 'black',
      opacity: 0,
      visibility: 'hidden',
      transition:
        'opacity {durations.normal} {easings.quint}, visibility {durations.normal} {easings.quint}',
      '&[data-open=true]': { opacity: 1, visibility: 'visible' },
      // Desktop: a top-right pill row that scrolls away with the page.
      md: {
        position: 'absolute',
        top: '32px',
        right: 'content',
        bottom: 'auto',
        left: 'auto',
        flexDirection: 'row',
        gap: 0,
        background: 'transparent',
        opacity: 1,
        visibility: 'visible',
      },
      lg: { top: '40px' },
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
      md: {
        fontSize: 'sm',
        padding: '8px 20px',
        marginRight: '-1px',
        borderRadius: '0',
        '&:last-child': { marginRight: '0' },
      },
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
      right: 'content',
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
      '& span': {
        display: 'block',
        width: '18px',
        height: '2px',
        background: 'white',
        transition:
          'transform 0.3s {easings.quint}, opacity 0.2s ease, background-color {durations.fast} {easings.quint}',
      },
      _hover: { '& span': { background: 'action' } },
      '&:focus-visible::before': {
        outline: '2px solid token(colors.action)',
        outlineOffset: '2px',
      },
      // Open: bars converge into a centered X and switch to chartreuse.
      '&[aria-expanded=true] span': { background: 'highlight' },
      '&[aria-expanded=true] span:nth-child(1)': { transform: 'translateY(7px) rotate(45deg)' },
      '&[aria-expanded=true] span:nth-child(2)': { opacity: 0 },
      '&[aria-expanded=true] span:nth-child(3)': { transform: 'translateY(-7px) rotate(-45deg)' },
      md: { display: 'none' },
    },
  },
})
