import { sva } from 'styled-system/css'

/**
 * About page — co-located slot recipe.
 *
 * The editorial About spread: an asymmetric "the project" split on light, a
 * dark gallery carousel + pillars band, then the curator letter — a sticky
 * portrait/masthead rail beside a generously set letter on light. The shared
 * hero header is the `PageHero` component; the curator eyebrow is `<Eyebrow>`.
 * The unused legacy `signature*` rules are dropped (the letter renders no
 * sign-off block). `inner` reuses the shared `sectionInner` layerStyle.
 */
export const aboutPage = sva({
  slots: [
    'inner',
    'placeImage',
    'placeImageImg',
    'carouselSection',
    'statement',
    'statementInner',
    'statementAside',
    'statementByline',
    'authorPhotoFrame',
    'authorPhoto',
    'authorPhotoImg',
    'authorCaption',
    'authorName',
    'authorRole',
    'statementLetter',
    'letterBody',
  ],
  base: {
    inner: { layerStyle: 'sectionInner' },

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

    // Dark ground + rhythm from `section({ ground: 'dark' })` in the component;
    // the carousel is the full-bleed band (no rail), so it spans the shell.
    carouselSection: {
      // Cancel the carousel controls' top margin — the section owns the rhythm.
      '& > :first-child': { marginTop: '0' },
    },

    // Curator letter — signed editorial spread on light. Ground (light) +
    // rhythm (lg) from `section()` in the component; `statementInner` is the rail.
    statement: {
      borderTop: 'hairline',
    },
    statementInner: {
      layerStyle: 'sectionInner',
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
      marginBottom: '2xl',
      lg: {
        position: 'sticky',
        top: '[calc(token(sizes.nav) + token(spacing.xl))]',
        marginBottom: '0',
      },
    },
    statementByline: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      // Matches the portrait's mobile image request; keep frame and source size aligned.
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
      display: 'flex',
      flexDirection: 'column',
      gap: 'xs',
      paddingTop: 'sm',
      borderTop: 'primary',
    },
    authorName: {
      textStyle: 'labelDisplay',
      fontSize: 'md',
      color: 'heading',
    },
    authorRole: {
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'wide',
      color: 'muted',
    },
    statementLetter: { maxWidth: 'measure' },
    letterBody: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      '& p': {
        textStyle: 'leadLarge',
        color: 'body',
      },
    },
  },
})
