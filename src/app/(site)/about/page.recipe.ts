import { sva } from 'styled-system/css'

export const aboutPage = sva({
  slots: [
    'placeImage',
    'placeImageImg',
    'statement',
    'statementInner',
    'statementAside',
    'statementByline',
    'authorPhotoFrame',
    'authorPhoto',
    'authorPhotoImg',
    'authorCaption',
    'statementLetter',
  ],
  base: {
    placeImage: {
      position: 'relative',
      aspectRatio: '4 / 5',
      overflow: 'hidden',
      border: 'hairline',
      md: { aspectRatio: '16 / 9' },
    },
    placeImageImg: {
      layerStyle: 'coverMono',
      background: 'gray.900',
    },

    // Curator letter — signed editorial spread on light. Ground (light) +
    // rhythm (lg) from `section()` in the component; `statementInner` is the rail.
    statement: {
      borderTop: 'hairline',
    },
    statementInner: {
      layerStyle: 'sectionInner',
      display: 'flex',
      flexDirection: 'column',
      gap: '2xl',
      lg: {
        display: 'grid',
        gridTemplateColumns: 'minmax(260px, 340px) minmax(0, 1fr)',
        columnGap: '2xl',
        alignItems: 'start',
      },
      '2xl': {
        gridTemplateColumns: 'minmax(300px, 380px) minmax(0, 1fr)',
        columnGap: '3xl',
      },
    },
    statementAside: {
      lg: {
        position: 'sticky',
        top: '[calc(token(sizes.nav) + token(spacing.xl))]',
      },
    },
    statementByline: {
      maxWidth: '[240px]',
    },
    authorPhotoFrame: {
      padding: 'sm',
      background: 'white',
      border: 'hairline',
      _hover: { '& img': { filter: '[grayscale(0%)]', transform: 'scale(1.03)' } },
      _motionReduce: { '& img': { transform: 'none' } },
    },
    authorPhoto: {
      position: 'relative',
      aspectRatio: '4 / 5',
      overflow: 'hidden',
      background: 'gray.200',
    },
    authorPhotoImg: {
      objectFit: 'cover',
      background: 'gray.200',
      filter: '[grayscale(100%) contrast(1.02)]',
      transitionProperty: '[filter, transform]',
      transitionDuration: 'slow',
      transitionTimingFunction: 'expo',
      _motionReduce: { transitionDuration: 'instant' },
    },
    authorCaption: {
      borderTop: 'primary',
    },
    statementLetter: { maxWidth: 'measure' },
  },
})
