import { sva } from 'styled-system/css'

export const eventModal = sva({
  slots: ['shell', 'chrome'],
  base: {
    shell: {
      display: 'grid',

      gridTemplateRows: 'auto 1fr auto',
      height: '100%',
      overflowY: 'auto',
      overscrollBehavior: 'contain',
      background: 'surface',
      color: 'body',
      animationStyle: 'arriveFade',
      lg: {
        gridTemplateRows: 'auto minmax(0, 1fr) auto',
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
  },
})
