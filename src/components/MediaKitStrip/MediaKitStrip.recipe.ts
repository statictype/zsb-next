import { sva } from 'styled-system/css'

/**
 * MediaKitStrip — co-located slot recipe.
 *
 * Poster content for the shared rail Carousel. Carousel owns the viewport,
 * drag interaction, and controls; this owns the 3:4 card and image hover-zoom.
 */
export const mediaKitStrip = sva({
  slots: ['card', 'image'],
  base: {
    card: {
      position: 'relative',
      width: 'clamp(240px, 70vw, 320px)',
      aspectRatio: '3 / 4',
      // exception: image placeholder, raised-dark surface
      background: 'gray.900',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      overflow: 'hidden',
      _hover: { '& img': { transform: 'scale(1.04)' } },
      md: { width: 'clamp(320px, 38vw, 460px)' },
      xl: { width: 'clamp(360px, 28vw, 480px)' },
    },
    // Drag prevention comes from the Figure's `draggable={false}` attribute.
    image: {
      objectFit: 'cover',
      background: 'gray.900',
      transition: 'transform {durations.entrance} {easings.expo}',
    },
  },
})
