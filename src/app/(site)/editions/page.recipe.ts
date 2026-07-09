import { sva } from 'styled-system/css'

/** Archive-page layout only; EditionCard owns card composition and chrome. */
export const editionsPage = sva({
  slots: ['grid', 'slot', 'card'],
  base: {
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2xl',
      width: 'full',
      lg: { gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 'gridGap', rowGap: '2xl' },
    },
    slot: { lg: { '&[data-feature]': { gridColumn: '1 / -1' } } },
    card: { height: 'full' },
  },
})
