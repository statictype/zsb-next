import { sva } from 'styled-system/css'

export const featuredEvents = sva({
  slots: [
    'header',
    'headerMain',
    'eyebrow',
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
    'venueName',
    'venueParent',
  ],
  base: {
    header: {
      marginBottom: 'xl',
    },
    headerMain: { minWidth: '0' },
    eyebrow: {
      marginBottom: 'sm',
    },

    card: {
      _hover: {
        '& img': { filter: '[grayscale(0%) contrast(1)]', transform: 'scale(1.04)' },
        '& a': { color: 'action' },
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
        transition: 'develop',
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
      textStyle: 'featuredEvents.watermarkType',
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
      transition: 'interactive',
      _after: { content: '""', position: 'absolute', inset: '0', zIndex: '3' },
      _focusVisible: { color: 'action' },
    },
    venueName: {
      color: 'gray.300',
    },
    venueParent: {
      color: 'muted',
      _before: { content: '"↳ "' },
    },
  },
})
