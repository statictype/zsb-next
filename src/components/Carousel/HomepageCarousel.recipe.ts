import { sva } from 'styled-system/css'

export const homepageCarousel = sva({
  slots: ['slide', 'image'],
  base: {
    slide: {
      pressable: 'dim',
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
  },
})
