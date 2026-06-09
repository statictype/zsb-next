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

> **Legacy — being replaced by the [Program & Calendar](#program--calendar-new-model) model below**, and removed once that lands (ZSB-38). See [ADR 0014](./docs/adr/0014-event-venue-content-model.md).

An item inside an edition's `ProgramData.blocks`. Each block has a **type** (`Exhibition`, `Film Program`, `Main Exhibition`, `Opening Event`, `Special Event`, `Student Exhibition`, `Talks & Workshops`) which controls the section it renders in, and how it's displayed.

Each block also carries a **column** (`1` or `2`). The two columns are always rendered side-by-side on desktop (collapsing to a single column on mobile in column-1-then-column-2 order) and are expected to be **visually balanced in height** — column assignment is an authoring decision driven by the rendered size of each block.

### Format

An optional sub-label on a program block (`ProgramBlock.format`), used today only on `Talks & Workshops` blocks. Names the *kind* of event: `Roundtable`, `Workshop`, `Open Studios`. Distinct from `type`:

- `type` is the renderer-level category (which column / section the block lives in).
- `format` is the event-programming category (what kind of event the public is attending).

A block can have a `type` of `Talks & Workshops` and a `format` of `Workshop`, `Roundtable`, or `Open Studios`. The closed set lives in `ProgramBlockFormat` in `src/types/edition.ts`; future formats (`Lecture`, `Screening Talk`, …) extend that union without changing the `type` enum.

## Program & Calendar (new model)

The terms below are introduced by the **Program & Calendar** project (Linear ZSB-25…38). They replace the [Program block](#program-block) model and the inline venue list; the old terms are removed once the new model is live and past editions are migrated (ZSB-38). Design rationale: [ADR 0014](./docs/adr/0014-event-venue-content-model.md).

### Event

The single building block of an edition's program — a thing that happens at a time, in a place, of one or more kinds. Each edition owns its list of events (nested in the edition document, not separate documents). An event has: a **name**; a **start date**; an optional **start time** (a local Bucharest `HH:mm`, present only when the time matters, e.g. an 18:00 opening); an optional **end date** (for multi-day runs); one or more **event types**; a **venue** (required — every event has one; the films and online talks all happen at CFP); optional Facebook / ticket links; a short **description**; an optional **image**; an optional **OG override** image; and a **featured** mark. Durations are shown by the site, never typed by editors.

An event is **individually shareable**: it has its own URL (`/editions/<year>/events/<key>`, keyed by the array `_key` — no slug, still a nested object) that opens as a modal over the calendar on in-app navigation and as a full page on a direct load, with its own Open Graph card (override image → poster + ZSB badge → generated text card). This reverses the original "no per-event link" stance — see [ADR 0015](./docs/adr/0015-per-event-route-and-modal.md).

### Venue

A place where events happen, saved **once and reused across editions** (a Sanity document, unlike the legacy inline venue entry). A venue has a name, address, Google Maps link, description, and a **venue type**. A venue may be **part of** a parent venue (a studio inside CFP) via a self-reference; the views roll sub-venues up under their parent. An event attaches to the *most specific* venue it happens in. "What's shown at a venue" is no longer typed on the venue — it's simply the events that point to it.

### Event type / Venue type

Team-managed taxonomies, each its own Sanity document (`eventType`, `venueType`) so the team can add to them without a developer. Event types (Opening, Talk, Workshop, Film…) drive the calendar's filter chips; venue types (partner gallery, studio…) group the venues view. This supersedes the legacy `ProgramBlockType` enum — see [ADR 0014](./docs/adr/0014-event-venue-content-model.md).

### Calendar

An edition's events shown as a **date-ordered, day-by-day agenda** (not a month grid). The primary way people read an edition's program; it replaces the hand-arranged program section. Filterable by venue and type, with a "hide past events" default. Past/upcoming is judged client-side against the current instant (the page itself is cached).

### Ongoing

The separate area of the calendar for **multi-day runs** (exhibitions and the like), kept apart from the day-by-day agenda so they don't repeat under every date; each run carries its own date range. Derived, not flagged: an event whose end date is on a later day than its start date is "ongoing". (Renamed from "On view" in ZSB-48 — the label was misread as "on display this second"; "Ongoing" plus per-run ranges carry the durational, multi-day sense.)

### Latest & Upcoming editions

The two derived editions the homepage and Visit page lean on, instead of a stored "current edition" pointer. **Latest** is the most recent edition that has taken place; **Upcoming** is the next one. They're computed (no manual setting), and past-ness is judged client-side on the cached pages (like the calendar).

Each surface decides *which* of them it shows via its **own** control — there is no global site-state ([ADR 0016]):

- **Editions list** (homepage) follows each edition's **status** (`upcoming` → coming-soon row, `live` → link).
- **Home hero** has a switch — *lead with Latest* or *lead with Upcoming*; leading with Upcoming demotes Latest to a compact secondary presence (its slideshow + CTA kept, integrated).
- **Homepage featured events** are just the events **marked featured** on the newest **live** edition, past ones hidden — controlled in that edition's event section, nowhere else. (Newest *live*, not highest-year: an `upcoming` edition's page isn't linkable yet, so featuring its events would point at a 404.)
- **Visit venues view** has its own, separate Latest/Upcoming switch.
- **Edition calendar** shows the agenda when the edition has events (else the coming-soon block); a *finished* edition shows a recap summary + social CTAs with its archive agenda collapsed.

(The old `siteSettings.currentEdition` field is removed once the Visit venues view — its one consumer — moves to the Visit switch (ZSB-46). See [ADR 0016].)

[ADR 0016]: ./docs/adr/0016-decoupled-edition-surface-controls.md

### Program callout

An optional edition-level banner (the "Sculptors for the Future" educational-programme callout today), rendered alongside the calendar. Lifted out of the legacy `ProgramData` so it survives the removal of the old program model.
