import { sva } from 'styled-system/css'

export const bellerBanner = sva({
  slots: ['banner', 'link', 'dot', 'accent'],
  base: {
    banner: {
      background: 'black',
      color: 'white',
      borderBottom: 'hairline',
    },
    link: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      columnGap: 'sm',
      rowGap: 'xs',
      minHeight: '[40px]',
      paddingBlock: 'sm',
      paddingLeft: 'gutter',
      paddingRight: '[calc(token(spacing.gutter) + token(sizes.touch) + token(spacing.sm))]',
      textStyle: 'label',
      textTransform: 'uppercase',
      md: { justifyContent: 'center', paddingRight: 'gutter' },
      _hover: { '& [data-part="cta"]': { textDecoration: 'underline' } },
    },
    dot: {
      flexShrink: '0',
      width: '[5px]',
      height: '[5px]',
      borderRadius: 'circle',
      background: 'action',
    },
    accent: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'xs',
      color: 'action',
      textUnderlineOffset: '3px',
    },
  },
})
