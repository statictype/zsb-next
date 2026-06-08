# Event & venue content model: nested events, taxonomy documents, Bucharest-local dates

The Program & Calendar project replaces the hand-arranged two-column program
(`ProgramData` / `ProgramBlock`) and the inline `venueEntry[]` with an
events-and-venues model. Three modelling decisions in that model are
hard to reverse once content is authored and migrated, so they're recorded here.

## Events are nested in the edition, not separate documents

Each edition owns its list of events as an array of objects (one list per
edition). Events are **not** their own Sanity documents.

The edition is the aggregate: an event has no life outside the edition it
belongs to, and every reader (calendar, filters, featured, venues view) starts
from a single edition's list.

> **Amended (2026-06-08): per-event addressability is now supported.** This ADR
> originally argued that events needed no slug or standalone route because
> sharing targeted only the filtered calendar view. That was reversed —
> single events are shareable, with their own URL and Open Graph card. See
> [ADR 0015](./0015-per-event-route-and-modal.md). The nesting decision here
> still holds: events stay nested objects, and the per-event route resolves an
> event by its array `_key` out of the already-cached edition — it does **not**
> promote events to documents and gives them no human slug. So nesting costs us
> nothing on addressability after all.

Venues are the exception: the same places recur across editions, so a **venue is
a document**, referenced from the event. An event points at the *most specific*
venue it happens in (a studio inside CFP, not "CFP"); the views roll sub-venues
up under their parent via a `partOf` self-reference.

## Event and venue types are taxonomy documents, not enums

Event types (Opening, Talk, Workshop, Film…) and venue types (partner gallery,
studio…) are **`eventType` / `venueType` documents**. An event holds an array of
`eventType` references (an event can carry more than one type and shows under
each); a venue holds one `venueType` reference.

This **supersedes [ADR 0004]**, which framed `type` as a renderer-level category
controlling which column/section a `ProgramBlock` rendered in. In the new model
the calendar replaces the two-column layout entirely, so there are no columns to
assign; `type` becomes an **editorial taxonomy** the team manages without a
developer, used to render the filter chips ([ZSB-29]). Storing it as referenced
documents gives the filter UI a canonical list to enumerate, referential
integrity, and clean TypeGen. (These are ordinary documents, **not** singletons —
[ADR 0009] governs only fixed-id singletons.)

## Timing is `startDate` + optional `startTime` + optional `endDate`, not datetime instants

An event's timing is a `date` start, an optional **local** `HH:mm` `startTime`
string (present only when the time matters — an 18:00 opening), and an optional
`endDate`. We store **no UTC instants** and capture **no end-times**.

Every event is Bucharest-anchored. Sanity's `datetime` stores UTC, so an "18:00
opening" entered by an editor in another zone — or composed on a build server in
UTC — drifts by hours. A naive local `HH:mm` string can't drift: the renderer
composes the Bucharest instant when it needs one. And "how long something lasts
is shown by us, not typed in by editors", so no end-time field exists.

**"On view" is derived**, not flagged: an event whose `endDate` falls on a later
calendar day than `startDate` is a multi-day run and renders in the separate
"On view" area; a single-day event with a `startTime` is a timed agenda item; a
single-day event without one is an all-day agenda item.

## Considered alternatives

- **Events as documents referenced from the edition.** More queryable, free
  per-event slug + route. Rejected: the calendar reads the whole edition anyway,
  single-event deep-links aren't a requirement, and "one list per edition"
  authoring is heavier across reference docs.
- **Types as a string list in `siteSettings`, or free text.** Lighter schema, no
  new document types. Rejected: Sanity can't natively constrain a string to "one
  of another document's array values" without a custom input, free text
  fragments the filter chips (`Talk`/`talk`/`Talks`), and both lose reference
  integrity and TypeGen.
- **`datetime` + an `allDay` boolean.** Standard, makes "is it past?" a direct
  instant comparison. Rejected: timezone drift, and it forces a meaningless time
  onto every all-day exhibition.

## Consequences

The edition page is cached (`cacheComponents: true` — [ADR 0012]) but "now" is
not. So the past/future split, the "hide past events" toggle, and the filters
([ZSB-29]) run **client-side**: the server renders every event into the cached
page, and a client component compares each event's composed Bucharest instant to
the current instant. "Past judged against the visitor's current time" means the
current instant computed in the browser, not the visitor's timezone.

The migration ([ZSB-37]) and the removal of the old format ([ADR 0004]'s
`ProgramBlock`, `venueEntry[]` — [ZSB-38]) follow once every edition carries
events, so the calendar never needs an old-format fallback. The SFTF banner,
today nested in `ProgramData`, moves to a standalone optional `programCallout`
field on the edition so the removal can't drop it.

## Reversibility

Low. Nesting-vs-documents and date-vs-datetime are baked into authored content
and the one-off migration; reversing either means re-modelling and re-migrating
four editions. Recorded so a future reader doesn't "fix" the lack of an event
document type, propose auto-distributing types into columns, or switch the date
fields to `datetime` for a "cleaner" past-check.

See also: [ADR 0004] (superseded — the two-column `ProgramBlock` model),
[ADR 0008] (edition status / listings), [ADR 0009] (singletons — types are not
one), [ADR 0012] (the cache split the calendar renders inside),
[ADR 0013] (where the mappers that reshape this content live).

[ADR 0004]: ./0004-programblock-column-is-authoring-intent.md
[ADR 0008]: ./0008-derive-edition-listings-from-status.md
[ADR 0009]: ./0009-singleton-pattern.md
[ADR 0012]: ./0012-cache-components-three-layer-fetch.md
[ADR 0013]: ./0013-reshaping-in-data-layer.md
[ZSB-29]: https://linear.app/zsb/issue/ZSB-29
[ZSB-33]: https://linear.app/zsb/issue/ZSB-33
[ZSB-37]: https://linear.app/zsb/issue/ZSB-37
[ZSB-38]: https://linear.app/zsb/issue/ZSB-38
