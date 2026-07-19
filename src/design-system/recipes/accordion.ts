import { defineSlotRecipe } from '@pandacss/dev'

export const accordion = defineSlotRecipe({
  className: 'accordion',
  jsx: ['Accordion'],
  description: 'Site accordion with Ark-owned behavior and normalized disclosure chrome',
  slots: ['root', 'item', 'itemTrigger', 'itemContent', 'itemIndicator'],
  base: {
    root: { width: '100%' },
    item: {
      borderBottom: 'hairline',
      _last: { borderBottomWidth: '0' },
    },
    itemTrigger: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'md',
      paddingBlock: 'md',
      paddingInline: '0',
      border: '0',
      background: 'transparent',
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'interactive',
      _hover: { color: 'action' },
      '& [data-accordion-meta]': {
        marginLeft: 'auto',
        color: 'muted',
      },
    },
    itemContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'lg',
      paddingBottom: 'lg',
    },
    itemIndicator: {
      layerStyle: 'disclosureIndicator',
      flexShrink: '0',
    },
  },
})
