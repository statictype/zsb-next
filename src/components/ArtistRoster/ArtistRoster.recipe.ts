import { sva } from 'styled-system/css'

export const artistRoster = sva({
  slots: ['root', 'head', 'wall', 'entry'],
  base: {
    root: {
      borderTop: 'hairline',
      paddingTop: 'md',
    },

    head: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      columnGap: 'lg',
      rowGap: 'sm',
      marginBottom: 'xl',
    },
    wall: {
      textStyle: 'cardTitle',
      textWrap: '[wrap]',
      color: 'heading',
      fontSize: { base: 'sm', md: 'base', lg: 'md' },
      lineHeight: '[1.9]',
      listStyleType: 'none',
    },
    entry: {
      display: 'inline-block',
      whiteSpace: 'nowrap',
      _after: {
        content: '""',
        display: 'inline-block',
        width: '[4px]',
        height: '[4px]',
        marginInline: '[0.55em]',
        verticalAlign: '[0.3em]',
        background: 'highlight',
      },
      '&:last-child::after': { display: 'none' },
    },
  },
})
