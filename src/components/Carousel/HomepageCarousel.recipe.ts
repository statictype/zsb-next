import { sva } from 'styled-system/css'

export const homepageCarousel = sva({
  slots: ['slide', 'image', 'vignette'],
  base: {
    slide: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      cursor: 'pointer',
      background: 'black',
    },
    image: { objectFit: 'cover', background: 'gray.900' },
    vignette: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.45) 100%)',
    },
  },
})
