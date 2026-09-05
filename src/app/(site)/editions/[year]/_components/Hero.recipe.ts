import { sva } from 'styled-system/css'

export const hero = sva({
  slots: [
    'hero',
    'inner',
    'head',
    'mast',
    'prefix',
    'plate',
    'frame',
    'image',
    'ledger',
    'row',
    'rowLabel',
    'rowValue',
  ],
  base: {
    hero: {
      layerStyle: 'pageHero',
      paddingInline: 'gutter',
    },
    inner: {
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      display: 'grid',
      gridTemplateColumns: '[minmax(0, 1fr)]',
      gridTemplateAreas: '"head" "plate" "ledger"',
      rowGap: 'xl',
      columnGap: 'gridGap',
      lg: {
        gridTemplateColumns: '[minmax(0, 1fr) minmax(0, 1fr)]',
        gridTemplateRows: '[auto 1fr]',
        gridTemplateAreas: '"head plate" "ledger plate"',
      },
    },

    head: {
      gridArea: 'head',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'md',
      minWidth: '0',
      animationStyle: 'enter',
    },
    mast: {
      margin: '0',
      display: 'flex',
      alignItems: 'baseline',
      flexWrap: 'wrap',
      columnGap: '[0.25em]',
    },
    prefix: { color: 'muted' },

    plate: {
      gridArea: 'plate',
      position: 'relative',
      border: 'hairline',
      aspectRatio: { base: '1 / 1', md: '16 / 9', lg: '3 / 2' },
      // Stretch would make the height definite and drop the aspect ratio.
      lg: { alignSelf: 'center' },
    },
    frame: {
      position: 'absolute',
      inset: '0',
      overflow: 'hidden',
      background: 'gray.900',
      filter: '[token(assets.mono)]',
    },
    image: { objectFit: 'cover' },

    ledger: {
      gridArea: 'ledger',
      margin: '0',
      width: 'full',
      animationStyle: 'enter',
      animationDelay: 'stagger',
      lg: { alignSelf: 'end' },
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '[64px minmax(0, 1fr)]',
      columnGap: 'md',
      alignItems: 'baseline',
      paddingBlock: 'sm',
      borderBottom: 'hairline',
      _last: { borderBottom: 'none' },
    },
    rowLabel: { margin: '0' },
    rowValue: { margin: '0', overflowWrap: 'anywhere' },
  },
})
