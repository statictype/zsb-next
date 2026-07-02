import { defineRecipe } from '@pandacss/dev'

/**
 * Badge — the first unified primitive (ZSB-71 spike proof).
 * Collapses the 8 legacy pill/chip/tape-label/status-badge variants into one
 * recipe with one size and two purposeful tones.
 */
export const badge = defineRecipe({
  jsx: ['Badge'],
  className: 'badge',
  description: 'Unified tag/chip/badge — replaces the legacy pill/chip/tape/status variants',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    width: 'fit-content',
    fontFamily: 'body',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    lineHeight: '1.3',
    whiteSpace: 'nowrap',
    fontSize: '10px',
    paddingInline: '12px',
    paddingBlock: '6px',
  },
  variants: {
    tone: {
      // Solid chartreuse fill, chartreuse hairline chip, solid dark fill. The
      // old `outline` (chartreuse) and `muted` (gray) hairlines were the same
      // role on different grounds — collapsed to one brand-forward hairline.
      highlight: { bg: 'highlight', color: 'black' },
      outline: { bg: 'black', color: 'highlight', border: 'highlight' },
    },
  },
  defaultVariants: { tone: 'highlight' },
})
