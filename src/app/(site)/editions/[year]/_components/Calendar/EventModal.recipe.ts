import { sva } from 'styled-system/css'

/**
 * EventModal — co-located slot recipe.
 *
 * Product content inside the shared panel Dialog. Dialog owns the modal shell;
 * this recipe keeps event layout, typography, poster, and floating controls.
 */
export const eventModal = sva({
  slots: ['controls', 'poster', 'body', 'when', 'types', 'venue', 'description', 'links'],
  base: {
    // Floating bar over the dialog top: Back (left) + Share (right). The bar is
    // click-through; only the buttons themselves take pointer events.
    controls: {
      position: 'absolute',
      top: 'sm',
      left: 'sm',
      right: 'sm',
      zIndex: '2',
      pointerEvents: 'none',
      '& > *': { pointerEvents: 'auto' },
    },

    poster: {
      position: 'relative',
      width: 'full',
      aspectRatio: '3 / 4',
      maxHeight: '[46vh]',
      flexShrink: '0',
      overflow: 'hidden',
      background: 'black',
      // Show the whole poster, not a crop.
      '& img': { objectFit: 'contain' },
      md: { width: '[320px]', aspectRatio: 'auto', maxHeight: '[none]', alignSelf: 'stretch' },
    },

    body: {
      display: 'flex',
      flex: '1',
      minHeight: '0',
      flexDirection: 'column',
      gap: 'xs',
      // Clear the floating control bar. Its bottom edge sits at `top` (sm) plus
      // the ~sm-Button height (~34px); `3xl` stays safely above that at every
      // breakpoint, so the clearance never depends on measuring the button.
      paddingTop: '3xl',
      paddingInline: 'lg',
      paddingBottom: 'lg',
      overflowY: 'auto',
    },
    when: {
      color: 'highlight',
    },
    // Layout-only overrides — the chip list + venue line are the shared
    // `TypeChips` / `VenueLine` components; these slots add the modal's rhythm.
    types: { marginTop: 'sm' },
    venue: { marginTop: 'sm' },

    description: {
      marginTop: 'md',
      whiteSpace: 'pre-line',
    },

    links: { marginTop: 'lg' },
  },
})
