import { sva } from 'styled-system/css'

export const visitFaq = sva({
  slots: ['section', 'list', 'answer'],
  base: {
    section: { borderTop: 'hairline' },
    list: { maxWidth: 'measure' },
    answer: {
      whiteSpace: 'pre-line',
    },
  },
})
