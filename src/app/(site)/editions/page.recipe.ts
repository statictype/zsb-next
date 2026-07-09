import { sva } from 'styled-system/css'

export const editionsPage = sva({
  slots: ['slot', 'card'],
  base: {
    slot: { lg: { '&[data-feature]': { gridColumn: '1 / -1' } } },
    card: { height: 'full' },
  },
})
