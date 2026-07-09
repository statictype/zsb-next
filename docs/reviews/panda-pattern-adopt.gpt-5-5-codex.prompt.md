# Panda pattern adoption — Codex prompt (GPT-5.5)

Use this prompt in Codex to execute **one layout-pattern cluster** from the
frozen Panda pattern catalog. It is the GPT-5.5/Codex version of
`panda-pattern-adopt.prompt.md`: repo-native, bounded, implementation-first, and
strict about leaving ambiguity visible instead of inventing policy.

---

## Role

You are a staff-level implementation agent working inside this repository. Your
job is to migrate one catalog cluster from hand-rolled layout slots to Panda JSX
patterns, preserving behavior and visuals unless the frozen catalog explicitly
records an accepted delta.

The catalog is authoritative. Execute it faithfully.

## First visible update

Before using tools, send one short update naming the cluster you are adopting and
saying that you will read the catalog row, the matching catalog section, and the
listed member files before editing.

## Input

A single **`cluster-id`** such as `C1-container`, `C3-stack`, or `C8-grid`.
Optionally, a catalog path. If no catalog path is provided, use the newest
`docs/reviews/*-pattern-catalog.md`.

You are not handed a file list. Resolve member files from the catalog.

## Success criteria

The task is complete when:

- only this cluster's member files have been edited
- each adopted layout uses the catalog's Panda JSX pattern and exact props
- emptied layout slots have been deleted end-to-end: no empty recipe keys, no
  stale slot names, no now-empty `className={s.slot}` usage in JSX
- recipe slots marked as partial-dissolve keep only the catalog-approved skin,
  state, variant, or retained layout declarations
- comments in touched files have been stripped unless they explain a
  non-inferable external constraint
- `pnpm panda codegen` and `pnpm typecheck` have passed
- touched files have been checked for residual `display: 'flex'`,
  `display: 'grid'`, `flexDirection`, and `css={` except where the catalog
  explicitly says the recipe stays
- the final response reports changed files, visual deltas, escalations, and
  verification

Do not commit unless the user explicitly asks for a commit.

## Required reading

Read narrowly, but do not read shallowly.

1. The catalog's **View 2 row** for the requested `cluster-id`.
2. The catalog's **View 1 section** for the same cluster (`### C<n> ...`).
   This section contains the full member list, per-member deltas, and
   partial-dissolve notes. View 2 alone is not sufficient.
3. The **DS reconciliations** (`R1`-`R3`) and any open-question note referenced
   by the cluster.
4. Each member file listed for the cluster, plus its directly paired recipe or
   component file when the catalog's member is only one side of a TSX/recipe
   pair.
5. If the catalog's pattern registration block changes the requested pattern's
   defaults or props, inspect the current design-system preset/generated Panda
   surface before editing. Apply only the registration needed for this cluster
   when the current surface cannot express the catalog's exact JSX.

Do not read other cluster sections unless a touched file contains a shape that
cannot be classified from the current cluster and must be escalated.

## Hard constraints

1. The catalog is closed. Do not invent a canonical pattern, token, ratio,
   breakpoint, or border classification.
2. Edit only this cluster's member files under `src/app/**` and
   `src/components/**`, plus the minimal generated/typed surface required by the
   catalog if the cluster explicitly calls for it.
3. Do not enter `src/lib`, `src/sanity`, `src/data`, or `src/types`.
4. Do not retire shared design-system layerStyles or tokens such as
   `sectionInner` or `chipRow` during a per-cluster pass. Shared retirement
   happens in the final reconciliation pass unless the catalog says otherwise
   for this exact cluster.
5. Do not convert unrelated layout shapes opportunistically, even when they are
   adjacent in the same file.
6. Do not add comments. Delete weak comments in touched code; keep only
   non-inferable "why" comments.
7. Do not use `css={{ ... }}`. Layout belongs on pattern props or real style
   props. The `css()` function for className composition is allowed when needed.
8. Do not commit, branch, or run E2E tests unless the user explicitly asks.

## Escalate, Do Not Improvise

If a member file contains any of the following, leave that item unchanged and add
it to the escalation table:

- a layout shape with no catalog entry
- a border, hairline, divider, decorative line, or separator not classified in
  C9
- a pattern prop that cannot express the catalog's exact value
- a recipe slot whose retained-vs-deleted ownership is unclear
- a visual delta not named by the catalog
- a conflict between the catalog and the current code

Escalation is not failure. Silent improvisation is failure.

## Procedure

### 1. Ground the cluster

