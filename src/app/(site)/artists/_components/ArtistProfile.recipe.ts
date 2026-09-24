import { sva } from 'styled-system/css'

export const artistProfile = sva({
  slots: ['root', 'header', 'name', 'switch', 'about', 'portrait', 'bio', 'bioBody', 'more'],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2xl',
      layerStyle: 'pageHero',
    },
    header: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 'md',
    },
    name: {
      textStyle: 'display',
      color: 'heading',
      animationStyle: 'enter',
      animationDelay: 'stagger',
    },
    switch: { display: 'flex', gap: 'sm' },
    about: {
      display: 'grid',
      gap: 'lg',
      alignItems: 'start',
      borderTop: 'hairline',
      paddingTop: 'md',
    },
    portrait: {
      position: 'relative',
      overflow: 'hidden',
      width: '[clamp(96px, 70.76px + 6.7314vw, 200px)]',
      aspectRatio: '4 / 5',
      '& img': { objectFit: 'cover' },
    },
    bio: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'md',
      maxWidth: 'measure',
    },
    bioBody: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      textStyle: 'body',
      color: 'body',
    },
    more: { display: { md: 'none' } },
  },
  variants: {
    withPortrait: {
      true: {
        about: { gridTemplateColumns: { sm: '[auto minmax(0, 1fr)]' } },
      },
      false: {},
    },
    bioOpen: {
      true: {},
      false: {
        bioBody: { '& > :not(:first-child)': { display: { base: 'none', md: 'revert' } } },
      },
    },
  },
})
