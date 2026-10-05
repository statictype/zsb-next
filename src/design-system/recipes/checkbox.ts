import { defineSlotRecipe } from '@/design-system/define-recipe'

export const checkbox = defineSlotRecipe({
  className: 'checkbox',
  jsx: ['Checkbox'],
  description: 'Controlled filter-option checkbox with site chip styling',
  slots: ['root', 'input', 'control', 'indicator', 'label'],
  base: {
    root: {
      pressable: 'fill',
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      isolation: 'isolate',
      gap: '9px',
      minHeight: '36px',
      padding: '8px 14px',
      // Without a type context here the label element inherits body type and
      // carries a 16px/1.7 strut against the count's 10px/1.3 line box.
      fontSize: 'xs',
      lineHeight: '1.3',
      whiteSpace: 'nowrap',
      color: 'gray.300',
      background: 'transparent',
      border: 'hairline',
      cursor: 'pointer',
      transition: 'interactive',
      '&:has(input:checked)': {
        color: 'white',
        borderColor: 'highlight',
      },
      // After `checked`, so hover wins on both props.
      _hover: {
        color: 'white',
        borderColor: 'action',
      },
      '&:has(input:focus-visible)': {
        outline: 'focus',
        outlineOffset: 'focusInset',
      },
      // Not 0.6: that read 4.22:1 against the resting gray.
      '& [data-checkbox-count]': {
        opacity: 0.7,
        fontVariantNumeric: 'tabular-nums',
      },
    },
    input: { layerStyle: 'srOnly' },
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
      ':hover > &': { opacity: 0.8 },
      // The only slot that fills, so the state survives a hover.
      'input:checked + &': {
        opacity: 1,
        background: 'action',
        borderColor: 'action',
        color: 'black',
      },
    },
    indicator: { display: 'inline-flex' },
    label: { display: 'inline-flex', alignItems: 'center', cursor: 'inherit' },
  },
})
