import { cva } from 'styled-system/css'

/**
 * SectionHeading — the one section-title treatment.
 *
 * Bakes the normalized defaults so the `css({ textStyle: 'sectionTitle',
 * marginBottom })` idiom (and the per-site title slots) collapse onto one
 * primitive: the `sectionTitle` textStyle, `color: inherit` (the B5 `section`
 * ground supplies white-on-dark / black-on-light — no per-site color fork),
 * `textWrap: pretty`, and `marginBottom: xl`. Only two margin states exist —
 * the default `xl`, or `flush` (0) when a parent header owns the title→content
 * gap. `case` flips the `sectionTitle` uppercase default to sentence case.
 */
export const sectionHeading = cva({
  base: {
    textStyle: 'sectionTitle',
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
