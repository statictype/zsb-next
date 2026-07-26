# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# ⛔ COMMENTS: THE BUDGET IS ZERO

**Read this before writing a single line. It overrides your defaults and any
skill, style guide, or habit that says otherwise.**

The default number of comments in a change is **zero**. Not "few". Zero. You
must be able to name the specific reader who would be wrong without the comment
before you write it.

## The only comment that survives

A fact that is **true of the world outside this file** and that a competent
reader **cannot recover** by reading the code, the types, the tests, or
`git log`. In practice: a browser/framework bug, a vendor API constraint, a
regulatory rule, a load-bearing ordering dependency, a value derived from a
measurement taken elsewhere.

If it fails that test, delete it. There is no second category.

## Delete on sight

- **Restatement.** `// Fetch the user` above `fetchUser()`.
- **Section headers.** `// ---- Helpers ----`, `// ---- Styles ----`. Structure
  is the file's job, not a banner's.
- **Design narration.** Explaining what a layout, spacing, or colour choice
  "reads as", what it "says", or why it looks right. The rendered UI is the
  argument. This is the single largest source of comment bloat in this repo.
- **Justifying a value.** `// 42% so the poster fills the column`. Pick the
  value; the reader can measure.
- **Naming a tradeoff you already resolved.** The chosen branch is in the code.
- **Restating a type or a prop's name** in a JSDoc `@param` or a doc block.
- **Ticket and ADR tourism.** `(ZSB-41)`, `(ADR 0015)` sprinkled as provenance.
  Cite one only when the reader must open it to change the code safely.
- **Anything that would go stale** if the code next to it changed.

## Component and module doc blocks

Default to none. A component's name, props, and JSX say what it is.

Write one only when the module's **role in the system** is genuinely not
visible from the file — e.g. "both event routes render this; changing the
shape breaks the OG card". Two sentences maximum. Never describe the layout,
the visual result, or the props.

## Editing existing files

You are not licensed to add comments because neighbouring comments exist. Match
the code, not the commentary. Removing a stale or useless comment is always an
acceptable part of a change.

## The check before you commit

Reread the diff and delete every comment you cannot defend under the rule
above. Expect to delete most of what you wrote. A reviewer treats an
unnecessary comment as a defect, the same as dead code.

## Stack

Next.js 16 (App Router, `cacheComponents: true`, `reactCompiler: true`), React 19, TypeScript (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`), Panda CSS, embedded Sanity Studio. Package manager is **pnpm**.

## Commands

- `pnpm dev` — dev server (localhost:3000). **Do not start this; the user runs it themselves.**
- `pnpm build` — production build; the canonical type-check (don't run unprompted — prefer `typecheck`)
- `pnpm typecheck` — `tsc --noEmit`, faster signal than a full build
- `pnpm lint` / `pnpm lint:fix` — ESLint, scoped to `./src`
- `pnpm format` / `pnpm format:check` — Biome (formatting only)
- `pnpm test` / `pnpm test:watch` — Vitest
- `pnpm vitest run path/to/file.test.ts` — a single test file
- `pnpm test:e2e` — Playwright smoke suite
- `pnpm typegen` — regenerate `sanity.types.ts`; run after any schema or GROQ change
- `pnpm panda codegen` — regenerate `styled-system/`; run after touching the design-system preset
- `pnpm images:unused` — find unreferenced files under `public/img/`

## Where to look

- **Domain vocabulary** (Edition, Program, Event, Venue, Latest/Upcoming, status values): `CONTEXT.md`
- **CMS/Studio architecture, singleton pattern, draft-mode fetching, adding a page**: `docs/cms.md`
- **Testing layers, what's deliberately untested, seeded-test pattern**: `docs/testing.md`
- **Historical prompts, audits, completed plans, and raw decision records**: adjacent `../zsb-wiki/`
- **Design-system tokens/recipes**: `src/design-system/preset.ts`

## MCP

At the start of a Next.js task, call the `init` tool from `next-devtools-mcp` first to load current Next 16 context.
