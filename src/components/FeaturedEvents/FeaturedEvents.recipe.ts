import { sva } from 'styled-system/css'

/**
 * FeaturedEvents — co-located slot recipe.
 *
 * The homepage spotlight (ZSB-31): must-see events pinned up as poster cards on
 * the same dark, image-forward palette as the calendar. The unified Card recipe
 * owns the hairline chrome; `frame` only sets the poster's portrait shape + the
 * skeleton base behind a loading image. The gallery image filter (desaturate at
 * rest → full colour on hover) is inlined here.
 * The card-wide hover (image zoom/desaturate + name → accent) drives from the
 * `card` slot targeting `& img` / `& a`; the name link's `::after` stretches the
 * hit target across the whole poster.
 */
export const featuredEvents = sva({
  slots: [
    'section',
    'inner',
    'header',
    'headerMain',
    'eyebrow',
    'title',
    'calendarLink',
    'grid',
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
    'venue',
    'venueName',
    'venueParent',
    'chips',
    'chip',
  ],
  base: {
    section: { layerStyle: 'section', background: 'blackPure', color: 'white' },
    inner: { layerStyle: 'sectionInner' },

    header: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 'md',
      marginBottom: 'xl',
    },
    headerMain: { minWidth: '0' },
    eyebrow: {
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'wide',
      fontWeight: 'semibold',
      color: 'highlight',
      marginBottom: 'sm',
    },
    title: { textStyle: 'sectionTitle', marginBottom: 0 },
    calendarLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      flexShrink: '0',
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontWeight: 'semibold',
      color: 'white',
      textDecoration: 'none',
      paddingBottom: '4px',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'gray.700',
      transition:
        'color {durations.fast} {easings.quint}, border-color {durations.fast} {easings.quint}, gap {durations.normal} {easings.expo}',
      _hover: { color: 'action', borderColor: 'action', gap: '14px' },
      _focusVisible: { outline: '2px solid token(colors.highlight)', outlineOffset: '3px' },
    },

    grid: {
      listStyle: 'none',
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 'gridGap',
      md: { gridTemplateColumns: 'repeat(2, 1fr)' },
      lg: { gridTemplateColumns: 'repeat(3, 1fr)' },
    },

    card: {
      opacity: '0',
      // staggered reveal — each card waits a beat longer than the last (--i)
      animation: 'cardIn {durations.medium} {easings.expo} forwards',
      animationDelay: 'calc(var(--i, 0) * 90ms)',
      _hover: {
        '& img': { filter: 'grayscale(0%) contrast(1)', transform: 'scale(1.04)' },
        '& a': { color: 'action' },
      },
      '@media (prefers-reduced-motion: reduce)': {
        opacity: '1',
        animation: 'none',
        '& img': { transition: 'none', transform: 'none' },
      },
    },

    // The poster frame: a portrait stage the image fills. Card owns the chrome
    // (border, position/overflow/isolation); this sets shape + skeleton base.
    frame: {
      aspectRatio: '4 / 5',
      background: 'gray.800',
      '& img': {
        objectFit: 'cover',
        filter: 'grayscale(100%) contrast(1.1)',
        transition:
          'filter {durations.medium} {easings.quint}, transform {durations.medium} {easings.quint}',
      },
    },
    // Image-less card: a tonal stage for the vast faded day numeral.
    noPoster: {
      background: 'linear-gradient(150deg, {colors.gray.900}, {colors.blackPure} 70%)',
    },

    watermark: {
      position: 'absolute',
      top: '-0.18em',
      right: '0.04em',
      fontFamily: 'display',
      fontSize: 'clamp(120px, 32vw, 260px)',
      lineHeight: '1',
      color: 'white',
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
        'linear-gradient(to top, {colors.blackPure} 2%, color-mix(in srgb, {colors.blackPure} 72%, transparent) 26%, transparent 58%)',
      pointerEvents: 'none',
    },
    stamp: {
      position: 'absolute',
      top: 'md',
      right: 'md',
      zIndex: '2',
      fontFamily: 'display',
      fontSize: 'sm',
      color: 'white',
      fontVariantNumeric: 'tabular-nums',
      opacity: '0.85',
      textShadow: '0 1px 8px rgba(0, 0, 0, 0.55)',
    },

    caption: {
      position: 'absolute',
      inset: 'auto 0 0 0',
      zIndex: '2',
      display: 'flex',
      flexDirection: 'column',
      gap: 'sm',
      padding: 'lg',
    },
    when: {
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontWeight: 'semibold',
      color: 'highlight',
    },
    name: {
      textStyle: 'cardTitle',
      // Event names are sentence-case, not the uppercase default.
      textTransform: 'none',
      color: 'white',
    },
    // Links to the event route; inherits the heading type. Its ::after stretches
    // the hit target over the whole frame.
    cardLink: {
      font: 'inherit',
      color: 'inherit',
      textDecoration: 'none',
      transition: 'color {durations.fast} {easings.quint}',
      _after: { content: '""', position: 'absolute', inset: '0', zIndex: '3' },
      _focusVisible: {
        color: 'action',
        outline: '2px solid token(colors.highlight)',
        outlineOffset: '3px',
      },
    },
    venue: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '8px',
      fontFamily: 'body',
      fontSize: 'sm',
    },
    venueName: {
      color: 'gray.300',
      textTransform: 'uppercase',
      letterSpacing: 'subtle',
      fontWeight: 'medium',
    },
    venueParent: {
      color: 'muted',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontSize: '2xs',
      _before: { content: '"↳ "' },
    },
    chips: {
      listStyle: 'none',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      marginTop: '2px',
    },
    chip: {
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontWeight: 'semibold',
      color: 'highlight',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'highlightFaint',
      paddingBlock: '3px',
      paddingInline: '9px',
      lineHeight: '1.4',
      // a touch of backdrop so chips hold up over a bright patch of poster
      background: 'color-mix(in srgb, {colors.blackPure} 35%, transparent)',
    },
  },
})
