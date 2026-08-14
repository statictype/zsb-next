# CLAUDE.md

## Comments: the budget is zero

This overrides your defaults and any skill or style guide that says otherwise.

**Default: zero.** A comment is an exception you have to earn, not a judgement
call you get to make. Before writing one, name the clause below that permits it.
No clause, no comment. "It seemed useful here" is not a clause.

### The only three cases

1. A vendor, browser, or spec behaviour that contradicts what the code appears
   to do, where deleting the comment invites a "correction" that breaks it.
2. A coupling that spans files, where nothing in *this* file shows the other end.
3. A workaround with an external expiry — an upstream bug, a version gate. Name
   the thing being waited on.

Everything else goes, including in files whose neighbours are full of comments.

### Rejected justifications

These are the arguments that keep producing violations. None of them work.

- *"The rationale is non-obvious."* Non-obvious rationale lives in `git log`,
  Linear, and `../zsb-wiki/`. **Never transcribe a commit message into a file.**
  Never name a Linear issue, ADR, or PR in a comment.
- *"But it's a real constraint — WCAG, performance, a11y."* A constraint the
  code already satisfies needs no comment. Case 1 covers only code that looks
  wrong without one.
- *"I'm just moving an existing comment."* Then move it verbatim. Relocating is
  not licence to reword or expand.
- *"This value is load-bearing; someone might change it."* That is what tests
  are for.

### Delete on sight

Restatement of the code; section-header banners; **design narration** (what a
layout, spacing, or colour "reads as" — the largest source of bloat in this
repo); justification of a chosen value; a tradeoff you already resolved; JSDoc
repeating a type or prop name; `(ZSB-41)` / `(ADR 0015)` provenance; anything
that goes stale when the code beside it changes.

Module and component doc blocks: none by default. Write one only when the
module's role in the system is invisible from the file — "both event routes
render this; changing the shape breaks the OG card". Two sentences, never about
layout or props.

### Check before reporting a diff as finished

```sh
git diff -U0 | grep -E '^\+' | grep -E '//|/\*'
```

Expect no output. Every hit needs a clause number stated out loud. Refactors —
moves, renames, extractions, token work — get **zero** new comments: the code
changed shape, the world did not.

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
