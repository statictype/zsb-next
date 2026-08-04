import { sva } from 'styled-system/css'

export const editionsPage = sva({
  slots: ['index', 'entry'],
  base: {
    index: { listStyle: 'none', margin: '0', padding: '0', borderBottom: 'hairline' },
    entry: { paddingBlock: 'xl', borderTop: 'hairline' },
  },
})
