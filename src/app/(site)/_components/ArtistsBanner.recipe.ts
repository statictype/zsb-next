import { sva } from 'styled-system/css'

export const artistsBanner = sva({
  slots: ['root', 'inner', 'body', 'subtext'],
  base: {
    root: {
      width: 'full',
      scrollMarginTop: '[token(sizes.nav)]',
    },
    inner: {
      layerStyle: 'sectionInner',
      display: 'grid',
      gap: 'lg',
      lg: {
        gridTemplateColumns: '[1.4fr 1fr]',
        columnGap: 'xl',
        alignItems: 'end',
      },
    },
    body: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'lg',
    },
    subtext: {
      maxWidth: 'measure',
    },
  },
})
