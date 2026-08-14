import { sva } from 'styled-system/css'

export const visitFaq = sva({
  slots: ['section', 'list', 'answer'],
  base: {
    section: { borderTop: 'hairline' },
    list: { maxWidth: 'measure' },
    answer: {
      // Editorial answers may contain intentional line breaks.
      whiteSpace: 'pre-line',
    },
  },
})
