import { sva } from 'styled-system/css'

export const editionCard = sva({
  slots: ['root', 'media', 'image', 'year', 'content', 'status'],
  base: {
    root: {
      height: '100%',
      _focusVisible: { outline: '2px solid token(colors.action)', outlineOffset: '4px' },
      '&[data-current=true]': { cursor: 'default', borderColor: 'highlight' },
      '&[data-upcoming]': { cursor: 'default' },
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
    year: { position: 'absolute', top: 'md', left: 'md', zIndex: '2' },
    content: {
      position: 'relative',
      zIndex: '1',
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      marginTop: '-3rem',
      padding: 'md',
    },
    status: { alignSelf: 'flex-start' },
  },
  variants: {
    media: {
      image: {},
      none: {
        root: { padding: 'lg', minHeight: '208px' },
        content: { marginTop: '0', padding: '0', flex: '1', justifyContent: 'space-between' },
        year: { position: 'static' },
      },
    },
    size: {
      lg: { media: { aspectRatio: '21 / 9' } },
      md: { media: { aspectRatio: { base: '4 / 3', md: '16 / 10' } } },
      sm: { content: { minHeight: '100%' } },
    },
  },
  defaultVariants: { media: 'image', size: 'md' },
})
