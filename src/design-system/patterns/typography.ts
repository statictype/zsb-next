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

export const manifestoTitle = definePattern({
  jsxName: 'ManifestoTitle',
  jsxElement: 'h2',
  blocklist: typeBlocklist,
  transform(props) {
    return {
      fontFamily: 'display',
      fontSize: { base: 'lg', xl: 'lg', '3xl': 'xl' },
      lineHeight: 1.14,
      ...props,
    }
  },
})

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
      fontSize: context === 'mobile' ? 'md' : 'sm',
      letterSpacing: 'label',
      textTransform: 'uppercase',
      ...props,
    }
  },
})
