import { sva } from 'styled-system/css'

export const artistsTable = sva({
  slots: ['root', 'colHeader', 'body', 'column', 'entry', 'num', 'footer', 'metaItem'],
  base: {
    root: { width: 'full' },

    colHeader: {
      paddingBlock: 'sm',
      paddingInline: 'md',
      background: 'highlight',
      color: 'black',
    },

    body: {
      width: 'full',
      border: 'hairline',
    },
    column: {
      borderBottom: 'hairline',
      md: {
        borderBottomWidth: '0',
        borderRight: 'hairline',
        paddingBlock: 'sm',
        paddingInline: '0',
        '&:last-child': { borderRightWidth: '0' },
      },
    },
    entry: {
      paddingBlock: 'md',
      paddingInline: 'md',
      borderBottom: 'hairline',
      '&:last-child': { borderBottomWidth: '0' },
    },
    num: {
      fontVariantNumeric: 'tabular-nums',
      minWidth: '[28px]',
      md: { minWidth: '[32px]' },
    },
    footer: {
      padding: 'sm',
      background: 'highlight',
      md: { paddingInline: 'md' },
    },
    metaItem: {
      color: 'black',
      '& span': { color: 'black', marginLeft: 'sm' },
    },
  },
})
