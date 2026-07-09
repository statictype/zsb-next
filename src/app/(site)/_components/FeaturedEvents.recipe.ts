import { sva } from 'styled-system/css'

/**
 * FeaturedEvents — co-located slot recipe.
 *
 * The homepage spotlight (ZSB-31): must-see events pinned up as poster cards on
 * the same dark, image-forward palette as the calendar. The unified Card recipe
 * owns the hairline chrome; `frame` only sets the poster's portrait shape + the
 * skeleton base behind a loading image. The gallery image filter (desaturate at
 * rest → full colour on hover) is inlined here.
 * The card-wide hover (image zoom/desaturate + name → accent) drives from the
 * `card` slot targeting `& img` / `& a`; the name link's `::after` stretches the
 * hit target across the whole poster.
 */
export const featuredEvents = sva({
  slots: [
    'header',
    'headerMain',
    'eyebrow',
    'grid',
    'card',
    'frame',
    'noPoster',
    'watermark',
    'scrim',
    'stamp',
    'caption',
    'when',
    'name',
    'cardLink',
    'venue',
    'venueName',
    'venueParent',
    'chips',
  ],
  base: {
    header: {
      marginBottom: 'xl',
    },
    headerMain: { minWidth: '0' },
    eyebrow: {
      marginBottom: 'sm',
    },

    grid: {
      listStyle: 'none',
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 'gridGap',
      md: { gridTemplateColumns: 'repeat(2, 1fr)' },
      lg: { gridTemplateColumns: 'repeat(3, 1fr)' },
    },

    card: {
      // The shared `enter` animation style owns the stagger from `--i`.
      _hover: {
        '& img': { filter: '[grayscale(0%) contrast(1)]', transform: 'scale(1.04)' },
        '& a': { color: 'action' },
      },
      _motionReduce: {
        '& img': { transitionDuration: 'instant', transform: 'none' },
      },
    },

    // The poster frame: a portrait stage the image fills. Card owns the chrome
    // (border, position/overflow/isolation); this sets shape + skeleton base.
    frame: {
      aspectRatio: '4 / 5',
      background: 'gray.800',
      '& img': {
        objectFit: 'cover',
        filter: '[grayscale(100%) contrast(1.1)]',
        transitionProperty: '[filter, transform]',
        transitionDuration: 'medium',
        transitionTimingFunction: 'quint',
      },
    },
    // Image-less card: a tonal stage for the vast faded day numeral.
    noPoster: {
      background: '[linear-gradient(150deg, token(colors.gray.900), token(colors.surface) 70%)]',
    },

    watermark: {
      position: 'absolute',
      top: '[-0.18em]',
      right: '[0.04em]',
      fontFamily: 'display',
      fontSize: '[clamp(120px, 32vw, 260px)]',
      lineHeight: 'display',
      color: 'heading',
      opacity: '0.05',
      fontVariantNumeric: 'tabular-nums',
      pointerEvents: 'none',
      zIndex: '0',
    },
    scrim: {
      position: 'absolute',
      inset: '0',
      zIndex: '1',
      background:
        '[linear-gradient(to top, token(colors.surface) 2%, color-mix(in srgb, token(colors.surface) 72%, transparent) 26%, transparent 58%)]',
      pointerEvents: 'none',
    },
    stamp: {
      position: 'absolute',
      top: 'md',
      right: 'md',
      zIndex: '2',
      fontFamily: 'display',
      fontSize: 'sm',
      color: 'heading',
      fontVariantNumeric: 'tabular-nums',
      opacity: '0.85',
      textShadow: 'text',
    },

    caption: {
      position: 'absolute',
      inset: '[auto 0 0 0]',
      zIndex: '2',
      display: 'flex',
      flexDirection: 'column',
      gap: 'sm',
      padding: 'lg',
    },
    when: {
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontWeight: 'semibold',
      color: 'highlight',
    },
    name: {
      textStyle: 'cardTitle',
      // Event names are sentence-case, not the uppercase default.
      textTransform: 'none',
      color: 'heading',
    },
    // Links to the event route; inherits the heading type. Its ::after stretches
    // the hit target over the whole frame.
    cardLink: {
      font: '[inherit]',
      color: '[inherit]',
      textDecoration: 'none',
      transitionProperty: 'colors',
      transitionDuration: 'fast',
      transitionTimingFunction: 'quint',
      _after: { content: '""', position: 'absolute', inset: '0', zIndex: '3' },
      _focusVisible: {
        color: 'action',
        outline: 'focus',
        outlineOffset: 'xs',
      },
    },
    venue: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 'sm',
      fontFamily: 'body',
      fontSize: 'sm',
    },
    venueName: {
      color: 'gray.300',
      textTransform: 'uppercase',
      letterSpacing: 'subtle',
      fontWeight: 'medium',
    },
    venueParent: {
      color: 'muted',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontSize: '2xs',
      _before: { content: '"↳ "' },
    },
    chips: {
      listStyle: 'none',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'sm',
      marginTop: 'xs',
    },
  },
})
