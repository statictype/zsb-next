# Panda pattern adoption — per-cluster (Phase A, run once per cluster)

Execute the migration for **one cluster** against the **frozen catalog**
(`docs/reviews/<date>-pattern-catalog.md`, produced by
`panda-pattern-catalog.prompt.md`). The catalog is **authoritative and closed** —
every canonical value, pattern, cluster membership, and border classification is
already decided. Your job is faithful execution, not redesign.

Model: Sonnet 5, run at **`xhigh` effort** with adaptive thinking (the setting for
coding/agentic work). You're trusted to read the catalog, apply judgment on wording
and placement, and keep the code clean — the guardrails below exist only where a
wrong guess is *silent*, not as a substitute for reading carefully. Three things
calibrated to how this model behaves:

- **It follows instructions literally and won't generalize across items.** Where a
  rule applies to *every* member or file, this prompt says so explicitly — treat it
  that way; don't narrow a blanket rule to the first case you hit.
- **It respects "be conservative" instructions to a fault.** So the escalation list
  is **coverage-first**: when in doubt, escalate — surface the item, don't privately
  judge it too minor to report. A long, honest escalation list is the success case.
- **It narrates more than older models by default.** The terse, no-prose output
  contract below is deliberate — hold to it; don't add running commentary.

## Input

A single **`cluster-id`** (e.g. `C3-stack`). Optionally a catalog path (default:
the newest `docs/reviews/*-pattern-catalog.md`). You are **not** handed a file
list — the member files come from the catalog. Resolving them is step 1.

## What to read (and only this — stay cheap by reading narrow, not shallow)

1. The catalog's **View 2 row** for this `cluster-id` — the compact pattern + props
   + canonical values.
2. The catalog's **View 1 section** for this same cluster (`### C<n> …`) — this is
   where the **full member-file list**, the **per-member deltas**, and the
   **"stays in recipe" / partial-dissolve** notes live. View 2 alone is not
   self-sufficient (some rows say "see C<n>"); read the matching View 1 section
   every time. One section is cheap; skipping it is how you miss a member or ship
   a wrong ratio.
3. The **DS reconciliations** (R1–R3) and any **Open-question** note referenced by
   your cluster — once, for context on `Container`/`Divider`/`chipRow`.

Do **not** read other clusters' sections.

## Rule #1 — escalate, don't improvise

The catalog is closed. If a member file contains a layout shape with **no catalog
entry**, a border/element **not classified in C9**, or anything the catalog didn't
anticipate — **stop on that item, leave the code unchanged, and add it to the
escalation list.** Never invent a canonical, never guess a cut. Improvising is the
one failure that silently reintroduces the drift Phase 0 removed.

## Scope

Only this cluster's **member files** (all under `src/app/**` or `src/components/**`).
Do not touch other clusters' files. Do not enter `src/design-system`, `src/lib`,
`src/sanity`, `src/data`, `src/types`. In particular, **do not retire shared DS
layerStyles/tokens** (`sectionInner`, `chipRow`, …) even when this cluster stops
using them — they're shared across clusters and retire in a single final pass, not
here.

## Procedure (per member file)

1. **Adopt the layout.** Replace the hand-rolled container (slot `className` or
   inline `css`) with the catalog's pattern in **JSX form**, using the catalog's
   props/values verbatim. Delete the layout slot once emptied.
   - **Partial dissolve:** if the catalog marks this member's recipe as *staying*
     (skinned/stateful — e.g. a grid whose columns are a variant, or a ruled-table
     skin), keep the recipe and remove **only** the layout declarations the catalog
     moves out; leave the skin/variant slots intact.
