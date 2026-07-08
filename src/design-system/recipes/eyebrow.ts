import { defineRecipe } from '@pandacss/dev'

/**
 * Eyebrow — unified kicker/label above headings (ZSB-71).
 * Collapses `.eyebrowMuted` (with decorative rule), the carousel-control eyebrow
 * (muted, no rule) and the FeaturedEvents eyebrow (highlight, smaller) into one
 * recipe: `tone` × `size` × `rule`. The rule inherits the text color.
 */
export const eyebrow = defineRecipe({
  jsx: ['Eyebrow'],
  className: 'eyebrow',
  description: 'Unified eyebrow/kicker — replaces legacy carousel and FeaturedEvents eyebrows',
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontFamily: 'body',
    textTransform: 'uppercase',
    letterSpacing: 'wide',
    lineHeight: 'heading',
    color: 'muted',
    fontSize: 'xs',
  },
  variants: {
    rule: {
      true: {
        _before: { layerStyle: 'ruleLine' },
      },
    },
  },
  defaultVariants: { rule: false },
})
