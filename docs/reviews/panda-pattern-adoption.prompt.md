# Panda pattern adoption — layout-primitive audit & migration prompt (Sonnet 5)

An adversarial audit hunting **hand-rolled layout** that should be a Panda
**pattern**, and the **accidental drift** that makes the codebase's small set of
real layout shapes look like a zoo. Posture: complain precisely, with evidence;
every finding resolves to a **code change, never a comment.**

The codebase went CSS-modules → slot-recipes-for-everything. That pass tokenized
values but left layout (`display:flex/grid`, `flexDirection`, gap/align/justify,
responsive shifts) encoded inside `*.recipe.ts` **slots**, applied as
`className`. There are **no layout primitives**. This prompt introduces them and
collapses the drift.

This is the **canonical full spec.** Operationally it runs as two derived
prompts: `panda-pattern-catalog.prompt.md` (Phase 0, strong model, once) and
`panda-pattern-adopt.prompt.md` (Phase A, cheap model, per cluster, catalog as
prerequisite). This doc is the reference they're carved from.

## Scope

- **In scope:** `src/app/**` (routes, their `*.recipe.ts`, `_components/`) and
  `src/components/**`.
- **Read-only source of truth:** `src/design-system/**` (tokens, `textStyles`,
  `layerStyles`, `preset.ts`, `recipes/`) — comment-stripped in Phase 0, but not
  a dissolution target.
- **Out of scope entirely:** `src/lib`, `src/sanity`, `src/data`, `src/types`,
  every other non-UI folder.

---

## The two rules that change everything else

**1. Slots dissolve; layout moves to the call site.** A slot whose job is layout
is not migrated in place — it is **deleted**, and its structure is expressed as a
Panda pattern (`Stack`, `HStack`, `VStack`, `Flex`, `Grid`, `Wrap`, `Center`,
`Container`, `Divider`, or a custom semantic pattern) in the JSX. Slot
dissolution is the *goal*, not a risk — **provided** the dissolved styling lands
somewhere reusable and rigorous, never scattered onto call sites as ad-hoc style
props.

**2. A comment is never evidence.** A docstring explaining why two paddings
differ, why a gap is what it is, or why a slot exists is a claim to verify, not a
fact to accept. The fix is a code change that removes the need for the
explanation. This prompt additionally **requires aggressive comment reduction** —
see [Comment reduction](#comment-reduction).

Every recommendation takes one of these verbs: **dissolve, extract, merge,
derive, compose, delete, replace, tokenize, adopt** (adopt = replace hand-rolled
layout with a pattern). "Add a comment", "document why", "leave as-is but note"
are not on the list.

## This is drift-collapse, not mechanical migration

The apparent variety of layouts is mostly **accidental drift** — gaps, paddings,
colors, font sizes, and breakpoint shifts that diverged by accident, not by
design. The real pattern set is **small**. So:

- **Cluster, then canonicalize.** Two near-identical layout shapes are one
  pattern with the drift corrected — not two patterns, and not one pattern
  plus a comment promising they're "basically the same".
- **Visual deltas are allowed and expected.** When the corrected/canonical
  pattern is the right answer, adopt it even though it shifts pixels. There is
  **no pixel-preservation mandate.** Prefer the better option over a mechanical
  1:1 when the difference is drift. (Flag the delta so it gets an eyeball — see
  output format — but do not preserve drift to avoid one.)
- **Decorative cruft is deleted, not migrated.** Stray borders, hairlines,
  connector lines, and decorative icons that carry no structural meaning are
  removed, not moved into a pattern or a layerStyle.

## Prerequisite — config (implementation; sequencing step 1)

This is an **implementation** prerequisite, not a review-run action (see hard
rule 1) — it's stated up front because it gates the JSX-form call sites Phase A
reasons about. `panda.config.ts` is `jsxStyleProps: 'none'` today, which means
the generated pattern JSX components accept their *pattern* props but not CSS
utility props — so a pattern can't be tuned at the call site without falling back
to `cx(pattern(), recipeSlot())`. The migration runs in **JSX form**, so:

- Set **`jsxStyleProps: 'all'`** and run `pnpm panda codegen`.
- **`strictTokens: true` stays on** — every prop value is still a token; `'all'`
  does not reopen raw values.
- The **`css={{…}}` prop is banned.** Its presence at a call site is itself a
  finding: layout intent belongs on pattern props / real style props, or in the
  pattern's own defaults — never in a `css` escape hatch. (This is the JSX `css`
  prop; the `css()` *function* for className composition is unaffected.)