Use `rg` and direct file reads to identify the requested cluster's member files.
Before editing, understand for each member:

- the exact layout shape being replaced
- the Panda JSX pattern to use
- which props come from the catalog
- whether the old recipe slot is `delete`, `partial-dissolve`, or `retain`
- for `delete` slots, every reference that must disappear: the slot name in the
  `slots` array, the slot key in `base`/variants, the JSX `className`, and any
  `cx()`/composition that existed only to attach that slot
- whether the catalog records a visual delta

### 2. Adopt the layout

Replace the hand-rolled layout wrapper or slot with the catalog's Panda JSX
pattern:

- `Container`
- `Stack`
- `HStack`
- `Center`
- `Wrap`
- `Grid`
- `Divider`
- custom patterns such as `editorialSplit` when the catalog names them

Use responsive values on the prop itself:

```tsx
<Stack direction={{ base: 'column', md: 'row' }} gap="md" />
```

Do not use breakpoint objects that bypass the pattern transform:

```tsx
<Stack direction="column" md={{ direction: 'row' }} />
```

If the subtree also uses a `jsx:`-enabled recipe such as `section`, keep the
subtree uniform. Prefer JSX recipe usage where the local codebase already
supports it instead of mixing a pattern inside a `cx(section(), ...)` wrapper.

### 3. Dissolve the recipe slot

When a slot exists only to provide the migrated layout, delete it from the
recipe and remove its usage from JSX. Deletion is structural, not just clearing
declarations: do not leave `slot: {}`, keep an otherwise-unused slot in `slots`,
or render `className={s.slot}` on the new Panda pattern. If the element now has
no remaining class, render the Panda pattern without `className`.

When the catalog marks a recipe as staying, remove only the layout declarations
the catalog moves out. Keep catalog-approved skin, state, variants, grid-cell
rules, box outlines, and other retained declarations.

When a slot partially dissolves and keeps only responsive layout for a later
cluster, make that ownership explicit in your notes and final verification. A
residual `flexDirection` or `display` in a touched file is acceptable only when
it belongs to another cataloged cluster or a retained state/skin surface.

### 4. Rehome non-layout declarations

Follow the catalog and this homing table:

| declaration | destination |
| --- | --- |
| `fontSize`, `fontWeight`, `textTransform`, `letterSpacing`, leaf typography | `textStyle` or style props on the leaf element |
| section ground or structural background | `section`, `layerStyle`, or the existing section shell |
| structural region separator | `Divider`, when C9 classifies that site as a separator |
| box outline, interior grid-cell rule, deliberate accent | keep as `border` only when C9 classifies it that way |
| decorative hairline/line with no structural role | delete only when C9 classifies it that way |

Do not re-derive border meaning from taste. C9 is the source of truth.

### 5. Strip comments in touched files

Delete comments that restate code, narrate design intent, justify obvious token
choices, preserve stale history, or explain removed implementation details.

Keep a comment only when removing it would hide an external constraint or a
non-inferable gotcha.

### 6. Verify

Run:

```sh
pnpm panda codegen
pnpm typecheck
```

Then search the touched files for:

```sh
display: 'flex'
display: 'grid'
flexDirection
css={
```

Residual hits are allowed only where the catalog explicitly kept the recipe or
where the hit is unrelated retained skin/state. Otherwise fix or escalate.
For every residual hit category that remains, identify its owner before
finishing: another cluster, retained state/skin, generated code, or escalation.
Do not report a generic "later cluster" bucket unless you checked the specific
hit.

## Codex Operating Notes

- Keep the worktree focused. Before editing, check `git status --short`; do not
  overwrite unrelated user changes.
- Prefer small, direct patches over broad rewrites.
- Use existing import style and ordering. Add `styled-system/jsx` imports only
  where the file now renders Panda JSX patterns.
- If a formatter or hook modifies a touched file, inspect the resulting diff
  before reporting success.
- Keep progress updates short. The user needs signal, not narration.
- If validation fails, fix the failure when it is clearly caused by your change.
  If the failure is unrelated or ambiguous, report it with the command output
  summary and leave the worktree uncommitted.

## Output

Finish with only these sections:

### Deltas

| file | change | visual delta |
| --- | --- | --- |

One row per changed file. Use `no` for no visual delta, or a short description
when the catalog accepted one.

### Escalations

| file:line | what | why it needs a human |
| --- | --- | --- |

Use `none` if there were no escalations.

### Verification

List each command run and whether it passed. Mention any non-blocking tool
warning, such as Panda's update-check cache warning, without treating it as a
type or codegen failure.
