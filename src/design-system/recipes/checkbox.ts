import { defineSlotRecipe } from '@pandacss/dev'

/**
 * The filter chip, on the system's two inks: a hairline at rest, the magenta
 * edge under the pointer, the chartreuse edge when selected.
 *
 * Every option is selected by default (`isSelected` is true on a null
 * selection), so "on" is the resting state of the whole bar and the informative
 * one is a chip switched off — the reason selection is an edge and not a fill.
 * The control is the only slot that fills, so the pointer (ring) and the state
 * (control) never say the same thing.
 */
export const checkbox = defineSlotRecipe({
  className: 'checkbox',
  jsx: ['Checkbox'],
  description: 'Controlled filter-option checkbox with Ark-owned interaction and site chip styling',
  slots: ['root', 'control', 'indicator', 'label'],
  base: {
    root: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      isolation: 'isolate',
      gap: '9px',
      minHeight: '36px',
      padding: '8px 14px',
      // The chip's own type context. Without it the root inherits body type and
      // the label element carries a 16px/1.7 strut while the count span is a
      // 10px/1.3 line box — two line boxes, centred separately, one visibly off.
      fontSize: 'xs',
      lineHeight: '1.3',
      whiteSpace: 'nowrap',
      color: 'gray.300',
      background: 'transparent',
      border: 'hairline',
      cursor: 'pointer',
      transition: 'interactive',
      // Selected — the chartreuse edge every marked control in the system wears.
      '&[data-state=checked]': {
        color: 'white',
        borderColor: 'highlight',
      },
      // Hover, from either state: the edge takes the action ink and the label
      // comes up to white. Declared after `checked` so it wins on both props —
      // hovering a selected chip offers to switch it off, and the filled
      // control is what holds the state meanwhile.
      '&[data-hover]': {
        color: 'white',
        borderColor: 'action',
      },
      '&[data-focus-visible]': {
        outline: 'focus',
        outlineOffset: '2px',
      },
      // One step under the label in every state. 0.7, not the 0.6 it started
      // at: that read 4.22:1 against the resting gray, under the 4.5 floor.
      '& [data-checkbox-count]': {
        opacity: 0.7,
        fontVariantNumeric: 'tabular-nums',
      },
    },
    control: {
      width: '14px',
      height: '14px',
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 'hairline',
      borderStyle: 'solid',
      borderColor: 'currentColor',
      opacity: 0.5,
      transition: 'interactive',
      '&[data-hover]': { opacity: 0.8 },
      // The one filled thing on the chip — so state survives a hover.
      '&[data-state=checked]': {
        opacity: 1,
        background: 'action',
        borderColor: 'action',
        color: 'black',
      },
    },
    indicator: { display: 'inline-flex' },
    // Flex, so the label box is its text's line box and not a strut around it.
    label: { display: 'inline-flex', alignItems: 'center', cursor: 'inherit' },
  },
})
