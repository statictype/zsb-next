# Ubiquitous Language

Canonical domain terms used across data, types, and components. When you introduce a new domain concept (something an event curator would recognise, not an implementation detail), add it here.

(Note on terminology: Bucharest Sculpture Days is an **event**, not a festival — the About page makes the point explicitly. Prefer "the event" over "the festival" in prose and naming.)

## Edition

A single year of the event. Modelled in `src/types/edition.ts` as a discriminated structure with two variants:

- **Edition** — a physical edition with venues, a program, and a carousel of on-site photography.
- **OnlineEdition** — a digital-only edition with an external gallery and no venue map.

Editions live in Sanity as `edition` documents. The one exception is 2021 — permanently static in `src/data/editions/2021.ts`, the online-only year with a shape Sanity doesn't model. `src/data/editions/index.ts` is the gateway: it serves 2021 from the static file and every other year from Sanity. The dynamic route `src/app/(site)/editions/[year]/` renders whichever variant `getEdition(year, options)` returns.

### Edition status

Every Sanity-backed edition carries a `status: 'upcoming' | 'live'`. An **upcoming** edition is one whose theme is announced but whose page isn't ready yet — it shows on the homepage editions list as a "Coming soon" row, not a link. A **live** edition is one with a viewable `/editions/YYYY` page; it shows on the homepage and in the footer's Explore column. Curators flip the status from upcoming → live when the program is finalised.

The value is `live`, deliberately **not** `published`: "published" is reserved for Sanity's own document publish/draft lifecycle, which is orthogonal to this field. A document can be published in Sanity while its edition is still `upcoming`. The route gate is written `status != "upcoming"` (rather than `== "live"`) so the public page stays reachable through any future value migration; `upcoming` is the single special-cased value.

## Program block

An item inside an edition's `ProgramData.blocks`. Each block has a **type** (`Exhibition`, `Film Program`, `Main Exhibition`, `Opening Event`, `Special Event`, `Student Exhibition`, `Talks & Workshops`) which controls the section it renders in, and how it's displayed.

Each block also carries a **column** (`1` or `2`). The two columns are always rendered side-by-side on desktop (collapsing to a single column on mobile in column-1-then-column-2 order) and are expected to be **visually balanced in height** — column assignment is an authoring decision driven by the rendered size of each block.

### Format

An optional sub-label on a program block (`ProgramBlock.format`), used today only on `Talks & Workshops` blocks. Names the *kind* of event: `Roundtable`, `Workshop`, `Open Studios`. Distinct from `type`:

- `type` is the renderer-level category (which column / section the block lives in).
- `format` is the event-programming category (what kind of event the public is attending).

A block can have a `type` of `Talks & Workshops` and a `format` of `Workshop`, `Roundtable`, or `Open Studios`. The closed set lives in `ProgramBlockFormat` in `src/types/edition.ts`; future formats (`Lecture`, `Screening Talk`, …) extend that union without changing the `type` enum.
