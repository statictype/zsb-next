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
// value must be a token, or a deliberate `[bracketed]` exception. Anything that
// recurs is a token or composition — shadows (card/badge/modal/frame/tape),
// the hero vignette gradient, the skeleton + gradient-border layer styles.
//
// MIGRATION IN PROGRESS: the `[bracketed]` literals still scattered through the
// recipes are NOT a sanctioned art-direction set — they are a backlog. ~95% can
// still be resolved: snap to the nearest token (accept a small visual delta) or
// refactor / recompose (extract a layerStyle, merge near-duplicate slots). Only
// a genuine residue is load-bearing one-off art direction (local scrims, the
// artists-table barcode, mask geometry, %-centering / hairline px) where a
// token would only launder a magic number into a magic name. Treat a bracket as
// debt to justify or remove, not as a blessed exception. New values follow the
// same test: second occurrence → token.
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
