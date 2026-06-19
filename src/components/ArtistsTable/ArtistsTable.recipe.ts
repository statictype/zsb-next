import { sva } from 'styled-system/css'

/**
 * ArtistsTable — co-located slot recipe.
 *
 * A numbered two-column roster on a chartreuse header/footer, framed by the
 * shared dark hairline (`--border-dark` → borderDark token). Single column on
 * mobile (stacked entries), a real 2-col grid from `md` where the inter-column
 * the hairline flips from a bottom border to a right border.
 */
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
    'meta',
    'metaItem',
    'barcode',
  ],
  base: {
    root: { width: '100%' },

    colHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBlock: 'sm',
      paddingInline: 'md',
      background: 'highlight',
      fontSize: '2xs',
      textTransform: 'uppercase',
      fontWeight: 'semibold',
      letterSpacing: 'label',
      color: 'headingLight',
      '& span:last-child': { lineHeight: 'heading' },
    },
    headerLabel: { fontFamily: 'body', fontSize: '2xs' },

    body: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'borderDark',
      md: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' },
    },
    column: {
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'borderDark',
      md: {
        borderBottomWidth: '0',
        borderRightWidth: '1px',
        borderRightStyle: 'solid',
        borderRightColor: 'borderDark',
        paddingBlock: 'sm',
        paddingInline: '0',
        '&:last-child': { borderRightWidth: '0' },
      },
    },
    entry: {
      display: 'flex',
      alignItems: 'center',
      gap: 'sm',
      paddingBlock: 'sm',
      paddingInline: 'md',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'borderDark',
      '&:last-child': { borderBottomWidth: '0' },
    },
    num: {
      fontSize: '2xs',
      lineHeight: 'loose',
      color: 'muted',
      fontVariantNumeric: 'tabular-nums',
      minWidth: '28px',
      md: { minWidth: '32px' },
    },
    name: {
      fontFamily: 'body',
      fontSize: '2xs',
      lineHeight: 'loose',
      color: 'body',
      fontWeight: 'medium',
      textTransform: 'uppercase',
      letterSpacing: 'subtle',
    },

    footer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 'sm',
      padding: 'sm',
      background: 'highlight',
      color: 'headingLight',
      md: { paddingInline: 'md' },
    },
    meta: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'md',
      justifyContent: 'flex-start',
    },
    metaItem: {
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      color: 'headingLight',
      fontWeight: 'semibold',
      '& span': { color: 'headingLight', marginLeft: '8px', fontWeight: 'regular' },
    },
    barcode: {
      justifySelf: 'flex-end',
      height: '24px',
      width: '80px',
      background:
        'repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.5) 0px, rgba(0, 0, 0, 0.5) 2px, transparent 2px, transparent 4px, rgba(0, 0, 0, 0.5) 4px, rgba(0, 0, 0, 0.5) 5px, transparent 5px, transparent 8px)',
    },
  },
})
