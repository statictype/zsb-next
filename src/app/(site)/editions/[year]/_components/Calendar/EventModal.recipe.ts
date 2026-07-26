import { sva } from 'styled-system/css'

// The control bar's full height: an icon button inset by `sm` top and bottom.
const dismissBox = 'calc(token(spacing.sm) * 2 + token(sizes.hitTarget))'

// Where the control bar crosses the reading column, the column both clears it
// and fades under it. The poster gets that separation from its own scrim; the
// column is black on black, so scrolled text would otherwise run into the
// arrows. The fade spans exactly the bar's box, so an unscrolled column — whose
// first line already starts below it — shows no fade at all.
const clearsControls = {
  paddingTop: `[${dismissBox}]`,
  maskImage: `[linear-gradient(to bottom, transparent 0, black ${dismissBox})]`,
} as const

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
    'footer',
    'actions',
    'share',
  ],
  base: {
    // Moving through the programme (left) and leaving the panel (right), on one
    // axis over the poster. Icon-only, so the bar fits the narrowest panel.
    // Click-through, so only the controls themselves take the pointer — the
    // poster underneath stays fully clickable.
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
    // A matched pair, so the two arrows stay flush. Holds the slot even when
    // neither renders, so close keeps its edge.
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
      // A contained poster leaves black bars, so nothing marks where the plate
      // ends and the reading column begins.
      borderBlockEnd: 'hairline',
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
        borderBlockEnd: 'none',
        borderInlineEnd: 'hairline',
        // Descriptions are short by schema, so panel height is set by three or
        // four lines of text — which left a 3:4 poster boxed inside a column
        // twice its width. The floor is the height at which the poster fills
        // that column: 42% of the panel wide is 56% of the panel tall. Panel
        // width is `dialogPanelXl` or the viewport less the positioner's
        // padding, and the last term is the panel's own ceiling, so the floor
        // can never force the positioner to scroll.
        minHeight:
          '[min(calc(token(sizes.dialogPanelXl) * 0.56), calc(56vw - token(spacing.lg) * 1.12), calc(100vh - token(spacing.lg) * 2))]',
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

    // Acting on the event, then leaving it: two rows, one docked strip. Leaving
    // takes its own row because its label is wider than the whole strip on a
    // narrow panel, and it is the last thing in reading order, not the first.
    footer: {
      flexShrink: '0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'md',
      borderTop: 'hairline',
      paddingInline: 'lg',
      paddingBlock: 'md',
    },
    actions: {
      width: 'full',
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
        content: { md: clearsControls },
      },
      false: {
        content: clearsControls,
      },
    },
  },
  defaultVariants: { poster: false },
})
