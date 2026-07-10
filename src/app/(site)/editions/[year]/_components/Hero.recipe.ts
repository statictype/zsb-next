import { sva } from 'styled-system/css'

/**
 * Hero — co-located slot recipe.
 *
 * The edition hero: an image frame (portrait on mobile, 2:1 from `md`) with
 * the theme tape (carrying the date line via `meta`) overlaid. Full-bleed
 * until `lg`, where the hero
 * gains horizontal padding and the tapes hang off the frame's left edge. The
 * shell composes the shared `pageHero` layerStyle (nav-clearing top padding +
 * black ground) so the frame starts at the same y as the title on every other
 * page. The image/vignette reveals compose the shared `enter` animation styles
 * (image = zoom, vignette = fade); the tapes keep the distinct `tapeIn`
 * keyframe. The frame (not the image) owns the `grayscaleSubtle` filter so it
 * survives `enter`'s `filter`.
 */
export const hero = sva({
  slots: ['hero', 'stage', 'frame', 'background', 'image', 'vignette', 'tapes'],
  base: {
    hero: {
      layerStyle: 'pageHero',
      position: 'relative',
      overflow: 'hidden',
      paddingInline: '0',
      lg: { paddingInline: 'gutter' },
    },
    stage: {
      position: 'relative',
      width: 'full',
      marginInline: 'auto',
      lg: {
        maxWidth: 'maxWidth',
        // Reserves the tape's own column beside the image instead of
        // overlaying it; tapes stay absolutely positioned within this box.
        display: 'grid',
        gridTemplateColumns: 'heroTapeColumn minmax(0, 1fr)',
      },
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
      filter: '[token(assets.grayscaleSubtle)]',
      boxShadow: 'frame',
      md: { aspectRatio: '2 / 1' },
      lg: { gridColumn: '2' },
      _after: {
        content: '""',
        position: 'absolute',
        inset: '0',
        pointerEvents: 'none',
        outline: 'hairline',
        outlineOffset: 'xs',
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
      layerStyle: 'heroTapeOffset',
      position: 'absolute',
      left: '0',
      zIndex: '4',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      paddingRight: 'md',
    },
  },
})
