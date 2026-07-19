import { defineSlotRecipe } from '@pandacss/dev'

export const collapsible = defineSlotRecipe({
  className: 'collapsible',
  jsx: ['Collapsible'],
  description: 'Independent disclosure with Ark-owned state and site archive styling',
  slots: ['root', 'trigger', 'content', 'indicator'],
  base: {
    root: {
      width: '100%',
      borderTop: 'hairline',
      display: 'flex',
      flexDirection: 'column',
      gap: 'md',
    },
    trigger: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 'md',
      paddingBlock: 'lg',
      paddingInline: '0',
      border: '0',
      background: 'transparent',
      cursor: 'pointer',
      textAlign: 'left',
      color: 'action',
      _hover: {
        '& [data-collapsible-label]': { textDecoration: 'underline', textUnderlineOffset: '3px' },
      },
      '& [data-collapsible-label=open]': { display: 'none' },
      '&[data-state=open] [data-collapsible-label=closed]': { display: 'none' },
      '&[data-state=open] [data-collapsible-label=open]': { display: 'inline' },
      '& [data-collapsible-meta]': {
        color: 'muted',
        fontVariantNumeric: 'tabular-nums',
      },
    },
    content: { paddingBottom: 'lg' },
    indicator: {
      layerStyle: 'disclosureIndicator',
      marginLeft: 'auto',
    },
  },
})
