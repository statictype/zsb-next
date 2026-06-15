import { sva } from 'styled-system/css'

/**
 * CalendarFilters — co-located slot recipe.
 *
 * Venue/type chips (all-on-by-default multi-select) + a Reset control, inside
 * the dark Calendar section. Chips are bespoke board controls (toggle look +
 * checkbox indicator), not the `<Button>` primitive. Active chip → `data-active`
 * on both the chip and its box. Raw grays are the documented dark-board
 * exceptions.
 */
export const calendarFilters = sva({
  slots: ['filters', 'bar', 'reset', 'facet', 'facetLabel', 'chips', 'chip', 'box', 'count'],
  base: {
    filters: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
      marginBottom: '2xl',
      paddingTop: 'lg',
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: 'divider',
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

    chip: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '9px',
      minHeight: '36px',
      padding: '8px 14px',
      fontFamily: 'body',
      fontSize: 'xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontWeight: 'semibold',
      color: 'gray.300',
      background: 'transparent',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'gray.700',
      cursor: 'pointer',
      transition:
        'color {durations.fast} {easings.quint}, border-color {durations.fast} {easings.quint}, background {durations.fast} {easings.quint}',
      _hover: { color: 'white', borderColor: 'white' },
      _focusVisible: { outline: '2px solid token(colors.highlight)', outlineOffset: '2px' },
      '&[data-active=true]': {
        color: 'white',
        background: 'action',
        borderColor: 'action',
        _hover: { color: 'white', background: 'action', borderColor: 'action' },
      },
    },
    // Checkbox indicator — empty box off, filled check on. State is driven by
    // the parent chip button's hover / data-active (active wins via source order).
    box: {
      width: '14px',
      height: '14px',
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'currentColor',
      opacity: 0.5,
      transition: 'opacity {durations.fast} {easings.quint}',
      'button:hover > &': { opacity: 0.8 },
      'button[data-active=true] > &': {
        opacity: 1,
        background: 'white',
        color: 'action',
        borderColor: 'white',
      },
    },
    count: { fontSize: '2xs', fontVariantNumeric: 'tabular-nums', opacity: 0.6 },
  },
})
