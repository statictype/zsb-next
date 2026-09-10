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
      position: 'relative',
      minHeight: { base: '[calc(100svh - 80px)]', lg: '[calc(100svh - 120px)]' },
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    inner: {
      position: 'relative',
      zIndex: '1',
      flex: '1',
      width: 'full',
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '2xl',
    },

    head: {
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
    prefix: { color: '[currentColor]' },

    plate: {
      position: 'absolute',
      inset: '0',
      zIndex: '0',
    },
    frame: {
      position: 'absolute',
      inset: '0',
      overflow: 'hidden',
      background: 'gray.900',
      filter: '[token(assets.color)]',
    },
    image: { objectFit: 'cover' },

    ledger: {
      margin: '0',
      width: 'full',
      maxWidth: 'narrowColumn',
      animationStyle: 'enter',
      animationDelay: 'stagger',
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '[64px minmax(0, 1fr)]',
      columnGap: 'md',
      alignItems: 'baseline',
      paddingBlock: 'sm',
      borderBottom: 'hairline',
      borderBottomColor: '[currentColor]',
      _last: { borderBottom: 'none' },
    },
    rowLabel: { margin: '0' },
    rowValue: { margin: '0', overflowWrap: 'anywhere' },
  },
  variants: {
    ink: {
      black: { inner: { color: 'black' } },
      white: { inner: { color: 'white' } },
    },
  },
  defaultVariants: { ink: 'white' },
})
