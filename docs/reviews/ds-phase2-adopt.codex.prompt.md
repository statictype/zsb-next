# DS Phase 2 — per-surface adoption (Codex variant: GPT-5.5, xhigh reasoning; run once per surface)

Execute the migration for **one surface** against the **frozen catalog**
(`docs/reviews/<date>-ds-catalog.md`, produced by
`ds-phase1-catalog.codex.prompt.md` and grilled by the user — check its
Open questions section is marked resolved; if not, stop and report). The
catalog is authoritative and closed: every verdict, target style, gap
owner, restructure design, and dissolution row is already decided. Your
job is faithful execution, not redesign.

Model: **GPT-5.5 in Codex CLI, reasoning effort `xhigh`.** Calibration for
this model:

- **Follow catalog rows literally, and apply blanket rules to every
  member.** Where a rule says "every file" or "every declaration", treat
  it that way — don't narrow it to the instances you happen to notice.
- **No scope creep.** You will see adjacent smells the catalog doesn't
  cover (a raw value, a clumsy slot, a stale name). Do not fix them —
  leaving them is correct; fixing them un-freezes the catalog. Note
  genuinely important ones in the escalation table instead.
- **Escalate, don't adapt.** If a catalog row no longer matches the code,
  or a declaration has no row, or two rows conflict: leave that item
  unchanged and add it to the escalation list. Never substitute your own
  verdict, however obvious the fix looks — a silent improvisation here is
  the failure mode this whole pipeline exists to prevent.
- **Don't loop.** If verification fails twice on the same item after
  faithful application of its row, stop on that item and escalate it
  rather than iterating into an improvised state.
- Terse output — the two tables at the bottom, no narration.

Environment notes: package manager is **pnpm**. **Never commit, branch, or
stage anything** — leave all changes in the working tree. Never run
`pnpm build` or `pnpm dev`; verify with the commands in the Verify section
only. Comment policy (inline, since project instruction files may not be
loaded): never add comments that restate, justify, or narrate an edit; the
only acceptable comment is a non-inferable, load-bearing "why"; strip stale
comments in files you touch, including any describing machinery this sweep
removes.

## Input

A single **surface-id** from the catalog's surface list (e.g.
`S1-primitives`, `S3-calendar`). Optionally a catalog path (default: the
newest `docs/reviews/*-ds-catalog.md`).

## What to read (narrow, not shallow)

1. The catalog's **surface section** for your surface-id — member files +
   the census rows that apply.
2. The referenced **census rows** themselves (type, ink, rhythm, calc,
   motion, dissolution) for those members — every edit you make must map
   to a row.
3. The **ground-mechanics** and **spacing-ladder** sections if step 0
   falls to you (below).
4. `docs/reviews/2026-07-09-ds-grill-findings.md` §G (the authoring
   constraints) — G1: no `css({…})` in JSX; G2: recipes consumed as
   styled JSX elements, never `className={recipe()}`.

Do not read other surfaces' sections.

## Step 0 — one-time foundations (first surface run only; idempotent)

If the tree doesn't yet have them (check, don't assume), apply verbatim
from the catalog: the **spacing-ladder clamp() tokens** (§4), the
**ground ink mechanics + ambient body default** (§2, including the
`globals.css` collision removals it lists). Run `pnpm panda codegen`,
then `pnpm typecheck` before proceeding. If already present: skip, note
as no-op.

## Procedure (per member file)

1. **Type** — apply each type-census row: the declaration becomes
   `<Text variant="…">` on the element the row names (`as`/`asChild` for
   semantic tags), disappears into ambient, or becomes the named art
   token. Legacy `textStyle:` references (`pageTitle`…`labelDisplay`)
   are replaced per their rows — no legacy name may survive in this
   surface's files.
2. **Ink** — colors die (cascade) or stay, per the ink census.
3. **Rhythm** — margins/rhythm-paddings dissolve into the gap owner the
   rhythm census names; build the nested Stacks it specifies. Divider
   sites lose their adjacent breathing-room padding to the gap.
4. **Calc** — execute the restructure design for any calc rows in this
   surface. The design is decided; if the code resists it, escalate —
   don't substitute a different restructure.
5. **Motion** — transitions snap to the two-speed rule per the motion
   census rows (`fast`/`normal` · `quint`).
6. **Recipe dissolution** — per the dissolution map: delete slots that
   emptied; if the recipe dissolves entirely, delete the file and its
   imports; if it survives as skin, convert sva → colocated
   `defineRecipe`/`defineSlotRecipe` with the map's `jsx` names, register
   it in the preset index the catalog designed, and convert every
   consumer to styled JSX form (G2). After any recipe/preset change:
   `pnpm panda codegen` before type-checking.
7. **Ride-along** — comment strip per the policy above.

## Mechanics footguns (silent failures — read before editing)

- Responsive values go **on the pattern prop**
  (`direction={{ base: 'column', md: 'row' }}`), never in a breakpoint
  object (`md={{ direction: 'row' }}`) — the latter bypasses the pattern
  transform and silently no-ops.
- No `cx()`/JSX hybrids and no `className={recipe()}` — if a subtree
  mixes forms, finish the conversion so it's uniformly JSX.
- `<Text>`'s `variant` prop is the only type knob; its blocklist rejects
  font props at build time — a blocklist error means you're porting a
  delta the census said to drop, not a reason to bypass the pattern.
- Config-recipe consumers import from `styled-system/recipes` (generated),
  not from the definition file.

## Verify (per run)

1. `pnpm panda codegen` — clean. 2. `pnpm typecheck` — clean.
3. `pnpm lint` — clean. 4. Greps over the touched files: no `sva(`, no
`css({` in `.tsx`, no `className={` carrying a recipe/slot, no
`fontSize|fontFamily|fontWeight|letterSpacing|textTransform` in recipes,
no `margin(Top|Bottom)` in recipes, no legacy textStyle names, no
`calc(` — each surviving hit must be a catalog-sanctioned exception
(art/skin rows); list any such survivor next to its row id.
5. `pnpm format`.
6. Update the catalog's **adoption-status table** row for this surface to
   `completed` (the one edit allowed outside the surface's files besides
   the preset index).

## Idempotency

Already-adopted members are no-ops — report and move on. Re-runs are safe.

## Output

Two tables, no prose:

- **Deltas:** `file` · `change` · `visual delta (yes+what / no)`.
- **Escalations:** `file:line` · `what` · `why it needs a human`.

The first surface run of the batch is reviewed before the rest are
launched — bias toward escalating genuine ambiguity; a clean escalation
list is a success, not a failure.
