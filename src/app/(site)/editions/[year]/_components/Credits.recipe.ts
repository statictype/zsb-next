import { sva } from 'styled-system/css'

const labelBase = {
  fontSize: 'xs',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'muted',
} as const

export const credits = sva({
  slots: [
    'primary',
    'label',
    'name',
    'detail',
    'logo',
    'badge',
    'partners',
    'partnersBlock',
    'partnersLabel',
    'partnersList',
    'secondary',
    'inline',
    'inlineLabel',
    'inlineNames',
  ],
  base: {
    label: labelBase,

    primary: {
      md: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        columnGap: 'lg',
        rowGap: 'xl',
      },
      xl: { gridTemplateColumns: 'repeat(4, 1fr)' },
    },
    name: {
      fontFamily: 'display',
      fontSize: 'md',
      color: 'heading',
      textTransform: 'uppercase',
      lineHeight: 'tight',
    },
    detail: {
      fontFamily: 'body',
      fontWeight: 'regular',
      fontSize: 'sm',
      color: 'muted',
      lineHeight: 'body',
      // Authored multi-line strings render their own '\n' breaks.
      whiteSpace: 'pre-line',
    },
    logo: {
      height: '[44px]',
      width: 'auto',
      objectFit: 'contain',
      filter: '[grayscale(100%)]',
      opacity: 0.8,
      transitionProperty: '[all]',
      transitionDuration: 'medium',
      transitionTimingFunction: 'quint',
      md: { height: '[60px]' },
      _hover: { filter: '[grayscale(0%)]', opacity: 1 },
    },
    // ISDay badge fills the 4th column of the primary row from 1280 up.
    badge: { xl: { gridColumn: 4 } },

    // Partners + secondary share one 4-column track so their grid lines align,
    // each separated from the band above by a hairline.
    partners: {
      marginTop: 'lg',
      paddingTop: 'lg',
      borderTop: 'hairline',
      md: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        columnGap: 'lg',
        rowGap: 'lg',
      },
    },
    secondary: {
      marginTop: 'lg',
      paddingTop: 'lg',
      borderTop: 'hairline',
      md: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        columnGap: 'lg',
        rowGap: 'lg',
      },
    },

    partnersBlock: {
      md: { gridColumn: 'span 2' },
    },
    partnersLabel: { ...labelBase, color: 'action' },
    partnersList: {
      fontFamily: 'body',
      fontWeight: 'regular',
      fontSize: 'sm',
      color: 'body',
      lineHeight: 'tight',
      '& span': {
        display: 'inline-flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
      },
      // Middot separators between partner names.
      '& span:not(:last-child)::after': {
        content: '""',
        flex: 'none',
        width: '[3px]',
        height: '[3px]',
        marginInline: 'sm',
        borderRadius: 'circle',
        background: 'action',
      },
    },

    inline: {
      md: { gridColumn: 'span 2' },
      lg: { gridColumn: 'span 1' },
    },
    inlineLabel: labelBase,
    inlineNames: {
      fontFamily: 'body',
      fontSize: 'sm',
      color: 'muted',
      lineHeight: 'body',
      // Authored multi-line strings render their own '\n' breaks.
      whiteSpace: 'pre-line',
    },
  },
})
