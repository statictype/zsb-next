# DS Phase 3 — deletion pass (Codex variant: GPT-5.5, xhigh reasoning)

The final sweep: delete everything the Phase 2 adoptions orphaned, and
prove the grill's invariants hold repo-wide. Authority:
`docs/reviews/2026-07-09-ds-grill-findings.md` + the frozen catalog
(`docs/reviews/<date>-ds-catalog.md`).

**Precondition:** every row of the catalog's adoption-status table is
`completed`. If any surface is pending, stop and report — this prompt
must run exactly once, last.

Model: **GPT-5.5 in Codex CLI, reasoning effort `xhigh`.** Calibration for
this model:

- **Every deletion needs a zero-consumers proof** — the exact grep you ran
  and its (empty) result, cited in the output table. No proof, no
  deletion. "Obviously dead" is not a proof.
- **Anything with a surviving consumer is an escalation, not a fix.** Do
  not update the consumer so the deletion can proceed — a surviving
  consumer is a missed Phase 2 item and must be reported against its
  surface, untouched. This is the rule this model is most likely to
  break; hold to it.
- **Enumerate exhaustively.** The invariant report lists every hit of
  every grep, mapped to its sanctioned exception or escalated. Never
  compress to "all clean except minor items".
- **No opportunistic cleanup** beyond the task lists below, however easy
  it looks.

Environment notes: package manager is **pnpm**. **Never commit, branch,
or stage anything.** Never run `pnpm build` or `pnpm dev`. Comment policy
(inline): strip comments that describe deleted machinery; add none.

## Task 1 — legacy typography

- Delete the legacy textStyles: `pageTitle`, `sectionTitle`, `cardTitle`,
  `boardTitle`, `labelDisplay`, `metaLabel`, `footerMeta`, `leadLarge`,
  `prose` (each: prove zero references first). Canonical 7 remain.
- Delete `fontSizes.badge` and `lineHeights.badge` (Badge now composes
  `<Text>`); `fontSizes.badgeRing` + `letterSpacings.badgeRing` move to
  the art/component token names the catalog's type census assigned (ring
  art, T6) — a rename, not a deletion, if the ring still consumes them.
- Delete orphaned `letterSpacings` (`subtle`, `wide`) and `lineHeights`
  (`heading`, `tight`, `display`, `body`, `loose` — whichever the 7
  styles' inlined literals left unconsumed). Prove each.

## Task 2 — legacy layout & spacing

- Retire `sectionInner` and `chipRow` layerStyles if the pattern sweeps
  left them unconsumed (carried over from the C1/C7 catalog's R1/R3).
- Delete spacing tokens the Phase 2 rhythm/ladder work orphaned
  (candidates per catalog §4: `navLogoTopMd`, `navDesktopTop*`,
  `badgeX/Y`, `cardOverlap`, stepped values replaced by clamp) — only
  those the catalog marked "snap" (reclassified component tokens stay).

## Task 3 — legacy motion & interactivity

- Delete `durations` that no longer have any consumer after the two-speed
  motion sweep (`medium`, `slow`, `reveal` are candidates — `reveal`/
  `entrance`/`sweep`/`stagger` likely survive in animationStyles; prove
  each). Delete orphaned `easings` (elastics, `expo`) only if
  animationStyles no longer reference them — expo almost certainly stays.
- Confirm no `_focusVisible`/`_disabled` restatements reappeared; the two
  sanctioned survivors are the dialog inset deviation and the Navigation
  toggle's `::before` ring (see findings §F1).

## Task 4 — sva & plumbing extinction

- `sva` must have zero imports in `src/` — if the dissolution map was
  fully executed this is already true; prove it, then remove any dead
  `*.recipe.ts` files and stale entries in the preset recipe index.
- The one legacy `cva` follows its catalog row.

## Task 5 — census verification (the point of the phase)

Run and record each invariant grep repo-wide (`src/`, excluding
`styled-system/`). Expected result: zero hits, or only the named
sanctioned exceptions (art rows, skin rows, the two focus deviations).
Report each as `invariant · hits · exceptions consumed`:

1. `css({` in `.tsx` — zero (G1).
2. `className={` carrying a recipe/slot call — zero (G2).
3. `fontSize|fontFamily|fontWeight|letterSpacing|lineHeight|textTransform`
   outside `src/design-system/` — zero beyond art/skin rows (T3/T4).
4. Legacy textStyle names — zero.
5. `margin(Top|Bottom)|marginBlock` in recipes — zero (R1).
6. `calc(` outside `tokens.ts` — zero (C1).
7. `sva(` — zero (P1).
8. Transition durations other than `fast`/`normal`/`instant` — zero (M1).
9. `outline:` focus declarations outside globalCss — the two sanctioned
   deviations only (F1).
10. `[bracketed]` raw literals in recipes — each remaining one is listed
    with its catalog exception row, or escalated.

Any unexpected hit: **do not fix it here** — it's a missed Phase 2 item;
escalate with the surface it belongs to.

## Verify

`pnpm panda codegen` · `pnpm typecheck` · `pnpm lint` · `pnpm format`.
Update the catalog's adoption-status table with a final
`phase-3: completed` row.

## Output

Three tables, no prose:

- **Deletions:** `token/style/file` · `proof (grep)`.
- **Invariants:** `invariant` · `hits` · `sanctioned exceptions consumed`.
- **Escalations:** `file:line` · `what` · `which surface missed it`.
