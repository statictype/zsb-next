import { sva } from 'styled-system/css'

export const homepageCarousel = sva({
  slots: ['slide', 'image', 'vignette'],
  base: {
    slide: {
      // Native <button> without preflight — strip the UA chrome.
      display: 'block',
      border: 'none',
      position: 'relative',
      width: 'full',
      height: 'full',
      overflow: 'hidden',
      cursor: 'pointer',
      background: 'black',
    },
    image: { objectFit: 'cover', background: 'gray.900' },
    vignette: {
      position: 'absolute',
      inset: '0',
      pointerEvents: 'none',
      background: '[radial-gradient(ellipse at center, transparent 55%, rgb(0 0 0 / 0.45) 100%)]',
    },
  },
})