2. **Rehome the rest** per the homing table:
   - **Type** (fontSize/weight/transform/letterSpacing) → a `textStyle` on the
     **leaf** element (`<p>`/`<a>`/`<h2>`), not the container — unless the catalog
     entry bakes it into the pattern.
   - **Structural paint** (ground/bg, the section shell) → `layerStyle`/`section`
     via `className`.
   - **Borders / separators** → **apply the catalog's C9 classification** for that
     exact site: `Divider` (region separator), keep `border` (box outline, interior
     grid-cell rule, deliberate accent), or delete (decorative, no role). **Do not
     re-derive** this — C9 already decided every hairline. A border not in C9 is an
     escalation, not a judgment call.
3. **Strip comments** in every file you touch (ride-along): cut restatement, design
   narration, value-justification, historical/`ZSB-XX`/setup cruft, stale refs.
   Keep only a non-inferable, load-bearing "why". **Never *add* a comment** either —
   no restating what an edit does or justifying a token/prop choice; the same
   "non-inferable why only" bar applies to comments you write, default to zero.
4. **Verify:** `pnpm panda codegen` then `pnpm typecheck`. Grep the touched files
   for residual `display: '(flex|grid)'`, `flexDirection`, `css={` — these should
   be gone **except** in a recipe the catalog said stays (partial dissolve), where
   the retained layout slot is expected.

## Three mechanics you must get right (silent-failure footguns)

- **No `css` prop.** Layout goes on pattern props / real style props, never
  `css={{…}}`. (The `css()` *function* for className composition is fine.)
- **Responsive values go on the prop, not in a breakpoint object.** `<Stack
  direction={{ base: 'column', md: 'row' }}>` — never `<Stack direction="column"
  md={{ direction: 'row' }}>`, which bypasses the pattern transform and silently
  no-ops. Same for `gap`, `columns`, `justify`, `align`, `colSpan`.
- **No `cx()`/JSX hybrid.** If the subtree also uses a `jsx:`-enabled recipe
  (`section`, …), migrate it to JSX form (`<Section ground="light">`) too, so the
  subtree is uniformly JSX — not a pattern nested inside a `cx(section(), …)` div.

## Gold example — Footer `baseline`

A layout + type + separator slot dissolving. **Before** (`Footer.recipe.ts` slot +
`Footer.tsx` usage):

```ts
baseline: {
  display: 'flex', flexDirection: 'column', gap: 'md',
  paddingTop: 'lg', borderTop: 'hairline',
  textStyle: 'footerMeta', letterSpacing: 'label',
  alignItems: 'center', textAlign: 'center',
  md: { flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', textAlign: 'left' },
},
```
```tsx
<div className={s.baseline}>
  <div className={s.copyright}>© {year} Bucharest Sculpture Days</div>
  <div className={s.legal}>…</div>
</div>
```

**After** — slot deleted; layout → `Stack`; `borderTop:hairline` → `Divider`
(C9 classifies Footer's top rules as separators); type → the leaf text nodes:

```tsx
<Divider />
<Stack
  direction={{ base: 'column', md: 'row' }}
  gap="md"
  align="center"
  justify={{ md: 'space-between' }}
  pt="lg"
>
  <span className={css({ textStyle: 'footerMeta', letterSpacing: 'label' })}>
    © {year} Bucharest Sculpture Days
  </span>
  <HStack gap="lg">…</HStack>
</Stack>
```

`delta`: the top rule is now a `Divider` (visually equivalent); type unchanged;
`textAlign` dropped in favour of `Stack` alignment. **Exact props come from the
catalog entry, not this sketch** — the sketch shows the *shape* of the move.

## Idempotency

If a member file is already adopted (no layout slot, pattern already in JSX), it's
a **no-op** — report it as such, change nothing. Re-runs are safe.

## Output

The edits, plus two short tables (no prose):

- **Deltas:** one row per changed file — `file` · `change` · `visual delta
  (yes+what / no)`.
- **Escalations:** one row per item left unchanged under Rule #1 — `file:line` ·
  `what` · `why it needs a human`.

## Calibration

The **first** cluster of a batch is reviewed before the rest run, to catch a
systematic error once rather than N times. Bias toward escalating a genuine
ambiguity over guessing — a clean escalation list is a success, not a failure.
