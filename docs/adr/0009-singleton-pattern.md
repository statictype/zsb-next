# Singletons are enforced via structure + document actions, not via schema

Sanity has no `singleton: true` schema option, and any pattern that tries to fake it at the schema level is a workaround. We enforce singletons in three coordinated places:

1. **Structure tree** (`src/sanity/structure.ts`): the `singletonListItem` helper renders the singleton directly with `S.document().documentId(type)`. Editors see the doc, not a "list of one" — and the structure tree filters singletons out of the auto-included document type list so they don't appear twice.
2. **`document.actions`** (`sanity.config.ts`): strips `delete`, `unpublish`, and `duplicate` from the action menu for any type listed in `SINGLETON_TYPES`. Editors can't accidentally remove the homepage; if they want to "reset" it they have to edit fields back to defaults manually.
3. **`document.newDocumentOptions`** (`sanity.config.ts`): removes singletons from the global "Create new" menu so editors can't create a second instance with a different ID. The Studio's structure-side flow only ever opens the one fixed-ID document.

The single source of truth for which types are singletons is `SINGLETON_TYPES` in `src/sanity/lib/singleton.ts`. Adding a name there enables all three guards. Forgetting to add it leaves an unlocked singleton — the doc can be deleted, duplicated, or re-created with a wrong ID, and editors will discover this at the worst possible moment.

Why the three-place enforcement instead of just the structure side:

- **Structure-only is insufficient.** Sanity's URL routing in the Studio lets editors hit `/desk/intent/create/...` directly. Without `newDocumentOptions`, a duplicate can be born from a URL.
- **Schema-side enforcement doesn't exist.** Old workarounds (`__experimental_actions`) are deprecated and don't cover the URL-create vector.
- **`document.actions` is the only way to keep the action menu honest.** Without it, the "Delete document" item sits there next to a singleton, inviting accidents.

Why singletons matter at all:

- The homepage, about page, footer settings — these are unambiguously one-of-a-kind. Two would break the site. Two with different IDs would silently hide the wrong one. Two with stale data in one would make the editor wonder which one the site is reading. The Studio should never offer a path that creates the problem.

Considered alternatives:

- **Model "singletons" as collection documents with a `isActive: true` flag, query the first one.** Sanity-idiomatic for some teams, especially when editors want a draft singleton-shape they can promote. Overhead is real (every query coalesces, every editor needs to remember the active-flag convention) and we don't need the staged-publish workflow yet. Skipped.
- **Schema-side `options.singleton`-ish marker, enforced only in structure.** Skipped because of the URL-create vector above; without action and new-document guards, the enforcement is illusory.

Reversibility: high. `SINGLETON_TYPES` is a single array; removing a name unlocks the type. The guards are guards, not data shapes.
