# DS Phase 0 — foundations (type scale, sealed textStyles, Text pattern, global interactivity)

Execute **Phase 0** of the design-system coherence plan
(`docs/reviews/2026-07-09-ds-grill-findings.md`, §T, §F/D, §E — read those
sections once; they are the authority). Every canonical value in this prompt
was decided in the grill; your job is faithful execution, not redesign.

Model: Sonnet 5 at **high effort**, adaptive thinking. Calibration:

- **Follow the tables literally and apply blanket rules to every member.**
  Don't narrow a repo-wide rename to the first file you touch.
- **Escalate, don't improvise.** Anything not covered by a table or rule in
  this prompt: leave the code unchanged, add it to the escalation list. A
  long honest escalation list is the success case.
- **Terse output contract** (bottom). No running commentary.

## Hard rules

1. Work on the current branch. **Never commit** — stop after verification.
2. Never run `pnpm build` or `pnpm dev`. Verify with `pnpm panda codegen`,
   `pnpm typecheck`, `pnpm lint`, and targeted greps of `pnpm panda cssgen`
   output.
3. No new comments that restate/justify edits (CLAUDE.md); strip stale
   comments in files you touch (e.g. comments describing the old stepped
   scale or the deleted `_focusVisible` blocks).
4. This phase deliberately changes rendered output **once, site-wide** — the
   visual normalization lands here so later sweeps are zero-delta refactors.
   Expected deltas are listed at the bottom; anything you cause *beyond*
   that list is an escalation, not a silent ship.

## Out of scope (do not touch)

Spacing-ladder clamp conversion; motion/two-speed transitions; sva→config
recipe conversion; ambient `body { textStyle }` default; Badge/Eyebrow/Button
`<Text>` composition; deleting `fontSizes.badge`/`badgeRing`,
`lineHeights.*`, `letterSpacings.subtle/wide` (legacy consumers remain until
Phase 2/3); any enforcement tooling.

---

## Task 1 — the 6-step fontSize scale (all `clamp()`)

In `src/design-system/tokens.ts`:

1. Replace `tokens.fontSizes` (`md`…`5xl`) and **delete
   `semanticTokens.fontSizes` entirely**. The new scale (fluid 375→1920px
   viewport, precomputed — use these exact values):

   | token | value |
   | --- | --- |
   | `xs` | `clamp(10px, 9.76px + 0.0647vw, 11px)` |
   | `sm` | `clamp(12px, 11.76px + 0.0647vw, 13px)` |
   | `base` | `16px` (the one flat size — a degenerate clamp is noise) |
   | `md` | `clamp(19px, 17.54px + 0.3883vw, 25px)` |
   | `lg` | `clamp(26px, 18.72px + 1.9417vw, 56px)` |
   | `xl` | `clamp(48px, 37.32px + 2.8479vw, 92px)` |

   Keep `badge` and `badgeRing` untouched (component/art, die in a later
   phase).

2. **Rename table — apply to every `fontSize:` reference in `src/`**
   (recipes, textStyles, tsx). No compat aliases: old names that changed
   meaning are renamed at the call site instead.

   | old | new |
   | --- | --- |
   | `2xs` | `xs` |
   | `xs` | `xs` |
   | `sm` | `sm` |
   | `base` | `base` |
   | `md` | `md` |
   | `lg` | `md` |
   | `xl` | `lg` |
   | `2xl` | `lg` |
   | `3xl` | `lg` |
   | `4xl` | `xl` |
   | `5xl` | `xl` |

   Responsive objects collapse where the mapping makes both ends equal
   (e.g. `{ base: 'xl', md: '2xl' }` → `'lg'`). Untouched: `badge`,
   `badgeRing`, `'[inherit]'`/`'inherit'`, and bracketed art clamps
   (`'[clamp(…)]'` in ExternalGallery/Hero/page — classified as art, T6).
   Any `fontSize` value not in this table and not in the untouched list is
   an **escalation**.

## Task 2 — the 7 sealed textStyles + legacy redefinitions

Replace the `textStyles` export in `tokens.ts` with:

1. **The 7 canonical styles** (pure type — **no `color`** in any of them;
   lh/ls values are inlined literals per T7):

   ```ts
   display: { fontFamily: 'display', fontSize: 'xl', lineHeight: '1', letterSpacing: '-0.02em', textTransform: 'uppercase' },
   title:   { fontFamily: 'display', fontSize: 'lg', lineHeight: '1.16', letterSpacing: '-0.02em', textTransform: 'uppercase' },
   heading: { fontFamily: 'display', fontSize: 'md', lineHeight: '1.16', letterSpacing: '-0.02em', textTransform: 'uppercase' },
   lead:    { fontFamily: 'body', fontSize: 'md', fontWeight: 'light', lineHeight: '1.56', textWrap: 'pretty' },
   body:    { fontFamily: 'body', fontSize: 'base', lineHeight: '1.56', textWrap: 'pretty' },
   caption: { fontFamily: 'body', fontSize: 'sm', lineHeight: '1.38' },
   label:   { fontFamily: 'body', fontSize: 'xs', fontWeight: 'semibold', lineHeight: '1.3', letterSpacing: '1.2px', textTransform: 'uppercase' },
   ```

