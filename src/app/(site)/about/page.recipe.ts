import { sva } from 'styled-system/css'

export const aboutPage = sva({
  slots: [
    'pillars',
    'pillar',
    'pillarPlate',
    'pillarImg',
    'pillarBody',
    'pillarText',
    'carousel',
    'statement',
    'statementInner',
    'statementAside',
    'statementByline',
    'authorPhoto',
    'authorPhotoImg',
    'authorCaption',
    'statementLetter',
  ],
  base: {
    pillars: { listStyle: 'none', margin: '0', padding: '0' },
    pillar: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr)',
      gridTemplateAreas: '"plate" "body"',
      rowGap: 'lg',
      paddingBlock: '3xl',
      borderTop: 'hairline',
      '&:first-child': { borderTop: 'none', paddingTop: '0' },
      '&:last-child': { paddingBottom: '0' },
      lg: {
        gridTemplateColumns: '1fr 1fr',
        gridTemplateAreas: '"body plate"',
        columnGap: '2xl',
        alignItems: 'center',
        '&:nth-child(even)': { gridTemplateAreas: '"plate body"' },
      },
    },
    pillarPlate: {
      gridArea: 'plate',
      position: 'relative',
      overflow: 'hidden',
      border: 'hairline',
      background: 'gray.900',
      aspectRatio: { base: '1 / 1', md: '16 / 9', lg: '3 / 2' },
    },
    pillarImg: {
      objectFit: 'cover',
    },
    pillarBody: {
      gridArea: 'body',
    },
    pillarText: {
      maxWidth: 'measure',
    },

    carousel: { marginTop: 'xl' },

    statement: {
      borderTop: 'hairline',
    },
    statementInner: {
      marginInline: 'auto',
      paddingInline: 'gutter',
      maxWidth:
        'calc(token(sizes.measure) + 300px + token(spacing.3xl) + 2 * token(spacing.gutter))',
      display: 'flex',
      flexDirection: 'column',
      gap: 'xl',
      lg: {
        display: 'grid',
        gridTemplateColumns: 'minmax(220px, 300px) minmax(0, 1fr)',
        columnGap: '3xl',
        alignItems: 'start',
      },
    },
    statementAside: {
      lg: {
        position: 'sticky',
        top: 'calc(token(sizes.nav) + token(spacing.xl))',
      },
    },
    statementByline: {
      alignItems: 'start',
      maxWidth: '300px',
    },
    authorPhoto: {
      position: 'relative',
      aspectRatio: '1 / 1',
      width: '100%',
      maxWidth: '200px',
      overflow: 'hidden',
      background: 'gray.200',
      border: 'hairline',
    },
    authorPhotoImg: {
      objectFit: 'cover',
    },
    authorCaption: {
      alignSelf: 'stretch',
      borderTop: 'primary',
      paddingTop: 'sm',
    },
    statementLetter: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      '& > p': { maxWidth: 'measure' },
      '& > p:first-child': { marginBottom: 'sm' },
    },
  },
})
