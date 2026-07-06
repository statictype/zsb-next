/**
 * The light-ground flip (Q2): locally redefines Panda's own emitted token
 * vars so `heading`/`body`/`surface`/`divider`/`brushStroke`/`hairline` role
 * tokens resolve to their light-ground values wherever this is spread in.
 * className-only — no `data-ground` attribute, no nested-opposite handling.
 * Shared by `card`'s `onLight` and `section`'s `light` ground variants —
 * the one definition of what "light ground" means.
 */
export const groundLightVars = {
  '--colors-surface': '{colors.white}',
  '--colors-heading': '{colors.black}',
  '--colors-body': '{colors.gray.700}',
  '--colors-divider': '{colors.gray.200}',
  '--colors-brush-stroke': '{colors.action}',
  '--borders-hairline': '1px solid var(--colors-divider)',
}
