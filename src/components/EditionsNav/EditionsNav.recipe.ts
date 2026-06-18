import { sva } from 'styled-system/css'

/**
 * EditionsNav — co-located slot recipe.
 *
 * The full-bleed pure-black editions strip above the footer. Cards are the
 * unified `card` recipe (chrome + accent-warming hover); this adds only the
 * strip-local bits — scroll-snap sizing/registration, the staggered entrance
 * (driven by the band's `data-revealed` + per-card `--i` delay), and the
 * per-state colour shifts keyed off `data-current` / `data-upcoming`. The
 * viewport/track come from the shared `strip` recipe. Co-located slots land in
 * the `utilities` layer, so `&[data-current=true]` cleanly overrides the card
 * recipe's borderDark hairline. `soon`/`viewing` stay bespoke boxed labels (matching
 * the footer's catalogue-stamp precedent).
 */
export const editionsNav = sva({
  slots: ['band', 'card', 'cardTop', 'soon', 'viewing', 'meta', 'year', 'theme'],
  base: {
    band: {
      background: 'black',
      color: 'white',
      paddingBlock: 'xl',
      paddingInline: 'gutter',
      overflow: 'clip',
    },

    // The unified `card` owns the chrome; this adds the strip-local sizing +
    // entrance. The border-color leg keeps the recipe's hairline-warming hover
    // smooth (this unlayered transition would otherwise clobber it).
    card: {
      flex: '0 0 auto',
      width: '78vw',
      minHeight: '208px',
      padding: 'lg',
      scrollSnapAlign: 'start',
      opacity: '0',
      transform: 'translateY(16px)',
      transition:
        'opacity {durations.reveal} {easings.expo} calc(var(--i, 0) * 60ms), transform {durations.reveal} {easings.expo} calc(var(--i, 0) * 60ms), border-color {durations.medium} {easings.expo}',
      md: { width: 'clamp(300px, 34vw, 448px)' },
      _focusVisible: { outline: '2px solid token(colors.highlight)', outlineOffset: '-2px' },
      '[data-revealed=true] &': { opacity: '1', transform: 'translateY(0)' },
      // Current edition: persistent chartreuse hairline, inert.
      '&[data-current=true]': { cursor: 'default', borderColor: 'highlight' },
      '&[data-upcoming]': { cursor: 'default' },
      _motionReduce: {
        opacity: '1',
        transform: 'none',
        transition: 'none',
      },
    },

    cardTop: {
      display: 'flex',
      alignItems: 'flex-start',
      minHeight: '22px',
      marginBottom: 'md',
    },
    soon: {
      fontFamily: 'body',
      fontSize: '2xs',
      fontWeight: 'semibold',
      lineHeight: '1',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      paddingBlock: '4px',
      paddingInline: '8px',
      borderWidth: '1px',
      borderStyle: 'solid',
      // Boxed like the footer's catalogue stamp.
      color: 'gray.600',
      borderColor: 'gray.800',
    },
    viewing: {
      fontFamily: 'body',
      fontSize: '2xs',
      fontWeight: 'semibold',
      lineHeight: '1',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      paddingBlock: '4px',
      paddingInline: '8px',
      borderWidth: '1px',
      borderStyle: 'solid',
      // Chartreuse outline, like the Calendar's type chips.
      color: 'highlight',
      borderColor: 'highlightFaint',
    },

    meta: { marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' },
    year: {
      fontFamily: 'display',
      fontSize: '2xl',
      lineHeight: 'display',
      letterSpacing: 'tight',
      whiteSpace: 'nowrap',
      color: 'white',
      transition: 'color {durations.fast} {easings.quint}',
      '[data-current=true] &': { color: 'highlight' },
      '[data-upcoming] &': { color: 'gray.600' },
      // Live, non-current card hover (upcoming cards are <div>, excluded by `a`).
      '@media (hover: hover)': {
        'a:not([data-current=true]):hover &': { color: 'action' },
      },
      _motionReduce: { transition: 'none' },
    },
    theme: {
      fontFamily: 'body',
      fontSize: 'xs',
      fontWeight: 'semibold',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      overflowWrap: 'anywhere',
      color: 'muted',
      transition: 'color {durations.fast} {easings.quint}',
      '[data-upcoming] &': { color: 'gray.700' },
      '@media (hover: hover)': {
        'a:not([data-current=true]):hover &': { color: 'gray.100' },
      },
      _motionReduce: { transition: 'none' },
    },
  },
})
