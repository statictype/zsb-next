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
        bg: 'rgb(0 0 0 / 0.35)',
        borderWidth: '1px',
        borderColor: 'color-mix(in oklch, oklch(87.9% 0.1981 115) 32%, transparent)',
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
        boxShadow: '0 1px 0 rgb(255 255 255 / 0.25) inset, 0 6px 16px rgb(0 0 0 / 0.25)',
        transform: 'rotate(-0.7deg)',
      },
    },
  },
  defaultVariants: { tone: 'highlight', size: 'md' },
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
        },
        // Stepped-responsive tokens: faithful to the :root media-query overrides.
        fontSizes: {
          '2xs': { value: { base: '8px', lg: '9px', '4xl': '10px' } },
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
      recipes: { badge },
    },
  },
})
