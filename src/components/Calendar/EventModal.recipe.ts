import { sva } from 'styled-system/css'

/**
 * EventModal — co-located slot recipe.
 *
 * Full detail for one event, as a dialog over the schedule board. Back/Share
 * are bespoke board chips (translucent, blurred), kept off the `<Button>`
 * primitive; Share carries the chartreuse copied state (`data-copied`). Raw
 * grays are the documented dark-board exceptions.
 */
export const eventModal = sva({
  slots: [
    'backdrop',
    'dialog',
    'controls',
    'poster',
    'body',
    'when',
    'name',
    'types',
    'venue',
    'venueName',
    'venueParent',
    'description',
    'links',
    'link',
  ],
  base: {
    backdrop: {
      position: 'fixed',
      inset: 0,
      zIndex: 1100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'lg',
      background: 'scrim',
      overflowY: 'auto',
    },
    dialog: {
      position: 'relative',
      width: '100%',
      maxWidth: '540px',
      maxHeight: 'calc(100dvh - 2 * token(spacing.lg))',
      display: 'flex',
      flexDirection: 'column',
      background: 'black',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'borderDark',
      boxShadow: 'modal',
      overflow: 'hidden',
      md: { flexDirection: 'row', maxWidth: '760px' },
    },

    // Floating bar over the dialog top: Back (left) + Share (right). The bar is
    // click-through; only the buttons themselves take pointer events.
    controls: {
      position: 'absolute',
      top: 'sm',
      left: 'sm',
      right: 'sm',
      zIndex: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'sm',
      pointerEvents: 'none',
      '& > *': { pointerEvents: 'auto' },
    },

    poster: {
      position: 'relative',
      width: '100%',
      aspectRatio: '3 / 4',
      maxHeight: '46vh',
      flexShrink: 0,
      overflow: 'hidden',
      background: 'black',
      // Show the whole poster, not a crop.
      '& img': { objectFit: 'contain' },
      md: { width: '320px', aspectRatio: 'auto', maxHeight: 'none', alignSelf: 'stretch' },
    },

    body: {
      display: 'flex',
      flex: 1,
      minHeight: 0,
      flexDirection: 'column',
      gap: 'xs',
      // Top padding clears the floating control bar (36px + offset) with a gap.
      paddingTop: 'calc(36px + token(spacing.sm) + token(spacing.lg))',
      paddingInline: 'lg',
      paddingBottom: 'lg',
      overflowY: 'auto',
    },
    when: {
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontWeight: 'semibold',
      color: 'highlight',
    },
    name: { fontFamily: 'display', fontSize: '2xl', lineHeight: 'tight', color: 'white' },

    types: { listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'sm' },

    venue: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '8px',
      marginTop: 'sm',
      fontFamily: 'body',
      fontSize: 'sm',
    },
    venueName: {
      color: 'gray.300',
      textTransform: 'uppercase',
      letterSpacing: 'subtle',
      fontWeight: 'medium',
    },
    venueParent: {
      color: 'muted',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontSize: '2xs',
      _before: { content: '"↳ "' },
    },

    description: {
      marginTop: 'md',
      fontFamily: 'body',
      fontSize: 'base',
      lineHeight: 'body',
      color: 'body',
      whiteSpace: 'pre-line',
    },

    links: { display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: 'lg' },
    link: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontWeight: 'semibold',
      color: 'white',
      paddingBottom: '3px',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'gray.700',
      transition:
        'color {durations.fast} {easings.quint}, border-color {durations.fast} {easings.quint}',
      _hover: {
        color: 'action',
        borderColor: 'action',
        '& svg': { transform: 'translate(2px, -2px)' },
      },
      '& svg': { transition: 'transform {durations.fast} {easings.quint}' },
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
        '& svg': { transition: 'none' },
      },
    },
  },
})
