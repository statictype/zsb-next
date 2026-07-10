import { cva } from 'styled-system/css'

export const sectionHeading = cva({
  base: {
    textWrap: '[pretty]',
  },
  variants: {
    flush: {
      true: {},
    },
  },
  defaultVariants: { flush: false },
})
