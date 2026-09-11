import { sva } from 'styled-system/css'

export const eventStepper = sva({
  slots: ['root', 'step', 'stepLabel', 'stepName', 'count', 'end'],
  base: {
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
      fontWeight: 'bold',
      lineHeight: '1.4',
      letterSpacing: '[-0.018em]',
    },
    count: {
      display: 'none',
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap',
      sm: { display: 'block' },
    },
    end: { minWidth: '0' },
  },
  variants: {
    chrome: {
      modal: {
        root: {
          display: 'flex',
          alignItems: 'center',
          gap: 'xs',
        },
        count: { paddingInline: 'xs' },
      },
      rail: {
        root: {
          display: 'grid',
          gridTemplateColumns: '[1fr auto 1fr]',
          alignItems: 'center',
          gap: 'md',
          marginTop: 'lg',
        },
      },
    },
  },
})
