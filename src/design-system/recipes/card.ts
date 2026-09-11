import { defineRecipe } from '@pandacss/dev'
import { groundDarkVars } from '@/design-system/recipes/ground'

/**
 * Card — the one unified card (ZSB-71).
 * Every card on the site is the same object: a hairline-bordered surface — ZSB's
 * signature is that hairline box. `interactive` adds the single normalized
 * hover shared by all cards (the hairline warms to the accent + a small lift).
 * The shell owns chrome + that hover; title-colour shifts and image zoom stay
 * consumer concerns. Backs editions / events / editions-nav / gallery cards.
 */
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
    ...groundDarkVars,
  },
  variants: {
    /** The one hover every card shares: the hairline warms to the accent.
     *  GPU-safe (border-color only — no lift). */
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
