# SYSTEM INTEGRITY AUDIT

A SYSTEM INTEGRITY AUDIT of a mature, zero-runtime Panda CSS design system in a
large Next.js repo. This is **NOT cleanup**: find where discipline silently
leaked, then propose deeper abstractions. Produce a **PLAN AND REPORT ONLY**. Do
not edit source. Do not run codegen. Generated Panda output is gitignored; read
`panda.config.ts` and co-located source recipes, never generated CSS.

Run as a **MULTI-PASS job** with checkpoints. Persist intermediate state to
`/docs/audit/` so each pass is cheap and resumable. Never load the whole repo
into context; work directory-by-directory and rely on persisted state files
instead of re-reading everything.

**Output format:** persist tabular artifacts as **Markdown tables** (or HTML),
not CSV — keep all columns and data, just render them as a Markdown table. (JSON
artifacts stay JSON.)

## Checkpoint protocol

Every pass writes its complete output to a file in `/docs/audit/` FIRST. At each
CHECKPOINT, print only a minimal digest (a few numbers + the file path) and
stop, then wait for "continue". On-disk files are the single source of truth;
chat is just a control channel. Never summarize a file's full contents into
chat. If you approach a context limit mid-pass, flush partial state to the
relevant `/docs/audit/` file, note where you stopped, and say "continue".

## System invariants (ground truth, flag every violation)

- **One source of truth:** `panda.config.ts` holds OKLCH color tokens (full gray
  ramp from a single anchor), the type scale as `textStyles` (2xs..5xl), and
  section/page layout as `layerStyles`.
- **Exactly 6 registered recipe primitives** (verify; suspected badge, button,
  card, + 3 others). Confirm the count, do not assume it.
- Every component-specific style is a co-located `sva`/`cva` next to its
  component, never registered globally.
- **Cascade layers:** `reset -> base -> tokens -> recipes -> utilities`.
  Co-located styles live in utilities and intentionally beat config recipes. No
  `!important`, no specificity hacks.
- Components style against semantic tokens, `textStyles`, `layerStyles`. Raw
  values (hex, px, rem, oklch literals, inline `fontSize`/`lineHeight`, inline
  section padding) are leaks.

## Motion philosophy (applies to all passes; stated once)

Keyframes are aggressively minimal. The goal is **NORMALIZATION**: the smallest
canonical set, each parameterized to cover many uses. Nothing gets a pass: every
keyframe is a consolidation or deletion candidate by default. The burden of
proof is on KEEPING. Unused/unapplied keyframes must be deleted. Near-duplicates
must collapse to one parameterized keyframe. Survival requires explicit
justification in PASS 3; absence of justification means propose removal. Inline
duration/easing maps to a motion token or flags a missing one.

## Keyframe hypothesis (verify with file:line, confirm or refute)

- **Delete** (suspected unused/unapplied): `rippleAnim`, `pulse`, `glowDrift`.
- **Collapse** to one parameterized "enter" (opacity + optional translate +
  scale): `fadeIn`, `fadeSlideUp`, `cardIn`, `dialogIn`, `tapeIn`,
  `imageReveal`.
- **Challenge** as one "loop a property to its end" (custom-property driven):
  `spin`, `mbGradientSpin`, `gradientBorderShift`.
- **Challenge** `heroProgress` and `shimmer` as one "sweep a bar across"
  keyframe.

**Target: 16 -> ~4.** Any deviation must cite evidence.

## PASS 0: System Map (cheap, do first)

Read ONLY `panda.config.ts` (and any files it imports for tokens). Write
`/docs/audit/00-system-map.md`: the registered primitives (name + variant API,
and the confirmed count), all semantic token roles, all `textStyles` (2xs..5xl)
with values, all `layerStyles`, and the layer order. This file is ground truth
for all later passes. Do NOT scan components yet. Also record the motion
baseline: all motion tokens (durations, easings) and all registered
keyframes/animations; list every keyframe as a consolidation or deletion
candidate with a one-line note on what it does. If durations/easings are not
tokenized, record that absence explicitly.

> **CHECKPOINT 0:** print ONLY a 4-line digest (primitive count, token-role
> count, textStyle count, keyframe count) plus the path, then wait.

## PASS 1: Inventory (mechanical, no judgment yet)

Walk the component tree directory-by-directory. For each component + its
co-located recipe, append a row to `/docs/audit/01-inventory.md` (a Markdown
table) with columns:

- `component_path`
- `recipe_path`
- `slot_count`
- `inline_css_count`
- `raw_value_count`
- `textstyle_inline_count`
- `layerstyle_inline_count`
- `anim_inline_count`
- `keyframes_local_count`
- `primitives_adopted`
- `line_ranges`
- `notable_patterns`

Capture file:line ranges for every leak/pattern in `line_ranges` so later passes
cite from the index without re-scanning. Also write `/docs/audit/01-usage.json`
tallying: frequency of each textStyle step, each spacing/radius/shadow token,
usage frequency of each registered keyframe (zero-usage = deletion candidate),
which components reference each keyframe, and a hash->locations map of repeated
co-located style patterns. Write human-readable totals (components, leaks by
type, top repeated patterns, textStyle histogram, keyframe usage histogram with
unused keyframes called out) to `/docs/audit/01-summary.md`.

Process at most ~15 components per batch; after each batch, flush to disk and
print one line: `batch N done: X components, Y leaks`.

