import { sva } from 'styled-system/css'

export const programFilters = sva({
  slots: ['filterRow', 'filterRowLabel'],
  base: {
    filterRow: {
      md: { flexDirection: 'row', alignItems: 'baseline', gap: 'md' },
    },
    filterRowLabel: {
      md: { flexShrink: '0', width: '[56px]', paddingTop: 'md' },
    },
  },
})
