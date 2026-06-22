import { sva } from 'styled-system/css'

/**
 * CalendarFilters — co-located slot recipe.
 *
 * Venue/type chips (all-on-by-default multi-select) + a Reset control, inside
 * the dark Calendar section. Each chip is the shared `<Checkbox>` primitive (it
 * owns the chip look + selected/hover/focus states); this recipe keeps only the
 * surrounding layout (facet rows, the chip list, Reset). Raw grays are the
 * documented dark-board exceptions.
 */
export const calendarFilters = sva({
  slots: ['filters', 'bar', 'reset', 'facet', 'facetLabel', 'chips'],
  base: {
    filters: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      marginBottom: '2xl',
      paddingTop: 'lg',
      borderTop: 'hairline',
    },

    bar: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
    reset: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontWeight: 'semibold',
      color: 'gray.300',
      background: 'transparent',
      border: 'none',
      padding: '4px 0',
      cursor: 'pointer',
      transition: 'color {durations.fast} {easings.quint}',
      '& svg': { transition: 'transform {durations.normal} {easings.quint}' },
      '&:hover:not(:disabled)': { color: 'action', '& svg': { transform: 'rotate(-90deg)' } },
      _disabled: { color: 'gray.800', cursor: 'default' },
      _focusVisible: { outline: '2px solid token(colors.highlight)', outlineOffset: '2px' },
    },

    facet: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'sm',
      md: { flexDirection: 'row', alignItems: 'baseline', gap: 'md' },
    },
    facetLabel: {
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'wide',
      fontWeight: 'semibold',
      color: 'muted',
      md: { flexShrink: 0, width: '56px', paddingTop: '12px' },
    },
    chips: { listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '8px' },
  },
})
