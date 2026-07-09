import { sva } from 'styled-system/css'

export const comingSoon = sva({
  slots: ['header', 'notice', 'headline', 'body'],
  base: {
    header: { marginBottom: 'xl' },

    notice: {
      paddingTop: 'xl',
    },
    headline: {
      color: 'white',
      maxWidth: '[18ch]',
    },
    body: {
      marginTop: 'md',
      color: 'body',
      maxWidth: 'measure',
    },
  },
})
