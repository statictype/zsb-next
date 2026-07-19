import { sva } from 'styled-system/css'

export const artistsTable = sva({
  slots: ['root', 'colHeader', 'body', 'column', 'entry', 'num', 'footer', 'metaItem', 'barcode'],
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
    barcode: {
      justifySelf: 'flex-end',
      height: '[24px]',
      width: '[80px]',
      // The ticket-stub barcode — decorative ink stripes over the chartreuse.
      background:
        '[repeating-linear-gradient(90deg, rgb(0 0 0 / 0.5) 0px, rgb(0 0 0 / 0.5) 2px, transparent 2px, transparent 4px, rgb(0 0 0 / 0.5) 4px, rgb(0 0 0 / 0.5) 5px, transparent 5px, transparent 8px)]',
    },
  },
})
