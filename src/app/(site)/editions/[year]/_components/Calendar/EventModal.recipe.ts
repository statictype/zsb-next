import { sva } from 'styled-system/css'

const dismissBox = 'calc(token(spacing.sm) * 2 + 32px)'

/**
 * EventModal — co-located slot recipe.
 *
 * Product content inside the shared panel Dialog. Dialog owns the modal shell;
 * this recipe keeps the poster, the scrolling reading column, and the action
 * row docked under it.
 */
export const eventModal = sva({
  slots: ['back', 'poster', 'body', 'content', 'when', 'name', 'description', 'actions', 'share'],
  base: {
    back: {
      position: 'absolute',
      top: 'sm',
      left: 'sm',
      zIndex: '2',
      color: 'heading',
      textShadow: 'text',
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
    poster: {
      true: {},
      false: {
        content: { paddingTop: `[${dismissBox}]` },
      },
    },
  },
  defaultVariants: { poster: false },
})
