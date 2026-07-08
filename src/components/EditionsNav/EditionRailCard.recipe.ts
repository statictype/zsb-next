import { sva } from 'styled-system/css'

/**
 * Rail plate chrome. The plate is just the theme tape — the year/status
 * badges are stamped inside the band through EditionTheme's `lead` slot, so
 * this recipe only shells the tape with link focus and state styling.
 * `status` is a real recipe variant so state styling lives next to the state
 * model in EditionRailCard, not behind data-attrs.
 */
export const editionRailCard = sva({
  slots: ['root', 'tape', 'badgeMuted'],
  base: {
    root: {
      display: 'inline-flex',
      height: 'full',
      minHeight: '0',
      padding: '0',
      overflow: 'visible',
      _focusVisible: { outline: 'focus', outlineOffset: 'xs' },
    },
    // The plate is as wide as its content — badges, theme, paddings — always
    // on one line; the carousel drags to reveal plates wider than the screen.
    // Font-size ladder + padding treatment live on EditionTheme's own `rail`
    // size variant now, not overridden here.
    tape: { whiteSpace: 'nowrap' },
    // Applied via `className` to the lead badges when `status="upcoming"` —
    // an opt-in override through Badge's own prop, not a `.badge` selector
    // guessing at its rendered class from outside.
    badgeMuted: {
      background: 'gray.900',
      borderColor: 'gray.700',
      color: 'gray.400',
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
          // No shared "disabled/muted" opacity convention exists across the
          // codebase yet (button/carousel/checkbox each pick their own) —
          // adding an `opacity` token scale here would make Panda's opacity
          // utility strict repo-wide, not just for this call site. Left raw
          // pending that broader migration.
          cursor: 'default',
          opacity: '0.58',
          filter: '[token(assets.grayscaleFull)]',
        },
      },
    },
  },
  defaultVariants: { status: 'live' },
})
