/**
 * Ground maps (Q2): locally redefine Panda's own emitted token vars so
 * `heading`/`body`/`muted`/`surface`/`divider` role tokens resolve to their
 * ground's values wherever a map is spread in. className-only — no
 * `data-ground` attribute, no nested-opposite handling. Shared by `card`'s
 * ground variants and `section`'s — the one definition of each ground.
 */
export const groundDarkVars = {
  '--colors-surface': '{colors.black}',
  '--colors-heading': '{colors.white}',
  '--colors-body': '{colors.gray.400}',
  '--colors-muted': '{colors.gray.600}',
  '--colors-divider': '{colors.gray.900}',
}

export const groundLightVars = {
  '--colors-surface': '{colors.white}',
  '--colors-heading': '{colors.black}',
  '--colors-body': '{colors.gray.700}',
  '--colors-muted': '{colors.gray.600}',
  '--colors-divider': '{colors.gray.200}',
  '--colors-brush-stroke': '{colors.action}',
  '--borders-hairline': '1px solid var(--colors-divider)',
}
