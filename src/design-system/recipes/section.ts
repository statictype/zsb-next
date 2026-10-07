import { defineRecipe } from '@/design-system/define-recipe'

export const section = defineRecipe({
  jsx: ['Section'],
  className: 'section',
  description: 'Section shell — vertical rhythm',
  base: { background: 'surface', color: 'body' },
  variants: {
    rhythm: {
      normal: { paddingBlock: '3xl' },
      lg: { paddingBlock: '4xl' },
      none: { paddingBlock: '0' },
    },
  },
  defaultVariants: { rhythm: 'normal' },
})
