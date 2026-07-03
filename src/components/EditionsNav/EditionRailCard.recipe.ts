import { sva } from 'styled-system/css'

/**
 * Rail plate chrome: the theme tape with the year/status badges tucked into
 * its lead-in padding. `status` is a real recipe variant so state styling
 * lives next to the state model in EditionRailCard, not behind data-attrs.
 */
export const editionRailCard = sva({
  slots: ['root', 'tape', 'badgeStack'],
  base: {
    root: {
      position: 'relative',
      display: 'inline-flex',
      height: '100%',
      minHeight: '0',
      minWidth: '0',
      padding: '0',
      overflow: 'visible',
      _focusVisible: { outline: '2px solid token(colors.action)', outlineOffset: '4px' },
    },
    tape: {
      paddingLeft: '6.25rem',
      maxWidth: '100%',
    },
    badgeStack: {
      position: 'absolute',
      top: '50%',
      left: '0.6em',
      zIndex: '2',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '2xs',
      transform: 'translateY(-50%)',
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
