/**
 * Gray ramp generated from ONE anchor (ZSB-70 palette rationalisation).
 *
 * The legacy palette had ~18 hand-picked grays (incl. 350/750/850 half-steps).
 * Measuring them in OKLCH showed a single systematic ramp: a magenta-leaning
 * hue (~345°) at very low chroma, varying only in lightness. So we regenerate
 * it from a fixed hue + chroma and step the L — preserving the brand's warm
 * tint while collapsing the source of truth to a handful of numbers.
 *
 * These are SOLID (not alpha) on purpose: grays sit on text over media
 * (scrims, galleries, Hero), where translucency would read through the image.
 * Alpha is reserved for adaptive solid-surface roles (dividers/overlays) later.
 */
const GRAY_HUE = 345
const GRAY_CHROMA = 0.005
const GRAY_L: Record<string, number> = {
  50: 97,
  100: 94.5,
  200: 90,
  300: 79,
  400: 69,
  500: 61,
  600: 52,
  700: 42,
  800: 32,
  900: 24,
  950: 15,
}
const grayRamp = Object.fromEntries(
  Object.entries(GRAY_L).map(([step, l]) => [
    step,
    { value: `oklch(${l}% ${GRAY_CHROMA} ${GRAY_HUE})` },
  ]),
)

export const conditions = {
  motionSafe: '@media (prefers-reduced-motion: no-preference)',
  motionReduce: '@media (prefers-reduced-motion: reduce)',
} as const

// Mirror the stepped breakpoints from globals.css (mobile-first).
export const breakpoints = {
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
  '3xl': '1536px',
  '4xl': '1792px',
} as const

