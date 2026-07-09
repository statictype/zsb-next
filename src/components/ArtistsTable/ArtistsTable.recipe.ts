import { sva } from 'styled-system/css'

export const artistsTable = sva({
  slots: [
    'root',
    'colHeader',
    'headerLabel',
    'body',
    'column',
    'entry',
    'num',
    'name',
    'footer',
    'metaItem',
    'barcode',
  ],
  base: {
    root: { width: 'full' },

    colHeader: {
      paddingBlock: 'sm',
      paddingInline: 'md',
      background: 'highlight',
      fontSize: 'xs',
      textTransform: 'uppercase',
      fontWeight: 'semibold',
      letterSpacing: 'label',
      color: 'black',
      '& span:last-child': { lineHeight: 'heading' },
    },
    headerLabel: { fontFamily: 'body', fontSize: 'xs' },

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
      paddingBlock: 'sm',
      paddingInline: 'md',
      borderBottom: 'hairline',
      '&:last-child': { borderBottomWidth: '0' },
    },
    num: {
      fontSize: 'xs',
      lineHeight: 'loose',
      color: 'muted',
      fontVariantNumeric: 'tabular-nums',
      minWidth: '[28px]',
      md: { minWidth: '[32px]' },
    },
    name: {
      fontFamily: 'body',
      fontSize: 'xs',
      lineHeight: 'loose',
      color: 'body',
      fontWeight: 'medium',
      textTransform: 'uppercase',
      letterSpacing: 'subtle',
    },

    footer: {
      padding: 'sm',
      background: 'highlight',
      color: 'black',
      md: { paddingInline: 'md' },
    },
    metaItem: {
      fontSize: 'xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      color: 'black',
      fontWeight: 'semibold',
      '& span': { color: 'black', marginLeft: 'sm', fontWeight: 'regular' },
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
