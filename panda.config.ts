import { defineConfig, defineRecipe } from '@pandacss/dev'

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

/**
 * Badge — the first unified primitive (ZSB-71 spike proof).
 * Collapses the 8 legacy pill/chip/tape-label/status-badge variants into one
 * recipe with `tone` × `size` × `elevated`.
 */
const badge = defineRecipe({
  className: 'badge',
  description: 'Unified tag/chip/badge — replaces the legacy pill/chip/tape/status variants',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    width: 'fit-content',
    fontFamily: 'body',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    lineHeight: '1.3',
    whiteSpace: 'nowrap',
  },
  variants: {
    tone: {
      // Solid chartreuse fill, chartreuse hairline chip, solid dark fill. The
      // old `outline` (chartreuse) and `muted` (gray) hairlines were the same
      // role on different grounds — collapsed to one brand-forward hairline.
      highlight: { bg: 'highlight', color: 'black' },
      outline: { color: 'highlight', borderWidth: '1px', borderColor: 'highlightFaint' },
      dark: { bg: 'gray.800', color: 'white' },
    },
    size: {
      sm: { fontSize: '8px', paddingInline: '8px', paddingBlock: '3px' },
      md: { fontSize: '10px', paddingInline: '12px', paddingBlock: '6px' },
    },
    elevated: {
      true: {
        boxShadow: 'badge',
        transform: 'rotate(-0.7deg)',
      },
    },
  },
  defaultVariants: { tone: 'highlight', size: 'md' },
})

/**
 * Eyebrow — unified kicker/label above headings (ZSB-71).
 * Collapses `.eyebrowMuted` (with decorative rule), the StripControls eyebrow
 * (muted, no rule) and the FeaturedEvents eyebrow (highlight, smaller) into one
 * recipe: `tone` × `size` × `rule`. The rule inherits the text color.
 */
const eyebrow = defineRecipe({
  className: 'eyebrow',
  description:
    'Unified eyebrow/kicker — replaces .eyebrowMuted + StripControls/FeaturedEvents eyebrows',
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontFamily: 'body',
    textTransform: 'uppercase',
    letterSpacing: 'wide',
    lineHeight: 'heading',
    color: 'muted',
  },
  variants: {
    tone: {
      muted: { color: 'muted' },
      highlight: { color: 'highlight' },
    },
    size: {
      sm: { fontSize: '2xs' },
      md: { fontSize: 'xs' },
    },
    rule: {
      true: {
        _before: {
          content: '""',
          width: '40px',
          height: '2px',
          background: 'currentColor',
          flexShrink: '0',
        },
      },
    },
  },
  defaultVariants: { tone: 'muted', size: 'md', rule: false },
})

/**
 * Button — unified action primitive (ZSB-71).
 * Collapses MagneticButton's filled/outlined looks + CookieBanner's solid/ghost
 * into `variant` (solid | outline | ghost) × `size` (sm | md | lg), sizing ported
 * from the legacy --btn-* tokens. The magnetic/ripple GSAP behaviour and the
 * text-link "secondary" are out of scope here (behaviour → ZSB-74; link → TextLink).
 */
