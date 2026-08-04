import { sva } from 'styled-system/css'

/**
 * EditionTheme — the edition theme set as type, used on the edition hero, the
 * archive cards and the editions rail.
 *
 * `size` is a named ladder (huge hero / large featured / normal card / rail
 * plate / sub, under a title that leads) rather than a free fontSize prop,
 * because Panda must extract the
 * responsive values statically. `interactive` drives the highlight behavior:
 * static at rest (the edition hero/current nav — rest color picked by `accent`)
 * vs white-at-rest → `action` on `a:hover` (cards/nav).
 */
export const editionTheme = sva({
  slots: ['heading', 'lead', 'highlight'],
  base: {
    // Gapless flex: the split-on-highlight spans must read as one word
    // (#digitalfield, not "#digital field").
    heading: {
      display: 'flex',
      alignItems: 'baseline',
      margin: '0',
      color: 'heading',
    },
    lead: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'xs',
      alignSelf: 'center',
      marginRight: '[0.6em]',
    },
    highlight: {
      transition: 'interactive',
    },
  },
  variants: {
    size: {
      huge: { heading: { textStyle: 'editionTheme.huge' } },
      // `large` / `normal` / `rail` render inside constrained list/featured
      // cards, so they cap at the card width.
      large: {
        heading: { maxWidth: 'full', textStyle: 'editionTheme.large' },
      },
      normal: {
        heading: { maxWidth: 'full', textStyle: 'editionTheme.normal' },
      },
      rail: {
        heading: { maxWidth: 'full', textStyle: 'editionTheme.rail' },
      },
      sub: {
        heading: { maxWidth: 'full', textStyle: 'editionTheme.sub' },
      },
    },
    interactive: {
      // Static: the accent color at rest (see `accent`).
      false: {},
      // Interactive: white at rest, accent on the card/link hover.
      true: { highlight: { 'a:hover &, a:focus-visible &': { color: 'action' } } },
    },
    // Ignored when `interactive` — hover color there is always `action`.
    accent: {
      highlight: {},
      action: {},
    },
    // De-emphasizes the whole heading (lead + theme text) — the rail's
    // "announced" plate. Separate from `accent`/`interactive`, which only ever
    // affect the highlight span.
    muted: {
      true: { heading: { color: 'muted' } },
      false: {},
    },
  },
  compoundVariants: [
    { interactive: false, accent: 'highlight', css: { highlight: { color: 'highlight' } } },
    { interactive: false, accent: 'action', css: { highlight: { color: 'action' } } },
  ],
  defaultVariants: { size: 'normal', interactive: false, accent: 'highlight', muted: false },
})
