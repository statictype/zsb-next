// Gray ramp generated from a fixed hue + chroma, stepping L. Solid (not alpha)
// on purpose: grays sit on text over media, where translucency would read
// through the image.
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
  // The one entrance reveal, parameterized by CSS vars (`--enter-y` /
  // `--enter-scale` / `--enter-blur`) set by the animation-style variants.
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
  // The 6-step fluid scale (375→1920px viewport), all `clamp()`.
  fontSizes: {
    partnerBadgeRing: { value: '40px' },
    xs: { value: 'clamp(10px, 9.76px + 0.0647vw, 11px)' },
    sm: { value: 'clamp(12px, 11.76px + 0.0647vw, 13px)' },
    base: { value: '16px' },
    md: { value: 'clamp(19px, 17.54px + 0.3883vw, 25px)' },
    lg: { value: 'clamp(26px, 18.72px + 1.9417vw, 56px)' },
    xl: { value: 'clamp(48px, 37.32px + 2.8479vw, 92px)' },
  },
  spacing: {
    // `0` is a real member of the scale: overriding a larger breakpoint's
    // padding, pinning an overlay edge (`inset: '0'`), collapsing a gap.
    '0': { value: '0px' },
    xs: { value: 'clamp(4px, 4px, 4px)' },
    sm: { value: 'clamp(8px, 8px, 8px)' },
    hairlineOverlap: { value: 'calc({borderWidths.hairline} * -1)' },
    dialogInset: { value: 'calc({borderWidths.focus} * -1)' },
    navLogoTopMd: { value: '24px' },
    navDesktopTop: { value: '32px' },
    navDesktopTopLg: { value: '40px' },
    // Badge's own padding — not shared by anything else in the size scale.
    badgeX: { value: '12px' },
    badgeY: { value: '6px' },
    md: { value: 'clamp(16px, 15.03px + 0.2589vw, 20px)' },
    lg: { value: 'clamp(24px, 18.17px + 1.5534vw, 48px)' },
    xl: { value: 'clamp(32px, 22.29px + 2.5890vw, 72px)' },
    '2xl': { value: 'clamp(48px, 32.47px + 4.1424vw, 112px)' },
    '3xl': { value: 'clamp(64px, 44.58px + 5.1780vw, 144px)' },
    '4xl': { value: 'clamp(96px, 64.93px + 8.2848vw, 224px)' },
    // The vertical rhythm of a standard section (`--section-padding-y`).
    sectionY: { value: 'clamp(80px, 70.29px + 2.5890vw, 120px)' },
    // Looser section rhythm for breathing-room sections (manifesto, About).
    sectionYLg: { value: 'clamp(100px, 80.58px + 5.1780vw, 180px)' },
    // The horizontal section gutter. Lives on the rail (`sectionInner`),
    // not the section shell, so full-bleed children can escape it.
    gutter: { value: 'clamp(16px, -7.30px + 6.2136vw, 112px)' },
    // Shared grid gutter (`--grid-gap`).
    gridGap: { value: 'clamp(16px, -0.50px + 4.4013vw, 84px)' },
    // The archive card's image-bleeds-under-content overlap — the root grid's
    // overlap row height (`EditionCard.recipe.ts`), not a call-site calc.
    cardOverlap: { value: '3rem' },
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
      value: { width: '{borderWidths.hairline}', style: 'solid', color: '{colors.divider}' },
    },
    highlight: {
      value: { width: '{borderWidths.hairline}', style: 'solid', color: '{colors.chartreuse}' },
    },
    primary: {
      value: { width: '{borderWidths.focus}', style: 'solid', color: '{colors.action}' },
    },
    // The one focus ring (`outline: 'focus'` + an outlineOffset at the site).
    focus: {
      value: { width: '{borderWidths.focus}', style: 'solid', color: '{colors.chartreuse}' },
    },
  },
  borderWidths: {
    '0': { value: '0px' },
    hairline: { value: '1px' },
    focus: { value: '2px' },
    // The gradientBorder hover ring's width (gallery tiles).
    gradientRing: { value: '2px' },
    // The sub-pixel hairline: Calendar's tighter gradient ring weight, and
    // Badge's own border (same value, different mechanism — named neutrally
    // so both can share it).
    hairlineThin: { value: '0.5px' },
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
    navLogoBase: { value: '40px' },
    navLogoLg: { value: '56px' },
    navLogoXl: { value: '60px' },
    navIcon: { value: '24px' },
    navGlyph: { value: '18px' },
    navGlyphStroke: { value: '2px' },
    navRollOffset: { value: '110%' },
    // The comfortable prose measure (leads, FAQ bodies, link lists).
    measure: { value: '60ch' },
    // The site content rail (`.sectionInner` max-width).
    maxWidth: { value: '1800px' },
    // Narrow single-column cap (mobile stat blocks, banners, error/edition
    // copy) — recurs as an unnamed ~500-525px literal across several
    // recipes; 520px is its most common value.
    narrowColumn: { value: '520px' },
    brushStroke: { value: '3px' },
    // The lightbox's desktop letterbox column — each nav arrow owns one full
    // column beside the frame. The frame's `md`+ width is derived from this
    // (100vw minus two columns) instead of restating the pixel math.
    lightboxNavColumn: { value: '80px' },
    // The lightbox frame's base (pre-`md`) width fraction of the viewport.
    lightboxFrameWidth: { value: '90vw' },
    // The nav arrows' vertical click zone — generous, but bounded (not the
    // full letterbox column height) so it can't reach into the close
    // button's corner.
    lightboxNavHit: { value: '240px' },
    // The lightbox center track's max rendered width at `md`+ (viewport minus
    // the two nav letterbox columns) — an `Image` `sizes` hint, not layout.
    lightboxFrameMax: { value: 'calc(100vw - ({sizes.lightboxNavColumn} * 2))' },
    // The transparent square hit target shared by Button's `icon` variant and
    // the carousel prev/next/autoplay controls — distinct from `touch` (the
    // WCAG minimum), this is the DS's own icon-button footprint.
    hitTarget: { value: '44px' },
    // The modal dialog's `panel` presentation width, and its `md`+ two-column
    // step.
    dialogPanel: { value: '540px' },
    dialogPanelWide: { value: '760px' },
    // The Calendar event row's desktop hover-reveal poster column.
    calendarPoster: { value: '220px' },
    // The edition hero's reserved left gutter (`lg`+) where the theme tape
    // sits, beside the image track rather than overlaid on it.
    heroTapeColumn: { value: '200px' },
    // The hero image track's max rendered width at `lg`+ (viewport minus the
    // tape column) — an `Image` `sizes` hint, not layout.
    heroImageMax: { value: 'calc(100vw - {sizes.heroTapeColumn})' },
  },
  assets: {
    brushStrokeX: { value: 'polygon(0 0, 100% 0, 100% 38%, 68% 58%, 0 100%)' },
    brushStrokeY: { value: 'polygon(0 0, 100% 0, 58% 68%, 38% 100%, 0 100%)' },
    // The hero frame's grayscale grade — photography desaturated just enough
    // to sit on the dark ground without going fully mono.
    grayscaleSubtle: { value: 'grayscale(0.3)' },
    // Full desaturation — the rail's "upcoming" plate, muted flat rather than
    // graded like `grayscaleSubtle`.
    grayscaleFull: { value: 'grayscale(1)' },
    // The card-media "develop" treatment — fully desaturated + dimmed at
    // rest, warming back to color + full brightness on hover/focus. Shared by
    // EditionCard and Calendar's run cards.
    developRest: { value: 'grayscale(1) brightness(0.7)' },
    developHover: { value: 'grayscale(0.3) brightness(1)' },
    // The gallery rail item's develop treatment — same rest/hover pairing
    // shape as `developRest`/`developHover`, tuned with contrast instead of
    // desaturation.
    galleryDevelopRest: { value: 'brightness(0.9) contrast(1)' },
    galleryDevelopHover: { value: 'brightness(1) contrast(1.1)' },
  },
  letterSpacings: {
    tight: { value: '-0.02em' },
    label: { value: '1.2px' },
    partnerBadgeRing: { value: '8px' },
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
    fast: { value: '200ms' },
    normal: { value: '300ms' },
    entrance: { value: '900ms' },
    sweep: { value: '1600ms' },
  },
  // `quint` is the one transition easing (via the `transition` utility);
  // `expo` belongs to the `enter` entrance animation only.
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
    frame: { value: '0 30px 80px -30px rgb(0 0 0 / 0.7)' },
    tape: {
      value: 'inset 0 1px 0 rgb(255 255 255 / 0.08), 0 14px 32px -6px rgb(0 0 0 / 0.55)',
    },
    text: { value: '0 1px 8px rgb(0 0 0 / 0.55)' },
  },
  gradients: {
    heroVignette: {
      value:
        'linear-gradient(115deg, rgb(14 11 16 / 0.55) 0%, rgb(14 11 16 / 0) 38%), radial-gradient(140% 90% at 50% 30%, transparent 55%, rgb(14 11 16 / 0.5) 100%)',
    },
    cardScrim: {
      value: 'linear-gradient(180deg, rgb(0 0 0 / 0.5), transparent 30%, rgb(0 0 0 / 0.55))',
    },
    carouselVignette: {
      value: 'radial-gradient(ellipse at center, transparent 55%, rgb(0 0 0 / 0.45) 100%)',
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
    '0': { value: '0' },
    '1': { value: '1' },
    '2': { value: '2' },
    '3': { value: '3' },
    '4': { value: '4' },
    '10': { value: '10' },
    '20': { value: '20' },
  },
  sizes: {
    // Fixed-nav height — the page-top offset every hero clears.
    nav: { value: { base: '60px', md: '72px', lg: '84px', xl: '100px' } },
    partnerBadgeStandard: { value: { base: '72px', md: '96px', xl: '125px' } },
    partnerBadgeStandardIcon: { value: { base: '20px', md: '26px', xl: '36px' } },
    partnerBadgeFooter: { value: { base: '100.8px', md: '115.2px', xl: '150px' } },
    partnerBadgeFooterIcon: { value: { base: '28px', md: '31.2px', xl: '43.2px' } },
    partnerBadgeHero: {
      value: { base: '158.4px', md: '172.8px', lg: '158.4px', xl: '218.75px', '3xl': '231.25px' },
    },
    partnerBadgeHeroIcon: {
      value: { base: '44px', md: '46.8px', lg: '42.9px', xl: '63px', '3xl': '66.6px' },
    },
    partnerBadgeUpcoming: { value: { base: '108px', md: '144px', xl: '187.5px' } },
    partnerBadgeUpcomingIcon: { value: { base: '30px', md: '39px', xl: '54px' } },
  },
} as const