## Hard rules

1. **Review only. Do not edit any file. Do not commit.** The single deliverable
   is the audit document. (The config change and pattern-catalog work are
   *implementation* steps sequenced by the migration plan, not review-time
   edits.)
2. **Ground before you judge.** Every finding verifiable from code — no invented
   patterns, tokens, or policy.
3. **Cluster drift across the in-scope folders before proposing a pattern.** For
   every hand-rolled layout shape in the reviewed file, grep the same/near shape
   across `src/app/**` + `src/components/**` (see grounding phase). A pattern is
   justified by the *cluster* of call sites it will serve, not by one file.
4. **Bias toward fewer patterns and fewer lines.** When two shapes can be one
   pattern-with-a-variant-prop, they are. State what shrinks and how many call
   sites collapse.
5. **Don't manufacture a pattern to fill an axis.** A genuinely one-off layout
   that will never recur may stay inline as a `Box`/`Flex` with props — flag it
   only if it's drift from a real cluster.
6. **Unify repo-wide when implemented.** When a finding's fix adds/changes a
   pattern or its defaults, the implementation updates *every* call site in the
   cluster, not just the reviewed file. One consistent way to lay things out.

## Two phases, two altitudes of depth

Depth is split by concern so neither is sacrificed:

- **Phase 0 — the catalog (global, run once, deep on the *vocabulary*).** A
  repo-wide pass that pins the true pattern set. Mechanical underneath (grep
  shape-signatures, cluster), but its *judgment* — naming the canonical set,
  choosing `defaultValues`, designing custom semantic patterns and their enum
  variant axes — is the highest-leverage depth in the whole migration. Review
  output: a standalone **pattern catalog document**
  (`docs/reviews/<YYYY-MM-DD>-pattern-catalog.md`). *Implementing* that catalog —
  registering the `defaultValues` and custom patterns in `preset.ts` — is
  sequencing step 2. **Run the review once; freeze the catalog.**
