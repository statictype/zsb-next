import { sva } from 'styled-system/css'

/**
 * Rail plate chrome. The plate is just the theme tape — the year/status
 * badges are stamped inside the band through EditionTheme's `lead` slot, so
 * this recipe only shells the tape with link focus and state styling.
 * `status` is a real recipe variant so state styling lives next to the state
 * model in EditionRailCard, not behind data-attrs.
 */
export const editionRailCard = sva({
  slots: ['root', 'tape'],
  base: {
    root: {
      display: 'inline-flex',
      height: '100%',
      minHeight: '0',
      padding: '0',
      overflow: 'visible',
      _focusVisible: { outline: '2px solid token(colors.action)', outlineOffset: '4px' },
    },
    // The plate is as wide as its content — badges, theme, paddings — always
    // on one line; the carousel drags to reveal plates wider than the screen.
    tape: {
      whiteSpace: 'nowrap',
      // Air between the brush-stroke rule and the stamped row.
      paddingTop: '0.8em',
    },
  },
  variants: {
    status: {
      live: {},
      current: {
        root: { cursor: 'default' },
      },
      upcoming: {
        root: {
          cursor: 'default',
          opacity: '0.58',
          filter: 'grayscale(1)',
          '& h2': { color: 'muted' },
          '& .badge': {
            background: 'gray.900',
            borderColor: 'gray.700',
            color: 'gray.400',
            boxShadow: 'none',
          },
        },
      },
    },
  },
  defaultVariants: { status: 'live' },
})
