import { sva } from 'styled-system/css'

/**
 * Hero — co-located slot recipe.
 *
 * The edition hero: an image frame (portrait on mobile, 2:1 from `md`) with a
 * stack of sticky-tape labels overlaid. Full-bleed until `lg`, where the hero
 * gains horizontal padding and the tapes hang off the frame's left edge. The
 * top offset mirrors the shared `pageHero` layerStyle (`token(sizes.nav)` + 80/
 * 120px) so the frame starts at the same y as the title on every other page.
 * Entrance animations (`imageReveal`, `fadeIn`, `tapeIn`) register in the Panda
 * keyframes; the unused legacy `--hero-bg` override hook is dropped (gray.900).
 */
export const hero = sva({
  slots: [
    'hero',
    'stage',
    'frame',
    'background',
    'image',
    'vignette',
    'tapes',
    'tapeDate',
    'tapeEdition',
    'editionSep',
    'tapeTheme',
    'themeHighlight',
  ],
  base: {
    hero: {
      position: 'relative',
      background: 'blackPure',
      overflow: 'hidden',
      // Matches the shared pageHero top offset.
      paddingTop: 'calc(token(sizes.nav) + 80px)',
      paddingInline: '0',
      paddingBottom: '3xl',
      md: { paddingTop: 'calc(token(sizes.nav) + 120px)', paddingBottom: '4xl' },
      lg: { paddingInline: 'content', paddingBottom: '5xl' },
    },
    stage: {
      position: 'relative',
      width: '100%',
      marginInline: 'auto',
      lg: { maxWidth: 'maxWidth' },
      // Tapes flush with the logo, image right-flush with the menu.
      '2xl': { maxWidth: 'none', width: '100%', marginRight: '0' },
    },

    // Portrait on mobile, 2:1 from tablet up; a faint inset hairline via ::after.
    frame: {
      position: 'relative',
      width: '100%',
      aspectRatio: '4 / 5',
      overflow: 'hidden',
      isolation: 'isolate',
      boxShadow: '0 30px 80px -30px rgba(0, 0, 0, 0.7)',
      md: { aspectRatio: '2 / 1' },
      _after: {
        content: '""',
        position: 'absolute',
        inset: '0',
        pointerEvents: 'none',
        outline: '1px solid rgba(255, 255, 255, 0.04)',
        outlineOffset: '-1px',
        zIndex: '2',
      },
    },
    // Backing color behind transparent hero images.
    background: { position: 'absolute', inset: '0', background: 'gray.900', zIndex: '0' },
    image: {
      objectFit: 'cover',
      objectPosition: 'center right',
      background: 'gray.900',
      animation: 'imageReveal 1.3s {easings.expo} both',
      zIndex: '0',
      filter: 'grayscale(0.3)',
    },
    vignette: {
      position: 'absolute',
      inset: '0',
      pointerEvents: 'none',
      background:
        'linear-gradient(115deg, rgba(14, 11, 16, 0.55) 0%, rgba(14, 11, 16, 0) 38%), radial-gradient(140% 90% at 50% 30%, transparent 55%, rgba(14, 11, 16, 0.5) 100%)',
      mixBlendMode: 'multiply',
      zIndex: '1',
      opacity: '0',
      animation: 'fadeIn 1.2s ease-out 0.3s forwards',
    },

    tapes: {
      position: 'absolute',
      left: '0',
      bottom: '8%',
      zIndex: '4',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '10px',
      maxWidth: '94%',
      paddingRight: 'md',
      md: { bottom: '10%', gap: '14px', maxWidth: '72%' },
      lg: { bottom: '11%', gap: '16px', maxWidth: '62%' },
      xl: { gap: '18px', maxWidth: '58%' },
    },

    // Chartreuse sticky-tape labels. tapeDate/tapeEdition share a look; only
    // rotate / margin / delay differ, so they're written out per slot (Panda
    // extracts literal objects, not spreads).
    tapeDate: {
      display: 'inline-block',
      fontFamily: 'body',
      fontSize: '2xs',
      fontWeight: 'semibold',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      color: 'black',
      background: 'highlight',
      paddingBlock: '7px',
      paddingInline: '12px',
      lineHeight: '1.25',
      boxShadow:
        'inset 0 1px 0 rgba(255, 255, 255, 0.35), inset 0 -1px 0 rgba(0, 0, 0, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.35)',
      transformOrigin: 'top left',
      opacity: '0',
      translate: '-8px 16px',
      animation: 'tapeIn 0.9s {easings.expo} 0.35s forwards',
      whiteSpace: 'nowrap',
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      rotate: '-0.9deg',
      marginLeft: '16px',
      md: { fontSize: 'xs', paddingBlock: '10px', paddingInline: '16px', marginLeft: '28px' },
      lg: { paddingBlock: '12px', paddingInline: '20px', marginLeft: '-22px' },
      xl: { marginLeft: '-16px' },
      '@media (prefers-reduced-motion: reduce)': {
        animation: 'none',
        opacity: '1',
        translate: '0 0',
      },
    },
    tapeEdition: {
      display: 'inline-block',
      fontFamily: 'body',
      fontSize: '2xs',
      fontWeight: 'semibold',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      color: 'black',
      background: 'highlight',
      paddingBlock: '7px',
      paddingInline: '12px',
      lineHeight: '1.25',
      boxShadow:
        'inset 0 1px 0 rgba(255, 255, 255, 0.35), inset 0 -1px 0 rgba(0, 0, 0, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.35)',
      transformOrigin: 'top left',
      opacity: '0',
      translate: '-8px 16px',
      animation: 'tapeIn 0.9s {easings.expo} 0.75s forwards',
      whiteSpace: 'nowrap',
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      rotate: '0.7deg',
      marginLeft: '28px',
      md: { fontSize: 'xs', paddingBlock: '10px', paddingInline: '16px', marginLeft: '40px' },
      lg: { paddingBlock: '12px', paddingInline: '20px' },
      '@media (prefers-reduced-motion: reduce)': {
        animation: 'none',
        opacity: '1',
        translate: '0 0',
      },
    },
    editionSep: {
      display: 'inline-block',
      marginInline: '6px',
      color: 'action',
      fontWeight: 'black',
    },

    // The focal label — black tape with a chartreuse top edge.
    tapeTheme: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'baseline',
      fontFamily: 'display',
      fontSize: 'xl',
      lineHeight: '1',
      letterSpacing: '-0.025em',
      color: 'white',
      background: 'blackPure',
      paddingTop: '12px',
      paddingInline: '18px',
      paddingBottom: '14px',
      marginBlock: '2px',
      marginLeft: '10px',
      rotate: '-0.45deg',
      transformOrigin: 'top left',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 14px 32px -6px rgba(0, 0, 0, 0.55)',
      opacity: '0',
      translate: '-12px 18px',
      animation: 'tapeIn 1s {easings.expo} 0.55s forwards',
      textTransform: 'lowercase',
      _before: {
        content: '""',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '3px',
        background: 'highlight',
        opacity: '0.85',
      },
      md: {
        fontSize: '3xl',
        paddingTop: '14px',
        paddingInline: '22px',
        paddingBottom: '16px',
        marginLeft: '18px',
      },
      lg: {
        fontSize: '4xl',
        paddingTop: '16px',
        paddingInline: '28px',
        paddingBottom: '20px',
        marginLeft: '-36px',
      },
      xl: {
        fontSize: '5xl',
        paddingTop: '18px',
        paddingInline: '32px',
        paddingBottom: '22px',
        marginLeft: '-40px',
      },
      '@media (prefers-reduced-motion: reduce)': {
        animation: 'none',
        opacity: '1',
        translate: '0 0',
      },
    },
    themeHighlight: { color: 'action' },
  },
})
