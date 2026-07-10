import { defineRecipe } from '@pandacss/dev'
import { groundDarkVars, groundLightVars } from './ground'

/**
 * Card — the one unified card (ZSB-71).
 * Every card on the site is the same object: a hairline-bordered surface — ZSB's
 * signature is that hairline box. `ground` carries the one hairline language onto
 * black (`onDark`) or white (`onLight`); `interactive` adds the single normalized
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
  },
  variants: {
    /** The ground the hairline sits on — the same box language on either. */
    ground: {
      onDark: {
        background: 'transparent',
        border: 'hairline',
        ...groundDarkVars,
      },
      onLight: {
        background: 'surface',
        border: 'hairline',
        boxShadow: 'card',
        ...groundLightVars,
      },
    },
    /** The one hover every card shares: the hairline warms to the accent.
     *  GPU-safe (border-color only — no lift). */
    interactive: {
      true: {
        cursor: 'pointer',
        transition: 'border-color {durations.fast} {easings.quint}',
        _hover: { borderColor: 'action' },
      },
    },
  },
  defaultVariants: { ground: 'onDark', interactive: false },
})
