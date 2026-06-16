import { sva } from 'styled-system/css'

/**
 * Checkbox — the selectable facet chip, fully owned by the primitive.
 *
 * A real `<input type="checkbox">` (visually hidden, keyboard + label-click for
 * free) inside a `<label>` that *is* the chip: box + check indicator + label +
 * optional count. Selected/hover/focus states are driven off the native input
 * via `:has()`, so the caller passes only data — no styling on top. Raw grays
 * are the documented dark-board exceptions (this lives in the Calendar section).
 */
export const checkbox = sva({
  slots: ['root', 'input', 'box', 'count'],
  base: {
    root: {
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
      // Selected — the native input drives it; active wins over hover.
      '&:has(:checked)': {
        color: 'white',
        background: 'action',
        borderColor: 'action',
        _hover: { color: 'white', background: 'action', borderColor: 'action' },
      },
      // Route the hidden input's focus ring to the chip.
      '&:has(:focus-visible)': {
        outline: '2px solid token(colors.highlight)',
        outlineOffset: '2px',
      },
    },
    // Visually hidden, still focusable + in the a11y tree.
    input: {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      whiteSpace: 'nowrap',
      borderWidth: '0',
    },
    // Indicator — empty box off, filled check on.
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
      'label:hover &': { opacity: 0.8 },
      'label:has(:checked) &': {
        opacity: 1,
        background: 'white',
        color: 'action',
        borderColor: 'white',
      },
    },
    count: { fontSize: '2xs', fontVariantNumeric: 'tabular-nums', opacity: 0.6 },
  },
})
