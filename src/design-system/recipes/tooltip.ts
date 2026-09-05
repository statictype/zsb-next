import { defineSlotRecipe } from '@pandacss/dev'

export const tooltip = defineSlotRecipe({
  className: 'tooltip',
  jsx: ['Tooltip'],
  description: 'Hover/focus gloss on an inline term — CSS-only, no positioning library',
  slots: ['root', 'bubble'],
  base: {
    root: {
      position: 'relative',
      display: 'inline',
      cursor: 'help',
      textDecoration: 'underline',
      textDecorationStyle: 'dotted',
      textDecorationColor: 'muted',
      textUnderlineOffset: '[3px]',
    },
    bubble: {
      position: 'absolute',
      insetBlockEnd: '[calc(100% + token(spacing.xs))]',
      insetInlineStart: '0',
      zIndex: '10',
      width: 'max-content',
      maxWidth: '[min(240px, 60vw)]',
      paddingBlock: 'xs',
      paddingInline: 'sm',
      background: 'gray.900',
      color: 'heading',
      textStyle: 'caption',
      textDecoration: 'none',
      pointerEvents: 'none',
      opacity: '0',
      transition: 'interactive',
      '[data-tooltip]:hover > &, [data-tooltip]:focus-visible > &': { opacity: '1' },
    },
  },
})
