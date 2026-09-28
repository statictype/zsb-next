import { sva } from 'styled-system/css'

export const artistRoster = sva({
  slots: ['head', 'wall', 'entry', 'link'],
  base: {
    head: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      columnGap: 'lg',
      rowGap: 'sm',
      marginBottom: 'xl',
      color: 'muted',
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
    link: {
      color: '[inherit]',
      textDecorationLine: 'underline',
      textDecorationColor: 'highlight',
      textDecorationThickness: '[1px]',
      textUnderlineOffset: '[0.2em]',
      transition: 'colors',
      _hover: { color: 'highlight' },
      _focusVisible: { outline: 'focus', outlineOffset: '[2px]' },
    },
  },
  variants: {
    accent: {
      highlight: {},
      action: {
        entry: { _after: { background: 'action' } },
        link: { textDecorationLine: 'none', _hover: { color: 'action' } },
      },
    },
  },
  defaultVariants: { accent: 'highlight' },
})
