import { sva } from 'styled-system/css'

export const credits = sva({
  slots: [
    'detail',
    'logo',
    'badge',
    'partners',
    'partnersBlock',
    'partnersLabel',
    'partnersList',
    'secondary',
    'inline',
    'inlineNames',
  ],
  base: {
    detail: {
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

    // Partners + secondary share one 4-column track so their grid lines align.
    partners: {
      paddingTop: 'lg',
    },
    secondary: {
      paddingTop: 'lg',
    },

    partnersBlock: {
      md: { gridColumn: 'span 2' },
    },
    partnersLabel: { color: 'action' },
    partnersList: {
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
    inlineNames: {
      // Authored multi-line strings render their own '\n' breaks.
      whiteSpace: 'pre-line',
    },
  },
})
