import { sva } from 'styled-system/css'

export const pillarGrid = sva({
  slots: ['grid', 'item', 'title', 'body'],
  base: {
    grid: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
    item: {
      paddingBlock: 'xl',
      borderBottom: 'hairline',
    },
    body: {
      maxWidth: 'measure',
    },
  },
  variants: {
    rhythm: {
      bookend: {
        grid: {
          lg: { gridAutoFlow: 'column', gridAutoColumns: 'fr' },
        },
        item: {
          '&:last-child': { borderBottom: 'none' },
          lg: {
            paddingBlock: 'xl',
            paddingInline: 'lg',
            borderBottom: 'none',
            marginBlock: '4xl',
            '&:first-child': { paddingLeft: '0' },
            '&:last-child': { paddingRight: '0' },
          },
        },
      },
      pair: {
        grid: {
          md: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
        },
        item: {
          md: {
            paddingInline: 'xl',
            paddingBlock: '4xl',
            '&:nth-child(odd)': {
              paddingLeft: '0',
              borderRight: 'hairline',
            },
            '&:nth-child(even)': { paddingRight: '0' },
          },
        },
      },
    },
    titleTone: {
      heading: { title: { color: 'heading' } },
      highlight: { title: { color: 'heading' } },
    },
  },
  defaultVariants: {
    rhythm: 'bookend',
    titleTone: 'heading',
  },
})
