import { sva } from 'styled-system/css'

export const pageHero = sva({
  slots: ['hero', 'title', 'lead'],
  base: {
    hero: { layerStyle: 'pageHero' },
    title: {
      animationStyle: 'enter',
      animationDelay: 'stagger',
    },
    lead: { maxWidth: 'measure' },
  },
  variants: {
    flush: {
      true: { hero: { paddingBottom: '0' } },
    },
  },
  defaultVariants: { flush: false },
})
