# Edition listings derive from `edition.status`, not from explicit arrays

The homepage editions list, the `/editions` index, and the footer's "Explore" links all derive from the same source: every `edition` document, ordered by `year desc`, with `edition.status: 'upcoming' | 'published'` controlling how each row renders. The homepage doc does **not** carry an explicit "list of editions to show" or a separate "upcoming edition" field. Same for the footer.

Why:

- **The current "upcoming" row exists in two places** (`src/app/page.tsx` hard-codes `{ year: 2026, theme: '#zeulcaremoare', upcoming: true }`; the footer's `EXPLORE_LINKS` references the published years). Modelling it as an explicit homepage field would duplicate that drift across the CMS too. An editor adding a new edition would have to remember to update three documents. Single source of truth is the edition itself.
- **An "upcoming" edition is just an edition that doesn't have its page filled in yet.** It has a year, a theme, a status. When the program is ready, the editor flips `status` to `'published'` and the homepage row becomes a link automatically. No second editorial action needed.
- **Derived listings can't drift.** If an editor edits the theme on the 2026 edition doc, it updates everywhere — homepage row, footer link, edition page itself. An explicit array would let those two values fall out of sync.
- **The same pattern handles future "archived" or "draft" states** if we ever need them — add a value to the `status` enum, branch the renderer. The signal stays on the edition where it belongs.

Media kit assets follow the same instinct: they live on the edition doc (`edition.pressKit`) rather than as standalone `mediaKitAsset` documents. The press page aggregates by querying all editions with a `pressKit`. Editors author every per-year asset (theme, manifesto, posters, press kit) inside the one document for that year, instead of bouncing between five different document types.

Considered alternatives:

- **Explicit `editionsList` field on the homepage doc.** Editor picks which editions to show, in what order, with manual upcoming/published toggles. Maximum flexibility but every new edition requires touching two documents, and the homepage gets out of sync with reality the moment someone forgets. Skipped.
- **Separate `upcomingEdition` field on the homepage doc.** Single dedicated slot for "next edition" with theme + year. Simpler than a full list but still duplicative — the upcoming edition will eventually need a full doc anyway (so it can become a published edition page), and the homepage value would drift from the edition doc the moment editorial details change. Skipped.
- **Separate `mediaKitAsset` documents** for poster / cover, with an edition reference. Allows multiple posters per year (RO version, EN version, social cuts) and editing one without touching the edition. Considered; rejected for now — the existing media kit has exactly one poster + one cover per year, and the cost of "two mental models per year" outweighs the flexibility. Can split later if multi-asset becomes real.

Reversibility: high. The homepage / press queries are 5-line GROQ; restructuring later is a query change plus a frontend update, no schema migration unless the source of truth itself moves.
