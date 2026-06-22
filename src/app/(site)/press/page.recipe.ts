import { sva } from 'styled-system/css'

/** Press-page rails only; LinkList owns the normalized register rows. */
export const pressPage = sva({
  slots: ['page', 'kitHeader', 'appearancesInner', 'releasesInner'],
  base: {
    page: { background: 'surface', color: 'heading' },
    kitHeader: { layerStyle: 'sectionInner', marginBottom: '2xl' },
    appearancesInner: { layerStyle: 'sectionInner' },
    releasesInner: { layerStyle: 'sectionInner' },
  },
})
