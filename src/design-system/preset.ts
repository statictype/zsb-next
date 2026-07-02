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
      // Typography utilities. Pure type — margins / max-width belong at the
      // call site. Tag/kicker treatments are NOT here: they are the Badge /
      // Eyebrow recipes.
      textStyles,
      // Page-shell layout as layerStyles. The section *shell* (vertical
      // rhythm + ground) is the `section` recipe; `sectionInner` is the
      // content rail — it owns the horizontal gutter, so full-bleed children
      // placed outside the rail span the shell. `pageHero` defers its gutter
      // to the rail too (its inner is a `sectionInner`).
      layerStyles,
      recipes,
    },
  },
})

export default designSystemPreset
