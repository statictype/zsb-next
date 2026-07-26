import { sva } from 'styled-system/css'

// The control bar's full height: an icon button inset by `sm` top and bottom.
// The tallest control sets it, so the clearance never depends on which of them
// renders.
const dismissBox = 'calc(token(spacing.sm) * 2 + token(sizes.hitTarget))'

/**
 * EventModal — co-located slot recipe.
 *
 * Product content inside the shared panel Dialog. Dialog owns the modal shell;
 * this recipe keeps the poster, the scrolling reading column, and the action
 * row docked under it.
 */
export const eventModal = sva({
  slots: [
    'controls',
    'steps',
    'poster',
    'body',
    'content',
    'when',
    'name',
    'description',
    'actions',
    'share',
  ],
  base: {
    // Leaving the panel (left) and moving through it (right), on one axis over
    // the poster. Click-through, so only the controls themselves take the
    // pointer — the poster underneath stays fully clickable.
    controls: {
      position: 'absolute',
      insetInline: 'sm',
      top: 'sm',
      zIndex: '2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'sm',
      pointerEvents: 'none',
      color: 'heading',
      textShadow: 'text',
      '& > *': { pointerEvents: 'auto' },
    },
    steps: {
      display: 'flex',
      alignItems: 'center',
      pointerEvents: 'auto',
    },

    poster: {
      position: 'relative',
      width: 'full',
      aspectRatio: '3 / 4',
      maxHeight: '[42vh]',
      flexShrink: '0',
      overflow: 'hidden',
      background: 'black',
      // The counterpart to the lightbox's own `zoom-out`.
      cursor: 'zoom-in',
      // Show the whole poster, not a crop.
      '& img': { objectFit: 'contain' },
      // The poster is flush to the panel edge, which clips at `overflow:
      // hidden` — the global 4px-offset ring would lose its outer sides.
      _focusVisible: { outlineOffset: 'dialogInset' },
      _after: {
        content: '""',
        position: 'absolute',
        insetInline: '0',
        top: '0',
        height: `[calc(${dismissBox} * 1.5)]`,
        background:
          '[linear-gradient(180deg, rgb(0 0 0 / 0.85) 0%, rgb(0 0 0 / 0.8) 55%, transparent 100%)]',
        pointerEvents: 'none',
      },
      // Sized from the panel, not the viewport: the panel's height is
      // content-driven, so a vh-derived width leaves the contained poster
      // letterboxed by a different amount on every event.
      md: {
        width: '[42%]',
        aspectRatio: 'auto',
        maxHeight: '[none]',
        alignSelf: 'stretch',
      },
    },

    body: {
      display: 'flex',
      flex: '1',
      flexDirection: 'column',
      minWidth: '0',
      minHeight: '0',
    },

    content: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1',
      minHeight: '0',
      padding: 'lg',
      overflowY: 'auto',
      overscrollBehavior: 'contain',
    },

    when: {
      color: 'highlight',
    },
    name: {
      textStyle: 'cardTitle',
      color: 'heading',
      textWrap: 'balance',
    },
    description: {
      whiteSpace: 'pre-line',
      maxWidth: 'measure',
    },

    actions: {
      flexShrink: '0',
      borderTop: 'hairline',
      paddingInline: 'lg',
      paddingBlock: 'md',
    },
    share: {
      marginInlineStart: 'auto',
    },
  },
  variants: {
    // The control bar spans the panel, not the poster. With a poster it only
    // crosses the reading column once the panel goes horizontal; without one it
    // sits over the column at every width.
    poster: {
      true: {
        content: { md: { paddingTop: `[${dismissBox}]` } },
      },
      false: {
        content: { paddingTop: `[${dismissBox}]` },
      },
    },
  },
  defaultVariants: { poster: false },
})
