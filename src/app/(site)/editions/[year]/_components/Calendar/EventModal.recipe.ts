import { sva } from 'styled-system/css'

/**
 * EventModal — co-located slot recipe.
 *
 * Product content inside the shared panel Dialog. Dialog owns the modal shell;
 * this recipe keeps event layout, typography, poster, and floating controls.
 */
export const eventModal = sva({
  slots: ['controls', 'poster', 'body', 'when', 'name', 'types', 'venue', 'description', 'links'],
  base: {
    // Floating bar over the dialog top: Back (left) + Share (right). The bar is
    // click-through; only the buttons themselves take pointer events.
    controls: {
      position: 'absolute',
      top: 'sm',
      left: 'sm',
      right: 'sm',
      zIndex: '2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'sm',
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
      // Top padding clears the floating control bar (36px + offset) with a gap.
      paddingTop: '[calc(36px + token(spacing.sm) + token(spacing.lg))]',
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

    // Layout-only overrides — the chip list + venue line are the shared
    // `TypeChips` / `VenueLine` components; these slots add the modal's rhythm.
    types: { marginTop: 'sm' },
    venue: { marginTop: 'sm' },

    description: {
      marginTop: 'md',
      fontFamily: 'body',
      fontSize: 'base',
      lineHeight: 'body',
      color: 'body',
      whiteSpace: 'pre-line',
    },

    links: { display: 'flex', flexWrap: 'wrap', gap: 'md', marginTop: 'lg' },
  },
})
