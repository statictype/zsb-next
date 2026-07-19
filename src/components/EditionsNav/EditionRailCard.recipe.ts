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
      height: 'full',
      minHeight: '0',
      padding: '0',
      overflow: 'visible',
    },
    // The plate is as wide as its content — badges, theme, paddings — always
    // on one line; the carousel drags to reveal plates wider than the screen.
    // Font-size ladder + padding treatment live on EditionTheme's own `rail`
    // size variant now, not overridden here.
    tape: { whiteSpace: 'nowrap' },
  },
  variants: {
    status: {
      live: {},
      current: {
        root: { cursor: 'default' },
      },
      announced: {
        root: {
          // Left raw: adding an `opacity` token scale would make Panda's
          // opacity utility strict repo-wide, for every existing raw opacity
          // literal in every recipe, not just this call site.
          cursor: 'default',
          opacity: '0.58',
          filter: '[token(assets.grayscaleFull)]',
        },
      },
    },
  },
  defaultVariants: { status: 'live' },
})
