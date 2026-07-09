import { sva } from 'styled-system/css'

/** Editions rail layout/reveal only; EditionRailCard owns plate composition. */
export const editionsNav = sva({
  slots: ['band', 'card'],
  base: {
    band: { background: 'surface', color: 'heading', paddingBlock: 'xl', overflow: 'clip' },
    card: {
      width: 'fit',
      border: 'none',
      // Breathing room between plates, on top of the carousel's own gap.
      marginInlineEnd: 'lg',
    },
  },
})
