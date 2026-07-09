import { sva } from 'styled-system/css'

export const pillarGrid = sva({
  slots: ['item', 'number', 'title', 'body'],
  base: {
    item: {
      paddingBlock: 'xl',
      borderBottom: 'hairline',
    },
    number: {
      fontFamily: 'display',
      fontSize: 'md',
      color: 'muted',
      letterSpacing: 'tight',
    },
    title: {
      textStyle: 'labelDisplay',
    },
    body: {
      textStyle: 'prose',
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
            padding: 'xl',
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
      highlight: { title: { color: 'highlight' } },
    },
    titleScale: {
      standard: { title: { fontSize: 'md' } },
      responsive: { title: { fontSize: { base: 'md', xl: 'lg' } } },
    },
  },
  defaultVariants: {
    rhythm: 'bookend',
    titleTone: 'heading',
    titleScale: 'standard',
  },
})
