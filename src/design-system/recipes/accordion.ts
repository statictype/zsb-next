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
      _focusVisible: { outline: '2px solid token(colors.highlight)', outlineOffset: '3px' },
      _motionReduce: { transition: 'none' },
      '& [data-accordion-meta]': {
        marginLeft: 'auto',
        fontFamily: 'body',
        fontSize: '2xs',
        textTransform: 'uppercase',
        letterSpacing: 'label',
        fontWeight: 'semibold',
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
      display: 'inline-flex',
      flexShrink: '0',
      color: 'muted',
      transition: 'transform {durations.fast} {easings.quint}',
      '&[data-state=open]': { transform: 'rotate(180deg)' },
      _motionReduce: { transition: 'none' },
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
        itemTrigger: {
          fontFamily: 'display',
          fontSize: { base: 'lg', md: 'xl' },
          lineHeight: 'tight',
        },
      },
    },
  },
  defaultVariants: { triggerTypography: 'standard' },
})
