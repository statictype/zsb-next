import { sva } from 'styled-system/css'

/**
 * EditionTheme — the canonical "theme tape".
 *
 * One normalized tape, the edition-hero tape being the truth: lowercase display
 * type on a black tape, rotated −0.45°, inset + float drop-shadow, a 3px
 * chartreuse top rule, and the `tapeIn` entrance on every instance. Padding is
 * `em`-based so it scales with the font size. `size` is a named ladder (the
 * three real needs — huge hero / large featured / normal card) rather than a
 * free fontSize prop, because Panda must extract the responsive values
 * statically. `interactive` drives the highlight accent: static `action` at
 * rest (the edition hero) vs white-at-rest → `action` on `a:hover` (cards/nav).
 * The entrance delay is the `delay` prop; only container positioning (the hero's
 * nav tuck) rides the caller's `className`.
 */
export const editionTheme = sva({
  slots: ['root', 'highlight'],
  base: {
    root: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'baseline',
      alignSelf: 'flex-start',
      fontFamily: 'display',
      lineHeight: '1',
      letterSpacing: 'tight',
      color: 'heading',
      background: 'canvas',
      // em-derived so padding tracks the font size across the ladder.
      padding: '0.45em 0.6em',
      marginBlock: '2px',
      rotate: '-0.45deg',
      transformOrigin: 'top left',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 14px 32px -6px rgba(0, 0, 0, 0.55)',
      textTransform: 'lowercase',
      // The tape entrance — on every instance.
      opacity: '0',
      translate: '-12px 18px',
      animation: 'tapeIn {durations.entrance} {easings.expo} forwards',
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
      _motionReduce: {
        animation: 'none',
        opacity: '1',
        translate: '0 0',
      },
    },
    highlight: { transition: 'color {durations.medium} {easings.expo}' },
  },
  variants: {
    size: {
      // `huge` is the edition hero — the tape sizes to its text so the black
      // ground always covers it, even for long single-token themes. `large` /
      // `normal` render inside constrained list/featured cards, so they cap at
      // the card width.
      huge: { root: { fontSize: { base: 'xl', md: '3xl', lg: '4xl', xl: '5xl' } } },
      large: {
        root: { maxWidth: '100%', fontSize: { base: 'xl', md: '3xl', lg: '3xl', xl: '4xl' } },
      },
      normal: {
        root: {
          maxWidth: '100%',
          fontSize: { base: 'xl', md: '3xl', lg: 'xl', xl: '2xl', '4xl': '3xl' },
        },
      },
    },
    interactive: {
      // Static: the highlight is the accent at rest (the edition hero).
      false: { highlight: { color: 'action' } },
      // Interactive: white at rest, accent on the card/link hover.
      true: { highlight: { color: 'inherit', 'a:hover &': { color: 'action' } } },
    },
  },
  defaultVariants: { size: 'normal', interactive: false },
})
