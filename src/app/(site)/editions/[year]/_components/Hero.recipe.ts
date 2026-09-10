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
    'thumb',
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
      minHeight: '[calc(100svh - 80px)]',
      // `lg` would also match a portrait tablet, and Panda emits it after the
      // orientation conditions, so the tall-hero rule states landscape itself.
      _landscapeLg: { minHeight: '[calc(100svh - 120px)]' },
      _portraitTablet: { minHeight: '[auto]' },
      _portraitLarge: { minHeight: '[65svh]' },
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    inner: {
      position: 'relative',
      _portraitTablet: { justifyContent: 'flex-start', gap: 'xl' },
      _portraitLarge: { justifyContent: 'flex-start', gap: 'xl' },
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
      _portraitPhone: {
        position: 'relative',
        inset: 'auto',
        aspectRatio: '1 / 1',
        marginBottom: 'xl',
      },
    },
    frame: {
      position: 'absolute',
      inset: '0',
      overflow: 'hidden',
      background: 'gray.900',
      filter: '[token(assets.color)]',
    },
    image: {
      objectFit: 'cover',
      objectPosition: 'right',
      _portraitPhone: { display: 'none' },
    },
    thumb: {
      objectFit: 'cover',
      display: 'none',
      _portraitPhone: { display: 'block' },
    },

    ledger: {
      margin: '0',
      width: 'fit',
      maxWidth: 'narrowColumn',
      animationStyle: 'enter',
      animationDelay: 'stagger',
      _portraitPhone: { width: 'full' },
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '[64px minmax(0, 1fr)]',
      columnGap: 'md',
      alignItems: 'baseline',
      paddingBlock: 'sm',
      paddingRight: 'md',
      borderBottomStyle: 'solid',
      borderBottomWidth: 'hairlineThin',
      borderBottomColor: '[color-mix(in srgb, currentColor 40%, transparent)]',
      _last: { borderBottomWidth: '0' },
      _portraitPhone: { paddingRight: '0' },
    },
    rowLabel: { margin: '0' },
    rowValue: { margin: '0', overflowWrap: 'anywhere' },
  },
  variants: {
    ink: {
      black: {
        inner: {
          color: 'black',
          _portraitPhone: { color: 'white' },
        },
      },
      white: { inner: { color: 'white' } },
    },
  },
  defaultVariants: { ink: 'white' },
})
