import { definePattern, definePreset } from '@pandacss/dev'
import { manifestoTitle, navigationLabel } from './patterns/typography'
import { editorialSplit } from './recipes/editorial-split'
import { recipes } from './recipes/index'
import {
  animationStyles,
  breakpoints,
  conditions,
  keyframes,
  layerStyles,
  semanticTokens,
  textStyles,
  tokens,
} from './tokens'

// `strictTokens` is ON (panda.config.ts): every value is a token; remaining
// `[bracketed]` literals in recipes are migration backlog to tokenize, not
// sanctioned exceptions.
export const designSystemPreset = definePreset({
  name: 'zsb-design-system',
  conditions: { extend: conditions },
  // The motion contract: two verbs, one easing. `interactive` is state
  // feedback (hovers, glyph nudges); `develop` is movement/reveal (image
  // develops, label rolls, panel slides). Call sites say which verb, never
  // the physics — raw transition longhands belong to this preset only.
  utilities: {
    extend: {
      transition: {
        values: ['interactive', 'develop', 'none'],
        // Panda merges (not replaces) the built-in value names into the
        // type union; anything but the three verbs is a deliberate no-op so
        // a legacy name can never smuggle its own physics back in.
        transform(value: string, { token }) {
          if (value === 'none') return { transition: 'none' }
          if (value !== 'interactive' && value !== 'develop') return {}
          return {
            transitionProperty:
              value === 'interactive'
                ? 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, opacity, transform'
                : 'opacity, transform, translate, scale, filter',
            transitionDuration: token(`durations.${value === 'interactive' ? 'fast' : 'normal'}`),
            transitionTimingFunction: token('easings.quint'),
          }
        },
      },
    },
  },
  patterns: {
    extend: {
      stack: { defaultValues: { gap: 'md' } },
      hstack: { defaultValues: { gap: 'sm' } },
      wrap: { defaultValues: { gap: 'sm', align: 'center' } },
      grid: {
        defaultValues: (props) => ({
          gap: props.columnGap || props.rowGap ? undefined : 'gridGap',
        }),
      },
      container: {
        defaultValues: { maxWidth: 'maxWidth', px: 'gutter', position: 'static' },
      },
      editorialSplit,
      manifestoTitle,
      navigationLabel,
      text: definePattern({
        jsxName: 'Text',
        jsxElement: 'span',
        properties: {
          variant: {
            type: 'enum',
            value: ['display', 'title', 'heading', 'lead', 'body', 'caption', 'label'],
          },
        },
        defaultValues: { variant: 'body' },
        blocklist: [
          'fontSize',
          'fontFamily',
          'fontWeight',
          'letterSpacing',
          'lineHeight',
          'textTransform',
          'textStyle',
        ],
        transform({ variant, ...rest }) {
          const ink =
            variant === 'display' || variant === 'title' || variant === 'heading'
              ? 'heading'
              : variant === 'label'
                ? 'muted'
                : 'body'
          return { textStyle: variant, color: ink, ...rest }
        },
      }),
    },
  },
  // Mirror the stepped breakpoints from globals.css (mobile-first).
  theme: {
    extend: {
      breakpoints,
      keyframes,
      tokens,
      semanticTokens,
      animationStyles,
      textStyles,
      layerStyles,
      recipes,
    },
  },
  globalCss: {
    body: { textStyle: 'body', color: 'body', background: 'surface' },
    ':focus-visible': { outline: 'focus', outlineOffset: 'token(spacing.xs)' },
    ':disabled, [aria-disabled=true]': { opacity: 0.5, cursor: 'not-allowed' },
    // The one reduced-motion rule: states still change, they just snap.
    '@media (prefers-reduced-motion: reduce)': {
      '*, *::before, *::after': {
        animationDuration: '0.01ms!',
        animationIterationCount: '1!',
        animationDelay: '0ms!',
        transitionDuration: '0.01ms!',
      },
    },
  },
})

export default designSystemPreset