const button = defineRecipe({
  className: 'btn',
  description: 'Unified button — replaces MagneticButton variants + CookieBanner buttons',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'body',
    fontWeight: 'semibold',
    textTransform: 'uppercase',
    cursor: 'pointer',
    borderRadius: '0',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    transition:
      'color {durations.normal} ease, background-color {durations.normal} ease, border-color {durations.normal} ease, filter {durations.normal} ease',
    _disabled: { opacity: '0.5', cursor: 'not-allowed' },
    _focusVisible: { outline: '2px solid token(colors.action)', outlineOffset: '2px' },
  },
  variants: {
    variant: {
      solid: {
        bg: 'action',
        color: 'white',
        borderColor: 'action',
        _hover: { filter: 'brightness(1.1)' },
      },
      outline: {
        bg: 'transparent',
        color: 'action',
        borderColor: 'action',
        _hover: { bg: 'action', color: 'white' },
      },
      ghost: {
        bg: 'transparent',
        color: 'muted',
        borderColor: 'divider',
        _hover: { color: 'heading', borderColor: 'heading' },
      },
      // Borderless text control that blends into the surrounding copy
      // (inherits font/size/case/tracking from context) — e.g. the footer
      // "Cookie Settings" sitting beside the Privacy Policy link.
      link: {
        display: 'inline',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        fontWeight: 'inherit',
        textTransform: 'inherit',
        letterSpacing: 'inherit',
        borderWidth: '0',
        bg: 'transparent',
        color: 'muted',
        _hover: { color: 'action' },
      },
    },
    size: {
      sm: {
        fontSize: { base: '9px', md: '10px' },
        letterSpacing: '1.5px',
        gap: '5px',
        paddingBlock: { base: '6px', md: '8px' },
        paddingInline: { base: '16px', md: '20px' },
      },
      md: {
        fontSize: { base: '10px', lg: '11px', '2xl': '13px' },
        letterSpacing: '2px',
        gap: { base: '8px', md: '10px' },
        paddingBlock: { base: '10px', md: '12px', lg: '14px', '2xl': '16px' },
        paddingInline: { base: '24px', md: '28px', lg: '32px', '2xl': '36px' },
      },
      lg: {
        fontSize: { base: '11px', md: '12px', '2xl': '13px' },
        letterSpacing: { base: '2px', lg: '2.5px' },
        gap: { base: '10px', md: '12px', lg: '14px' },
        paddingBlock: { base: '12px', md: '16px', lg: '20px', '2xl': '24px' },
        paddingInline: { base: '28px', md: '36px', lg: '44px', '2xl': '52px' },
      },
    },
  },
  // The `link` variant is sizeless — neutralize the default size's padding/gap.
  compoundVariants: [
    {
      variant: 'link',
      css: { paddingBlock: '0', paddingInline: '0', gap: '0' },
    },
  ],
  defaultVariants: { variant: 'solid', size: 'md' },
})

/**
 * TextLink — unified inline link primitive (ZSB-71).
 * Collapses the Footer underline-draw, the FeaturedEvents bottom-border link and
 * the MagneticButton "secondary" into `underline` (draw | border | quiet).
 * (The Navigation pill is button-shaped → stays a Button concern.)
 */
const textLink = defineRecipe({
  className: 'textlink',
  description:
    'Unified inline text link — replaces Footer / FeaturedEvents / secondary link styles',
  base: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'sm',
    color: 'inherit',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color {durations.normal} ease',
  },
  variants: {
    underline: {
      draw: {
        _after: {
          content: '""',
          position: 'absolute',
          left: '0',
          bottom: '-3px',
          width: '0',
          height: '1px',
          background: 'action',
          transition: 'width {durations.normal} {easings.expo}',
        },
        _hover: { color: 'heading', _after: { width: '100%' } },
      },
      border: {
        borderBottomWidth: '1px',
        borderBottomColor: 'divider',
        paddingBottom: 'xs',
        _hover: { color: 'action', borderBottomColor: 'action' },
      },
      quiet: { _hover: { color: 'action' } },
    },
  },
  defaultVariants: { underline: 'draw' },
})

/**
 * IconButton — unified square icon control (ZSB-71).
 * Collapses the StripControls prev/next, the HeroSlideshow nav (prev/toggle/next),
 * and the Lightbox close + prev/next into one recipe: `size` (sm | md | lg, the
 * 40 / 44 / responsive --btn-size scale) × `tone` (default | media). Per-control
 * icon motion (arrow nudge, close rotate) stays a consumer concern via the shared
 * `transform` transition in the base — the primitive owns only chrome + states.
 */
const iconButton = defineRecipe({
  className: 'iconbtn',
  description:
    'Unified icon control — replaces StripControls / Slideshow / Lightbox arrows + close',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    // One size: 44px, the WCAG tap-target floor. The old 40/44/48 spread was
    // drift, not deliberate — the control reads the same everywhere now.
    width: '44px',
    height: '44px',
    padding: '0',
    background: 'transparent',
    borderWidth: '0',
    cursor: 'pointer',
    transition: 'color {durations.normal} ease, transform {durations.normal} {easings.expo}',
    _disabled: { opacity: '0.5', cursor: 'not-allowed' },
    _focusVisible: { outline: '2px solid token(colors.action)', outlineOffset: '2px' },
  },
  variants: {
    /** Resting/hover colour. `default` sits on the canvas; `media` is the dimmed
     *  translucent-white treatment for controls layered over imagery. */
    tone: {
      default: { color: 'heading', _hover: { _enabled: { color: 'action' } } },
      media: {
        color: 'onMedia',
        _hover: { _enabled: { color: 'white' } },
      },
    },
  },
  defaultVariants: { tone: 'default' },
})