// Reduced-motion is handled once by the global kill in preset.ts, not per
// style.
export const animationStyles = {
  enter: {
    DEFAULT: {
      value: {
        animationName: 'enter',
        animationDuration: 'entrance',
        animationTimingFunction: 'expo',
        animationFillMode: 'both',
        '--enter-y': '30px',
      },
    },
    fade: {
      value: {
        animationName: 'enter',
        animationDuration: 'entrance',
        animationTimingFunction: 'expo',
        animationFillMode: 'both',
        '--enter-y': '0px',
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
      },
    },
    snappy: {
      value: {
        animationName: 'enter',
        animationDuration: 'normal',
        animationTimingFunction: 'expo',
        animationFillMode: 'both',
        '--enter-y': '30px',
      },
    },
  },
  spin: {
    value: {
      animationName: 'spin',
      animationDuration: '32s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
    },
  },
  shimmer: {
    value: {
      animationName: 'shimmer',
      animationDuration: 'sweep',
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: 'infinite',
    },
  },
  gradientBorder: {
    value: {
      animationName: 'gradientBorderShift',
      animationDuration: '2s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
    },
  },
  tape: {
    value: {
      animationName: 'tapeIn',
      animationDuration: 'entrance',
      animationTimingFunction: 'expo',
      animationFillMode: 'forwards',
      animationDelay: 'var(--tape-delay, 0s)',
    },
  },
} as const

