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
    },
    media: {
      position: 'relative',
      width: 'full',
      overflow: 'hidden',
      background: 'gray.900',
      // Shared below `lg`, where both sizes stack single-column; only the
      // panoramic `lg` size variant departs at the `lg` breakpoint.
      aspectRatio: { base: '16 / 9', md: '21 / 9' },
      _after: {
        content: '""',
        position: 'absolute',
        inset: '0',
        backgroundGradient: 'cardScrim',
        pointerEvents: 'none',
        zIndex: '1',
      },
    },
    image: {
      objectFit: 'cover',
      background: 'gray.900',
      filter: '[token(assets.developRest)]',
      transform: 'scale(1.01)',
      // Develop and zoom on separate clocks — one shorthand, two durations.
      transition:
        '[filter {durations.reveal} {easings.expo}, transform {durations.entrance} {easings.expo}]',
      'a:hover &, a:focus-visible &': {
        filter: '[token(assets.developHover)]',
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
      marginTop: '[calc(token(spacing.cardOverlap) * -1)]',
      padding: 'md',
    },
    meta: {
      paddingTop: 'md',
    },
    details: {
      minWidth: '0',
      textWrap: '[pretty]',
    },
    // Keeps the venue name from breaking mid-phrase — a narrow card wraps
    // before the whole name, not between its words.
    venue: { whiteSpace: 'nowrap' },
    cta: {
      flexShrink: '0',
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
      lg: { media: { aspectRatio: { lg: '21 / 9' } } },
      md: { media: { aspectRatio: { lg: '16 / 10' } } },
    },
  },
  defaultVariants: { size: 'md' },
})