/**
 * Card — the one unified card (ZSB-71).
 * Every card on the site is the same object: a hairline-bordered surface — ZSB's
 * signature is that hairline box. `ground` carries the one hairline language onto
 * black (`onDark`) or white (`onLight`); `interactive` adds the single normalized
 * hover shared by all cards (the hairline warms to the accent + a small lift).
 * The shell owns chrome + that hover; title-colour shifts and image zoom stay
 * consumer concerns. Backs editions / events / editions-nav / gallery cards.
 */
const card = defineRecipe({
  className: 'card',
  description: 'Unified hairline card — editions / events / editions-nav / gallery',
  base: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    isolation: 'isolate',
    color: 'inherit',
    textDecoration: 'none',
    borderWidth: '1px',
    borderStyle: 'solid',
  },
  variants: {
    /** The ground the hairline sits on — the same box language on either. */
    ground: {
      onDark: { background: 'transparent', borderColor: 'divider' },
      onLight: { background: 'surfaceLight', borderColor: 'dividerLight', boxShadow: 'card' },
    },
    /** The one hover every card shares: the hairline warms to the accent.
     *  GPU-safe (border-color only — no lift). */
    interactive: {
      true: {
        cursor: 'pointer',
        transition: 'border-color {durations.normal} {easings.expo}',
        _hover: { borderColor: 'action' },
      },
    },
  },
  defaultVariants: { ground: 'onDark', interactive: false },
})

