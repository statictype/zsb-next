# Ark UI + Panda CSS Migration Prompt

Implement the Ark UI + Panda CSS design-system migration described in:

`docs/audit/ark-ui-design-system-findings.md`

Work on the current branch. Everything belongs in one large PR. Do not create another branch or modify existing plans/ADRs.

## Working rules

- Ark UI is always private inside site-shaped components.
- Pages must never import Ark parts, hooks, contexts, anatomy, or change-detail types.
- Public APIs use single components such as `<Accordion>`, `<Dialog>`, and `<Carousel>`.
- Panda owns styling; Ark owns interaction, accessibility, focus, keyboard behavior, and state machines.
- Multi-part primitive recipes must match Ark anatomy internally.
- Style Ark states through `data-*` attributes.
- `className` is allowed only on the primitive root for layout placement.
- Keep client boundaries at the smallest interactive leaves.
- Use stable domain IDs for repeated interactive content.
- Preserve existing styling only where the findings identify it as intentional; otherwise normalize drift.
- Update or add Playwright tests when needed, but never run E2E tests unless explicitly instructed.
- Allowed gates: Panda codegen, typecheck, lint, and unit/component tests.

## Progress protocol

For every task:

1. Implement the complete task.
2. Review the diff and verify it against the findings document.
3. Run the relevant allowed gates.
4. Fix all discovered issues.
5. Stop for user review with the work uncommitted.
6. Commit only after explicit user approval.

Do not mark partial or uncommitted work complete.

## Tasklist

### 1. Extract the Panda design-system preset

- Create an internal `definePreset` module; do not create a package.
- Move tokens, semantic tokens, keyframes, conditions, text styles, layer styles, patterns, and reusable recipes into it.
- Keep extraction globs, output configuration, framework settings, reset policy, and other app build concerns in `panda.config.ts`.
- Set `jsxStyleProps: 'none'`.
- Add `_motionSafe` and `_motionReduce`.
- Add the narrow `editorialSplit` pattern used by Manifesto and ThemeArtists.
- Explicitly register public wrapper names through recipe `jsx` metadata.
- Prefer extraction from literal JSX props and explicit literal mappings; avoid blanket `staticCss`.

### 2. Build and adopt Accordion

- Create a one-piece `<Accordion items={...}>`.
- Item contract: `id`, `trigger`, `content`, optional `meta`.
- Own state internally; initially closed.
- Default to zero-or-one open item; expose `multiple` only as an explicit option.
- Provide `standard` and `display` trigger typography.
- Keep all collapsed content mounted.
- Migrate Visit FAQ and Venues View.
- Normalize shared dividers, spacing, focus treatment, indicator motion, and state styling.
- Remove obsolete Disclosure usage and styling.

### 3. Build and adopt Collapsible

- Create a one-piece `<Collapsible>` with closed/open labels, optional meta, and content.
- Own state internally and default closed when mounted.
- Give it its own Ark-anatomy slot recipe while sharing appropriate visual tokens with Accordion.
- Before/during an edition, render the programme directly.
- Only finished editions mount the closed archive Collapsible.
- Remove obsolete native archive-disclosure code and styling.

### 4. Replace Checkbox internals

- Preserve the site API: `id`, `label`, optional `count`, boolean `checked`, and `onCheckedChange(boolean)`.
- Keep Calendar filter state externally controlled.
- Keep Ark value objects and group internals private.
- Migrate filter consumers and remove DIY interaction behavior.

### 5. Build and adopt Dialog

- Create one site-level `<Dialog>` with private Ark internals.
- Public concepts: `id`, `open`, `onClose`, accessible label/title, and `presentation`.
- Support exactly `panel` and `fullscreen`.
- Migrate EventModal using `panel` while preserving route-owned open state.
- Ensure every dismissal path delegates to the router-aware `onClose`.
- Migrate Lightbox using `fullscreen`.
- Keep Lightbox index, preloading, keyboard image navigation, and gestures as product logic.
- Delete redundant manual focus trapping, dismissal, portal, modal ARIA, and scroll-lock behavior.

### 6. Migrate mobile navigation

- Keep desktop navigation as a normal always-visible `<nav>`.
- Use fullscreen Dialog behavior for the mobile overlay.
- Use Swap privately for the hamburger/close transition.
- Preserve active-page navigation styling.
- Ensure Escape, focus containment, focus restoration, and scroll locking come from Dialog.

### 7. Consolidate all carousel behavior

- Replace HeroSlideshow and hand-rolled scroll strips with one site `<Carousel>`.
- Public slides are `{ id, content }`.
- Support exactly `stage` and `rail` modes.
- Support `autoplay={false | milliseconds}` and explicit looping.
- Homepage hero uses autoplay stage mode.
- Gallery, MediaKitStrip, and EditionsNav use rail mode.
- Carousel owns controls, dragging, keyboard behavior, and accessible labeling.
- Every instance has previous/next controls.
- Rail mode supports current/total and an optional eyebrow.
- Autoplay stage mode includes indicators and play/pause.
- Pause autoplay on hover/focus, resume unless explicitly paused, and reset timing after manual navigation.
- Start autoplay paused under reduced motion.
- Remove obsolete slideshow progress, state, scroll-snap hooks, controls, and styles.
- Preserve click-versus-drag behavior for interactive slides.

### 8. Normalize and clean up

- Consolidate duplicated first-match accent-string splitting into one internal utility.
- Keep `AccentSplit` as the general editorial primitive and `EditionTheme` as the specialized theme-tape component.
- Change CookieBanner from faux-dialog semantics to an appropriately labelled non-modal region/status treatment.
- Remove dead hooks, recipes, styles, imports, and utilities left by the migration.
- Update documentation and component comments.

### 9. Complete verification

- Add/update component tests for Accordion, Checkbox, Collapsible, Dialog, and Carousel contracts.
- Add/update Playwright coverage for event-route dismissal, mobile navigation focus, and Carousel drag-versus-click behavior.
- Do not run Playwright unless explicitly instructed.
- Run Panda codegen, typecheck, lint, and unit/component tests.
- Review mobile, desktop, and reduced-motion styling.
- Review the complete PR diff for Ark leakage, styling drift, dead code, and incomplete migrations.

## Completion criteria

- Every task is reviewed and committed.
- No consumer imports Ark UI directly.
- No old interaction implementation remains beside its replacement.
- All allowed automated gates pass.
- Playwright specs are maintained but not executed without explicit permission.
- The findings document and implementation agree.
