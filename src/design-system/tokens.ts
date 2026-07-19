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
      filter: 'blur(var(--enter-blur, 0px))',
    },
    to: { opacity: '1', translate: '0 0', scale: '1', filter: 'blur(0px)' },
  },

  tapeIn: { to: { opacity: '1', translate: '0 0' } },
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
    partnerBadgeRing: { value: '40px' },
    xs: { value: 'clamp(9px, 8.76px + 0.0647vw, 10px)' },
    sm: { value: 'clamp(12px, 11.76px + 0.0647vw, 13px)' },
    base: { value: '16px' },
    md: { value: 'clamp(17px, 15.54px + 0.3883vw, 23px)' },
    lg: { value: 'clamp(26px, 18.72px + 1.9417vw, 56px)' },
    xl: { value: 'clamp(46px, 25.32px + 2.8479vw, 80px)' },
  },
  spacing: {
    '0': { value: '0px' },
    xs: { value: 'clamp(4px, 4px, 4px)' },
    sm: { value: 'clamp(8px, 8px, 8px)' },
    hairlineOverlap: { value: 'calc({borderWidths.hairline} * -1)' },
    dialogInset: { value: 'calc({borderWidths.focus} * -1)' },
    navLogoTopMd: { value: '24px' },
    navDesktopTop: { value: '32px' },
    navDesktopTopLg: { value: '40px' },
    badgeX: { value: '12px' },
    badgeY: { value: '6px' },
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
    cardOverlap: { value: '3rem' },
  },
  radii: {
    pill: { value: '100px' },
    circle: { value: '50%' },
  },
  borders: {
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
    focus: {
      value: { width: '{borderWidths.focus}', style: 'solid', color: '{colors.chartreuse}' },
    },
  },
  borderWidths: {
    '0': { value: '0px' },
    hairline: { value: '1px' },
    focus: { value: '2px' },
    gradientRing: { value: '2px' },

    // so both can share it).
    hairlineThin: { value: '0.5px' },
  },
  sizes: {
    '0': { value: '0px' },
    full: { value: '100%' },
    fit: { value: 'fit-content' },

    touch: { value: '48px' },
    navLogoBase: { value: '40px' },
    navLogoLg: { value: '56px' },
    navLogoXl: { value: '60px' },
    navIcon: { value: '24px' },
    navGlyph: { value: '18px' },
    navGlyphStroke: { value: '2px' },
    navRollOffset: { value: '110%' },
    measure: { value: '60ch' },
    maxWidth: { value: '1800px' },

    narrowColumn: { value: '520px' },
    brushStroke: { value: '3px' },
    lightboxNavColumn: { value: '80px' },
    lightboxFrameWidth: { value: '90vw' },

    lightboxNavHit: { value: '240px' },

    lightboxFrameMax: { value: 'calc(100vw - ({sizes.lightboxNavColumn} * 2))' },

    hitTarget: { value: '44px' },

    dialogPanel: { value: '540px' },
    dialogPanelWide: { value: '760px' },
    calendarPoster: { value: '220px' },

    heroTapeColumn: { value: '200px' },

    heroImageMax: { value: 'calc(100vw - {sizes.heroTapeColumn})' },
  },
  assets: {
    brushStrokeX: { value: 'polygon(0 0, 100% 0, 100% 38%, 68% 58%, 0 100%)' },
    brushStrokeY: { value: 'polygon(0 0, 100% 0, 58% 68%, 38% 100%, 0 100%)' },

    grayscaleSubtle: { value: 'grayscale(0.3)' },

    grayscaleFull: { value: 'grayscale(1)' },

    developRest: { value: 'grayscale(1) brightness(0.7)' },
    developHover: { value: 'grayscale(0.3) brightness(1)' },

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

  easings: {
    expo: { value: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    quint: { value: 'cubic-bezier(0.23, 1, 0.32, 1)' },
  },

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
      fontSize: 'lg',
      lineHeight: '1.1',
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
  manifesto: {
    value: {
      fontFamily: 'display',
      fontSize: 'xl',
      lineHeight: '1.1',
      letterSpacing: '-0.02em',
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
    value: {
      fontFamily: 'body',
      fontSize: 'base',
      lineHeight: '1.4',
      letterSpacing: '-0.018em',
      fontWeight: 'bold',
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
          fontSize: { base: 'lg', sm: 'xl' },
          lineHeight: '1',
          letterSpacing: '0.007em',
          textTransform: 'lowercase',
        },
      },
      large: {
        value: {
          fontFamily: 'display',
          fontSize: { base: 'lg', md: 'lg', lg: 'lg', xl: 'xl' },
          lineHeight: '1',
          letterSpacing: '0.007em',
          textTransform: 'lowercase',
        },
      },
      normal: {
        value: {
          fontFamily: 'display',
          fontSize: { base: 'md', md: 'lg' },
          lineHeight: '1',
          letterSpacing: '0.007em',
          textTransform: 'lowercase',
        },
      },
      rail: {
        value: {
          fontFamily: 'display',
          fontSize: { base: 'md', lg: 'lg' },
          lineHeight: '1',
          letterSpacing: '0.01em',
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

  heroTapeOffset: {
    value: {
      bottom: { base: '8%', md: '10%', lg: '11%' },
      maxWidth: { base: '94%', md: '72%', lg: '62%', xl: '58%' },
    },
  },

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
      transitionTimingFunction: 'quint',
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

  brushStrokeRule: {
    value: { content: '""', position: 'absolute', opacity: '0.85' },
  },

  ruleLine: {
    value: { content: '""', width: 'lg', height: '2px', background: 'current', flexShrink: '0' },
  },

  disclosureIndicator: {
    value: {
      display: 'inline-flex',
      transitionProperty: '[transform]',
      transitionDuration: 'fast',
      transitionTimingFunction: 'quint',
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
