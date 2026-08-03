import { sva } from 'styled-system/css'

export const mediaKitStrip = sva({
  slots: ['card', 'image'],
  base: {
    card: {
      position: 'relative',
      width: '[clamp(240px, 70vw, 320px)]',
      aspectRatio: '3 / 4',
      // exception: image placeholder, raised-dark surface
      background: 'gray.900',
      overflow: 'hidden',
      _hover: { '& img': { filter: '[token(assets.monoHover)]', transform: 'scale(1.04)' } },
      md: { width: '[clamp(320px, 38vw, 460px)]' },
      xl: { width: '[clamp(360px, 28vw, 480px)]' },
    },
    image: {
      objectFit: 'cover',
      background: 'gray.900',
      filter: '[token(assets.mono)]',
      transition: 'develop',
    },
  },
})
