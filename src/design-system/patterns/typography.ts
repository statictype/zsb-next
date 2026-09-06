import { definePattern } from '@pandacss/dev'

const typeBlocklist = [
  'fontSize',
  'fontFamily',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
  'textTransform',
  'textStyle',
]

export const navigationLabel = definePattern({
  jsxName: 'NavigationLabel',
  jsxElement: 'span',
  properties: {
    context: {
      type: 'enum',
      value: ['desktop', 'mobile'],
    },
  },
  defaultValues: { context: 'desktop' },
  blocklist: typeBlocklist,
  transform({ context, ...props }) {
    return {
      fontFamily: 'display',
      fontSize: context === 'mobile' ? 'md' : 'nav',
      letterSpacing: 'label',
      textTransform: 'uppercase',
      ...props,
    }
  },
})
