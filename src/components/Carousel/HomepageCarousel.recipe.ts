import { sva } from 'styled-system/css'

export const homepageCarousel = sva({
  slots: ['slide', 'image'],
  base: {
    slide: { position: 'relative', width: 'full', height: 'full', overflow: 'hidden' },
    image: { objectFit: 'cover', background: 'gray.900' },
  },
})
