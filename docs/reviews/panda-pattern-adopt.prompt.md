# Panda pattern adoption — per-cluster (Phase A, cheap model, run N times)

Execute the migration for **one cluster** against the **frozen catalog**. This
prompt does **not** stand alone: it consumes the catalog produced by
`panda-pattern-catalog.prompt.md`. The catalog is **authoritative and closed** —
every canonical value, pattern, and cluster membership is already decided.

## Prerequisites (all must hold)

1. The catalog `docs/reviews/<date>-pattern-catalog.md` exists. **Read its
   adoption index (View 2) first.** Do not read View 1 (the verbose decision
   record) — you don't need it, and re-reading it per cluster is wasted cost.
2. Config already flipped: `jsxStyleProps: 'all'`, `strictTokens: true`, patterns
   registered in `preset.ts`, `pnpm panda codegen` run.

## Rule #1 — escalate, don't improvise

The catalog is closed. If this cluster's files contain a layout shape with **no
catalog entry**, a decorative element whose removal is **ambiguous** (might carry
structural/interaction/a11y meaning), or anything the catalog didn't anticipate —
**stop on that item, add it to the escalation list, and leave the code
unchanged.** Never invent a canonical, never guess a cut. Improvising is the one
failure that silently reintroduces the drift Phase 0 removed.

## Scope

Only the **member files** listed for this cluster (all under `src/app/**` or
`src/components/**`). Do not grep the repo, do not touch other clusters' files,
do not enter `src/design-system`, `src/lib`, `src/sanity`, `src/data`,
`src/types`.

## Procedure (per member file)

1. **Adopt the layout.** Replace the hand-rolled container (slot `className` or
   inline `css`) with the catalog's pattern in **JSX form**, using the catalog's
   props/values verbatim. Delete the now-empty layout slot.
2. **Rehome the rest** per the homing table:
   - **Type** (fontSize/weight/transform/letterSpacing) → a `textStyle` on the
     **leaf** element (`<p>`/`<a>`/`<h2>`), not the container — unless the catalog
     entry bakes it into the pattern.
   - **Structural paint** (ground/bg) → `layerStyle`/`section` via `className`.
   - **Structural separator** (a rule dividing regions) → the `Divider` pattern.
   - **Decorative paint** (borders/hairlines/lines/icons, no structural role) →
     **delete** (ambiguous → escalate, don't delete).
3. **Strip comments** in every file you touch (ride-along): cut restatement,
   design narration, value-justification, historical/`ZSB-XX`/setup cruft, stale
   refs. Keep only a non-inferable, load-bearing "why".
4. **Verify:** run `pnpm panda codegen` then `pnpm typecheck`; grep the touched
   files for residual `display: '(flex|grid)'`, `flexDirection`, and `css={` —
   all should be gone.

## Three mechanics you must get right

- **No `css` prop.** Layout goes on pattern props / real style props, never
  `css={{…}}`. (The `css()` *function* for className composition is fine.)
- **Responsive props go on the prop, not in `md`.** `<Stack direction={{ base:
  'column', md: 'row' }}>` — never `<Stack direction="column" md={{ direction:
  'row' }}>`, which skips the pattern transform and silently no-ops. Same for
  `gap`, `columns`, `colSpan`.
- **No `cx()`/JSX hybrid.** If the subtree also uses a `jsx:`-enabled recipe
  (`section`, …), migrate it to JSX form (`<Section ground="light">`) too, so the
  subtree is uniformly JSX, not a pattern nested in a `cx(section(), …)` div.

## Gold example — Footer `baseline`

A layout+skin+separator slot dissolving. **Before** (`Footer.recipe.ts` slot +
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

**After** — slot deleted; layout → `Stack`; `borderTop:hairline` (a separator)
→ `Divider`; `textStyle:footerMeta`+`letterSpacing:label` → the leaf text nodes:

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
`textAlign` dropped in favour of `Stack` alignment. (Exact props come from the
**catalog entry**, not this sketch — the sketch shows the *shape* of the move.)

## Idempotency

If a member file is already adopted (no layout slot, pattern already in JSX), it
is a **no-op** — report it as such, change nothing. This makes re-runs safe.

## Output — terse, no narration

The edits, plus two short tables. **No prose explanation.**

- **Deltas:** one row per changed file — `file` · `change` · `visual delta
  (yes+what / no)`.
- **Escalations:** one row per item left unchanged under Rule #1 — `file:line` ·
  `what` · `why it needs a human`.

## Calibration note

The **first** cluster of a batch is reviewed by a strong model before the rest
run, to catch a systematic error once rather than N times.
