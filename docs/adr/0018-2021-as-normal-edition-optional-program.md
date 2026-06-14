# 2021 modelled as a normal Sanity edition; program is an optional section

The 2021 edition was originally kept as a permanently-static file
(`src/data/editions/2021.ts`) with its own `OnlineEdition` type, because the
inaugural online-only year had a shape we didn't want to model in Sanity. That
left the 2021 artists unlinked to any edition and the page painful to maintain.
We reverse that decision (ZSB-20): 2021 becomes an ordinary `edition` document
in Sanity, and the `OnlineEdition` type / `isOnlineEdition` discriminator /
`online-edition-layout.tsx` are deleted.

"Online-only" is deliberately **not** re-modelled as a distinct concept. Instead
the *program* (events + calendar) is now an **optional** edition section, gated
by a `hasProgram` checkbox: when off, the Studio hides the program fields and the
page renders no program block at all; when on, the page shows the calendar (or
the coming-soon block until events are added). 2021 simply leaves it off.

The one genuinely 2021-specific thing — the link to the off-site photo gallery
(`filialadesculptura.work`) — stays a small static constant in code
(`EXTERNAL_GALLERY_BY_YEAR` in `edition-content.tsx`), not a Sanity field: it's a
closed historical fact for a single edition, not editor-managed content, so a
reusable schema field would be clutter. A future reader will otherwise wonder why
year 2021 is hardcoded there — this is why.

## Consequences

- The Sanity `edition.year` minimum drops from 2022 to 2021.
- Existing editions (2022–2026) are backfilled with `hasProgram: true` so the new
  conditional `hidden` doesn't hide their events from editors; the mapper also
  defaults a missing value to `true`.
- `getEdition` is now a pure Sanity fetch — the static-edition fallback,
  `STATIC_ONLY_YEARS`, and the `isOnlineEdition` guards in the data layer are gone
  (empty `events` / `hasProgram` already cover those cases).
