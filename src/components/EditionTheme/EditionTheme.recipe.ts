import { sva } from 'styled-system/css'

/**
 * EditionTheme — the canonical "theme tape".
 *
 * One normalized tape, the edition-hero tape being the truth: lowercase display
 * type on a black tape, rotated −0.45°, inset + float drop-shadow, a shared
 * chartreuse brush-stroke top rule, and the `tapeIn` entrance on every instance. Padding is
 * `em`-based so it scales with the font size. `size` is a named ladder (the
 * three real needs — huge hero / large featured / normal card) rather than a
 * free fontSize prop, because Panda must extract the responsive values
 * statically. `interactive` drives the highlight behavior: static at rest (the
 * edition hero/current nav — rest color picked by `accent`) vs white-at-rest →
 * `action` on `a:hover` (cards/nav).
 * The entrance delay is the `delay` prop; only container positioning (the hero's
 * nav tuck) rides the caller's `className`.
 */
export const editionTheme = sva({
  slots: ['root', 'heading', 'lead', 'meta', 'highlight'],
  base: {
    // The band — a div, not the heading itself, so the optional meta row can
    // share the tape's ground without entering the heading's accessible name.
    // All type is set here and inherits into the heading.
    root: {
      position: 'relative',
      display: 'inline-flex',
      flexDirection: 'column',
      alignSelf: 'flex-start',
      fontFamily: 'display',
      lineHeight: '1',
      letterSpacing: 'tight',
      color: 'heading',
      background: 'surface',
      // em-derived so padding tracks the font size across the ladder.
      padding: '0.45em 0.6em',
      marginBlock: '2px',
      rotate: '-0.45deg',
      transformOrigin: 'top left',
      boxShadow: 'tape',
      textTransform: 'lowercase',
      // The tape entrance — on every instance.
      opacity: '0',
      translate: '-12px 18px',
      animationStyle: 'tape',
      _before: {
        content: '""',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: 'brushStroke',
        background:
          'linear-gradient(90deg, token(colors.brushStroke) 0%, token(colors.brushStroke) 72%, transparent 100%)',
        clipPath: 'token(assets.brushStrokeX)',
        opacity: '0.85',
      },
      _motionReduce: {
        animation: 'none',
        opacity: '1',
        translate: '0 0',
      },
    },
    // The heading row: lead + theme text, laid out exactly like the old
    // single-element tape (type inherits from root). `fontSize: inherit`
    // kills the UA's h1/h2 scale factor — the ladder lives on root.
    heading: {
      display: 'flex',
      alignItems: 'baseline',
      margin: '0',
      fontSize: 'inherit',
    },
    // The stamped lead (rail badges): vertically centered in the band, with an
    // em gap so it tracks the tape's font-size ladder.
    lead: {
      display: 'inline-flex',
      alignItems: 'center',
      alignSelf: 'center',
      gap: '2xs',
      marginRight: '0.6em',
    },
    // The meta line (edition hero's date/venue): a second row inside the
    // band, so it shares the tape's ground and text inset by construction.
    // Absolute type — card-meta scale, not the tape ladder.
    meta: {
      margin: '0',
      marginTop: 'md',
      fontFamily: 'body',
      fontSize: 'sm',
      lineHeight: '1.3',
      fontWeight: 'regular',
      letterSpacing: 'subtle',
      textTransform: 'none',
      color: 'body',
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
      // Static: the accent color at rest (see `accent`).
      false: {},
      // Interactive: white at rest, accent on the card/link hover.
      true: { highlight: { color: 'inherit', 'a:hover &': { color: 'action' } } },
    },
    // Rest color of a static highlight: chartreuse marks active/current
    // elements (rail current card), pink is decorative accent (edition hero).
    // Ignored when `interactive` — hover color there is always `action`.
    accent: {
      highlight: {},
      action: {},
    },
  },
  compoundVariants: [
    { interactive: false, accent: 'highlight', css: { highlight: { color: 'highlight' } } },
    { interactive: false, accent: 'action', css: { highlight: { color: 'action' } } },
  ],
  defaultVariants: { size: 'normal', interactive: false, accent: 'highlight' },
})
