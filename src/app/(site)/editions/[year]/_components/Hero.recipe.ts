import { sva } from 'styled-system/css'

/**
 * Hero — co-located slot recipe.
 *
 * The edition hero: an image frame (portrait on mobile, 2:1 from `md`) with
 * the theme tape (carrying the date line via `meta`) overlaid. Full-bleed
 * until `lg`, where the hero
 * gains horizontal padding and the tapes hang off the frame's left edge. The
 * top offset mirrors the shared `pageHero` layerStyle (`token(sizes.nav)` + 80/
 * 120px) so the frame starts at the same y as the title on every other page.
 * The image/vignette reveals compose the shared `enter` animation styles (image = zoom,
 * vignette = fade); the tapes keep the distinct `tapeIn` keyframe. The frame
 * (not the image) owns the `grayscale(0.3)` so it survives `enter`'s `filter`.
 */
export const hero = sva({
  slots: ['hero', 'stage', 'frame', 'background', 'image', 'vignette', 'tapes'],
  base: {
    hero: {
      position: 'relative',
      background: 'surface',
      overflow: 'hidden',
      // Matches the shared pageHero top offset.
      paddingTop: '[calc(token(sizes.nav) + 80px)]',
      paddingInline: '0',
      paddingBottom: '3xl',
      md: { paddingTop: '[calc(token(sizes.nav) + 120px)]', paddingBottom: '4xl' },
      lg: { paddingInline: 'gutter', paddingBottom: '4xl' },
    },
    stage: {
      position: 'relative',
      width: 'full',
      marginInline: 'auto',
      lg: { maxWidth: 'maxWidth' },
      // Tapes flush with the logo, image right-flush with the menu.
      '2xl': { maxWidth: '[none]', width: 'full', marginRight: '0' },
    },

    // Portrait on mobile, 2:1 from tablet up; a faint inset hairline via ::after.
    frame: {
      position: 'relative',
      width: 'full',
      aspectRatio: '4 / 5',
      overflow: 'hidden',
      isolation: 'isolate',
      filter: '[grayscale(0.3)]',
      boxShadow: 'frame',
      md: { aspectRatio: '2 / 1' },
      _after: {
        content: '""',
        position: 'absolute',
        inset: '0',
        pointerEvents: 'none',
        outline: 'hairline',
        outlineOffset: '[-1px]',
        zIndex: '2',
      },
    },
    // Backing color behind transparent hero images.
    background: { position: 'absolute', inset: '0', background: 'gray.900', zIndex: '0' },
    image: {
      objectFit: 'cover',
      objectPosition: 'center right',
      background: 'gray.900',
      zIndex: '0',
    },
    vignette: {
      position: 'absolute',
      inset: '0',
      pointerEvents: 'none',
      backgroundGradient: 'heroVignette',
      mixBlendMode: 'multiply',
      zIndex: '1',
      animationDelay: 'normal',
    },

    tapes: {
      position: 'absolute',
      left: '0',
      bottom: '[8%]',
      zIndex: '4',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      maxWidth: '[94%]',
      paddingRight: 'md',
      md: { bottom: '[10%]', maxWidth: '[72%]' },
      lg: { bottom: '[11%]', maxWidth: '[62%]' },
      xl: { maxWidth: '[58%]' },
    },
  },
})
