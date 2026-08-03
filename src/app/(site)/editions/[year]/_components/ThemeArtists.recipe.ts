import { sva } from 'styled-system/css'

export const themeArtists = sva({
  slots: ['section', 'inner', 'body', 'artistsTable', 'carousel'],
  base: {
    section: {
      position: 'relative',
      overflow: 'hidden',
    },
    inner: {
      position: 'relative',
      zIndex: '1',
      paddingInline: 'gutter',
      '4xl': { paddingLeft: '2xl' },
    },

    body: {
      lg: { alignSelf: 'start' },
      '& p': {
        textWrap: '[pretty]',
      },
    },

    carousel: { marginTop: '3xl' },
  },
})
