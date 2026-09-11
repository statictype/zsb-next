import { sva } from 'styled-system/css'

export const eventView = sva({
  slots: [
    'page',
    'crumb',
    'theme',
    'detail',
    'rail',
    'step',
    'stepLabel',
    'stepName',
    'count',
    'end',
  ],
  base: {
    page: {
      minHeight: 'svh',
      paddingTop: '[calc(token(sizes.nav) + token(spacing.md))]',
      paddingBottom: 'xl',
    },

    crumb: {
      display: 'flex',
      alignItems: 'center',
      gap: 'sm',
      minWidth: '0',
      paddingBottom: 'md',
    },
    theme: {
      display: 'none',
      lineClamp: '1',
      md: { display: 'block' },
    },

    detail: { border: 'hairline' },
  },
})
