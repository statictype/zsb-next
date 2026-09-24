import { sva } from 'styled-system/css'

export const artistProfile = sva({
  slots: ['root', 'header', 'name', 'switch', 'portrait', 'bio', 'heading'],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2xl',
      paddingBlock: 'sectionY',
    },
    header: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 'md',
    },
    name: { textStyle: 'display', color: 'heading' },
    switch: { display: 'flex', gap: 'sm' },
    portrait: {
      position: 'relative',
      overflow: 'hidden',
      width: 'full',
      maxWidth: 'narrowColumn',
      aspectRatio: '4 / 5',
    },
    bio: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      maxWidth: 'measure',
      textStyle: 'body',
      color: 'body',
    },
    heading: { textStyle: 'title', color: 'heading' },
  },
})
