# CLAUDE.md

## Comments: the budget is zero

This overrides your defaults and any skill or style guide that says otherwise.

A comment survives only if it states a fact **true of the world outside this
file** that a competent reader **cannot recover** from the code, the types, the
tests, or `git log` — a browser or vendor constraint, a load-bearing ordering
dependency. Everything else goes, including in files
whose neighbours are full of comments.

Delete on sight: restatement of the code; section-header banners; **design
narration** (what a layout, spacing, or colour "reads as" — the largest source
of bloat in this repo); justification of a chosen value; a tradeoff you already
resolved; JSDoc repeating a type or prop name; `(ZSB-41)` / `(ADR 0015)`
provenance; anything that goes stale when the code beside it changes.

Module and component doc blocks: none by default. Write one only when the
module's role in the system is invisible from the file — "both event routes
render this; changing the shape breaks the OG card". Two sentences, never about
layout or props.

## Props and absence

Absence is resolved once, in the mapper. Full rules and rationale:
`../zsb-wiki/src/content/wiki/plans/absence-handling-refactor.archived.md`.

- Never add `| undefined` to a prop type. Exception: pass-through of an optional
  domain field, where the call site is `prop={x}` and `x` is already
  `T | undefined`.
- Never make a required prop optional to switch layout or behaviour. That is a
  variant prop with `defaultVariants`.
- Never pass `undefined` to a custom component's prop. Both arms of a branch are
  real values; a caller that does not branch omits the prop. Carved out:
  `className`, `style`, `aria-*`, `data-*`, and tests.
- Arrays are `?: T[]` with a `= []` default.

## Stack

Next.js 16 (App Router, `cacheComponents`, `reactCompiler`), React 19, TypeScript
(`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`), Panda CSS,
embedded Sanity Studio. pnpm.

## Commands

- `pnpm dev` — **never run it**; the user has it running.
- `pnpm build` — never run it unprompted; `pnpm typecheck` is the signal.
- `pnpm typegen` — after any schema or GROQ change.
- `pnpm panda codegen` — after touching `src/design-system/`.
- `pnpm images:unused` — unreferenced files under `public/img/`.
- Also: `lint`, `lint:fix`, `format`, `test`, `test:e2e`.

## Where to look

- Domain vocabulary (Edition, Program, Event, Venue, Latest/Upcoming, status): `CONTEXT.md`
- CMS/Studio, singletons, draft-mode fetching, adding a page: `docs/cms.md`
- Testing layers, the seeded-test pattern, what is deliberately untested: `docs/testing.md`
- Design tokens and recipes: `src/design-system/preset.ts`
- Past plans, audits, decision records: `../zsb-wiki/`
