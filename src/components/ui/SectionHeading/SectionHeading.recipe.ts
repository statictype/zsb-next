import { cva } from 'styled-system/css'

export const sectionHeading = cva({
  base: {
    color: '[inherit]',
    textWrap: '[pretty]',
    marginBottom: 'xl',
  },
  variants: {
    case: {
      upper: {},
      sentence: { textTransform: 'none' },
    },
    flush: {
      true: { marginBottom: '0' },
    },
  },
  defaultVariants: { case: 'upper', flush: false },
})
