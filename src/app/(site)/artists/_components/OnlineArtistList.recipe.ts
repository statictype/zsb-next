import { sva } from 'styled-system/css'

export const onlineArtistList = sva({
  slots: ['root', 'heading', 'list', 'item'],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'lg',
      marginBlockStart: '3xl',
      paddingBlockStart: 'lg',
      borderBlockStart: 'hairline',
    },
    heading: { textStyle: 'heading', color: 'heading' },
    list: {
      listStyleType: 'none',
      columnCount: { base: 2, md: 3, lg: 4 },
      columnGap: 'gridGap',
    },
    item: {
      breakInside: 'avoid',
      paddingBlock: 'xs',
      textStyle: 'body',
      color: 'body',
    },
  },
})