export default defineConfig({
  // Panda's CSS reset is intentionally OFF — the site keeps its existing global
  // styles during the incremental migration; we don't want a reset mid-flight.
  preflight: false,
  // Utilities only, none of Panda's opinionated default theme/colors.
  presets: ['@pandacss/preset-base'],
  include: ['./src/**/*.{ts,tsx}'],
  exclude: [],
  jsxFramework: 'react',
  outdir: 'styled-system',
  // Mirror the stepped breakpoints from globals.css (mobile-first).
  theme: {
    extend: {
      breakpoints: {
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
        '3xl': '1536px',
        '4xl': '1792px',
      },
      keyframes: {
        fadeSlideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        glowDrift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(30px, -20px) scale(1.1)' },
        },
        // PartnerBadge's continuously-rotating text ring.
        spin: { to: { transform: 'rotate(-360deg)' } },
        // Carousel item's animated gradient hover border.
        gradientBorderShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        // HeroSlideshow per-slide progress line (scaleX, GPU-only).
        heroProgress: { from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } },
        // MagneticButton click ripple + gradient-border ring spin (hero CTA).
        rippleAnim: { to: { transform: 'scale(4)', opacity: 0 } },
        mbGradientSpin: { to: { '--mb-angle': '360deg' } },
      },
      tokens: {
        colors: {
          gray: grayRamp,
          // Brand anchors, authored in OKLCH (measured from the legacy hexes).
          pink: { value: 'oklch(61.6% 0.2527 355)' },
          lightPink: { value: 'oklch(91.3% 0.0492 343)' },
          chartreuse: { value: 'oklch(87.9% 0.1981 115)' },
          black: { value: 'oklch(15.6% 0.0115 312)' },
          // True black. The brand `black` is intentionally magenta-tinted ink;
          // a few surfaces (the events board) want a pure, un-tinted ground.
          blackPure: { value: '#000' },
          white: { value: '#fff' },
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
          xs: { value: '4px' },
          sm: { value: '8px' },
          lg: { value: 'clamp(24px, 18.78px + 1.6304vw, 48px)' },
          xl: { value: 'clamp(32px, 23.3px + 2.7174vw, 72px)' },
        },
        radii: {
          pill: { value: '100px' },
          circle: { value: '50%' },
        },
        sizes: {
          // The site content rail (`.sectionInner` max-width).
          maxWidth: { value: '1800px' },
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
          fast: { value: '200ms' },
          normal: { value: '300ms' },
          medium: { value: '400ms' },
          slow: { value: '500ms' },
          reveal: { value: '600ms' },
        },
        easings: {
          expo: { value: 'cubic-bezier(0.16, 1, 0.3, 1)' },
          quint: { value: 'cubic-bezier(0.23, 1, 0.32, 1)' },
        },
        // The two primitive shadows the audit found inlined (ad-hoc opacities):
        // the Card's faint lift and the Badge's pinned-paper elevation.
        shadows: {
          card: { value: '0 2px 12px rgb(0 0 0 / 0.03)' },
          badge: { value: '0 1px 0 rgb(255 255 255 / 0.25) inset, 0 6px 16px rgb(0 0 0 / 0.25)' },
        },
      },
      semanticTokens: {
        colors: {
          canvas: { value: '{colors.black}' },
          surfaceLight: { value: '{colors.gray.100}' },
          heading: { value: '{colors.white}' },
          headingLight: { value: '{colors.black}' },
          body: { value: '{colors.gray.400}' },
          bodyLight: { value: '{colors.gray.700}' },
          muted: { value: '{colors.gray.600}' },
          divider: { value: '{colors.gray.900}' },
          dividerLight: { value: '{colors.gray.200}' },
          action: { value: '{colors.pink}' },
          highlight: { value: '{colors.chartreuse}' },
          // Two purposeful translucent roles (the audit's scattered ad-hoc
          // opacities collapse to these). `highlightFaint` references the
          // chartreuse anchor so the brand hue stays single-sourced.
          highlightFaint: { value: 'color-mix(in oklch, {colors.chartreuse} 32%, transparent)' }, // chartreuse hairline
          onMedia: { value: 'rgb(255 255 255 / 0.55)' }, // dimmed control foreground over imagery
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
          content: {
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
        },
      },
      // Typography utilities ported from Shared.module.css. Pure type — margins
      // and max-width that the legacy classes carried move to the call site.
      // `pill`/`eyebrowMuted` are intentionally NOT here: they are the Badge /
      // Eyebrow recipes; consumers adopt those instead.
      textStyles: {
        sectionTitle: {
          value: {
            fontFamily: 'display',
            fontSize: { base: 'xl', md: '2xl' },
            lineHeight: 'display',
            textTransform: 'uppercase',
          },
        },
        sectionHeadline: {
          value: {
            fontFamily: 'display',
            fontSize: 'clamp(40px, 7vw, 96px)',
            lineHeight: '0.9',
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
        subsectionTitle: {
          value: {
            fontFamily: 'display',
            fontSize: { base: 'xl', md: '2xl', '3xl': '3xl' },
            lineHeight: 'heading',
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
        heroLead: {
          value: {
            fontFamily: 'body',
            fontSize: { base: 'base', '2xl': 'md' },
            lineHeight: 'body',
            // Exception: lead emphasis, brighter than `body`.
            color: 'gray.200',
          },
        },
        heroBody: {
          value: { fontFamily: 'body', fontSize: 'base', lineHeight: 'body', color: 'body' },
        },
        lead: {
          value: { fontFamily: 'body', fontSize: 'base', lineHeight: 'body', color: 'body' },
        },
        labelText: {
          value: {
            fontFamily: 'body',
            fontSize: '2xs',
            fontWeight: 'semibold',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
          },
        },
        labelSmall: {
          value: {
            fontFamily: 'body',
            fontSize: '2xs',
            fontWeight: 'semibold',
            letterSpacing: 'label',
            textTransform: 'uppercase',
          },
        },
      },
      // Section / page-shell layout ported from Shared.module.css. Authoring
      // these as layerStyles dissolves the old section-padding ordering bug —
      // Panda dedupes at the property level, so a later class can override pad.
      layerStyles: {
        section: { value: { paddingBlock: 'sectionY', paddingInline: 'content' } },
        sectionDark: { value: { background: 'blackPure', color: 'white' } },
        sectionLight: { value: { background: 'white', color: 'black' } },
        sectionInner: { value: { maxWidth: 'maxWidth', marginInline: 'auto' } },
        pageHero: {
          value: {
            background: 'blackPure',
            color: 'white',
            paddingTop: {
              base: 'calc(token(sizes.nav) + 80px)',
              md: 'calc(token(sizes.nav) + 120px)',
            },
            paddingBottom: { base: '2xl', md: '3xl' },
            paddingInline: 'content',
          },
        },
        // NB `sectionHeader` (flex layout) and `skeleton` (positioned + animated)
        // are NOT layerStyles — Panda layerStyles are surface props only. They
        // migrate with their first consumer (sectionHeader → inline css; skeleton
        // → a shared css helper + the pulse keyframe).
      },
      recipes: { badge, eyebrow, button, textLink, iconButton, card },
    },
  },
})
