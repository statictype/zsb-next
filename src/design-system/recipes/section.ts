import { defineRecipe } from '@pandacss/dev'
import { groundDarkVars, groundLightVars } from '@/design-system/recipes/ground'

export const section = defineRecipe({
  jsx: ['Section'],
  className: 'section',
  description: 'Section shell — vertical rhythm + optional ground (bg/color)',
  base: {},
  variants: {
    /** The section ground. Omit for a rhythm-only section that inherits the
     *  page's own background (e.g. the press strips). Keyed off the semantic
     *  role tokens, never raw black/white. */
    ground: {
      dark: {
        background: 'surface',
        color: 'body',
        ...groundDarkVars,
      },
      light: {
        background: 'surface',
        color: 'body',
        ...groundLightVars,
      },
    },
    rhythm: {
      normal: { paddingBlock: '3xl' },
      lg: { paddingBlock: '4xl' },
      none: { paddingBlock: '0' },
    },
  },
  defaultVariants: { rhythm: 'normal' },
})
