import { sva } from 'styled-system/css'

/** Editions rail layout/reveal only; EditionCard owns card composition. */
export const editionsNav = sva({
  slots: ['band', 'card'],
  base: {
    band: { background: 'surface', color: 'heading', paddingBlock: 'xl', overflow: 'clip' },
    card: {
      width: '78vw',
      opacity: '0',
      transform: 'translateY(16px)',
      transition:
        'opacity {durations.reveal} {easings.expo} calc(var(--i, 0) * 60ms), transform {durations.reveal} {easings.expo} calc(var(--i, 0) * 60ms), border-color {durations.medium} {easings.expo}',
      md: { width: 'clamp(300px, 34vw, 448px)' },
      '[data-revealed=true] &': { opacity: '1', transform: 'translateY(0)' },
      _motionReduce: { opacity: '1', transform: 'none', transition: 'none' },
    },
  },
})
