import { sva } from 'styled-system/css'

const ringTravelling = { '&::before': { opacity: 1, animationStyle: 'gradientBorder' } } as const

export const editionsNav = sva({
  slots: ['band', 'inner', 'grid', 'cell', 'head', 'year', 'prefix', 'tag'],
  base: {
    band: { background: 'surface', paddingBlock: 'xl' },
    inner: { paddingInline: 'gutter' },
    grid: {
      display: 'grid',
      gridTemplateColumns: { base: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' },
      gap: '[token(borderWidths.hairline)]',
      padding: '[token(borderWidths.hairline)]',
      background: 'divider',
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
    },
    head: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      columnGap: 'md',
      rowGap: 'sm',
    },
    year: { margin: '0', textStyle: 'detailTitle', color: 'heading' },
    prefix: { color: 'muted', marginInlineEnd: '[0.22em]' },
    tag: { marginInlineStart: 'auto' },
  },
  variants: {
    status: {
      live: {
        cell: {
          _before: {
            content: '""',
            layerStyle: 'gradientBorder',
            inset: '[calc(token(borderWidths.hairline) * -1)]',
            padding: '[token(borderWidths.hairline)]',
          },
          _hover: ringTravelling,
          _focusVisible: ringTravelling,
        },
      },
      current: { cell: { cursor: 'default' } },
      announced: {
        cell: {
          cursor: 'default',
          opacity: '0.58',
        },
      },
    },
  },
  defaultVariants: { status: 'live' },
})
