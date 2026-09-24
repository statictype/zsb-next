import { sva } from 'styled-system/css'

export const artistProfile = sva({
  slots: ['root', 'header', 'name', 'switch', 'intro', 'portrait', 'bio'],
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
    intro: {
      display: 'grid',
      gap: 'xl',
      alignItems: 'start',
    },
    portrait: {
      position: 'relative',
      overflow: 'hidden',
      width: 'full',
      maxWidth: { base: 'narrowColumn', md: '[none]' },
      aspectRatio: '4 / 5',
      maxHeight: { md: '[80svh]' },
    },
    bio: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      maxWidth: 'measure',
      textStyle: 'body',
      color: 'body',
    },
  },
  variants: {
    withPortrait: {
      true: {
        intro: { gridTemplateColumns: { md: '[minmax(0, 2fr) minmax(0, 3fr)]' } },
      },
      false: {},
    },
  },
})
