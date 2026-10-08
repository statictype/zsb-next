import { defineRecipe } from '@/design-system/define-recipe'

export const card = defineRecipe({
  jsx: ['Card'],
  className: 'card',
  description: 'Unified hairline card — editions / events / editions-nav / gallery',
  base: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    isolation: 'isolate',
    color: 'body',
    textDecoration: 'none',
    background: 'transparent',
    border: 'hairline',
  },
  variants: {
    interactive: {
      true: {
        pressable: 'fill',
        cursor: 'pointer',
        transition: 'interactive',
        _hover: { borderColor: 'action' },
      },
    },
  },
  defaultVariants: { interactive: false },
})
