import { sva } from 'styled-system/css'

export const pageHero = sva({
  slots: ['hero', 'title', 'lead'],
  base: {
    hero: { layerStyle: 'pageHero' },
    title: {
      animationStyle: 'enter',
      animationDelay: 'fast',
    },
    lead: { maxWidth: 'measure' },
  },
  variants: {
    // Drop the hero's bottom padding when a section follows directly — the
    // section owns the gap (its `sectionY` top), so the two don't double up.
    flush: {
      true: { hero: { paddingBottom: '0' } },
    },
  },
  defaultVariants: { flush: false },
})
