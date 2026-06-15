# Panda CSS with an OKLCH token theme (reverses "CSS Modules only")

The styling foundation was strong at the token layer (semantic roles, a `clamp()`
type scale) but fragmented one level up: a design-language audit found 8+ badge
variants, 3 link patterns, 2 unrelated button systems, 3 eyebrow treatments, and
3 arrow-control implementations. The cause wasn't bad tokens — it was that CSS
Modules give no structured, typed way to express *variants*, so every component
hand-rolled its own version of the same role and the drift kept recurring.

## Adopt Panda CSS as the styling layer; build variant-driven primitives as recipes

We reverse the previous "CSS Modules only. No Tailwind, no CSS-in-JS" rule and
adopt **Panda CSS** (zero-runtime, build-time, PostCSS-based). Its **recipes** are
variant-driven primitives by construction — the exact shape the shared
`Badge`/`Button`/`Eyebrow`/etc. need ([ZSB-71]) — and its theme is authored in
TypeScript, which lets the token system be *generated* rather than hand-listed.

Panda was chosen over **vanilla-extract** (the other finalist): both are
zero-runtime and Turbopack-compatible under Next 16, but Panda's recipes map more
directly onto "primitive with variant props", and its TS theme makes the
generated OKLCH ramp (below) natural. Tailwind was rejected — utility-class churn
away from CSS Modules with variants bolted on via a separate helper.

### Palette: OKLCH anchors + a generated gray ramp

Measuring the legacy palette in OKLCH revealed the ~18 grays (incl. the
`350/750/850` half-steps) were one systematic ramp: a magenta-leaning hue (~345°)
at very low chroma, varying only in lightness. So the gray scale is now
**generated from a single anchor** (fixed hue + chroma, stepped lightness) instead
of 18 hand-picked hexes, and the brand anchors (pink, chartreuse, ink) are
authored in OKLCH. Grays stay **solid** — they're used for text over media
(scrims, galleries, Hero), where translucency would read through the image; alpha
is reserved for adaptive solid-surface roles (dividers/overlays) later.

## Update (migration complete) — CSS Modules fully retired

The incremental migration described below is **done**: every `*.module.css` has
been migrated to Panda (shared primitives + co-located `sva`/`css`) and deleted —
zero CSS Modules remain. The legacy `globals.css` `:root` token block is gone;
`globals.css` is now just the cascade-layer declaration, the `--mb-angle`
`@property`, and the element reset, whose `body` reads Panda's emitted token vars
(`--colors-*` / `--fonts-*` / …) directly. A hard ESLint `no-restricted-imports`
rule bans any new `*.module.css` import, so the move can't silently regress. The
"two layers coexist" section below is retained as the historical record of how the
migration ran.

## Migration is incremental; the two layers coexist

Panda and CSS Modules run side by side. Panda's PostCSS plugin processes its
`@layer` entry; Next keeps handling `*.module.css`. The Panda theme imports the
existing semantic roles so the `globals.css` investment carries over rather than
being rewritten, and `preflight` is **off** so no reset is injected mid-migration.
Panda tokens emit under a `--colors-*` / `--spacing-*` namespace, distinct from the
legacy `--action` / `--space-*` vars, so the two never collide while both exist.

The 404 page (`src/app/not-found.tsx`) is migrated first as the proof: a real,
static, self-contained route moved fully off CSS Modules / `globals.css` tokens
onto Panda `css()` + tokens, building green alongside the still-CSS-Modules rest
of the site.

## Considered alternatives

- **Stay on CSS Modules + a variants helper (cva).** Keeps the status quo and adds
  type-safe variants, but leaves tokens hand-listed and doesn't give a token-aware
  authoring surface; the audit's fragmentation was as much about no shared
  *primitive* as about variant ergonomics.
- **vanilla-extract.** Closer to CSS Modules mentally (`.css.ts`), but more verbose
  recipes, smaller ecosystem, and Turbopack support is newer than Panda's PostCSS
  path.
- **Tailwind v4.** Largest ecosystem, but a utility-first rewrite that abandons the
  semantic-token discipline already in place.

## Consequences

- New dependency `@pandacss/dev`; a generated `styled-system/` dir (gitignored,
  regenerated via `prepare` → `panda codegen`); `postcss.config.mjs`; a `panda.css`
  entry imported in the root layout; a `styled-system` tsconfig path alias.
- Primitives ([ZSB-71]) are authored as Panda recipes; legacy one-offs are migrated
  onto them and deleted.
- Token enforcement ([ZSB-75]) keeps raw values out once primitives land — the
  guardrail that stops the fragmentation from recurring.
- `globals.css` shrinks over time as roles move into the Panda theme; it stays the
  source for anything not yet migrated.

## Reversibility

Low-to-medium while migration is partial (both systems present, easy to stop), but
the intent is a one-way move: as components migrate and `globals.css` tokens are
removed, reverting means re-authoring them. Recorded so a future reader knows the
"CSS Modules only" rule was deliberately retired here, not forgotten.

See also: [ADR 0012] (the Cache Components fetch split — why `/styleguide`, which
renders time-dependent components, is dev-only and not part of this proof).

[ADR 0012]: ./0012-cache-components-three-layer-fetch.md
[ZSB-71]: https://linear.app/zsb/issue/ZSB-71
[ZSB-75]: https://linear.app/zsb/issue/ZSB-75
