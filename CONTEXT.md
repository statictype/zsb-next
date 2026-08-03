# Ubiquitous Language

Canonical domain terms used across data, types, and components. When you introduce a new domain concept (something an event curator would recognise, not an implementation detail), add it here.

## Naming and language

Three things carry names, and two names were being asked to cover all three:

1. **The organiser** — Filiala de Sculptură București a UAP. The site does not lean on it: it has no linkable site of its own.
2. **The event** — Bucharest Sculpture Days, short form **ZSB**. Never a festival; the About page makes the point explicitly, so prefer "the event".
3. **The site**, which represents the event.

**One name.** "Bucharest Sculpture Days (ZSB)" on first mention per page, ZSB thereafter and wherever space is tight. Editions stay `ZSB 2026`. The Romanian name, Zilele Sculpturii București, appears only in `alternateName` metadata alongside ZSB — the English name leads because "Bucharest sculpture" is what the off-season audience searches for. "Platform" describes ZSB inside a sentence; it is not a second brand.

**Proper nouns are written as their owner writes them** — not translated, not normalised. "Galeria Simeza" and "Nicodim Gallery" are both correct, because each is the name that venue uses for itself. The same goes for people. An audit reporting this as an inconsistency is wrong. Everything ZSB writes *about* them is English: descriptions, labels, and all UI copy. The taxonomies stay uniform and English — event types (Exhibition, Film, Open Studio, Opening, Talk, Workshop) and venue types (Artist studio, Partner gallery, Partner venue).

**A theme keeps its own language.** `#celălaltcorp` is an artistic title, not a string to translate, so the curator's choice of language stands. No theme is written in English — a few, like `#syzygy` and `#digitalfield`, read the same in both languages, which is not the same thing. An edition carries an optional `themeGloss` saying what the theme tells an English-speaking visitor; it is left empty only for the themes that already carry across. Where the gloss renders is settled with the edition hero, not here.

## Edition

A single year of the event, modelled as one `Edition` shape in `src/types/edition.ts`. An edition has a hero, manifesto, theme + artists, credits, and an **optional program** (events → the program section). The **program** is gated by `hasProgram`: a physical edition has one; the inaugural online-only **2021** does not, so its page renders no program block — just a static link to its off-site photo gallery (`EXTERNAL_GALLERY_BY_YEAR` in `edition-content.tsx`). "Online-only" is deliberately *not* a separate type or Sanity concept.

Every edition lives in Sanity as an `edition` document — there are no static editions. `src/data/editions/index.ts` (`getEdition`) is the gateway, a thin pass to the Sanity fetch; the dynamic route `src/app/(site)/editions/[year]/` renders what it returns.

### Edition status

Every Sanity-backed edition carries a `status: 'announced' | 'live'`. An **announced** edition is one whose theme is announced but whose page isn't ready yet — it shows on the homepage editions list as a "Coming soon" row, not a link. A **live** edition is one with a viewable `/editions/YYYY` page; it shows on the homepage and in the footer's Explore column. Curators flip the status from announced → live when the program is finalised. (The value was named `upcoming` until X1, 2026-07-19 — renamed because it borrowed the temporal vocabulary of the derived Latest/Upcoming pair below while meaning something else: publication state, not position in time.)

The value is `live`, deliberately **not** `published`: "published" is reserved for Sanity's own document publish/draft lifecycle, which is orthogonal to this field. A document can be published in Sanity while its edition is still `announced`. Every reachability gate tests the stable value — `status == "live"` — never the other one, so a rename of any non-live value is a non-event and any unknown or legacy status degrades to "not linkable", the correct failure mode for a gate.

## Artist

A person who has shown work at the event, saved once as an `artist` document and reused across editions. `edition.artists` is the only field in the schema that references one; an artist's editions are read back through that reverse reference (`ArtistEditionsField`).

An artist becomes **public** when a live edition lists them. `ARTIST_INDEX_QUERY` gates on `_id in *[_type == "edition" && status == "live"].artists[]._ref`, so an artist added only to an announced edition appears nowhere on the site until that edition is flipped to live — announcing the lineup is the curator's decision, not a side effect of filling in the edition document. The gate makes the `/artists` table and the homepage banner's artist count the same set by construction. Because the result depends on `edition` documents, the query subscribes to the `edition` revalidation tag as well as `artist`.

The **"N editions" count** beside those artists is not derived. It is `EDITIONS_HELD` in `src/lib/constants.ts` — editions that have taken place, which is fewer than the edition documents in Sanity whenever a future edition is announced. Bump it by hand after an edition runs.

## Program

