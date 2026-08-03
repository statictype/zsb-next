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
  gradientBorderShift: {
    '0%': { backgroundPosition: '0% 50%' },
    '100%': { backgroundPosition: '200% 50%' },
  },
  shimmer: {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
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
    xs: { value: 'clamp(9px, 8.76px + 0.0647vw, 10px)' },
    sm: { value: 'clamp(12px, 11.76px + 0.0647vw, 13px)' },
    base: { value: '16px' },
    md: { value: 'clamp(17px, 15.54px + 0.3883vw, 23px)' },
    lg: { value: 'clamp(22px, 19.33px + 0.7120vw, 33px)' },
    xl: { value: 'clamp(27px, 22.87px + 1.1003vw, 44px)' },
    '2xl': { value: 'clamp(34px, 27.93px + 1.6181vw, 59px)' },
    '3xl': { value: 'min(clamp(42px, 32.78px + 2.4595vw, 80px), 11vw)' },
  },
  spacing: {
    '0': { value: '0px' },
    xs: { value: '4px' },
    sm: { value: '8px' },
    dialogInset: { value: 'calc({borderWidths.focus} * -1)' },
    md: { value: 'clamp(16px, 15.03px + 0.2589vw, 20px)' },
    lg: { value: 'clamp(24px, 18.17px + 1.5534vw, 48px)' },
    xl: { value: 'clamp(32px, 22.29px + 2.5890vw, 72px)' },
    '2xl': { value: 'clamp(48px, 32.47px + 4.1424vw, 112px)' },
    '3xl': { value: 'clamp(64px, 44.58px + 5.1780vw, 144px)' },
    '4xl': { value: 'clamp(96px, 64.93px + 8.2848vw, 224px)' },
    sectionY: { value: 'clamp(80px, 70.29px + 2.5890vw, 120px)' },
    sectionYLg: { value: 'clamp(100px, 80.58px + 5.1780vw, 180px)' },

    gutter: { value: 'clamp(16px, -7.30px + 6.2136vw, 112px)' },
    gridGap: { value: 'clamp(16px, -0.50px + 4.4013vw, 84px)' },
  },
  radii: {
    none: { value: '0px' },
    pill: { value: '100px' },
    circle: { value: '50%' },
  },
  borders: {
    none: { value: 'none' },
    hairline: {
      value: { width: '{borderWidths.hairline}', style: 'solid', color: '{colors.divider}' },
    },
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
    '0': { value: '0px' },
    hairline: { value: '1px' },
    focus: { value: '2px' },
    gradientRing: { value: '1px' },

    // so both can share it).
    hairlineThin: { value: '0.5px' },
  },
  sizes: {
    '0': { value: '0px' },
    full: { value: '100%' },
    fit: { value: 'fit-content' },

    touch: { value: '48px' },
    navIcon: { value: '24px' },
    rollOffset: { value: '110%' },
    measure: { value: '60ch' },
    maxWidth: { value: '1800px' },

    narrowColumn: { value: '520px' },

    dialogPanel: { value: '540px' },
    dialogPanelWide: { value: '760px' },
    dialogPanelXl: { value: '1000px' },
  },
  assets: {
    monoRest: { value: 'grayscale(1) brightness(1.12) contrast(1.08)' },

    grayscaleFull: { value: 'grayscale(1)' },

    developRest: { value: 'grayscale(1) brightness(1.08) contrast(1.06)' },
    developHover: { value: 'grayscale(0.3) brightness(1.08) contrast(1.06)' },

    colorRest: { value: 'brightness(1.1) contrast(1)' },
    colorHover: { value: 'brightness(1) contrast(1.1)' },
  },
  letterSpacings: {
    tight: { value: '-0.02em' },
    label: { value: '1.2px' },
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
    entrance: { value: '600ms' },
    stagger: { value: '80ms' },

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

    card: { value: '0 2px 12px rgb(0 0 0 / 0.03)' },
    badge: { value: '0 1px 0 rgb(255 255 255 / 0.25) inset, 0 6px 16px rgb(0 0 0 / 0.25)' },
    modal: { value: '0 30px 80px rgb(0 0 0 / 0.5)' },
    frame: { value: '0 30px 80px -30px rgb(0 0 0 / 0.7)' },
    text: { value: '0 1px 8px rgb(0 0 0 / 0.55)' },
  },
  gradients: {
    heroVignette: {
      value:
        'linear-gradient(115deg, rgb(14 11 16 / 0.34) 0%, rgb(14 11 16 / 0) 38%), radial-gradient(140% 90% at 50% 30%, transparent 55%, rgb(14 11 16 / 0.3) 100%)',
    },
    cardScrim: {
      value: 'linear-gradient(180deg, rgb(0 0 0 / 0.5), transparent 30%, rgb(0 0 0 / 0.55))',
    },
    carouselVignette: {
      value: 'radial-gradient(ellipse at center, transparent 55%, rgb(0 0 0 / 0.45) 100%)',
    },
    stageScrim: {
      value: 'linear-gradient(180deg, transparent, rgb(0 0 0 / 0.55))',
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
    muted: { value: '{colors.gray.500}' },
    divider: { value: '{colors.gray.900}' },
    action: { value: '{colors.pink}' },
    highlight: { value: '{colors.chartreuse}' },
  },
  zIndex: {
    nav: { value: '100' },
    banner: { value: '200' },
    overlay: { value: '1000' },
    modal: { value: '1010' },
    // Above the banner, below every dialog. The mobile menu draws its own close
    // control inside its dialog (`dialogToggle`), so this never has to outrank
    // the modal layer — and must not, or it lands on other dialogs' controls.
    navToggle: { value: '300' },
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
  },
} as const