2. **Legacy styles redefined as thin copies** (they keep their names so
   existing recipe references still resolve; they die in Phase 2). Author
   each as the canonical style's value plus the listed extra — copy the
   values (Panda textStyles can't reference each other):

   | legacy | becomes | extra kept |
   | --- | --- | --- |
   | `pageTitle` | = `display` | — |
   | `sectionTitle` | = `title` | — |
   | `cardTitle` | = `heading` | — |
   | `boardTitle` | = `heading` | `color: 'white'` |
   | `metaLabel` | = `label` | `color: 'muted'` |
   | `footerMeta` | = `label` | `color: 'muted'` |
   | `lead` | canonical `lead` (absorbs old `leadLarge` role) | — |
   | `leadLarge` | = `lead` | — |
   | `prose` | = `body` | `color: 'body'` |
   | `labelDisplay` | **unchanged** (no fontSize to remap; dies Phase 2) | — |

## Task 3 — the `Text` pattern

In `src/design-system/preset.ts` `patterns.extend`, add:

```ts
text: definePattern({
  jsxName: 'Text',
  jsxElement: 'span',
  properties: { variant: { type: 'enum', value: ['display', 'title', 'heading', 'lead', 'body', 'caption', 'label'] } },
  defaultValues: { variant: 'body' },
  blocklist: ['fontSize', 'fontFamily', 'fontWeight', 'letterSpacing', 'lineHeight', 'textTransform', 'textStyle'],
  transform({ variant, ...rest }) {
    return { textStyle: variant, ...rest }
  },
}),
```

Prop is named `variant` (not `style` — DOM-prop collision). The generated
JSX supports `as`/`asChild` for semantic elements; don't add anything for
that. Run `pnpm panda codegen` and confirm `styled-system/patterns/text.*`
and the `Text` JSX export exist. No call-site adoption in this phase.

## Task 4 — global focus + disabled, delete the restatements

1. Add to the project's `globalCss` (extend where it's currently defined —
   `panda.config.ts` or the preset; if neither has one, add `globalCss` to
   the preset):

   ```ts
   ':focus-visible': { outline: 'focus', outlineOffset: 'token(spacing.xs)' },
   ':disabled, [aria-disabled=true]': { opacity: 0.5, cursor: 'not-allowed' },
   ```

   Verify via cssgen that `outline` resolves to the 2px chartreuse ring and
   the offset to 4px.

2. **Delete every `_focusVisible` block that only restates a ring** —
   i.e. its declarations are a subset of `{ outline: 'focus' | 'primary',
   outlineOffset: <any> }`. That includes the pink `outline: 'primary'`
   sites (button, carousel ×3) — chartreuse wins everywhere. Known sites
   (verify by grep, don't trust line numbers): ExternalGallery,
   CalendarFilters, Calendar ×3, VenuesView, EditionRailCard, Navigation,
   EditionCard, FeaturedEvents, button, accordion, carousel ×3,
   collapsible, dialog.
   - **Exception (keep):** `dialog.ts` close-button's negative
     `outlineOffset` (`calc(focus * -1)`) — clipping deviation; keep the
     whole block.
   - A `_focusVisible` block containing anything *besides* outline+offset:
     delete only the ring part, keep the rest — if unsure, **escalate**.
3. **Disabled convention:** delete `button.ts` `_disabled`, `carousel.ts`
   `_disabled`, and `CalendarFilters.recipe.ts` `_disabled` recolor (the
   `:hover:not(:disabled)` guard there stays). The global rule now covers
   them.
4. `borders.focus` stays (the ring's definition). `borders.primary` stays
   (still the about-page accent rule); it merely loses its focus duty.

## Task 5 — ride-along prompt amendment (E3)

In `docs/reviews/panda-pattern-adopt.prompt.md`, the gold example's leaf
spans use `css({ textStyle: 'footerMeta', … })` — superseded by G1/T4.
Rewrite those leaf lines to `<Text variant="label">` form and add one line
noting that leaf type now goes through the `Text` pattern (grill 2026-07-09).
Don't restructure the rest of the prompt.

## Verification (in order)

1. `pnpm panda codegen` — clean.
2. `pnpm typecheck` — clean. (Type errors from deleted fontSize names mean
   a missed rename — fix via the table, don't re-add tokens.)
3. `pnpm lint` — clean.
4. Greps: no `fontSize: '2xs'`/`'2xl'`/`'3xl'`/`'4xl'`/`'5xl'` left in
   `src/`; no `_focusVisible` outside the dialog exception and any
   escalated sites; `pnpm panda cssgen` output contains the
   `:focus-visible` and `:disabled` rules exactly once.
5. `pnpm format` before finishing.

## Expected visual deltas (sanctioned — everything else escalates)

- Site-wide type snaps to the merged scale: old-`lg` text drops to `md`
  (22–25 → 19–25px), old-`xl` (incl. **card titles**) drops into the new
  `md`, section titles ride the wider fluid `lg`, page/hero titles become
  48–92px, tiny `2xs` text grows to `xs` (10–11px).
- `base` body text is 16px at all widths (was 15px on lg–3xl laptops).
- `boardTitle` switches to the display face on the schedule board.
- `footerMeta` gains `label` tracking (1.2px).
- `leadLarge`/`lead` unify (md · light); `prose` sits on 16px base.
- Button + carousel focus rings turn chartreuse; all rings get 4px offset.
- Disabled controls unify to 50% opacity (CalendarFilters' reset loses its
  gray recolor).

## Output

Two tables, no prose:

- **Deltas:** `file` · `change` · `visual delta (yes+what / no)`.
- **Escalations:** `file:line` · `what` · `why it needs a human`.
