import { sva } from 'styled-system/css'

export const editionsNav = sva({
  slots: ['band', 'inner', 'grid', 'cell', 'head', 'year', 'prefix', 'tag', 'theme'],
  base: {
    band: { background: 'surface', paddingBlock: 'xl' },
    inner: { layerStyle: 'sectionInner' },
    grid: {
      display: 'grid',
      gridTemplateColumns: {
        base: 'minmax(0, 1fr)',
        md: 'repeat(2, minmax(0, 1fr))',
        xl: 'repeat(3, minmax(0, 1fr))',
      },
      borderBlockStart: 'hairline',
      borderInlineStart: 'hairline',
      marginBlockStart: 'lg',
    },
    cell: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'sm',
      minWidth: '0',
      padding: '[calc(token(spacing.lg) * 0.75)]',
      background: 'surface',
      position: 'relative',
      borderBlockEnd: 'hairline',
      borderInlineEnd: 'hairline',
    },
    head: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      columnGap: 'md',
      rowGap: 'sm',
    },
    year: { margin: '0', textStyle: 'heading', color: 'heading' },
    prefix: { color: 'muted' },
    tag: { marginInlineStart: 'auto' },
    theme: { flexWrap: 'wrap', overflowWrap: 'anywhere' },
  },
  variants: {
    status: {
      live: {
        cell: { pressable: 'fill' },
        theme: { '@media (hover: none)': { '& > span': { color: 'action' } } },
      },
      current: { cell: { cursor: 'default' } },
      announced: {
        cell: { cursor: 'default' },
        year: { color: 'body' },
      },
    },
  },
  defaultVariants: { status: 'live' },
})
