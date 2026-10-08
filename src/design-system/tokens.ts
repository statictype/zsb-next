const GRAY_HUE = 345
const GRAY_CHROMA = 0.005
const GRAY_L: Record<string, number> = {
  200: 90,
  300: 79,
  400: 69,
  500: 61,
  600: 52,
  700: 42,
  800: 32,
  900: 24,
}
const grayRamp = Object.fromEntries(
  Object.entries(GRAY_L).map(([step, l]) => [
    step,
    { value: `oklch(${l}% ${GRAY_CHROMA} ${GRAY_HUE})` },
  ]),
)

const fluid = (min: number, max: number, from = 375, to = 1920) => {
  const slope = ((max - min) / (to - from)) * 100
  const intercept = min - (slope * from) / 100
  return `clamp(${min}px, ${intercept.toFixed(2)}px + ${slope.toFixed(4)}vw, ${max}px)`
}

export const portraitPhoneQuery = '(max-width: 599.98px) and (orientation: portrait)'

export const conditions = {
  motionReduce: '@media (prefers-reduced-motion: reduce)',
  groundLight: '[data-ground=light] &',

  portrait: '@media (orientation: portrait)',
  portraitPhone: `@media ${portraitPhoneQuery}`,
  landscapePhone: '@media (max-height: 499.98px) and (orientation: landscape)',

  hover: '&:is(:hover, [data-hover]):not(:disabled, [aria-disabled=true], [data-disabled])',
  active: '&:is(:active, [data-active]):not(:disabled, [aria-disabled=true], [data-disabled])',
} as const

export const breakpoints = {
  sm: '637px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
  '3xl': '1536px',
  '4xl': '1792px',
} as const

