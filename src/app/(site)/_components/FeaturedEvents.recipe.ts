import { sva } from 'styled-system/css'

export const featuredEvents = sva({
  slots: [
    'header',
    'card',
    'frame',
    'noPoster',
    'scrim',
    'caption',
    'when',
    'name',
    'cardLink',
    'venueName',
  ],
  base: {
    header: {
      marginBottom: 'xl',
    },

    card: {
      _hover: {
        '& img': { filter: '[token(assets.monoHover)]', transform: 'scale(1.04)' },
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
        filter: '[token(assets.mono)]',
        transition: 'develop',
      },
    },
    noPoster: {
      background: '[linear-gradient(150deg, token(colors.gray.900), token(colors.surface) 70%)]',
    },

    scrim: {
      position: 'absolute',
      inset: '0',
      zIndex: '1',
      background:
        '[linear-gradient(to top, token(colors.surface) 2%, color-mix(in srgb, token(colors.surface) 72%, transparent) 26%, transparent 58%)]',
      pointerEvents: 'none',
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
  },
})
