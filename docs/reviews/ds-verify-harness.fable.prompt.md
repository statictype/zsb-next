# DS verification harness — visual snapshots + cssgen diff (Fable 5)

Every DS pass so far was verified by typecheck + eyeballs. This pass
builds the two verifiers that make future refactors provably no-op:
a Playwright visual-snapshot suite and a generated-CSS diff harness.
Once these exist, "snap 40 call sites" is a mechanical change an agent
can prove safe without a human looking at every page.

Read first, before any code: `docs/testing.md` (the layer philosophy —
this harness must slot in as a layer, not a parallel universe),
`playwright.config.ts` (the smoke suite self-builds via `webServer`
and hits live Sanity), and `e2e/helpers.ts`.

Locked decisions — do not relitigate:

- **The visual suite is a local refactor verifier, not a CI gate.**
  Baselines are committed from the platform they were generated on
  (`snapshotPathTemplate` must include the platform so a foreign
  machine fails cleanly rather than diffing across font rasterizers).
  CI wiring is out of scope until baselines are containerized.
- **Live Sanity data is the fixture.** The smoke suite already accepts
  that; don't build a mock CMS here. Determinism comes from masking
  and clock control, not data virtualization. If a page can't be made
  stable that way, drop it from coverage and say so in the output.
- **No new build paths.** The suite reuses the existing `webServer`
  self-build; never run `pnpm build` standalone.

## Task 1 — visual project

- Add a `visual` Playwright project (own `e2e/visual/` dir, chromium
  only) that the existing `smoke` project ignores; scripts
  `test:visual` and `test:visual:update`.
- Two viewports: 375×812 and 1440×900. `use` sets
  `reducedMotion: 'reduce'` — the DS's global reduced-motion kill
  (preset.ts globalCss) then freezes all transitions/animations, which
  is what makes full-page screenshots deterministic at all. Wait for
  `document.fonts.ready` and network idle before every shot.
- Control the clock (Playwright clock API) — the Calendar's
  live/past/today rendering is date-derived; pin a date inside the
  current edition's run so bands and markers are stable.
- Coverage (full-page unless noted): `/`, `/editions`, the newest
  edition's `/editions/[year]` (hero + calendar), an event modal open,
  `/about`, `/press`, `/visit`, `/partners`, the 404 page, mobile nav
  menu open, lightbox open. Element-level shots for the states the
  motion contract just normalized: a hovered `EditionCard`, a hovered
  Calendar run, a focused nav link.
- Mask what live data makes unstable (event counts, "today" copy if
  the clock can't reach it) — prefer a mask over dropping the page.
  Tolerances stay tight (`maxDiffPixels` in the low hundreds); a loose
  tolerance is a disabled verifier.

## Task 2 — cssgen diff harness

- `pnpm css:diff [ref]` (default `HEAD`): emits `panda cssgen` output
  for the working tree and for `ref`, normalizes nothing (cssgen is
  deterministic), and prints a unified diff; exit 0 on empty.
- Must not require a second `pnpm install` — use a temporary git
  worktree sharing this repo's `node_modules` (or generate from a
  stash roundtrip); document the mechanism in the script header.
- Acceptance: clean tree → `css:diff HEAD` empty; a one-token edit →
  exactly that token's ripple in the diff, nothing else.

## Task 3 — document the layer

- Add the two verifiers to `docs/testing.md` as a new layer entry, in
  the file's existing register and length discipline (a few lines, not
  a manual): what each proves, the refactor workflow (baseline →
  change → `css:diff` + `test:visual` → only intended deltas), and the
  update path (`test:visual:update` after an *intended* visual change,
  reviewed like code).

## Verify

- `pnpm test:visual` twice back-to-back on the clean tree — the second
  run must pass with zero diffs (flake check).
- Negative test: seed a 1px visual change (any recipe), show the suite
  catching it, revert.
- `pnpm css:diff HEAD` empty on the clean tree; negative test with a
  token edit, reverted.
- `pnpm typecheck` · `pnpm lint` · `pnpm format`.

## Output

Three tables, no prose:

- **Coverage:** `page/state` · `viewports` · `masks applied (why)` —
  dropped pages appear here with the instability they couldn't escape.
- **Determinism:** `flake source` · `mitigation` (fonts, clock,
  animations, live data, image loading — account for each).
- **Proofs:** `harness` · `negative test` · `result`.