- **Phase A — adoption (per component/cluster, run N times, deep on *execution*).**
  Each run **consumes** the frozen catalog — it never re-derives a canonical
  value (that re-derivation is both wasted work and the exact mechanism by which
  drift creeps back). Its depth goes into executing *this* unit's dissolution
  correctly (the axes below). Output: a per-run **audit** (see
  [Output](#output--the-audit-document)).

### Phase 0 — build the catalog

Discover and read, don't assume:

- **The design-system source of truth**: `src/design-system/tokens.ts` (tokens,
  `textStyles`, `layerStyles`, `semanticTokens`), `src/design-system/preset.ts`
  (what's registered — note the sole custom pattern, `editorialSplit`), and
  `src/design-system/recipes/`.
- **The generated pattern surface**: `styled-system/patterns/` and
  `styled-system/jsx/` — which built-ins exist and their uncustomized defaults.
- **Every hand-rolled layout container in the in-scope folders** (`src/app/**` +
  `src/components/**`). Key each by a **shape-signature**: `{ direction +
  responsive shift, gap-bucket, align, justify, wrap, columns }`. Cluster by
  signature. Layout only — paint/type are *not* part of the signature (they get
  rehomed per the policy table, and folding them in would fracture real clusters
  along cosmetic drift).

Each catalog entry reports: the signature · **every** member call-site · the
current value spread (the drift, shown explicitly) · the chosen **canonical**
value · the resulting pattern (built-in + `defaultValues`, or custom pattern +
enum variant props) · the per-member **visual delta** adopting the canonical
causes.

**Reconcile overlaps with the existing DS, don't duplicate them.** Two built-in
patterns already have DS equivalents — resolve each explicitly in the catalog:
- **`Container` vs the `sectionInner` / `pageHero` layerStyles** — the max-width +
  horizontal-gutter *rail* is layout, and `Container` does exactly it. Decide
  once: either rails adopt `Container` (customized to the rail's max-width/gutter
  tokens) and the layerStyles retire, or the layerStyles stay and `Container`
  goes unused. Do not ship both.
- **`Divider` vs raw `borderTop`/hairline separators** — a rule that *separates
  content regions* is a `Divider`; a border that's edge decoration is deleted
  (axis 4). Classify each existing hairline into one or the other.

### Phase A — per-component grounding

Before any finding, read: the reviewed component's **call sites** (JSX, not just
the recipe); the **frozen catalog** (to pick the pattern to adopt — never invent
a new canonical here); and **every comment** in the files (see comment-reduction
axis).

**Two mechanics the recommendations must get right:**
- **Responsive pattern props go on the prop, not in `md`.** A responsive shift is
  `<Stack direction={{ base: 'column', md: 'row' }}>`, never `<Stack
  direction="column" md={{ direction: 'row' }}>` — the latter skips the pattern
  transform and silently no-ops. (Same for `gap`, `columns`, `colSpan`.) Footer's
  `navCol` row→column shift is exactly this case.
- **Don't leave a `cx()`/JSX hybrid.** When a dissolution restructures a subtree
  that also uses a jsx-enabled recipe (`section`, and any recipe with a `jsx:`
  key), migrate that recipe to its **JSX form** (`<Section ground="light">`) in
  the same change, so the subtree is uniformly JSX instead of a pattern element
  nested inside a `cx(section(), …)` div.

## The pattern-adoption policy — where a dissolved slot's content goes

Every part of a dissolving slot resolves to one of these homes. There is no
"leave it on the container as a style prop" option.

| Slot content | Home |
| --- | --- |
| **Layout** — direction, gap, align, justify, wrap, columns, responsive shifts; also the max-width + gutter **rail** | A **pattern**: a built-in customized via `defaultValues` (the rail is `Container` — see the Phase-0 reconciliation), or a **custom semantic pattern** with enum `properties` + `defaultValues` + `transform` branches (`editorialSplit` is the precedent — patterns have **no** recipe-style `variants` block; enum properties are how you get variant behavior). |
| **Type** — fontSize, weight, transform, letterSpacing | A **`textStyle`** on the **leaf** element (`<p>`, `<a>`, `<h2>`), not the container — **unless** baking it into a semantic pattern is clearly simpler and more reusable (see case-by-case skin below). |
| **Structural paint** — ground/bg, the section shell | A **`layerStyle`** or the existing `section` recipe, applied via `className`. |
| **Structural separator** — a rule/border dividing content regions | The **`Divider`** pattern. |
| **Decorative paint** — borders/hairlines/connector lines/icons with **no** structural or separating role | **Deleted.** |

**The boundary — decided by kind, not folder:**
- **`recipe`** = a **skinned and/or stateful** UI component (visual states,
  `compoundVariants`) — Button, Badge, Card, Accordion, Dialog, Checkbox.
- **`pattern`** = a **layout container** — structure + spacing + responsive,
  bare at the call site.
- A `ui/*` component that turns out to be **layout-only** (e.g. a list/heading
  shell with no states) **may dissolve** into patterns too — `ui/*` is not
  off-limits.

**Case-by-case skin.** The default is containers carry **zero skin** (type on
leaves, structural paint in a layerStyle, decoration deleted) — this is what
keeps call sites bare. But **do not invent a `textStyle`/`layerStyle` purely to
evict a bit of skin from a pattern** when baking that skin into the pattern's
`transform` is simpler and equally reusable. A semantic pattern (e.g. a shared
meta-row) may carry its own `textStyle`/color when that skin is *intrinsic to the
shape* and shared by every call site. Judgment call, made per pattern — justify
it in the finding.

## The axes

Axes 1–3 are the bespoke, project-specific machinery and carry the detail; they
are three facets of the same move (hand-rolled layout → pattern) and a single
finding often spans them — that's fine. Axes 4–6 are checklist depth.

1. **Pattern adoption** — a hand-rolled `display:flex/grid` container (in a slot
   *or* inline) becomes a built-in pattern (customized via `defaultValues`) or a
   custom semantic pattern from the catalog. Cite the catalog entry. Decorative
   cruft is **not** re-homed — it's deleted (axis 4).
2. **Drift collapse** — the reviewed shape belongs to a catalog cluster; adopt
   its **canonical** value even at a visual delta. Two local shapes differing only
   by drift collapse to one pattern usage + variant prop.
3. **Slot dissolution** — a layout slot is **deleted**, not migrated; its content
   rehomes per the policy table above. Name the slots that disappear and the
   count.
4. **Decorative deletion** — purely decorative borders/hairlines/lines/icons
   removed. Guardrail: only when it carries **no** structural/interaction/a11y
   role; anything ambiguous is raised as a question, not deleted.
5. **Comment reduction** — see [Comment reduction](#comment-reduction). Applies
   to every file a finding touches.
6. **Types / prop-API / dead code / adversarial** — standard judgment, one line
   each: dead recipe slots/exports left behind by dissolution; a pattern prop
   typed wider than its enum; `cx()` composition made redundant once a slot is
   gone; works-by-accident cascade order.

## Comment reduction

`src/` is ~12% comment lines (~2,300 lines; `tokens.ts` alone is 164). Cut
aggressively. This is a ride-along axis: strip comments in **every file a
finding already touches** (don't open files solely to strip). The DS files
(`tokens.ts`, `preset.ts`, `recipes/`) are in scope during **Phase 0**, which
already reads them.

**Cut — assume delete:**
- **Restatement** — anything a reader with the types and token names open
  already knows (`// The section ground`, slot/section narration, obvious prop
  docstrings).
- **Design narration** — docstrings describing what a recipe/component *is* or
  looks like ("Dark editorial footer: partner badge…").
- **Justification** — "why this value / why these differ / why raw". Per rule 2
  these are *refactors*, not comments: the comment goes, the code change lands.
- **Historical / tracker cruft** — comments referencing `ZSB-XX` issues, how the
  project was set up in the past, migration backstory. Irrelevant; delete.
- **Stale** — anything referencing removed slots/values.

**Keep — rare, must clear all three:** (1) the "why" is not inferable from
names/types, (2) it's load-bearing — deleting it invites a real bug (external
constraint, non-obvious ordering, gotcha), and (3) it can't be made self-evident
by a rename/extract/token. Even then, prefer **encoding over commenting** — a
named token, a type, or a test beats a sentence.

## Output — the audit document

One git-tracked file per Phase-A run:
`docs/reviews/<YYYY-MM-DD>-pattern-audit.md` (append `-2`, `-3` … on collision).
Writing it is the deliverable; **do not commit** unless asked. (Phase 0 emits its
own `-pattern-catalog.md` per the grounding section.)

Structure: a **summary table** (one row per finding: id · file · axis · one-line
smell), then **detailed findings** in file/line order. Each finding:

| field | meaning |
| --- | --- |
| `id` | stable ref (`ADOPT-1`, `DISSOLVE-2`, `DRIFT-3`, `DECO-4`, `CMT-5`, `MISC-6`) |
| `file:line` | clickable anchor |
| `axis` | adoption / drift / dissolution / decorative / comment / misc |
| `smell` | one line |
| `catalog-ref` | the Phase-0 catalog entry / pattern being adopted (or "n/a"). Never a newly-invented canonical — if the shape has no catalog home, that's a **gap finding** against the catalog, not a local decision. |
| `evidence` | verifiable from code: the slot/JSX being dissolved, the drift spread vs canonical, the leaf that receives the `textStyle`. If a comment claimed the rawness/duplication was intentional, name it and say why it doesn't hold. |
| `recommendation` | the concrete change in verbs (dissolve / adopt / merge / delete / tokenize). State what shrinks — slots removed, call sites collapsed, comment lines cut. Per the repo-wide rule, list **every** cluster call-site the fix should touch. |
| `delta` | does the fix change rendered output? **yes + what** (a corrected drift value, a deleted decorative element, a new inherited property) or **no**. This is the one thing to eyeball before committing. |

After the findings, an **Open questions** section: the ambiguous decorative
elements the guardrail held back from auto-deletion (axis 4) and any shape with
no catalog home (a `catalog-ref` gap), each phrased as a decision the human
makes. These are *not* findings — they block their related finding until
answered.

Then **stop**. Do not implement anything during a review run.

## Migration sequencing

All of this lands in **one branch / one PR** (`refactor/panda-patterns`) — these
are *ordered phases within that branch*, not separate PRs:

1. **Config flip** (see config section) — gates everything.
2. **Pattern catalog (Phase 0)** — run the global sweep; register the canonical
   `defaultValues` + custom patterns in `preset.ts`; freeze the catalog. Give each
   custom pattern a `blocklist`/`strict` so call sites can't override its
   canonical props back into drift — a config-native guard on the patterns.
3. **Adoption (Phase A)** — per component/cluster, ordered primitives → leaf
   components → composites, whole clusters at once, comments stripped ride-along.

**Drift guard (config can't fully do it).** `strictTokens` is value-level and
there's no way to ban raw `display:flex`/the `css` prop via Panda config
(`jsxStyleProps` bundles style props with the `css` prop). The `blocklist`/
`strict` above locks the *patterns*; the residual guard — no raw layout / no
`css` prop in `src/app` + `src/components` — needs a **scoped grep or ESLint
check** (recommended, but a CI/config change — get sign-off before adding).