export const keyframes = {
  // The one entrance reveal. Parameterized by CSS vars (`--enter-y` /
  // `--enter-scale` / `--enter-blur`) set by animation-style variants; built
  // from→to with `animation-fill-mode: both` so the element rests in its
  // visible final state and reduced-motion is just `animation: none`.
  // Folds in the former fadeSlideUp / fadeIn / dialogIn / cardIn /
  // imageReveal / cardReveal.
  enter: {
    from: {
      opacity: '0',
      translate: '0 var(--enter-y, 0px)',
      scale: 'var(--enter-scale, 1)',
      filter: 'blur(var(--enter-blur, 0px))',
    },
    to: { opacity: '1', translate: '0 0', scale: '1', filter: 'blur(0px)' },
  },
  // The diagonal sticky-tape entrance (translate x+y beneath a static
  // rotate). Kept distinct from `enter` — Hero/EditionTheme tapes need it.
  tapeIn: { to: { opacity: '1', translate: '0 0' } },
  // PartnerBadge's continuously-rotating text ring.
  spin: { to: { transform: 'rotate(-360deg)' } },
  // Carousel item's animated gradient hover border.
  gradientBorderShift: {
    '0%': { backgroundPosition: '0% 50%' },
    '100%': { backgroundPosition: '200% 50%' },
  },
  // Loading-skeleton sweep (edition loading bones + the shared skeleton).
  shimmer: {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
} as const

export const tokens = {
  colors: {
    gray: grayRamp,
    // Brand anchors, authored in OKLCH (measured from the legacy hexes).
    pink: { value: 'oklch(61.6% 0.2527 355)' },
    chartreuse: { value: 'oklch(87.9% 0.1981 115)' },
    // One true black. The former magenta-tinted `black` and the pure
    // `black` are merged here — every dark ground is the same `#000`.
    black: { value: 'oklch(0% 0 0)' },
    white: { value: '#fff' },
    // CSS keywords admitted as tokens: unstyling (button resets, ghost
    // fills) and inheriting glyph color are recurring, deliberate moves.
    transparent: { value: 'transparent' },
    current: { value: 'currentColor' },
  },
  fonts: {
    // Reference the next/font CSS variables already set on <html>.
    display: { value: 'var(--font-dela-gothic), sans-serif' },
    body: { value: 'var(--font-montserrat), sans-serif' },
  },
  // Static + already-fluid (clamp) scales port as plain tokens.
  // Stepped-responsive ones live in semanticTokens below.
  fontSizes: {
    md: { value: 'clamp(19px, 18.35px + 0.2038vw, 22px)' },
    lg: { value: 'clamp(22px, 21.35px + 0.2038vw, 25px)' },
    xl: { value: 'clamp(26px, 24.26px + 0.5435vw, 34px)' },
    '2xl': { value: 'clamp(32px, 28.96px + 0.9511vw, 46px)' },
    '3xl': { value: 'clamp(40px, 36.52px + 1.087vw, 56px)' },
    '4xl': { value: 'clamp(48px, 42.35px + 1.766vw, 74px)' },
    '5xl': { value: 'clamp(58px, 50.61px + 2.31vw, 92px)' },
  },
  spacing: {
    // `0` is a real member of the scale: overriding a larger breakpoint's
    // padding, pinning an overlay edge (`inset: '0'`), collapsing a gap.
    '0': { value: '0px' },
    xs: { value: '4px' },
    sm: { value: '8px' },
    lg: { value: 'clamp(24px, 18.78px + 1.6304vw, 48px)' },
    xl: { value: 'clamp(32px, 23.3px + 2.7174vw, 72px)' },
  },
  radii: {
    pill: { value: '100px' },
    circle: { value: '50%' },
  },
  borders: {
    // `none` as a token: buttons/fieldsets keep their UA border (preflight
    // is off), so stripping it is a deliberate, recurring act.
    none: { value: 'none' },
    hairline: {
      value: { width: '1px', style: 'solid', color: '{colors.divider}' },
    },
    highlight: {
      value: { width: '1px', style: 'solid', color: '{colors.chartreuse}' },
    },
    primary: {
      value: { width: '2px', style: 'solid', color: '{colors.action}' },
    },
    // The one focus ring (`outline: 'focus'` + an outlineOffset at the site).
    focus: {
      value: { width: '2px', style: 'solid', color: '{colors.chartreuse}' },
    },
  },
  sizes: {
    // Structural fractions/keywords, tokenized so `strictTokens` can hold
    // without bracket noise on every overlay and full-bleed frame.
    '0': { value: '0px' },
    full: { value: '100%' },
    fit: { value: 'fit-content' },
    // NB no `screen` size token: preset-base hardcodes `screen: 100vh` in its
    // height utilities, shadowing any theme token of that name. Fullscreen
    // shells use the preset's own `svh` value (100svh) instead.
    // Minimum comfortable touch target (WCAG 2.5.8-ish; the nav toggle).
    touch: { value: '48px' },
    // The comfortable prose measure (leads, FAQ bodies, link lists).
    measure: { value: '60ch' },
    // The site content rail (`.sectionInner` max-width).
    maxWidth: { value: '1800px' },
    brushStroke: { value: '3px' },
  },
  assets: {
    brushStrokeX: { value: 'polygon(0 0, 100% 0, 100% 38%, 68% 58%, 0 100%)' },
    brushStrokeY: { value: 'polygon(0 0, 100% 0, 58% 68%, 38% 100%, 0 100%)' },
  },
  lineHeights: {
    display: { value: '1' },
    heading: { value: '1.38' },
    tight: { value: '1.16' },
    body: { value: '1.56' },
    loose: { value: '1.9' },
  },
  letterSpacings: {
    tight: { value: '-0.02em' },
    subtle: { value: '0.6px' },
    label: { value: '1.2px' },
    wide: { value: '4px' },
  },
  fontWeights: {
    light: { value: '300' },
    regular: { value: '400' },
    medium: { value: '500' },
    semibold: { value: '600' },
    bold: { value: '700' },
    black: { value: '900' },
  },
  durations: {
    // Reduced-motion kill switch: `transitionDuration: 'instant'` under
    // `_motionReduce` ends a transition without re-declaring the shorthand.
    instant: { value: '0s' },
    stagger: { value: '60ms' },
    fast: { value: '200ms' },
    normal: { value: '300ms' },
    medium: { value: '400ms' },
    slow: { value: '500ms' },
    reveal: { value: '600ms' },
    // Slow entrances/reveals (the fadeSlideUp / tape / image-reveal family)
    // and the skeleton sweep — collapsed off the scattered 0.8–1.3s / 1.6–1.8s
    // literals. Continuous loops (spin/glow/etc.) keep their own literal speed.
    entrance: { value: '900ms' },
    sweep: { value: '1600ms' },
  },
  easings: {
    expo: { value: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    quint: { value: 'cubic-bezier(0.23, 1, 0.32, 1)' },
  },
  // Primitive shadows the audit found inlined (ad-hoc opacities): the
  // Card's faint lift, the Badge's pinned-paper elevation, and the one
  // floating-panel lift shared by the modal dialog + cookie banner.
  shadows: {
    card: { value: '0 2px 12px rgb(0 0 0 / 0.03)' },
    badge: { value: '0 1px 0 rgb(255 255 255 / 0.25) inset, 0 6px 16px rgb(0 0 0 / 0.25)' },
    modal: { value: '0 30px 80px rgb(0 0 0 / 0.5)' },
    // The hero frame's grounding lift — modal's geometry pulled tighter
    // (negative spread) and darker, sized for photography on black.
    frame: { value: '0 30px 80px -30px rgb(0 0 0 / 0.7)' },
    // The theme tape's pinned-paper elevation (badge's recipe, heavier hand).
    tape: {
      value: 'inset 0 1px 0 rgb(255 255 255 / 0.08), 0 14px 32px -6px rgb(0 0 0 / 0.55)',
    },
    // Legibility halo for type sitting directly on photography.
    text: { value: '0 1px 8px rgb(0 0 0 / 0.55)' },
  },
  gradients: {
    // The hero's photographic vignette. The near-black stops are the legacy
    // `canvas` color (#0E0B10, the brand's warm magenta tint) — kept ONLY
    // here, where it multiplies over imagery; every opaque dark ground is
    // `black` (ZSB-70).
    heroVignette: {
      value:
        'linear-gradient(115deg, rgb(14 11 16 / 0.55) 0%, rgb(14 11 16 / 0) 38%), radial-gradient(140% 90% at 50% 30%, transparent 55%, rgb(14 11 16 / 0.5) 100%)',
    },
  },
} as const

export const semanticTokens = {
  colors: {
    surface: {
      DEFAULT: { value: '{colors.black}' },
      scrim: { value: 'rgb(0 0 0 / 0.95)' },
    },
    heading: { value: '{colors.white}' },
    body: { value: '{colors.gray.400}' },
    muted: { value: '{colors.gray.600}' },
    divider: { value: '{colors.gray.900}' },
    action: { value: '{colors.pink}' },
    highlight: { value: '{colors.chartreuse}' },
    brushStroke: { value: '{colors.highlight}' },
  },
  zIndex: {
    // Global chrome stacking — semantic, page-wide.
    nav: { value: '100' },
    banner: { value: '200' },
    overlay: { value: '1000' },
    modal: { value: '1010' },
    navToggle: { value: '1011' },
    lightbox: { value: '1020' },
    draftBadge: { value: '1030' },
    // Local stacking inside an `isolation: isolate` (or positioned) subtree:
    // numeric by design — media base, scrim, content, floating accents.
    '0': { value: '0' },
    '1': { value: '1' },
    '2': { value: '2' },
    '3': { value: '3' },
    '4': { value: '4' },
    '10': { value: '10' },
  },
  // Stepped-responsive tokens: faithful to the :root media-query overrides.
  fontSizes: {
    base: { value: { base: '16px', lg: '15px', '4xl': '16px' } },
    '2xs': { value: { base: '8px', lg: '9px', '4xl': '10px' } },
    xs: { value: { base: '10px', lg: '11px' } },
    sm: { value: { base: '12px', '4xl': '13px' } },
  },
  sizes: {
    // Fixed-nav height — the page-top offset every hero clears.
    nav: { value: { base: '60px', md: '72px', lg: '84px', xl: '100px' } },
  },
  spacing: {
    md: { value: { base: '16px', md: '20px' } },
    // The vertical rhythm of a standard section (`--section-padding-y`).
    sectionY: { value: { base: '80px', md: '100px', '2xl': '120px' } },
    // Looser section rhythm for breathing-room sections (manifesto, About).
    sectionYLg: { value: { base: '100px', md: '160px', '2xl': '180px' } },
    // Shared grid gutter (`--grid-gap`).
    gridGap: {
      value: {
        base: '16px',
        md: '32px',
        lg: '48px',
        xl: '60px',
        '2xl': '66px',
        '3xl': '72px',
        '4xl': '84px',
      },
    },
    '3xl': {
      value: {
        base: '64px',
        md: '80px',
        lg: '96px',
        xl: '112px',
        '2xl': '120px',
        '3xl': '128px',
        '4xl': '144px',
      },
    },
    // The horizontal section gutter. Lives on the rail (`sectionInner`),
    // not the section shell, so full-bleed children can escape it.
    gutter: {
      value: {
        base: '16px',
        md: '40px',
        lg: '80px',
        '2xl': '88px',
        '3xl': '96px',
        '4xl': '112px',
      },
    },
    '2xl': {
      value: {
        base: '48px',
        md: '56px',
        lg: '64px',
        xl: '80px',
        '2xl': '88px',
        '3xl': '96px',
        '4xl': '112px',
      },
    },
    '4xl': {
      value: {
        base: '96px',
        md: '112px',
        lg: '128px',
        xl: '160px',
        '2xl': '176px',
        '3xl': '192px',
        '4xl': '224px',
      },
    },
  },
} as const

export const animationStyles = {
  enter: {
    DEFAULT: {
      value: {
        animationName: 'enter',
        animationDuration: 'entrance',
        animationTimingFunction: 'expo',
        animationFillMode: 'both',
        animationDelay: 'calc(var(--i, 0) * {durations.stagger})',
        '--enter-y': '30px',
        _motionReduce: { animation: 'none' },
      },
    },
    fade: {
      value: {
        animationName: 'enter',
        animationDuration: 'entrance',
        animationTimingFunction: 'expo',
        animationFillMode: 'both',
        '--enter-y': '0px',
        _motionReduce: { animation: 'none' },
      },
    },
    zoom: {
      value: {
        animationName: 'enter',
        animationDuration: 'entrance',
        animationTimingFunction: 'expo',
        animationFillMode: 'both',
        '--enter-y': '0px',
        '--enter-scale': '1.06',
        _motionReduce: { animation: 'none' },
      },
    },
    snappy: {
      value: {
        animationName: 'enter',
        animationDuration: 'normal',
        animationTimingFunction: 'expo',
        animationFillMode: 'both',
        '--enter-y': '30px',
        _motionReduce: { animation: 'none' },
      },
    },
  },
  spin: {
    value: {
      animationName: 'spin',
      animationDuration: '32s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
      _motionReduce: { animationPlayState: 'paused' },
    },
  },
  shimmer: {
    value: {
      animationName: 'shimmer',
      animationDuration: 'sweep',
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: 'infinite',
      _motionReduce: { animation: 'none' },
    },
  },
  gradientBorder: {
    value: {
      animationName: 'gradientBorderShift',
      animationDuration: '2s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
      _motionReduce: { animation: 'none' },
    },
  },
  tape: {
    value: {
      animationName: 'tapeIn',
      animationDuration: 'entrance',
      animationTimingFunction: 'expo',
      animationFillMode: 'forwards',
      animationDelay: 'var(--tape-delay, 0s)',
      _motionReduce: { animation: 'none' },
    },
  },
} as const

// Typography utilities. Pure type — margins / max-width belong at the call
// site. Tag/kicker treatments are NOT here: they are the Badge / Eyebrow
// recipes.
export const textStyles = {
  sectionTitle: {
    value: {
      fontFamily: 'display',
      fontSize: { base: 'xl', md: '2xl' },
      lineHeight: 'display',
      textTransform: 'uppercase',
    },
  },
  // textStyles are typography-only — the entrance animation (the legacy
  // `.pageTitle` `fadeSlideUp`) is applied at the call site via
  // `css({ animation: 'fadeSlideUp 1s {easings.expo} 0.2s both' })`.
  pageTitle: {
    value: {
      fontFamily: 'display',
      fontSize: 'clamp(40px, 4.75vw, 100px)',
      lineHeight: '1',
      textTransform: 'uppercase',
    },
  },
  cardTitle: {
    value: {
      fontFamily: 'display',
      fontSize: 'xl',
      lineHeight: 'heading',
      letterSpacing: 'tight',
      textTransform: 'uppercase',
    },
  },
  labelDisplay: {
    value: {
      fontFamily: 'display',
      textTransform: 'uppercase',
      lineHeight: 'tight',
      letterSpacing: 'tight',
    },
  },
  metaLabel: {
    value: {
      fontFamily: 'body',
      fontSize: '2xs',
      textTransform: 'uppercase',
      letterSpacing: 'label',
      fontWeight: 'semibold',
      color: 'muted',
    },
  },
  lead: {
    value: {
      fontFamily: 'body',
      fontSize: 'base',
      lineHeight: 'body',
      textWrap: 'pretty',
    },
  },
  // The homepage hero's larger, lighter intro — the one place a lead is
  // emphasised over the canonical `lead` role.
  leadLarge: {
    value: {
      fontFamily: 'body',
      fontSize: 'md',
      fontWeight: 'light',
      lineHeight: 'body',
      textWrap: 'pretty',
    },
  },
  prose: {
    value: { fontFamily: 'body', fontSize: 'base', lineHeight: 'body', color: 'body' },
  },
} as const

// Page-shell layout as layerStyles. The section *shell* (vertical rhythm
// + ground) is now the `section` recipe; `sectionInner` is the content
// rail — it owns the horizontal gutter, so full-bleed children placed
// outside the rail span the shell. `pageHero` defers its gutter to the
// rail too (its inner is a `sectionInner`).
export const layerStyles = {
  sectionInner: {
    value: { maxWidth: 'maxWidth', marginInline: 'auto', paddingInline: 'gutter' },
  },
  coverMono: {
    value: {
      objectFit: 'cover',
      filter: '[grayscale(100%) contrast(1.05)]',
    },
  },
  pageHero: {
    value: {
      background: 'black',
      color: 'white',
      paddingTop: {
        base: 'calc(token(sizes.nav) + 80px)',
        md: 'calc(token(sizes.nav) + 120px)',
      },
      paddingBottom: { base: '2xl', md: '3xl' },
    },
  },
  // The one loading-placeholder surface: gray.800 base with the `shimmer`
  // sweep riding on `::after`. Shared by the image skeleton (`css()` helper
  // positions it absolutely) and the edition-loading bones.
  skeleton: {
    value: {
      position: 'relative',
      background: 'gray.800',
      overflow: 'hidden',
      _after: {
        content: '""',
        position: 'absolute',
        inset: '0',
        background:
          'linear-gradient(90deg, transparent 0%, rgb(255 255 255 / 0.06) 50%, transparent 100%)',
        animationStyle: 'shimmer',
      },
    },
  },
  // The hairline-gradient hover ring (Calendar runs + gallery tiles): paint
  // the action→highlight sweep, then mask everything except the padding ring
  // (content-box XOR). Applied on a `::before`; the call site supplies
  // `content`, the ring width (padding), its transition, and the hover that
  // lifts `opacity` + starts `animationStyle: 'gradientBorder'`.
  gradientBorder: {
    value: {
      position: 'absolute',
      inset: '0',
      background:
        'linear-gradient(90deg, token(colors.action) 0%, token(colors.highlight) 50%, token(colors.action) 100%)',
      backgroundSize: '200% 100%',
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
      opacity: '0',
      zIndex: '2',
      pointerEvents: 'none',
    },
  },
  // NB layerStyles carry the surface look only — positioning/stacking beyond
  // the mechanism itself stays at the call site.
} as const
