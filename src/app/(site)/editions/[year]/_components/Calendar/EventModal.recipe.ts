import { sva } from 'styled-system/css'

export const eventModal = sva({
  slots: ['shell', 'chrome', 'steps', 'count'],
  base: {
    shell: {
      display: 'grid',

      gridTemplateRows: '[auto 1fr auto]',
      height: 'full',
      overflowY: 'auto',
      overscrollBehavior: 'contain',
      background: 'surface',
      color: 'body',
      // The `fullscreen` dialog has a transparent backdrop, so the shell has to
      // paint its own ground and arrive on its own.
      animationStyle: 'enter.fade',
      lg: {
        gridTemplateRows: '[auto minmax(0, 1fr) auto]',
        overflow: 'hidden',
      },
    },

    chrome: {
      position: 'sticky',
      top: '0',
      zIndex: '1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'sm',
      background: 'surface',
      borderBottom: 'hairline',
      paddingInline: 'sm',
      paddingBlock: 'xs',
      md: { paddingInline: 'md' },
    },
    steps: {
      display: 'flex',
      alignItems: 'center',
      gap: 'xs',
    },
    count: {
      display: 'none',
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap',
      paddingInline: 'xs',
      sm: { display: 'block' },
    },
  },
})
