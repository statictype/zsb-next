import { sva } from 'styled-system/css'

export const artistProfile = sva({
  slots: [
    'root',
    'header',
    'intro',
    'name',
    'switch',
    'about',
    'aboutHeading',
    'portrait',
    'bio',
    'bioBody',
    'more',
  ],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      paddingTop: '2xl',
      paddingBottom: 'sectionY',
    },
    header: {
      display: 'grid',
      gap: 'xl',
      alignItems: 'end',
      paddingBottom: 'xl',
      gridTemplateColumns: { lg: '[minmax(0, 7fr) minmax(0, 5fr)]' },
    },
    intro: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'lg',
    },
    name: {
      textStyle: 'display',
      color: 'heading',
      animationStyle: 'enter',
      animationDelay: 'stagger',
    },
    switch: { display: 'flex', gap: 'xs' },
    about: {
      display: 'grid',
      gap: 'lg',
      alignItems: 'start',
      borderTop: 'hairline',
      paddingTop: { base: 'xl', lg: '2xl' },
    },
    aboutHeading: { gridColumn: '[1 / -1]' },
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
    more: { textStyle: 'body', display: { md: 'none' } },
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
