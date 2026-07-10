# DS Phase 2 — per-surface adoption (Fable 5; run once per surface)

Execute the migration for **one surface** against the **frozen catalog**
(`docs/reviews/2026-07-10-ds-catalog.md`). The catalog is authoritative
and closed: every verdict, target style, gap owner, restructure design,
and dissolution row is already decided. Your job is faithful execution,
not redesign. Follow catalog rows literally and apply blanket rules to
every member; escalate instead of improvising anything the catalog
didn't anticipate; terse output, no narration.

**Already implemented — do not re-verify:** Phase 0 foundations (type
scale, sealed textStyles, `Text` pattern, global focus/disabled), the C8
grid and C9 divider patterns, and the **entire type census (§1)** —
type rows for your surface's members are no-ops unless a member visibly
still carries raw font declarations. The remaining work per surface is
ink, rhythm, calc, motion, and recipe dissolution.

## Out of scope

Never touch these files, even where a surface lists them as members:

- `src/app/opengraph-image.tsx`,
  `src/app/(site)/editions/[year]/opengraph-image.tsx`,
  `src/app/(site)/editions/[year]/events/[slug]/opengraph-image.tsx`
  (Satori markup cannot consume Panda output)
- `src/app/global-error.tsx` (root error fallback cannot depend on
  generated Panda output)
- `src/app/(site)/_components/FeaturedEvents.tsx` and
  `FeaturedEvents.recipe.ts`

Their catalog rows (including the "escalate — requires Open question"
rows) are void: skip them silently — no edit, no escalation. Exclude
these files from the verify greps.

## Input

A single **surface-id** from the catalog's surface list (e.g.
`S1-primitives`, `S3-calendar`).

## What to read

1. The catalog's **surface section** for your surface-id — member files +
   the census rows that apply.
2. The referenced **census rows** themselves (ink, rhythm, calc, motion,
   dissolution) for those members — every edit you make must map to a
   row.
3. The **ground-mechanics** (§2) and **spacing-ladder** (§4) sections if
   step 0 falls to you (below).
4. `docs/reviews/2026-07-09-ds-grill-findings.md` §G (the authoring
   constraints) — G1: no `css({…})` in JSX; G2: recipes consumed as
   styled JSX elements, never `className={recipe()}`.

Do not read other surfaces' sections.

## Hard rules

1. **Escalate, don't improvise** — a declaration with no catalog row, a
   row that no longer matches the code, a conflict between rows: leave
   that item unchanged, list it. Never invent a verdict.
2. Scope: only this surface's member files (plus the one-time step 0 and
   preset registration edits). Don't touch other surfaces' files; don't
   retire shared tokens/layerStyles other surfaces still use (Phase 3's
   job).
3. Comments: strip restatement/narration in files you touch; never add
   any. Delete comments describing things this sweep removes.

## Step 0 — one-time foundations (first surface run only; idempotent)

If the tree doesn't yet have them, apply verbatim from the catalog: the
**spacing-ladder clamp() tokens** (§4) and the **ground ink mechanics +
ambient body default** (§2, including the `Text` ink selection, the
`globalCss.body` default, and the `globals.css` collision removals it
lists). Run `pnpm panda codegen`, then `pnpm typecheck` before
proceeding. If already present: skip, note as no-op.

## Procedure (per member file)

1. **Ink** — colors die (cascade), stay (row says so), per the ink
   census.
2. **Rhythm** — margins/rhythm-paddings dissolve into the gap owner the
   rhythm census names; build the nested Stacks it specifies. Divider
   sites lose their adjacent breathing-room padding to the gap.
3. **Calc** — execute the restructure design for any calc rows in this
   surface. The design is decided; if the code resists it, escalate —
   don't substitute a different restructure.
4. **Motion** — transitions snap to the two-speed rule per the motion
   census rows (`fast`/`normal` · `quint`).
5. **Empty-husk cleanup** — unconditional, not gated on the dissolution
   map: a slot emptied by the steps above dies completely — remove it
   from the recipe's `slots` array and `base`, and drop every
   `className` reference to it in consumer JSX. Emptied nested style
   objects (`md: {}`, `'& p': {}`) die too. A recipe left with no
   styled slots is deleted with its imports. Empty **variant values**
   (`sm: {}`, `false: {}`) are API surface — leave them; only a
   dissolution row retires a variant.
6. **Recipe dissolution** — per the dissolution map: delete slots that
   emptied; if the recipe dissolves entirely, delete the file and its
   imports; if it survives as skin, convert sva → colocated
   `defineRecipe`/`defineSlotRecipe` with the map's `jsx` names, register
   it in the preset index the catalog designed, and convert every
   consumer to styled JSX form (G2). After any recipe/preset change:
   `pnpm panda codegen` before type-checking.
7. **Ride-along** — comment strip (hard rule 3); any leftover type-census
   row not yet adopted for this member is applied per its row.

## Mechanics footguns (silent failures)

- Responsive values go **on the pattern prop**
  (`direction={{ base: 'column', md: 'row' }}`), never in a breakpoint
  object — the latter silently no-ops.
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
`calc(`, no empty slots or `: {}` style objects in touched recipes
(empty variant values excepted) — each surviving hit must be a
catalog-sanctioned exception (art/skin rows), out-of-scope file hits
excluded; list any such survivor next to its row id.
5. `pnpm format`.
6. Update the catalog's **adoption-status table** row for this surface to
   `completed` (the one edit allowed outside the surface's files besides
   the preset index).

## Idempotency

Already-adopted members are no-ops — report and move on. Re-runs are
safe.

## Output

Two tables, no prose:

- **Deltas:** `file` · `change` · `visual delta (yes+what / no)`.
- **Escalations:** `file:line` · `what` · `why it needs a human`.

The first surface run of the batch is reviewed before the rest are
launched — bias toward escalating genuine ambiguity.
