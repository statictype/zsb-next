import { sva } from 'styled-system/css'

export const credits = sva({
  slots: [
    'detail',
    'logo',
    'badge',
    'partnersBlock',
    'partnersLabel',
    'partnersList',
    'inline',
    'inlineNames',
  ],
  base: {
    detail: {
      whiteSpace: 'pre-line',
    },
    logo: {
      height: '[44px]',
      width: 'auto',
      objectFit: 'contain',
      filter: '[grayscale(100%)]',
      opacity: 0.8,
      transition: 'develop',
      md: { height: '[60px]' },
      _hover: { filter: '[grayscale(0%)]', opacity: 1 },
    },
    badge: { xl: { gridColumn: 4 } },

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
