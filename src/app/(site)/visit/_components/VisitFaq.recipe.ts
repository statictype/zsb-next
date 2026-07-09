import { sva } from 'styled-system/css'

export const visitFaq = sva({
  slots: ['list', 'answer'],
  base: {
    list: { maxWidth: 'measure' },
    answer: {
      // Editorial answers may contain intentional line breaks.
      whiteSpace: 'pre-line',
    },
  },
})