// The 7 sealed textStyles — pure type, no color. Ink cascades from the
// surface (ground/section owns heading/body/muted ink).
export const textStyles = {
  display: {
    value: {
      fontFamily: 'display',
      fontSize: 'xl',
      lineHeight: '1',
      letterSpacing: '-0.02em',
      textTransform: 'uppercase',
    },
  },
  title: {
    value: {
      fontFamily: 'display',
      fontSize: 'lg',
      lineHeight: '1.16',
      letterSpacing: '-0.02em',
      textTransform: 'uppercase',
    },
  },
  heading: {
    value: {
      fontFamily: 'display',
      fontSize: 'md',
      lineHeight: '1.16',
      letterSpacing: '-0.02em',
      textTransform: 'uppercase',
    },
  },
  lead: {
    value: {
      fontFamily: 'body',
      fontSize: 'md',
      fontWeight: 'light',
      lineHeight: '1.56',
      textWrap: 'pretty',
    },
  },
  body: {
    value: {
      fontFamily: 'body',
      fontSize: 'base',
      lineHeight: '1.56',
      textWrap: 'pretty',
    },
  },
  caption: {
    value: {
      fontFamily: 'body',
      fontSize: 'sm',
      lineHeight: '1.38',
    },
  },
  label: {
    value: {
      fontFamily: 'body',
      fontSize: 'xs',
      fontWeight: 'semibold',
      lineHeight: '1.3',
      letterSpacing: '1.2px',
      textTransform: 'uppercase',
    },
  },

  featuredEvents: {
    watermarkType: {
      value: {
        fontFamily: 'display',
        fontSize: 'clamp(120px, 32vw, 260px)',
        lineHeight: '1',
      },
    },
  },
  calendar: {
    markerDayType: {
      value: {
        fontFamily: 'display',
        fontSize: 'lg',
        lineHeight: '0.8',
      },
    },
  },
  externalGallery: {
    plateType: {
      monogram: {
        value: {
          fontFamily: 'display',
          lineHeight: '1',
          textTransform: 'uppercase',
        },
      },
      zsb: {
        value: {
          fontSize: 'clamp(56px, 7vw, 104px)',
          letterSpacing: '-2px',
        },
      },
      year: {
        value: {
          fontSize: 'clamp(36px, 4.5vw, 64px)',
          letterSpacing: '-1px',
        },
      },
    },
  },
  editionTheme: {
    tapeType: {
      huge: {
        value: {
          fontFamily: 'display',
          fontSize: { base: 'lg', md: 'lg', lg: 'xl', xl: 'xl' },
          lineHeight: '1',
          letterSpacing: '-0.02em',
          textTransform: 'lowercase',
        },
      },
      large: {
        value: {
          fontFamily: 'display',
          fontSize: { base: 'lg', md: 'lg', lg: 'lg', xl: 'xl' },
          lineHeight: '1',
          letterSpacing: '-0.02em',
          textTransform: 'lowercase',
        },
      },
      normal: {
        value: {
          fontFamily: 'display',
          fontSize: 'lg',
          lineHeight: '1',
          letterSpacing: '-0.02em',
          textTransform: 'lowercase',
        },
      },
      rail: {
        value: {
          fontFamily: 'display',
          fontSize: { base: 'xl', md: 'xl', lg: 'lg', xl: 'xl', '4xl': 'xl' },
          lineHeight: '1',
          letterSpacing: '-0.02em',
          textTransform: 'lowercase',
        },
      },
    },
  },
  partnerBadge: {
    ringType: {
      value: {
        fontFamily: 'body',
        fontSize: 'partnerBadgeRing',
        fontWeight: 'semibold',
        letterSpacing: 'partnerBadgeRing',
      },
    },
  },

  cardTitle: {
    value: {
      fontFamily: 'display',
      fontSize: 'md',
      lineHeight: '1.16',
      letterSpacing: '-0.02em',
      textTransform: 'uppercase',
    },
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
  // The edition hero tape's bottom offset + width cap, stepped in tandem
  // across breakpoints so the two ramps live in one named place instead of
  // two parallel brackets at the call site.
  heroTapeOffset: {
    value: {
      bottom: { base: '8%', md: '10%', lg: '11%' },
      maxWidth: { base: '94%', md: '72%', lg: '62%', xl: '58%' },
    },
  },
  // The edition hero tape's horizontal nudge — tucks it under the nav on
  // mobile, then pulls it flush with the logo from `lg` as the tape's own
  // em-based padding grows with its `huge` fontSize ladder.
  heroTapeNudge: {
    value: {
      marginLeft: { base: '10px', md: '18px', lg: '-36px', xl: '-40px' },
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
  // `content` and the ring width (padding).
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
      transitionProperty: '[opacity]',
      transitionDuration: 'fast',
      transitionTimingFunction: 'quint',
    },
  },
  // The gallery rail slide's width+height, ramped in tandem across
  // breakpoints (same bundling rationale as `heroTapeOffset`) plus the
  // landscape-phone height override.
  galleryRailFrame: {
    value: {
      width: {
        base: '[clamp(360px, 92vw, 540px)]',
        md: '[clamp(600px, 81vw, 990px)]',
        lg: '[clamp(730px, 73vw, 1140px)]',
        xl: '[clamp(830px, 62vw, 1250px)]',
        '2xl': '[clamp(940px, 59vw, 1350px)]',
        '4xl': '[clamp(1040px, 55vw, 1460px)]',
      },
      height: {
        base: '[28vh]',
        md: '[35vh]',
        lg: '[40vh]',
        xl: '[42vh]',
        '2xl': '[43vh]',
        '4xl': '[44vh]',
      },
      '@media (max-width: 767px) and (orientation: landscape)': { height: '[73vh]' },
    },
  },
  // The brush-stroke rule's shared boilerplate (EditionTheme's top rule,
  // Manifesto's left rule) — content/position/opacity are identical; axis
  // (height vs width, position sides, gradient direction, clipPath) stays
  // at each call site.
  brushStrokeRule: {
    value: { content: '""', position: 'absolute', opacity: '0.85' },
  },
  // The small horizontal kicker rule (Eyebrow's `rule` variant) — a
  // `::before` dash sized off the shared `lg` spacing step rather than a
  // one-off pixel value.
  ruleLine: {
    value: { content: '""', width: 'lg', height: '2px', background: 'current', flexShrink: '0' },
  },
  // The disclosure chevron shared by Accordion/Collapsible: flex + rotate on
  // `data-state=open`. Layout deltas stay at the call sites.
  disclosureIndicator: {
    value: {
      display: 'inline-flex',
      transitionProperty: '[transform]',
      transitionDuration: 'fast',
      transitionTimingFunction: 'quint',
      '&[data-state=open]': { transform: 'rotate(180deg)' },
    },
  },
  // Visually-hidden but still in the accessibility tree — the standard
  // sr-only recipe, named once instead of hand-rolled at each call site.
  srOnly: {
    value: {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)',
      whiteSpace: 'nowrap',
      borderWidth: '0',
    },
  },
  // NB layerStyles carry the surface look only — positioning/stacking beyond
  // the mechanism itself stays at the call site.
} as const
