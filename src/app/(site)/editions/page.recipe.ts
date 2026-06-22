import { sva } from 'styled-system/css'

/** Archive-page layout only; EditionCard owns card composition and chrome. */
export const editionsPage = sva({
  slots: ['inner', 'grid', 'slot', 'card'],
  base: {
    inner: { layerStyle: 'sectionInner' },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2xl',
      width: '100%',
      lg: { gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 'gridGap', rowGap: '2xl' },
    },
    slot: { lg: { '&[data-feature]': { gridColumn: '1 / -1' } } },
    card: { height: '100%' },
  },
})
