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
    'projectSection',
    'projectGrid',
    'projectAside',
    'projectTitle',
    'projectMain',
    'carouselSection',
    'pillarsSection',
    'pillarsGrid',
    'pillar',
    'pillarHead',
    'pillarTitle',
    'pillarBody',
    'statement',
    'statementInner',
    'statementAside',
    'statementHeadline',
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
      border: '1px solid token(colors.divider)',
      md: { aspectRatio: '16 / 9' },
    },
    placeImageImg: {
      objectFit: 'cover',
      background: 'gray.900',
      filter: 'grayscale(100%) contrast(1.05)',
    },

    // The project — asymmetric editorial split on light.
    projectSection: {
      layerStyle: 'sectionLight',
      paddingBlock: 'sectionYLg',
      paddingInline: 'content',
    },
    projectGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 'lg',
      lg: {
        gridTemplateColumns: '1fr 1fr',
        // No gutter: the body column starts exactly at 50% so its accent bar
        // lands on the pillars' centre divider.
        columnGap: '0',
        rowGap: 'lg',
        alignItems: 'start',
      },
    },
    projectAside: { position: 'relative' },
    projectTitle: {
      fontFamily: 'display',
      fontSize: { base: '2xl', xl: '3xl', '3xl': '4xl' },
      lineHeight: { base: 'tight', md: 'display', '4xl': '1.08' },
      color: 'black',
      textWrap: 'pretty',
      margin: '0',
      paddingRight: 'md',
    },
    projectMain: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      paddingLeft: 'md',
      md: { paddingLeft: '40px' },
      _before: {
        content: '""',
        position: 'absolute',
        left: '0',
        top: '0',
        bottom: '0',
        width: '2px',
        background: 'linear-gradient(to bottom, {colors.action}, transparent)',
      },
      '& p': {
        fontFamily: 'body',
        fontSize: 'md',
        lineHeight: 'body',
        fontWeight: 'light',
        color: 'bodyLight',
      },
    },

    carouselSection: {
      layerStyle: 'sectionDark',
      paddingTop: 'sectionY',
      paddingInline: 'content',
      paddingBottom: '0',
      // Cancel the carousel controls' top margin — the section owns the rhythm.
      '& > :first-child': { marginTop: '0' },
    },

    pillarsSection: {
      layerStyle: 'sectionDark',
      paddingTop: '0',
      paddingInline: 'content',
      paddingBottom: '2xl',
      md: { paddingBottom: '0' },
    },
    pillarsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      borderTop: '1px solid token(colors.divider)',
      borderBottom: '1px solid token(colors.divider)',
      md: { gridTemplateColumns: '1fr 1fr' },
    },
    pillar: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      paddingBlock: 'xl',
      borderBottom: '1px solid token(colors.divider)',
      '&:last-child': { borderBottomWidth: '0' },
      md: {
        paddingBlock: 'xl',
        paddingInline: 'xl',
        borderBottomWidth: '0',
        borderRight: '1px solid token(colors.divider)',
        marginBlock: '4xl',
        '&:first-child': { paddingLeft: '0' },
        '&:last-child': { paddingRight: '0', borderRightWidth: '0' },
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
      margin: '0',
    },
    pillarBody: {
      fontFamily: 'body',
      fontSize: 'base',
      lineHeight: { base: 'body', md: 'loose' },
      color: 'body',
      maxWidth: '50ch',
    },

    // Curator letter — signed editorial spread on light.
    statement: {
      position: 'relative',
      background: 'surfaceLight',
      color: 'headingLight',
      paddingBlock: 'sectionYLg',
      paddingInline: 'content',
      _before: {
        content: '""',
        position: 'absolute',
        inset: '0 0 auto',
        height: '1px',
        background: 'dividerLight',
      },
    },
    statementInner: {
      maxWidth: 'maxWidth',
      marginInline: 'auto',
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
        top: 'calc(token(sizes.nav) + token(spacing.xl))',
        marginBottom: '0',
      },
    },
    statementHeadline: {
      textStyle: 'sectionTitle',
      color: 'headingLight',
      marginTop: '0',
      marginBottom: 'xl',
      textWrap: 'balance',
    },
    statementByline: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      margin: '0',
      maxWidth: '240px',
    },
    authorPhotoFrame: {
      padding: '6px',
      background: 'white',
      border: '1px solid token(colors.dividerLight)',
      _hover: { '& img': { filter: 'grayscale(0%)', transform: 'scale(1.03)' } },
      '@media (prefers-reduced-motion: reduce)': { '& img': { transform: 'none' } },
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
      filter: 'grayscale(100%) contrast(1.02)',
      transition:
        'filter {durations.slow} {easings.expo}, transform {durations.slow} {easings.expo}',
      '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
    },
    authorCaption: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      paddingTop: 'sm',
      borderTop: '2px solid token(colors.action)',
    },
    authorName: {
      fontFamily: 'display',
      fontSize: 'md',
      textTransform: 'uppercase',
      color: 'headingLight',
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
    statementLetter: { maxWidth: '62ch' },
    letterBody: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      '& p': {
        fontFamily: 'body',
        fontSize: 'md',
        fontWeight: 'light',
        color: 'bodyLight',
        textWrap: 'pretty',
      },
    },
  },
})
