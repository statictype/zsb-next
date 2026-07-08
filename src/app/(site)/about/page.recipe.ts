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
    'pillarsGrid',
    'pillar',
    'pillarHead',
    'pillarTitle',
    'pillarBody',
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
      objectFit: 'cover',
      background: 'gray.900',
      filter: '[grayscale(100%) contrast(1.05)]',
    },

    // Dark ground + rhythm from `section({ ground: 'dark' })` in the component;
    // the carousel is the full-bleed band (no rail), so it spans the shell.
    carouselSection: {
      // Cancel the carousel controls' top margin — the section owns the rhythm.
      '& > :first-child': { marginTop: '0' },
    },

    pillarsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      borderTop: 'hairline',
      borderBottom: 'hairline',
      md: { gridTemplateColumns: '1fr 1fr' },
    },
    pillar: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      paddingBlock: 'xl',
      borderBottom: 'hairline',
      '&:last-child': { borderBottom: 'none' },
      md: {
        paddingBlock: 'xl',
        paddingInline: 'xl',
        borderBottom: 'none',
        borderRight: 'hairline',
        marginBlock: '4xl',
        '&:first-child': { paddingLeft: '0' },
        '&:last-child': { paddingRight: '0', borderRight: 'none' },
      },
    },
    pillarHead: { display: 'flex', alignItems: 'baseline', gap: 'md' },
    pillarTitle: {
      fontFamily: 'display',
      fontSize: 'lg',
      textTransform: 'uppercase',
      lineHeight: 'tight',
      color: 'highlight',
      letterSpacing: 'tight',
    },
    pillarBody: {
      textStyle: 'prose',
      maxWidth: 'measure',
    },

    // Curator letter — signed editorial spread on light. Ground (light) +
    // rhythm (lg) from `section()` in the component; `statementInner` is the rail.
    statement: {
      position: 'relative',
      _before: {
        content: '""',
        position: 'absolute',
        inset: '[0 0 auto]',
        height: '[1px]',
        background: 'divider',
      },
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
      fontFamily: 'display',
      fontSize: 'md',
      textTransform: 'uppercase',
      color: 'heading',
      lineHeight: 'tight',
      letterSpacing: 'tight',
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
