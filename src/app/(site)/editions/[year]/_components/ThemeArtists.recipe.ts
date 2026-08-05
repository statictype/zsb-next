import { sva } from 'styled-system/css'

export const themeArtists = sva({
  slots: ['section', 'inner', 'body', 'artistsTable', 'carousel'],
  base: {
    section: {
      position: 'relative',
      // `hidden` would make the section a scroll container and kill the sticky
      // theme statement inside it; `clip` clips without creating one.
      overflowX: 'clip',
    },
    inner: {
      position: 'relative',
      zIndex: '1',
      paddingInline: 'gutter',
      '4xl': { paddingLeft: '2xl' },
    },

    body: {
      '& p': {
        textWrap: '[pretty]',
        lg: {
          position: 'sticky',
          top: '[calc(token(sizes.nav) + token(spacing.lg))]',
        },
      },
    },

    carousel: { marginTop: '3xl' },
  },
})
