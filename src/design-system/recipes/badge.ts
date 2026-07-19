import { defineRecipe } from '@pandacss/dev'

export const badge = defineRecipe({
  jsx: ['Badge'],
  className: 'badge',
  description: 'Unified tag/chip/badge — replaces the legacy pill/chip/tape/status variants',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    width: 'fit-content',
    whiteSpace: 'nowrap',
    paddingInline: 'badgeX',
    paddingBlock: 'badgeY',
    borderWidth: 'hairlineThin',
    borderStyle: 'solid',
    borderColor: 'highlight',
    fontFamily: 'body',
    fontSize: 'xs',
    fontWeight: 'medium',
    lineHeight: '1.3',
    letterSpacing: '1.2px',
    textTransform: 'uppercase',
  },
  variants: {
    tone: {
      highlight: { bg: 'highlight', color: 'black' },
      outline: { bg: 'black', color: 'highlight' },
      muted: { bg: 'gray.900', borderColor: 'gray.700', color: 'gray.400' },
    },
  },
  defaultVariants: { tone: 'highlight' },
})
