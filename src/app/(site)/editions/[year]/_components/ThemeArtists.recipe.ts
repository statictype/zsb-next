import { sva } from 'styled-system/css'

export const themeArtists = sva({
  slots: ['section', 'inner', 'themeHeader', 'body', 'artistsTable'],
  base: {
    section: {
      position: 'relative',
      overflow: 'hidden',
    },
    inner: {
      position: 'relative',
      zIndex: '1',
      paddingInline: 'gutter',
      maxWidth: 'narrowColumn',
      lg: {
        maxWidth: 'maxWidth',
      },
      '4xl': { paddingLeft: '2xl' },
    },

    themeHeader: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      paddingInline: 'gutter',
      marginBottom: '3xl',
    },
    body: {
      marginBottom: '2xl',
      lg: { alignSelf: 'start' },
      '& p': {
        textWrap: '[pretty]',
      },
      '& p:last-child': { marginBottom: '0' },
    },
  },
})