> **CHECKPOINT 1:** print ONLY the path `/docs/audit/01-summary.md` and its 4
> headline numbers, then wait.

## PASS 2: Leak + drift analysis (judgment)

Using `01-inventory.csv` and `01-usage.json` as your index (re-open individual
files only as needed, citing recorded `line_ranges`), classify findings:

- Co-located styles reimplementing a primitive -> "adopt primitive X, tweak via
  utilities layer" with the exact remaining override.
- Raw values -> map to the correct semantic token, or state none fits.
- Inline `fontSize`/`lineHeight` -> map to a textStyle or flag a missing one.
- Inline section/page padding -> map to a layerStyle.
- **Motion drift** (apply the Motion philosophy): flag unused/unapplied
  keyframes for deletion against the usage histogram; group near-duplicates to
  collapse; challenge every remaining keyframe (parameterize / token-driven
  transition / delete). Inline duration/easing -> motion token or missing-token
  flag.
- Any specificity hack / `!important` / layer misuse.

Write `/docs/audit/02-findings.md`: a Markdown findings table (ID, Severity
[Critical/High/Medium/Low], Category, File:lines, Issue, Recommended fix) AND a
grouped-by-severity section (top 5 highest-severity called out). Cite file:line
for every finding.

> **CHECKPOINT 2:** print ONLY the severity counts (one line) and the path,
> wait.

## PASS 3: Abstractions

From the repeated-pattern map (N>=2 components):

- **Primitive promotion:** name each new primitive, list adopting components,
  sketch an orthogonal variant API (size/tone/intent, no combinatorial names),
  state what shrinks. The 6 are not frozen; propose
  additions/consolidations.
- **Type scale reduction:** from the histogram, propose a reduced modular scale
  (state the ratio), give an old->new migration map, flag 0-1 use steps for
  removal. Same for over-rich spacing/radius/shadow scales.
- **Motion consolidation** (apply the Motion philosophy hard): delete
  unused/unapplied keyframes; collapse near-duplicate families to one keyframe
  parameterized by distance/scale/duration via tokens or animation utilities;
  pressure-test the remainder (parameterize / token-driven transition / delete).
  State a target count (aim low) and before -> after. Each survivor needs a
  one-line justification.
- **OKLCH ramp sanity check** (lightweight): perceptual evenness + which text
  roles pass WCAG AA/AAA against which surfaces; flag unsafe/undefined pairings.
  No palette redesign.

Write `/docs/audit/03-abstractions.md`.

> **CHECKPOINT 3:** print ONLY promotion-candidate count, proposed scale ratio,
> keyframe count (before -> after), and the path, then wait.

## PASS 4: Component composition + slot reorganization (go deep)

For each component flagged in passes 2-3 (batch, flush per batch), propose at
TWO levels:

### 1. Composition (between components)

Where component boundaries are wrong. A component may be split, merged, or
recomposed from existing primitives/components when simpler than its current
form. Slots are not the only lever: if the same result comes from composing
existing pieces differently (e.g. a parent stack/grid + two primitives instead
of one bespoke component), propose that. Explicitly flag **OVERENGINEERED**
components: too many slots/variants/props for actual usage, abstraction paying
off in <2 call sites, or wrappers adding nothing. Bias hard toward fewer,
simpler components. Collapsing a component into composition is a preferred
outcome.

### 2. Slots (within a component)

Propose concrete slot boundaries (root/header/media/body/footer etc.) where
markup conflates concerns or forces inline `css()`; move repeated inline `css()`
into named `sva` slots; separate sibling-layout (belongs to parent / Panda
stack/hstack/grid/container) from component-internal styling. Show the proposed
slot tree and map current elements -> slots.

For each proposal state the lever (recompose / split / merge / delete / reslot),
the simpler target shape, and what shrinks (components, slots, variants, or
LOC). Do not add structure real usage does not justify. Flag and propose only,
no final code. Write `/docs/audit/04-slots.md`.

> **CHECKPOINT 4:** print ONLY the count of components with proposed reorgs,
> split by lever (recompose/split/merge/delete/reslot), and the path, then wait.

## PASS 5: Assemble report

Compile `/docs/design-audit.md` by reading and stitching artifacts 00-04. Do NOT
reconstruct from memory; quote and reorganize from the files. If a section is
missing from disk, say so rather than inventing it. Structure:

1. Executive summary (system health + top 3 wins).
2. System Map (from 00).
3. Severity-ranked findings table (from 02).
4. Primitive promotion proposals (from 03).
5. Type/spacing scale reduction with migration map (from 03).
6. Color/contrast risks (from 03).
   - **6b.** Motion consolidation: deletions, canonical keyframe set, family
     migration map (from 03).
7. Composition + slot reorganization (from 04), including components recommended
   for simplification, merge, or deletion.
8. Phased refactor plan:
   - **Phase 1** (mechanical leaks)
   - **Phase 2** (promotion)
   - **Phase 3** (composition + slots + scale reduction + motion consolidation)
   - Each phase: estimated CSS/LOC reduction and risk level.

End with the single highest-leverage change to make first.

## Constraints

Evidence over vibes: cite file:line for every finding. No source edits, no
codegen runs, stay zero-runtime, no Tailwind, no new deps unless explicitly
proposed and justified, keep RSC compatibility. Prefer fewer, stronger
abstractions; prefer composing existing pieces over adding new ones. An
abstraction must earn its keep in >=2 real call sites, else recommend inlining
or deletion. No overengineered components.