export const animationStyles = {
  enter: {
    DEFAULT: {
      value: {
        animationName: 'enter',
        animationDuration: 'entrance',
        animationTimingFunction: 'motion',
        animationFillMode: 'both',
        '--enter-y': '30px',
      },
    },
    fade: {
      value: {
        animationName: 'enter',
        animationDuration: 'entrance',
        animationTimingFunction: 'motion',
        animationFillMode: 'both',
        '--enter-y': '0px',
      },
    },
    zoom: {
      value: {
        animationName: 'enter',
        animationDuration: 'entrance',
        animationTimingFunction: 'motion',
        animationFillMode: 'both',
        '--enter-y': '0px',
        '--enter-scale': '1.06',
      },
    },
  },
  arrive: {
    DEFAULT: {
      value: {
        animationName: 'enter',
        animationDuration: 'normal',
        animationTimingFunction: 'motion',
        animationFillMode: 'both',
        '--enter-y': '12px',
      },
    },
    fade: {
      value: {
        animationName: 'enter',
        animationDuration: 'normal',
        animationTimingFunction: 'motion',
        animationFillMode: 'both',
        '--enter-y': '0px',
      },
    },
  },
  spin: {
    value: {
      animationName: 'spin',
      animationDuration: 'orbit',
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
      letterSpacing: '-0.02em',
      textTransform: 'uppercase',
    },
  },
  title: {
    value: {
      fontFamily: 'display',
      fontSize: '2xl',
      lineHeight: '1.16',
      letterSpacing: '-0.02em',
      textTransform: 'uppercase',
    },
  },
  heading: {
    value: {
      fontFamily: 'display',
      fontSize: 'lg',
      lineHeight: '1.1',
      letterSpacing: '-0.02em',
    },
  },
  detailTitle: {
    value: {
      fontFamily: 'display',
      fontSize: 'xl',
      lineHeight: '1.12',
      letterSpacing: '-0.02em',
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
      fontWeight: 'normal',
      lineHeight: '1.3',
      letterSpacing: '1.2px',
      textTransform: 'uppercase',
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
    huge: {
      value: {
        fontFamily: 'display',
        fontSize: { base: '2xl', sm: '3xl' },
        lineHeight: '1',
        letterSpacing: '0.007em',
        textTransform: 'lowercase',
      },
    },
    large: {
      value: {
        fontFamily: 'display',
        fontSize: { base: '2xl', xl: '3xl' },
        lineHeight: '1',
        letterSpacing: '0.007em',
        textTransform: 'lowercase',
      },
    },
    normal: {
      value: {
        fontFamily: 'display',
        fontSize: { base: 'md', md: '2xl' },
        lineHeight: '1',
        letterSpacing: '0.007em',
        textTransform: 'lowercase',
      },
    },
    rail: {
      value: {
        fontFamily: 'display',
        fontSize: { base: 'md', lg: '2xl' },
        lineHeight: '1',
        letterSpacing: '0.01em',
        textTransform: 'lowercase',
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

export const layerStyles = {
  sectionInner: {
    value: { maxWidth: 'maxWidth', marginInline: 'auto', paddingInline: 'gutter' },
  },
  coverMono: {
    value: {
      objectFit: 'cover',
      filter: '[token(assets.monoRest)]',
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
      transitionProperty: '[opacity]',
      transitionDuration: 'fast',
      transitionTimingFunction: 'feedback',
    },
  },

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

  ruleLine: {
    value: { content: '""', width: 'lg', height: '2px', background: 'current', flexShrink: '0' },
  },

  disclosureIndicator: {
    value: {
      display: 'inline-flex',
      transitionProperty: '[transform]',
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
