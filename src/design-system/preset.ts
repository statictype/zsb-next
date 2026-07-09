import { definePreset } from '@pandacss/dev'
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
  patterns: { extend: { editorialSplit } },
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
})

export default designSystemPreset
