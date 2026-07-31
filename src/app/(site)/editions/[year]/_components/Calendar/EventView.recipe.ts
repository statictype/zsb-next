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

    rail: {
      display: 'grid',
      gridTemplateColumns: '[1fr auto 1fr]',
      alignItems: 'center',
      gap: 'md',
      marginTop: 'lg',
    },
    step: {
      display: 'grid',
      gap: 'xs',
      minWidth: '0',
      textDecoration: 'none',
      _hover: { '& [data-step-name]': { color: 'action' } },
      _focusVisible: { '& [data-step-name]': { color: 'action' } },
      '&[data-dir=next]': { justifySelf: 'end', textAlign: 'right' },
    },
    stepLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: 'xs',
      '[data-dir=next] &': { justifyContent: 'flex-end' },
    },
    stepName: {
      color: 'heading',
      lineClamp: '1',
      transition: 'interactive',
    },
    count: {
      display: 'none',
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap',
      sm: { display: 'block' },
    },
    end: { minWidth: '0' },
  },
})
