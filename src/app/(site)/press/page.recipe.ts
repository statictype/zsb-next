import { sva } from 'styled-system/css'

/** Press-page rails only; LinkList owns the normalized register rows. */
export const pressPage = sva({
  slots: ['page'],
  base: {
    page: { background: 'surface' },
  },
})
