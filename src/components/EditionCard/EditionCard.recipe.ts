import { sva } from 'styled-system/css'

/** Archive image-card chrome only; the footer rail's imageless plate lives in
 *  EditionRailCard.recipe. */
export const editionCard = sva({
  slots: ['root', 'media', 'image', 'year', 'content', 'meta', 'metaItem'],
  base: {
    root: {
      height: '100%',
      overflow: 'visible',
      _focusVisible: { outline: '2px solid token(colors.action)', outlineOffset: '4px' },
    },
    media: {
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      background: 'gray.900',
      _after: {
        content: '""',
        position: 'absolute',
        inset: '0',
        background: 'linear-gradient(180deg, rgb(0 0 0 / 0.5), transparent 30%, rgb(0 0 0 / 0.55))',
        pointerEvents: 'none',
        zIndex: '1',
      },
    },
    image: {
      objectFit: 'cover',
      background: 'gray.900',
      filter: 'grayscale(100%) brightness(0.7)',
      transform: 'scale(1.01)',
      transition:
        'filter {durations.reveal} {easings.expo}, transform {durations.entrance} {easings.expo}',
      'a:hover &, a:focus-visible &': {
        filter: 'grayscale(30%) brightness(1)',
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
      marginTop: '-3rem',
      padding: 'md',
    },
    meta: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 'xs',
      margin: '0',
      padding: 'md 0 0',
      borderTop: 'hairline',
      color: 'body',
      md: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
    },
    metaItem: {
      display: 'grid',
      gap: '2xs',
      minWidth: '0',
      '& dt': { textStyle: 'metaLabel' },
      '& dd': { margin: '0', fontSize: 'sm', lineHeight: 'body', textWrap: 'pretty' },
    },
  },
  variants: {
    size: {
      lg: { media: { aspectRatio: '21 / 9' } },
      md: { media: { aspectRatio: { base: '4 / 3', md: '16 / 10' } } },
    },
  },
  defaultVariants: { size: 'md' },
})
