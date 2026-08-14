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
    /** Vertical rhythm — the standard cadence vs the looser breathing-room one
     *  (manifesto, About editorial spreads). */
    rhythm: {
      normal: { paddingBlock: 'sectionY' },
      lg: { paddingBlock: 'sectionYLg' },
      none: { paddingBlock: '0' },
      /** Only for a section whose ground matches the one above it: the shared
       *  ground makes the gap alone read as blank page, so the boundary is
       *  drawn as a rail-width hairline instead. */
      joined: {
        paddingTop: '0',
        paddingBottom: 'sectionY',
        _before: {
          content: '""',
          display: 'block',
          height: '[token(borderWidths.hairline)]',
          background: 'divider',
          width: '[calc(min(100%, token(sizes.maxWidth)) - token(spacing.gutter) * 2)]',
          marginInline: 'auto',
          marginBottom: 'sectionY',
        },
      },
    },
  },
  defaultVariants: { rhythm: 'normal' },
})
