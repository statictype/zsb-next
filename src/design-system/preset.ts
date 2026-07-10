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
          return { textStyle: variant, ...rest }
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
    ':focus-visible': { outline: 'focus', outlineOffset: 'token(spacing.xs)' },
    ':disabled, [aria-disabled=true]': { opacity: 0.5, cursor: 'not-allowed' },
  },
})

export default designSystemPreset
