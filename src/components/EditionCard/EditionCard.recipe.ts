import { sva } from 'styled-system/css'

/** Archive image-card chrome only; the footer rail's imageless plate lives in
 *  EditionRailCard.recipe. */
export const editionCard = sva({
  slots: [
    'root',
    'media',
    'image',
    'year',
    'content',
    'meta',
    'details',
    'venue',
    'cta',
    'ctaIcon',
  ],
  base: {
    root: {
      height: 'full',
      overflow: 'visible',
      _focusVisible: { outline: 'focus', outlineOffset: 'xs' },
    },
    media: {
      position: 'relative',
      width: 'full',
      overflow: 'hidden',
      background: 'gray.900',
      _after: {
        content: '""',
        position: 'absolute',
        inset: '0',
        background:
          '[linear-gradient(180deg, rgb(0 0 0 / 0.5), transparent 30%, rgb(0 0 0 / 0.55))]',
        pointerEvents: 'none',
        zIndex: '1',
      },
    },
    image: {
      objectFit: 'cover',
      background: 'gray.900',
      filter: '[grayscale(100%) brightness(0.7)]',
      transform: 'scale(1.01)',
      // Develop and zoom on separate clocks — one shorthand, two durations.
      transition:
        '[filter {durations.reveal} {easings.expo}, transform {durations.entrance} {easings.expo}]',
      'a:hover &, a:focus-visible &': {
        filter: '[grayscale(30%) brightness(1)]',
        transform: 'scale(1.05)',
      },
    },
    year: {
      position: 'absolute',
      top: 'md',
      left: 'md',
      zIndex: '2',
    },
    content: {
      position: 'relative',
      zIndex: '1',
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      marginTop: '[-3rem]',
      padding: 'md',
    },
    // One row: the unlabeled date/venue line on the left, the "View edition"
    // cue on the right. Spacing above the row comes from `content`'s own
    // gap; the hairline is the row's own top border.
    meta: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'sm',
      marginTop: 'sm',
      paddingTop: 'md',
      borderTop: 'hairline',
      color: 'body',
    },
    details: {
      minWidth: '0',
      fontSize: 'sm',
      lineHeight: 'body',
      letterSpacing: 'subtle',
      textWrap: '[pretty]',
    },
    // Keeps the venue name from breaking mid-phrase — a narrow card wraps
    // before the whole name, not between its words.
    venue: { whiteSpace: 'nowrap' },
    // The card's own link already carries the accessible name (tape + meta);
    // this cue is a purely visual affordance, hidden from the a11y tree.
    cta: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: '0',
      gap: 'sm',
      fontFamily: 'body',
      fontSize: 'xs',
      fontWeight: 'semibold',
      letterSpacing: 'label',
      textTransform: 'uppercase',
      color: 'heading',
      transitionProperty: 'colors',
      transitionDuration: 'normal',
      transitionTimingFunction: 'expo',
      'a:hover &': { color: 'action' },
    },
    ctaIcon: {
      transitionProperty: '[transform]',
      transitionDuration: 'normal',
      transitionTimingFunction: 'expo',
      'a:hover &': { transform: 'translate(2px, -2px)' },
    },
  },
  variants: {
    size: {
      // The panoramic ratio only reads as "featured" once the grid actually
      // goes two-column and spans this card full-width (`lg`, page.recipe.ts).
      // Below that it stacks single-column with the rest, so it matches their
      // aspect ratio — otherwise it's the odd one out on mobile.
      lg: { media: { aspectRatio: { base: '16 / 9', md: '21 / 9', lg: '21 / 9' } } },
      md: { media: { aspectRatio: { base: '16 / 9', md: '21 / 9', lg: '16 / 10' } } },
    },
  },
  defaultVariants: { size: 'md' },
})