export const keyframes = {
  enter: {
    from: {
      opacity: '0',
      translate: '0 var(--enter-y, 0px)',
      scale: 'var(--enter-scale, 1)',
    },
    to: { opacity: '1', translate: '0 0', scale: '1' },
  },

  spin: { to: { transform: 'rotate(-360deg)' } },
  nudge: {
    '0%, 100%': { translate: '0 0' },
    '50%': { translate: 'var(--nudge)' },
  },
  gradientBorderShift: {
    '0%': { backgroundPosition: '0% 50%' },
    '100%': { backgroundPosition: '200% 50%' },
  },
  shimmer: {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
  progressSweep: {
    from: { opacity: '1', transform: 'translateX(-100%)' },
    to: { opacity: '1', transform: 'translateX(250%)' },
  },
  marquee: {
    from: { transform: 'translate3d(0, 0, 0)' },
    to: { transform: 'translate3d(-25%, 0, 0)' },
  },
} as const

export const tokens = {
  colors: {
    gray: grayRamp,
    pink: { value: 'oklch(61.6% 0.2527 355)' },
    chartreuse: { value: 'oklch(87.9% 0.1981 115)' },

    black: { value: 'oklch(0% 0 0)' },
    white: { value: '#fff' },

    transparent: { value: 'transparent' },
    current: { value: 'currentColor' },
  },
  fonts: {
    display: { value: 'var(--font-dela-gothic), sans-serif' },
    body: { value: 'var(--font-montserrat), sans-serif' },
  },
  fontSizes: {
    xs: { value: '11px' },
    sm: { value: fluid(12, 13) },
    base: { value: fluid(14, 16, 1024) },
    md: { value: fluid(17, 23, 1024) },
    lg: { value: fluid(22, 33) },
    xl: { value: fluid(27, 44) },
    '2xl': { value: fluid(34, 59) },
    '3xl': { value: `min(${fluid(42, 80)}, 11vw)` },
  },
  spacing: {
    xs: { value: '4px' },
    sm: { value: '8px' },
    focusInset: { value: 'calc({borderWidths.focus} * -1)' },
    md: { value: fluid(16, 20) },
    lg: { value: fluid(24, 48) },
    xl: { value: fluid(32, 72) },
    '2xl': { value: fluid(48, 112) },
    '3xl': { value: fluid(64, 144) },
    '4xl': { value: fluid(96, 224) },
    gutter: { value: fluid(16, 112) },
  },
  radii: {
    circle: { value: '50%' },
  },
  borders: {
    none: { value: 'none' },
    highlight: {
      value: { width: '{borderWidths.hairline}', style: 'solid', color: '{colors.highlight}' },
    },
    primary: {
      value: { width: '{borderWidths.hairline}', style: 'solid', color: '{colors.action}' },
    },
    focus: {
      value: { width: '{borderWidths.focus}', style: 'solid', color: '{colors.action}' },
    },
  },
  borderWidths: {
    hairline: { value: '0.5px' },
    focus: { value: '2px' },
  },
  sizes: {
    touch: { value: '48px' },
    measure: { value: '60ch' },
    maxWidth: { value: '1800px' },

    narrowColumn: { value: '520px' },
    dialogPanelWide: { value: '760px' },
  },
  assets: {
    mono: { value: 'grayscale(1) brightness(1.08) contrast(1.06)' },
    monoHover: { value: 'grayscale(0.3) brightness(1.08) contrast(1.06)' },
    monoReveal: { value: 'grayscale(0) brightness(1.08) contrast(1.06)' },

    color: { value: 'brightness(1.1) contrast(1)' },
    colorHover: { value: 'brightness(1) contrast(1.1)' },

    grayscaleFull: { value: 'grayscale(1)' },
  },
  letterSpacings: {
    tight: { value: '-0.018em' },
    theme: { value: '0.007em' },
    label: { value: '1.2px' },
  },
  fontWeights: {
    light: { value: '300' },
    regular: { value: '400' },
    medium: { value: '500' },
    semibold: { value: '600' },
    bold: { value: '700' },
  },
  durations: {
    fast: { value: '200ms' },
    normal: { value: '300ms' },
    entrance: { value: '600ms' },
    stagger: { value: '80ms' },

    pulse: { value: '900ms' },
    sweep: { value: '1600ms' },
    travel: { value: '2s' },
    orbit: { value: '32s' },
  },

  easings: {
    feedback: {
      value:
        'linear(0, 0.01 1.8%, 0.044 4%, 0.112 6.9%, 0.267 12.2%, 0.451 18.5%, 0.572 23.3%, 0.671 28%, 0.753 32.8%, 0.822 38.1%, 0.879 44.2%, 0.924 51.3%, 0.959 60.3%, 0.983 72.8%, 0.996 94.4%, 1)',
    },
    motion: {
      value:
        'linear(0, 0.01 1.9%, 0.043 4%, 0.104 6.6%, 0.21 10%, 0.536 19.4%, 0.667 23.8%, 0.769 27.8%, 0.852 31.8%, 0.918 36%, 0.968 40.6%, 1.004 45.8%, 1.026 52%, 1.031 60.7%, 1.002 95.1%, 1)',
    },
  },

  shadows: {
    litEdge: { value: 'inset 0 1px 0 rgb(255 255 255 / 0.18)' },

    badge: { value: '0 1px 0 rgb(255 255 255 / 0.25) inset, 0 6px 16px rgb(0 0 0 / 0.25)' },
    modal: { value: '0 30px 80px rgb(0 0 0 / 0.5)' },
  },
  gradients: {
    stageScrim: {
      value: 'linear-gradient(180deg, transparent, rgb(0 0 0 / 0.55))',
    },
  },
} as const

export const semanticTokens = {
  colors: {
    surface: {
      DEFAULT: { value: { base: '{colors.black}', _groundLight: '{colors.white}' } },
      scrim: { value: 'rgb(0 0 0 / 0.95)' },
    },
    heading: { value: { base: '{colors.white}', _groundLight: '{colors.black}' } },
    body: { value: { base: '{colors.gray.400}', _groundLight: '{colors.gray.700}' } },
    muted: { value: { base: '{colors.gray.500}', _groundLight: '{colors.gray.600}' } },
    divider: { value: { base: '{colors.gray.800}', _groundLight: '{colors.gray.200}' } },
    action: { value: '{colors.pink}' },
    highlight: { value: '{colors.chartreuse}' },
  },
  borders: {
    hairline: {
      value: {
        base: '{borderWidths.hairline} solid {colors.divider}',
        _groundLight: '{borderWidths.hairline} solid {colors.divider}',
      },
    },
    subtle: {
      value: {
        base: '{borderWidths.hairline} solid {colors.gray.700}',
        _groundLight: '{borderWidths.hairline} solid {colors.gray.300}',
      },
    },
  },
  zIndex: {
    nav: { value: '100' },
    banner: { value: '200' },
    overlay: { value: '1000' },
    modal: { value: '1010' },
    navToggle: { value: '300' },
    lightboxFlip: { value: '1020' },
    draftBadge: { value: '1030' },
    progress: { value: '1040' },
  },
  sizes: {
    nav: { value: { base: '60px', md: '72px', lg: '84px', xl: '100px' } },
    bellerBar: { value: { base: '56px', md: '60px' } },
    heroFold: { value: '60svh' },
  },
} as const

const enter = (duration: string, y: string, extra: Record<string, string> = {}) => ({
  value: {
    animationName: 'enter',
    animationDuration: duration,
    animationTimingFunction: 'motion',
    animationFillMode: 'both',
    '--enter-y': y,
    ...extra,
  },
})

export const animationStyles = {
  enter: enter('entrance', '30px'),
  enterFade: enter('entrance', '0px'),
  enterZoom: enter('entrance', '0px', { '--enter-scale': '1.06' }),
  arrive: enter('normal', '12px'),
  arriveFade: enter('normal', '0px'),
  spin: {
    value: {
      animationName: 'spin',
      animationDuration: 'orbit',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
    },
  },
  nudge: {
    value: {
      animationName: 'nudge',
      animationDuration: 'pulse',
      animationTimingFunction: 'ease-in-out',
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
      animationDuration: 'travel',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
    },
  },
} as const

export const textStyles = {
  display: {
    value: {
      fontFamily: 'display',
      fontSize: '3xl',
      lineHeight: '1',
      textTransform: 'uppercase',
      textWrap: 'balance',
    },
  },
  title: {
    value: {
      fontFamily: 'display',
      fontSize: 'xl',
      lineHeight: '1.16',
      textTransform: 'uppercase',
      textWrap: 'balance',
    },
  },
  heading: {
    value: {
      fontFamily: 'display',
      fontSize: 'lg',
      lineHeight: '1.1',
      textWrap: 'balance',
    },
  },
  rowTitle: {
    value: {
      fontFamily: 'body',
      fontSize: 'md',
      fontWeight: 'bold',
      lineHeight: '1.3',
      textWrap: 'balance',
    },
  },
  detailTitle: {
    value: {
      fontFamily: 'display',
      fontSize: 'xl',
      lineHeight: '1.12',
      textWrap: 'balance',
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
      lineHeight: '1.7',
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
      fontWeight: 'regular',
      lineHeight: '1.3',
      letterSpacing: 'label',
      textTransform: 'uppercase',
    },
  },

  editionTheme: {
    sub: {
      value: {
        fontFamily: 'display',
        fontSize: { base: 'md', md: 'lg' },
        lineHeight: '1',
        letterSpacing: 'theme',
        textTransform: 'lowercase',
      },
    },
    cell: {
      value: {
        fontFamily: 'body',
        fontSize: 'base',
        fontWeight: 'medium',
        lineHeight: '1.45',
        textTransform: 'lowercase',
      },
    },
    row: {
      value: {
        fontFamily: 'body',
        fontSize: 'md',
        fontWeight: 'medium',
        lineHeight: '1.3',
        letterSpacing: 'tight',
        textTransform: 'lowercase',
      },
    },
  },

  cardTitle: {
    value: {
      fontFamily: 'display',
      fontSize: 'md',
      lineHeight: '1.16',
      textTransform: 'uppercase',
      textWrap: 'balance',
    },
  },

  manifesto: {
    value: {
      fontFamily: 'display',
      fontSize: '3xl',
      lineHeight: '1.16',
      textWrap: 'balance',
    },
  },
} as const

export const layerStyles = {
  sectionInner: {
    value: { maxWidth: 'maxWidth', marginInline: 'auto', paddingInline: 'gutter' },
  },
  coverMono: {
    value: {
      objectFit: 'cover',
      filter: 'token(assets.mono)',
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
      transitionProperty: 'opacity',
      transitionDuration: 'fast',
      transitionTimingFunction: 'feedback',
    },
  },

  disclosureIndicator: {
    value: {
      display: 'inline-flex',
      transitionProperty: 'transform',
      transitionDuration: 'fast',
      transitionTimingFunction: 'feedback',
      '&[data-state=open]': { transform: 'rotate(180deg)' },
    },
  },

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
} as const
