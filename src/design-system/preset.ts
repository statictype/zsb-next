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

// Raw-value policy (`strictTokens` is ON — see panda.config.ts): every style
// value must be a token — no exceptions. Anything that recurs is a token or
// composition — shadows (card/badge/modal/frame/tape), the hero vignette
// gradient, the skeleton + gradient-border layer styles.
//
// `[bracketed]` literals still scattered through the recipes are migration
// backlog, not sanctioned art direction. Resolve every one: snap to the
// nearest token (accept a small visual delta) or refactor/recompose (extract
// a layerStyle, merge near-duplicate slots, derive one value from another via
// a token-backed CSS var instead of hardcoding both). There is no load-bearing
// exception that stays raw — a bracket is debt to remove, never a value to
// keep and explain. New values follow the same test: second occurrence →
// token.
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
