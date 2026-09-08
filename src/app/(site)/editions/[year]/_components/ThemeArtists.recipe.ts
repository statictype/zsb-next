import { sva } from 'styled-system/css'

export const themeArtists = sva({
  slots: ['section', 'inner', 'note'],
  base: {
    section: {
      position: 'relative',
      overflowX: 'clip',
      '& > * + *': { marginTop: '3xl' },
    },
    inner: { layerStyle: 'sectionInner' },
    note: {
      marginTop: 'lg',
      maxWidth: 'measure',
    },
  },
})
