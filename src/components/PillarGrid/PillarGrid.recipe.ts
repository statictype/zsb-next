import { sva } from 'styled-system/css'

export const pillarGrid = sva({
  slots: ['item', 'title', 'body'],
  base: {
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
        item: {
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
      },
      pair: {
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
