import { cva } from 'styled-system/css'

export const sectionHeading = cva({
  base: {
    color: '[inherit]',
    textWrap: '[pretty]',
    marginBottom: 'xl',
  },
  variants: {
    flush: {
      true: { marginBottom: '0' },
    },
  },
  defaultVariants: { flush: false },
})
