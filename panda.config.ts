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
      highlight: { bg: 'highlight', color: 'black' },
      outline: {
        color: 'highlight',
        bg: 'scrim',
        borderWidth: '1px',
        borderColor: 'highlightFaint',
      },
      muted: { color: 'muted', borderWidth: '1px', borderColor: 'divider' },
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
    padding: '0',
    background: 'transparent',
    borderWidth: '0',
    cursor: 'pointer',
    transition: 'color {durations.normal} ease, transform {durations.normal} {easings.expo}',
    _disabled: { opacity: '0.5', cursor: 'not-allowed' },
    _focusVisible: { outline: '2px solid token(colors.action)', outlineOffset: '2px' },
  },
  variants: {
    size: {
      sm: { width: '40px', height: '40px' },
      md: { width: '44px', height: '44px' },
      lg: {
        width: { base: '48px', md: '56px', lg: '64px' },
        height: { base: '48px', md: '56px', lg: '64px' },
      },
    },
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
  defaultVariants: { size: 'md', tone: 'default' },
})

/**
 * Card — base contained-surface shell (ZSB-71).
 * Backs the FeaturedEvents poster frame, the EditionsNav hairline box, and the
 * IsdayBadge surface. Owns only the shared shell: a clipped, relatively-positioned
 * flex column with its own stacking context (so scrims / stamps / stretched links
 * layer predictably). `surface` (bare | dark | light) is the frame treatment;
 * `interactive` flags a hoverable target. Per-consumer hover motion (image zoom,
 * underline-grow) stays a consumer concern — the shell owns chrome, not motion.
 */
const card = defineRecipe({
  className: 'card',
  description:
    'Base card shell — replaces the FeaturedEvents / EditionsNav / IsdayBadge containers',
  base: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    isolation: 'isolate',
    color: 'inherit',
    textDecoration: 'none',
  },
  variants: {
    /** The frame treatment: `bare` lets an image be the frame (FeaturedEvents),
     *  `dark` is a hairline box on black (EditionsNav), `light` a bordered surface
     *  with a faint lift on a light ground (IsdayBadge). */
    surface: {
      bare: { background: 'transparent' },
      dark: { background: 'transparent', borderWidth: '1px', borderColor: 'divider' },
      light: {
        background: 'surfaceLight',
        borderWidth: '1px',
        borderColor: 'dividerLight',
        boxShadow: 'card',
      },
    },
    interactive: {
      true: { cursor: 'pointer' },
    },
  },
  defaultVariants: { surface: 'dark', interactive: false },
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
      },
      tokens: {
        colors: {
          gray: grayRamp,
          // Brand anchors, authored in OKLCH (measured from the legacy hexes).
          pink: { value: 'oklch(61.6% 0.2527 355)' },
          lightPink: { value: 'oklch(91.3% 0.0492 343)' },
          chartreuse: { value: 'oklch(87.9% 0.1981 115)' },
          black: { value: 'oklch(15.6% 0.0115 312)' },
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
          lg: { value: 'clamp(22px, 21.35px + 0.2038vw, 25px)' },
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
          // Translucent overlays — close the audit's "ad-hoc opacity / untokenized
          // badge tone" gaps. Alpha (not the solid gray ramp) because these layer
          // over imagery, where the ground must read through.
          scrim: { value: 'rgb(0 0 0 / 0.35)' }, // backdrop behind chips/badges on media
          highlightFaint: { value: 'color-mix(in oklch, {colors.chartreuse} 32%, transparent)' }, // chartreuse hairline
          onMedia: { value: 'rgb(255 255 255 / 0.55)' }, // dimmed control foreground over imagery
        },
        // Stepped-responsive tokens: faithful to the :root media-query overrides.
        fontSizes: {
          '2xs': { value: { base: '8px', lg: '9px', '4xl': '10px' } },
          xs: { value: { base: '10px', lg: '11px' } },
          sm: { value: { base: '12px', '4xl': '13px' } },
        },
        spacing: {
          md: { value: { base: '16px', md: '20px' } },
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
      recipes: { badge, eyebrow, button, textLink, iconButton, card },
    },
  },
})
