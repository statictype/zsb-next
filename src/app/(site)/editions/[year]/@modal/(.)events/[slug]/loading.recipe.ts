import { sva } from 'styled-system/css'

export const eventModalLoading = sva({
  slots: ['bone', 'layout', 'poster', 'column', 'name', 'meta', 'line', 'actions', 'action'],
  base: {
    bone: { layerStyle: 'skeleton' },
    layout: {
      display: 'grid',
      lg: { gridTemplateColumns: 'minmax(0, 38%) minmax(0, 1fr)', minHeight: '0' },
    },
    poster: {
      aspectRatio: '3 / 4',
      maxHeight: '52dvh',
      borderBlockEnd: 'hairline',
      lg: {
        borderBlockEnd: 'none',
        aspectRatio: 'auto',
        maxHeight: 'none',
        borderInlineEnd: 'hairline',
      },
    },
    column: {
      display: 'grid',
      alignContent: 'start',
      gap: 'md',
      padding: 'lg',
      lg: { alignContent: 'center' },
      xl: { padding: 'xl' },
    },
    name: { width: '80%', height: '36px' },
    meta: { width: '220px', height: '20px' },
    line: {
      height: '14px',
      '&:nth-of-type(1)': { width: '100%' },
      '&:nth-of-type(2)': { width: '88%' },
      '&:nth-of-type(3)': { width: '64%' },
    },
    actions: {
      borderTop: 'hairline',
      paddingInline: 'lg',
      paddingBlock: 'md',
      xl: { paddingInline: 'xl' },
    },
    action: { width: '200px', height: '32px' },
  },
})
