import { sva } from 'styled-system/css'

/**
 * CalendarFilters — co-located slot recipe.
 *
 * Venue/type chips (all-on-by-default multi-select) + a Reset control, inside
 * the dark Calendar section. Each chip is the shared `<Checkbox>` primitive (it
 * owns the chip look + selected/hover/focus states); this recipe keeps only the
 * surrounding layout (filter rows and Reset). Raw grays are the
 * documented dark-board exceptions.
 */
export const calendarFilters = sva({
  slots: ['filters', 'bar', 'reset', 'filterRow', 'filterRowLabel'],
  base: {
    filters: {
      marginBottom: '2xl',
      paddingTop: 'lg',
    },

    bar: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' },
    reset: {
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontWeight: 'semibold',
      color: 'gray.300',
      background: 'transparent',
      border: 'none',
      paddingBlock: 'xs',
      paddingInline: '0',
      cursor: 'pointer',
      transitionProperty: 'colors',
      transitionDuration: 'fast',
      transitionTimingFunction: 'quint',
      '& svg': {
        transitionProperty: '[transform]',
        transitionDuration: 'normal',
        transitionTimingFunction: 'quint',
      },
      '&:hover:not(:disabled)': { color: 'action', '& svg': { transform: 'rotate(-90deg)' } },
      _disabled: { color: 'gray.800', cursor: 'default' },
      _focusVisible: { outline: 'focus', outlineOffset: 'xs' },
    },

    filterRow: {
      md: { flexDirection: 'row', alignItems: 'baseline', gap: 'md' },
    },
    filterRowLabel: {
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'wide',
      fontWeight: 'semibold',
      color: 'muted',
      md: { flexShrink: '0', width: '[56px]', paddingTop: 'md' },
    },
  },
})
