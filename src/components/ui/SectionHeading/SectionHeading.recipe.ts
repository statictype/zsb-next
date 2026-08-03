import { cva } from 'styled-system/css'

export const sectionHeading = cva({
  base: {
    textWrap: '[pretty]',
    textTransform: 'uppercase',
  },
  variants: {
    flush: {
      true: {},
    },
  },
  defaultVariants: { flush: false },
})
