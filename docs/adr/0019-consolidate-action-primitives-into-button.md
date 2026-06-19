# Consolidate the action primitives into one `button`

A system-integrity audit found the action primitives had re-fragmented: a separate
`textLink` recipe, a separate `MagneticButton` component, a separate `iconButton`
recipe/`<IconButton>` component, hand-rolled arrow-links in five places, and the
error page reimplementing a button. We **fold them into one `button` recipe** —
`variant: primary | secondary | ghost | text | icon` × `size` — and retire
`textLink`, `MagneticButton`, and `iconButton`. The `icon` variant is a 44px square
borderless control (white→action); its old `media` tone is dropped (one hover, no
variation). The `text` variant drops its
trailing arrow. The magnetic interaction is removed entirely: it was an
AI-selected behavior rather than part of a deliberate motion language, so no
`button({ magnetic })` modifier is added.

This **extends [ADR 0017]** (variant-driven primitives) and reverses part of the
[ZSB-71] primitive split, which had `textLink` and `MagneticButton` as their own
primitives — in practice they were the same action role at different fidelities, so
the split produced drift rather than clarity.

## Element choice — `asChild`

The styling is one role, but the *element* varies (`<button>` vs `<a>`/`<Link>`, or
a non-interactive `<span>` inside a card link). The `<Button>` component therefore
takes an **`asChild` (Slot) prop**: with `asChild`, Button renders no element of its
own and merges its variant className + props onto the child element the call site
provides — `<Button asChild variant="text"><a href>…</a></Button>` →
`<a class="button…" href>…</a>`. No wrapper, no nested-interactive.

This replaces the earlier pattern of applying the raw `button({…})` recipe className
plus per-site override classes (which had re-drifted the typography — e.g. editions
`.cta`, VisitSection `directionsLink`). A polymorphic **`as` prop** was rejected: the
generic-component types (polymorphic `forwardRef`, native prop collisions) are far
messier than a fixed-prop component whose child carries its own native, correctly
typed props. The `button({…})` recipe stays available for pure styling needs.

## Status

Accepted — superseded in part during execution. The `textLink` consolidation
stands; `MagneticButton` was retired without adding a magnetic modifier.

## Considered alternatives

- **Keep `textLink` separate.** A link and a button are semantically distinct
  (`<a>` vs `<button>`). But the *styling* is one role; the element stays correct at
  the call site (the recipe is element-agnostic), and one recipe kills the three
  drifting link patterns the audit found. Rejected on drift grounds.
- **Keep `MagneticButton` as a component.** It added a whole component for a hover
  behavior over an otherwise-standard button. Rejected on drift grounds; the
  behavior itself was also dropped rather than preserved as a modifier.

[ADR 0017]: ./0017-panda-css-with-oklch-token-theme.md
[ZSB-71]: https://linear.app/zsb/issue/ZSB-71
