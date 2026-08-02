import { sva } from 'styled-system/css'

/**
 * Hero — co-located slot recipe.
 *
 * The edition hero: an image frame (portrait on mobile, 2:1 from `md`) with the
 * theme and date line below it in flow. Full-bleed until `lg`, where the hero
 * gains horizontal padding. The shell composes the shared `pageHero` layerStyle
 * (nav-clearing top padding + black ground) so the frame starts at the same y as
 * the title on every other page. The image/vignette reveals compose the shared
 * `enter` animation styles (image = zoom, vignette = fade). The frame (not the
 * image) owns the `grayscaleSubtle` filter so it survives `enter`'s `filter`.
 */
export const hero = sva({
  slots: ['hero', 'stage', 'frame', 'background', 'image', 'vignette', 'intro'],
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
      lg: { maxWidth: 'maxWidth' },
      // Image right-flush with the menu.
      '2xl': { maxWidth: '[none]', width: 'full', marginRight: '0' },
    },

    frame: {
      position: 'relative',
      width: 'full',
      aspectRatio: '1 / 1',
      overflow: 'hidden',
      isolation: 'isolate',
      filter: '[token(assets.grayscaleSubtle)]',
      boxShadow: 'frame',
      md: { aspectRatio: '2 / 1' },
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

    intro: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'md',
      maxWidth: 'maxWidth',
      marginInline: 'auto',
      paddingInline: 'gutter',
      paddingTop: 'xl',
      lg: { paddingInline: '0' },
    },
  },
})
