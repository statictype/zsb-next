import { sva } from 'styled-system/css'

export const errorPage = sva({
  slots: ['page', 'content', 'icon', 'actions'],
  base: {
    page: {
      minHeight: 'svh',
      background: 'black',
      paddingBlock: 'xl',
      paddingInline: 'gutter',
    },
    content: { textAlign: 'center', maxWidth: 'narrowColumn' },
    icon: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '56px',
      height: '56px',
      border: 'hairline',
      color: 'action',
    },
    actions: {
      display: 'flex',
      gap: 'md',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
  },
})
