# Panda pattern catalog — global layout sweep (Phase 0, strong model, run once)

Build the **frozen catalog** the per-cluster adoption prompt
(`panda-pattern-adopt.prompt.md`) consumes. This is the high-judgment pass: pin
the codebase's small set of real layout shapes, choose their canonical values,
and design the patterns the drift collapses toward. **Run once; freeze.**

The codebase went CSS-modules → slot-recipes-for-everything. That pass tokenized
values but left layout (`display:flex/grid`, `flexDirection`, gap/align/justify,
responsive shifts) encoded inside `*.recipe.ts` **slots**, applied as
`className`. There are **no layout primitives**. The apparent variety of layouts
is mostly **accidental drift** — the real pattern set is small. Your job is to
find it.

## Scope

- **In scope for the layout inventory:** `src/app/**` (routes, their
  `*.recipe.ts`, and `_components/`) and `src/components/**`.
- **Read-only source of truth:** `src/design-system/**` — tokens, `textStyles`,
  `layerStyles`, `semanticTokens`, `preset.ts`, `recipes/`. You use these to
  place values; you do not audit them for layout adoption.
- **Out of scope entirely:** `src/lib`, `src/sanity`, `src/data`, `src/types`,
  and every other non-UI folder.

## Posture

Adversarial. Every canonical you choose resolves to a **code change, never a
comment**. A docstring saying two paddings differ "intentionally" is a claim to
verify, not a fact — the fix is the value corrected, not the comment kept.

## Drift-collapse, not cataloguing what exists

- **Cluster, then canonicalize.** Two near-identical shapes are **one** pattern
  with the drift corrected — not two, and not one-plus-a-comment.
- **Visual deltas are allowed and expected.** When the canonical is the right
  answer, choose it even though it shifts pixels. No pixel-preservation mandate.
  Record every delta so it gets an eyeball.
- **Decorative cruft is deleted, not catalogued.** Stray borders, hairlines,
  connector lines, decorative icons carry no shape — they don't become patterns.

## Config prerequisite (implementation, sequencing step 1)

The migration runs in **JSX form**. `panda.config.ts` is `jsxStyleProps: 'none'`
today (pattern JSX accepts pattern props but not CSS utility props). It must
become **`jsxStyleProps: 'all'`** (+ `pnpm panda codegen`); `strictTokens: true`
stays. The `css={{…}}` prop is banned in the adopted code. You don't flip it —
you assume it, and note it as sequencing step 1.

## Grounding (do this, don't assume)

1. Read the DS source of truth (above) — note the sole custom pattern,
   `editorialSplit`, and the built-in surface in `styled-system/patterns/`.
2. **Inventory every hand-rolled layout container** in the in-scope folders. Key
   each by a **shape-signature**: `{ direction + responsive shift, gap-bucket,
   align, justify, wrap, columns }`. Layout only — paint/type are **not** in the
   signature (they rehome per the policy table; folding them in fractures real
   clusters along cosmetic drift).
3. **Cluster by signature.** The canonical member is the target; the rest are
   drift.

## Where a dissolved slot's content goes (the homing policy)

You need this to separate layout (→ pattern) from everything else while
clustering.

| Slot content | Home |
| --- | --- |
| **Layout** — direction, gap, align, justify, wrap, columns, responsive shifts; the max-width + gutter **rail** | A **pattern**: a built-in customized via `defaultValues`, or a **custom semantic pattern** (see below). The rail is `Container` (see reconciliation). |
| **Type** — fontSize, weight, transform, letterSpacing | A **`textStyle`** on the **leaf** element — unless baking it into a semantic pattern is clearly simpler and shared by every member (case-by-case; justify). |
| **Structural paint** — ground/bg, the section shell | A **`layerStyle`** or the existing `section` recipe, via `className`. |
| **Structural separator** — a rule dividing content regions | The **`Divider`** pattern. |
| **Decorative paint** — borders/hairlines/lines/icons with **no** structural or separating role | **Deleted.** |

**Boundary — by kind, not folder:** `recipe` = skinned/stateful component
(visual states, `compoundVariants`) — Button, Badge, Card, Accordion, Dialog. A
`pattern` = a layout container, bare at the call site. A `ui/*` component that's
layout-only may dissolve into patterns too.

## Designing the patterns

- **Built-ins** (`Stack`/`HStack`/`VStack`/`Flex`/`Grid`/`Wrap`/`Center`/
  `Container`/`Divider`): set project `defaultValues` so the common case needs no
  props at the call site.
- **Custom semantic patterns** via `definePattern` (`editorialSplit` is the
  precedent): enum `properties` + `defaultValues` + `transform` branches. Patterns
  have **no** recipe-style `variants` block — enum properties are how you get
  variant behaviour.
- **Lock canonical props against drift.** Give each custom pattern a `blocklist`
  (and `strict` where appropriate) so call sites cannot override its canonical
  values back into drift — a config-native guard, better than a lint rule for the
  patterns themselves.
- **Reconcile overlaps with the existing DS — do not ship duplicates:**
  - **`Container` vs the `sectionInner`/`pageHero` layerStyles** — the max-width +
    gutter rail is layout, and `Container` does exactly it. Decide once: rails
    adopt `Container` and the layerStyles retire, or the layerStyles stay and
    `Container` goes unused.
  - **`Divider` vs raw `borderTop`/hairlines** — separators become `Divider`;
    edge decoration is deleted. Classify each existing hairline.

## Comment reduction (DS files, in scope for this phase)

`src/` is ~12% comment lines. While reading the DS source, cut aggressively in
`tokens.ts`, `preset.ts`, `recipes/`. **Cut:** restatement a reader with the
types open already knows; design narration; value-justification ("why this / why
these differ / why raw" — those are refactors); historical/tracker cruft
(`ZSB-XX` issue refs, past-setup notes, migration backstory); stale refs to
removed slots. **Keep only** a non-inferable, load-bearing "why" that can't be
encoded as a name/type/test — and prefer encoding it.

## Output — the catalog document

One git-tracked file: `docs/reviews/<YYYY-MM-DD>-pattern-catalog.md`. Two views
of one catalog:

### View 1 — decision record (verbose; human review)

Per cluster: the signature · **every** member call-site · the current value
spread (the drift, shown explicitly) · the chosen **canonical** · the resulting
pattern (built-in + `defaultValues`, or the custom `definePattern` spec incl.
`blocklist`) · the per-member **visual delta** adopting the canonical causes ·
the rationale. Plus the two DS reconciliations, resolved.

### View 2 — adoption index (compact; machine input for Phase A)

The lookup table `panda-pattern-adopt.prompt.md` loads. Keep it terse — this is
the only part re-read per cluster, so no prose here. One row per cluster:

| `cluster-id` | `signature` | `pattern + props (JSX)` | `canonical values` | `member files` |

Then a short **registration block**: the exact `defaultValues` for each built-in
and the full `definePattern` source for each custom pattern, ready to paste into
`preset.ts` (sequencing step 2).

### Open questions

Any shape with no clean canonical, any ambiguous decorative element, any
unresolved DS overlap — phrased as a decision for the human. These block their
cluster until answered.

Then **stop.** Do not edit `preset.ts` or any component — registration and
adoption are later sequencing steps.
