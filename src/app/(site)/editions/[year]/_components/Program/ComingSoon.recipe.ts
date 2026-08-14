import { sva } from 'styled-system/css'

export const comingSoon = sva({
  slots: ['headline', 'body'],
  base: {
    headline: {
      maxWidth: '[18ch]',
    },
    body: {
      maxWidth: 'measure',
    },
  },
})
