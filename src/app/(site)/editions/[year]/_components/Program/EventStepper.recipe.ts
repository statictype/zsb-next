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
      _active: { '& [data-step-name]': { color: 'highlight', transitionDuration: '0ms' } },
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
      lineClamp: '2',
      overflowWrap: 'anywhere',
      transition: 'interactive',
      fontWeight: 'bold',
      lineHeight: '1.4',
      letterSpacing: 'tight',
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
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          alignItems: 'start',
          sm: { gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)', alignItems: 'center' },
          gap: 'md',
          marginTop: 'lg',
        },
      },
    },
  },
})
