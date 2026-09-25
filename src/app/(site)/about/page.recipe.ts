import { sva } from 'styled-system/css'

export const aboutPage = sva({
  slots: [
    'pillars',
    'pillar',
    'pillarPlate',
    'pillarImg',
    'pillarBody',
    'pillarText',
    'plateFrame',
    'plateImg',
    'plateCredit',
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
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gridTemplateAreas: '"body plate"',
        columnGap: 'gridGap',
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
      layerStyle: 'coverMono',
    },
    pillarBody: {
      gridArea: 'body',
    },
    pillarText: {
      maxWidth: 'measure',
    },

    plateFrame: {
      marginTop: 'xl',
      position: 'relative',
      isolation: 'isolate',
      aspectRatio: '1 / 1',
      overflow: 'hidden',
      md: { aspectRatio: '21 / 9' },
      _after: {
        content: '""',
        position: 'absolute',
        insetInline: '0',
        bottom: '0',
        height: '[42%]',
        zIndex: '1',
        pointerEvents: 'none',
        backgroundGradient: 'stageScrim',
      },
    },
    plateImg: {
      layerStyle: 'coverMono',
      background: 'gray.900',
    },
    plateCredit: {
      position: 'absolute',
      insetInline: '0',
      bottom: '0',
      zIndex: '2',
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      paddingInline: 'gutter',
      paddingBottom: 'md',
    },

    statement: {
      borderTop: 'hairline',
    },
    statementInner: {
      marginInline: 'auto',
      paddingInline: 'gutter',
      maxWidth:
        '[calc(token(sizes.measure) + 300px + token(spacing.3xl) + 2 * token(spacing.gutter))]',
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
        top: '[calc(token(sizes.nav) + token(spacing.xl))]',
      },
    },
    statementByline: {
      alignItems: 'start',
      maxWidth: '[300px]',
    },
    authorPhoto: {
      position: 'relative',
      aspectRatio: '1 / 1',
      width: '[100%]',
      maxWidth: '[200px]',
      overflow: 'hidden',
      background: 'gray.200',
      border: 'hairline',
    },
    authorPhotoImg: {
      layerStyle: 'coverMono',
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
