# Consolidate the action primitives into one `button`

A system-integrity audit found the action primitives had re-fragmented: a separate
`textLink` recipe, a separate `MagneticButton` component, hand-rolled arrow-links in
five places, and the error page reimplementing a button. We **fold them into one
`button` recipe** — `variant: primary | secondary | ghost | text` × `size` ×
`magnetic` (the GSAP magnet, was a whole component) × `icon` — and retire `textLink`
and `MagneticButton`. The `text` variant drops its trailing arrow; the magnetic
behavior drops its click ripple and hover glow/nudge (motion is normalized
separately).

This **extends [ADR 0017]** (variant-driven primitives) and reverses part of the
[ZSB-71] primitive split, which had `textLink` and `MagneticButton` as their own
primitives — in practice they were the same action role at different fidelities, so
the split produced drift rather than clarity.

## Status

Accepted (planned) — lands across the design-system refactor plan: the recipe
rework first (additive), then the `textLink` and `MagneticButton` retirements.

## Considered alternatives

- **Keep `textLink` separate.** A link and a button are semantically distinct
  (`<a>` vs `<button>`). But the *styling* is one role; the element stays correct at
  the call site (the recipe is element-agnostic), and one recipe kills the three
  drifting link patterns the audit found. Rejected on drift grounds.
- **Keep `MagneticButton` as a component.** It added a whole component for a hover
  behavior over an otherwise-standard button. A `magnetic` modifier on `button`
  expresses the same thing without a parallel chrome implementation.

[ADR 0017]: ./0017-panda-css-with-oklch-token-theme.md
[ZSB-71]: https://linear.app/zsb/issue/ZSB-71
