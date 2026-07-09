import { sva } from 'styled-system/css'

export const comingSoon = sva({
  slots: ['header', 'notice', 'headline', 'body'],
  base: {
    header: { marginBottom: 'xl' },

    notice: {
      paddingTop: 'xl',
    },
    headline: {
      fontFamily: 'display',
      fontSize: 'lg',
      lineHeight: 'tight',
      color: 'white',
      maxWidth: '[18ch]',
    },
    body: {
      marginTop: 'md',
      fontFamily: 'body',
      fontSize: 'base',
      lineHeight: 'body',
      color: 'body',
      maxWidth: 'measure',
    },
  },
})
