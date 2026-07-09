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
      color: 'heading',
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'color {durations.fast} {easings.quint}',
      _hover: { color: 'action' },
      _motionReduce: { transition: 'none' },
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
      color: 'muted',
      transitionDuration: 'fast',
    },
  },
  variants: {
    triggerTypography: {
      standard: {
        itemTrigger: {
          fontFamily: 'body',
          fontSize: 'md',
          fontWeight: 'bold',
          lineHeight: 'tight',
        },
      },
      display: {
        itemTrigger: {},
      },
    },
  },
  defaultVariants: { triggerTypography: 'standard' },
})