The terms below come from the **Program & Calendar** project (Linear ZSB-25…38). They replaced the old hand-arranged two-column program (`ProgramData` / `ProgramBlock`) and the inline venue list, both removed in ZSB-38 once every edition was migrated.

### Event

The single building block of an edition's program — a thing that happens at a time, in a place, of one or more kinds. Each edition owns its list of events (nested in the edition document, not separate documents). An event has: a **name**; a **start date**; an optional **start time** (a local Bucharest `HH:mm`, present only when the time matters, e.g. an 18:00 opening); an optional **end date** (for multi-day runs); one or more **event types**; a **venue** (required — every event has one; the films and online talks all happen at CFP); optional Facebook / ticket links; a short **description**; an optional **image**; an optional **OG override** image; and a **featured** mark. Durations are shown by the site, never typed by editors.

An event is **individually shareable**: it has its own URL (`/editions/<year>/events/<key>`, keyed by the array `_key` — no slug, still a nested object) that opens as a fullscreen modal over the program on in-app navigation and as its own standalone page on a direct load, with its own Open Graph card (override image → poster + ZSB badge → generated text card).

### Venue

A place where events happen, saved **once and reused across editions** (a Sanity document, unlike the legacy inline venue entry). A venue has a name, address, Google Maps link, description, and a **venue type**. A venue may be **part of** a parent venue (a studio inside CFP) via a self-reference; the views roll sub-venues up under their parent. An event attaches to the *most specific* venue it happens in. "What's shown at a venue" is no longer typed on the venue — it's simply the events that point to it.

Every event's venue carries a **rolled-up identity** (`rollUp`: the parent venue when it's a sub-venue, else itself) — the single key the three venue-facing surfaces group by: the program's `venue=` filter chips, the Visit venues view, and the JSON-LD Places. It's computed once in the data layer (`rollUpVenue` in `src/lib/venues.ts`, stamped in `mapEvents`), so those surfaces can't disagree on which venues exist (ZSB-65). The Visit venues view's sections are likewise built server-side (`groupVenuesByType`, called in `getVisitEdition`); `VenuesView` is a pure renderer.

### Event type / Venue type

Team-managed taxonomies, each its own Sanity document (`eventType`, `venueType`) so the team can add to them without a developer. Event types (Opening, Talk, Workshop, Film…) drive the program's filter chips; venue types (partner gallery, studio…) group the venues view. This supersedes the legacy `ProgramBlockType` enum.

### Program (the section)

An edition's events shown as a **date-ordered, day-by-day list** (not a month grid) under the heading "Program", at the `#program` anchor. "Program" names both an edition's set of events and the section that renders them — the section *is* the program, and `hasProgram` gates both. It replaces the hand-arranged program section, and was called the Calendar until ZSB-116: the word implied a month grid, and three of the four layers (the anchor, the Sanity field group, this document) already said program. Filterable by venue and type, with a "hide past events" default. Past/upcoming is judged client-side against the current instant (the page itself is cached).

### Ongoing

The separate area of the program for **multi-day runs** (exhibitions and the like), kept apart from the day-by-day list so they don't repeat under every date; each run carries its own date range. Derived, not flagged: an event whose end date is on a later day than its start date is "ongoing". (Renamed from "On view" in ZSB-48 — the label was misread as "on display this second"; "Ongoing" plus per-run ranges carry the durational, multi-day sense.)

### Latest & Upcoming editions

The two derived editions the homepage and Visit page lean on, instead of a stored "current edition" pointer. **Latest** is the most recent edition that has taken place; **Upcoming** is the next one. They're computed (no manual setting), and past-ness is judged client-side on the cached pages (like the program).

Each surface decides *which* of them it shows via its **own** control — there is no global site-state:

- **Editions list** (homepage) follows each edition's **status** (`live` → link, anything else → coming-soon row).
- **Home hero** has a switch — *lead with Latest* or *lead with Upcoming*; leading with Upcoming demotes Latest to a compact secondary presence (its slideshow + CTA kept, integrated).
- **Homepage featured events** are just the events **marked featured** on the newest **live** edition, past ones hidden — controlled in that edition's event section, nowhere else. (Newest *live*, not highest-year: an `announced` edition's page isn't linkable yet, so featuring its events would point at a 404.)
- **Visit venues view** has its own, separate Latest/Upcoming switch.
- **Edition program** shows the day-by-day list when the edition has events (else the coming-soon block); a *finished* edition shows a recap summary + social CTAs with its archive collapsed.

(The old `siteSettings.currentEdition` field is removed once the Visit venues view — its one consumer — moves to the Visit switch (ZSB-46).)
