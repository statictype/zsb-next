import { sva } from 'styled-system/css'

/**
 * Editions list page — co-located slot recipe.
 *
 * A grid of edition cards on the unified `card` recipe (chrome + hover-lift);
 * the latest edition is the full-width "feature" card. The feature treatment is
 * keyed off a `data-feature` attribute on the entrance wrapper so the frame /
 * theme overrides reach across slots without a brittle class reference. The
 * `.yearTag` pill → `<Badge>`; the card-image filter inlines the former
 * `--card-image-filter` stepped var (this was its last consumer). Hover/focus
 * effects drive from the card `<a>` via `a:hover &` / `a:focus-visible &`.
 */
export const editionsPage = sva({
  slots: [
    'inner',
    'list',
    'grid',
    'slot',
    'card',
    'frame',
    'thumbImg',
    'yearTag',
    'meta',
    'theme',
    'themeHighlight',
    'metaFoot',
    'subline',
    'sublineDot',
    'cta',
  ],
  base: {
    inner: { layerStyle: 'sectionInner' },
    list: {
      layerStyle: 'sectionDark',
      paddingBlock: 'sectionY',
      paddingInline: 'content',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2xl',
      width: '100%',
      lg: { gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 'gridGap', rowGap: '2xl' },
    },

    // Entrance wrapper — the reveal is composed here (`enter()` on the element)
    // so it never fights the Card's own hover-lift transform. `data-feature`
    // promotes the latest edition card.
    slot: {
      // The blur+rise reveal is the shared `enter({ soft: true })` (composed on
      // the element); only the per-card stagger delay stays here.
      animationDelay: 'calc(var(--card-index, 0) * 120ms + 120ms)',
      lg: { '&[data-feature]': { gridColumn: '1 / -1' } },
    },
    card: {
      height: '100%',
      _focusVisible: { outline: '2px solid token(colors.action)', outlineOffset: '4px' },
    },

    frame: {
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      aspectRatio: '4 / 3',
      background: 'gray.900',
      md: { aspectRatio: '16 / 10' },
      lg: { '[data-feature] &': { aspectRatio: '21 / 9' } },
      // Cinematic gradient: anchors the year tag and deepens the base.
      _after: {
        content: '""',
        position: 'absolute',
        inset: '0',
        background:
          'linear-gradient(180deg, rgba(14, 11, 16, 0.5) 0%, rgba(14, 11, 16, 0) 25%, rgba(14, 11, 16, 0) 70%, rgba(14, 11, 16, 0.55) 100%)',
        pointerEvents: 'none',
        zIndex: '1',
      },
    },
    thumbImg: {
      objectFit: 'cover',
      background: 'gray.900',
      filter: 'grayscale(100%) brightness(0.7)',
      transform: 'scale(1.01)',
      transition:
        'filter {durations.reveal} {easings.expo}, transform {durations.entrance} {easings.expo}',
      willChange: 'transform, filter',
      'a:hover &, a:focus-visible &': {
        filter: 'grayscale(30%) brightness(1)',
        transform: 'scale(1.05)',
      },
    },
    // Floating pill over the thumbnail; the pill look comes from <Badge>.
    yearTag: { position: 'absolute', top: 'md', left: 'md', zIndex: '2' },

    meta: {
      position: 'relative',
      zIndex: '1',
      display: 'flex',
      flexDirection: 'column',
      gap: 'lg',
      // Pull the meta up so the theme tape straddles the image's lower edge.
      marginTop: '-3rem',
      paddingTop: '0',
      paddingRight: 'lg',
      paddingBottom: 'lg',
      paddingLeft: 'md',
    },
    // The hero "theme tape" ported in: black tape, chartreuse top rule.
    theme: {
      position: 'relative',
      alignSelf: 'flex-start',
      maxWidth: '100%',
      fontFamily: 'display',
      fontSize: { base: 'xl', md: '3xl', lg: 'xl', xl: '2xl', '4xl': '3xl' },
      lineHeight: '1',
      letterSpacing: 'tight',
      color: 'white',
      background: 'black',
      paddingTop: '10px',
      paddingInline: '16px',
      paddingBottom: '12px',
      rotate: '-0.4deg',
      transformOrigin: 'top left',
      boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      textTransform: 'lowercase',
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
      lg: { '[data-feature] &': { fontSize: '3xl' } },
      xl: { '[data-feature] &': { fontSize: '4xl' } },
    },
    // Only the highlight substring warms to pink on card hover (white at rest).
    themeHighlight: {
      color: 'inherit',
      transition: 'color {durations.medium} {easings.expo}',
      'a:hover &': { color: 'action' },
    },

    metaFoot: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'md',
    },
    subline: {
      display: 'flex',
      flex: '1 1 auto',
      minWidth: '0',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 'sm',
      fontFamily: 'body',
      fontSize: '2xs',
      fontWeight: 'semibold',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      color: 'muted',
      transition: 'color {durations.medium} {easings.expo}',
      'a:hover &': { color: 'body' },
    },
    sublineDot: {
      width: '3px',
      height: '3px',
      borderRadius: 'circle',
      background: 'currentColor',
      display: 'inline-block',
      opacity: '0.6',
    },
    // Resting-pink text link; the arrow nudges on card hover.
    cta: {
      flexShrink: '0',
      color: 'action',
      fontFamily: 'body',
      fontSize: '2xs',
      fontWeight: 'semibold',
      textTransform: 'uppercase',
      letterSpacing: 'wide',
    },
  },
})
