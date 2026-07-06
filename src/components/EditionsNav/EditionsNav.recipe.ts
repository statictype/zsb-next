import { sva } from 'styled-system/css'

/** Editions rail layout/reveal only; EditionRailCard owns plate composition. */
export const editionsNav = sva({
  slots: ['band', 'card'],
  base: {
    band: { background: 'surface', color: 'heading', paddingBlock: 'xl', overflow: 'clip' },
    card: {
      width: 'fit-content',
      border: '0',
      // Breathing room between plates, on top of the carousel's own gap.
      marginInlineEnd: 'lg',
      opacity: '0',
      transform: 'translateY(16px)',
      transition:
        'opacity {durations.reveal} {easings.expo} calc(var(--i, 0) * 60ms), transform {durations.reveal} {easings.expo} calc(var(--i, 0) * 60ms)',
      '[data-revealed=true] &': { opacity: '1', transform: 'translateY(0)' },
      _motionReduce: { opacity: '1', transform: 'none', transition: 'none' },
    },
  },
})
