import { defineRecipe } from '@pandacss/dev'
import { groundLightVars } from './ground'

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
      dark: { background: 'surface', color: 'heading' },
      light: {
        background: 'surface',
        color: 'heading',
        ...groundLightVars,
      },
    },
    /** Vertical rhythm — the standard cadence vs the looser breathing-room one
     *  (manifesto, About editorial spreads). */
    rhythm: {
      normal: { paddingBlock: 'sectionY' },
      lg: { paddingBlock: 'sectionYLg' },
    },
  },
  defaultVariants: { rhythm: 'normal' },
})
