# DS enforcement — conventions become gates (Codex variant: GPT-5.5, xhigh reasoning)

The DS's conventions currently hold by discipline: raw motion physics
live only in the preset, `[bracketed]` literals are "migration backlog,
not sanctioned exceptions" (`src/design-system/preset.ts`), and the
`transition` utility's legacy value names (`colors`, `all`, …) are
compile-valid but deliberate no-ops. This pass turns each convention
into a gate that fails the build. Authority: the motion contract in
`src/design-system/preset.ts` (utilities comment) and the frozen
catalog (`docs/reviews/2026-07-10-ds-catalog.md`).

Model: **GPT-5.5 in Codex CLI, reasoning effort `xhigh`.** Calibration
for this model:

- **Every gate needs a negative-test proof** — seed a violation, show
  the exact failing output, revert the seed. Cite the proof in the
  output table. A gate that has never fired is not a gate.
- **Gates only, no cleanup.** If a gate finds a real violation in the
  current tree, allowlist or escalate it — do not fix it here. This is
  the rule this model is most likely to break: the fix looks one line
  away. Hold to it; violations found are output rows, not edits.
- **Zero false positives.** A gate that flags sanctioned code (art
  rows, the preset's own longhands) is wrong; scope it until the full
  current tree passes.
- Do not invent config file locations or rule names — read
  `eslint.config.mjs`, `panda.config.ts`, and
  `.github/workflows/ci.yml` before writing to them.

Environment notes: package manager is **pnpm**. **Never commit,
branch, or stage anything.** Never run `pnpm build` or `pnpm dev`.
Comment policy (inline): no comments that restate code; gate failure
messages must tell the author what to do instead, in one line.

## Task 1 — motion physics ban (ESLint)

Extend `eslint.config.mjs` (flat config, scoped `./src`):

- Ban the raw motion longhands as style-object keys outside
  `src/design-system/`: `transitionProperty`, `transitionDuration`,
  `transitionTimingFunction`, `transitionDelay`, `animationName`,
  `animationDuration`, `animationTimingFunction`,
  `animationIterationCount`, `animationFillMode`. Use
  `no-restricted-syntax` `Property` selectors; add an override block
  exempting `src/design-system/**`.
- Sanctioned outside the preset and therefore **not** banned:
  `transition` (the verb utility), `animationStyle`, `animationDelay`
  (hero sequencing — `PageHero.recipe.ts`, `Hero.recipe.ts`,
  `page.recipe.ts` are the current consumers).
- Ban the legacy `transition` enum values that Panda's merge left in
  the type union: literal values `all|common|background|colors|opacity|
  shadow|transform|size|position` under a `transition` key. Only
  `interactive`, `develop`, `none` pass.
- Failure message names the verb to use (e.g. "use transition:
  'interactive' | 'develop' — physics lives in the preset").

## Task 2 — bracket-literal gate

- Inventory every value-position escape hatch (`: '[` …`]'`) in
  `src/**/*.recipe.ts`, `src/design-system/**`, and inline `css()`
  calls. Selector strings containing brackets (`'& [data-…]'`) are not
  escapes; the gate must distinguish value position from selector keys.
- Write `scripts/check-brackets.mjs` + a `lint:brackets` script:
  compares current hits against a committed allowlist
  (`scripts/bracket-allowlist.txt`, one `file · count` or
  `file:line · value` entry per hit — pick the format that survives
  line drift best and say why).
- The allowlist only shrinks: a new hit fails; a stale entry (hit
  removed but still listed) also fails, so the ratchet is real.
- Chain it into `pnpm lint` (or the CI lint step in
  `.github/workflows/ci.yml`) so it gates PRs without a new workflow.

## Task 3 — Panda strict validation

- In `panda.config.ts`, set `validation: 'error'` and evaluate
  `strictPropertyValues: true` (strictTokens is already on). Run
  `pnpm panda codegen` + `pnpm panda cssgen`.
- If either flag produces >20 violations, stop, leave the flag off,
  and escalate the inventory instead of fixing — that's its own
  adoption pass. ≤20: they're gate bugs or true violations; allowlist
  or escalate per the rules above.

## Task 4 — CI wiring

- Confirm every new gate actually runs in `.github/workflows/ci.yml`
  on a PR (lint step covers ESLint; show where `lint:brackets` runs).
- No new required checks beyond the existing workflow's jobs.

## Verify

`pnpm panda codegen` · `pnpm typecheck` · `pnpm lint` (must include
the new rules and pass on the clean tree) · `pnpm lint:brackets` ·
`pnpm format`. Then the negative tests: one seeded violation per gate,
each captured failing, each reverted — the tree you leave behind is
clean.

## Output

Two tables, no prose:

- **Gates:** `gate` · `mechanism (file)` · `negative-test proof` ·
  `current-tree hits (allowlisted/zero)`.
- **Escalations:** `file:line` · `what the gate found` · `why it's not
  fixed here`.
