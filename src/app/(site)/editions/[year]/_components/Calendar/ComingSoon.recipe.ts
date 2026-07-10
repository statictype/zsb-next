import { sva } from 'styled-system/css'

export const comingSoon = sva({
  slots: ['header', 'notice', 'headline', 'body'],
  base: {
    header: { marginBottom: 'xl' },

    notice: {
      paddingTop: 'xl',
    },
    headline: {
      maxWidth: '[18ch]',
    },
    body: {
      marginTop: 'md',
      maxWidth: 'measure',
    },
  },
})
