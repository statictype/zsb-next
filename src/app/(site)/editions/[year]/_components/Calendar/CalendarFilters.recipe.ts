import { sva } from 'styled-system/css'

/**
 * CalendarFilters — co-located slot recipe.
 *
 * Venue/type chips (all-on-by-default multi-select) + a Reset control, inside
 * the dark Calendar section. Each chip is the shared `<Checkbox>` primitive (it
 * owns the chip look + selected/hover/focus states) and Reset is a `quiet`
 * `<Button>`; this recipe keeps only the surrounding layout.
 */
export const calendarFilters = sva({
  slots: ['bar', 'filterRow', 'filterRowLabel'],
  base: {
    bar: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },

    filterRow: {
      md: { flexDirection: 'row', alignItems: 'baseline', gap: 'md' },
    },
    filterRowLabel: {
      md: { flexShrink: '0', width: '[56px]', paddingTop: 'md' },
    },
  },
})
