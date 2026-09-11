import { sva } from 'styled-system/css'

export const venueLine = sva({
  slots: ['name', 'parent'],
  base: {
    name: {
      color: 'gray.300',
    },
    parent: {
      _before: { content: '"↳ "' },
    },
  },
})
