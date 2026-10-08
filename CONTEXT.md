# Domain vocabulary

Terms used in data, types and components. Add a term here when it names something an event curator would recognize, not an implementation detail.

## Names

Three things carry names:

1. The organiser, Filiala de Sculptură București a UAP.
2. The event, Bucharest Sculpture Days, short form ZSB. It is not a festival; the About page says so. Prefer "the event".
3. The site, which represents the event.

Write "Bucharest Sculpture Days (ZSB)" on first mention per page and ZSB after that. Editions are named `ZSB 2026`. The Romanian name, Zilele Sculpturii București, appears only in `alternateName` metadata. "Platform" describes ZSB within a sentence and is not a second name.

Proper nouns appear as their owner writes them, untranslated ("Galeria Simeza", "Nicodim Gallery"). Everything ZSB writes about them is English, including descriptions, labels and UI copy. Event types (Exhibition, Film, Open Studio, Opening, Talk, Workshop) and venue types (Artist studio, Partner gallery, Partner venue) are English.

An edition theme keeps the curator's language (`#celălaltcorp`). An edition has an optional `themeGloss` that explains the theme to English readers; it is empty for themes that need none.

## Edition

One year of the event, modelled as `Edition` in `src/types/edition.ts`: hero, manifesto, theme and artists, credits, and an optional program. `hasProgram` gates the program section. A year without a program, such as the online-only 2021, renders a link to its external photo gallery instead (`EXTERNAL_GALLERY_BY_YEAR` in `edition-content.tsx`). Online-only is not a separate type.

Every edition is an `edition` document in Sanity; [`docs/cms.md`](docs/cms.md) describes the fetching gateway.

### Edition status

`status` is `'announced'` or `'live'`.

- An announced edition has a theme but no page yet. The homepage editions list shows it as a "Coming soon" row without a link.
- A live edition has a viewable `/editions/YYYY` page and appears as a link. Curators set it to live when the program is final.

`live` is distinct from Sanity's own published and draft states. A document can be published while its edition is announced. Every reachability check tests `status == "live"`, so an unknown value is treated as not linkable.

## Artist

A person who has shown work at the event, stored once as an `artist` document and referenced from `edition.artists`. An artist's editions are read back through the reverse reference (`ArtistEditionsField` in the Studio).

An artist is public when a live edition lists them. `ARTIST_INDEX_QUERY` selects artists whose `_id` is referenced by a live edition, so an artist listed only on an announced edition does not appear until that edition goes live. The `/artists` table and the homepage banner's artist count use the same set. The query subscribes to the `edition` tag as well as `artist`.

The "N editions" figure next to those artists is `EDITIONS_HELD` in `src/lib/constants.ts`. It counts editions that have taken place and is updated by hand after an edition runs.

## Program

### Event

The unit of an edition's program: something that happens at a time and place. Events are nested in the edition document. An event has:

- a name, a start date, an optional start time (Bucharest-local `HH:mm`) and an optional end date;
- one or more event types;
- a required venue;
- optional Facebook and ticket links, a description, an image, and an override image for the Open Graph card;
- a featured flag.

Durations are derived for display and never entered by editors.

Each event has its own URL, `/editions/<year>/events/<key>`, where `<key>` is derived by `deriveEventSlugs` (see [`docs/cms.md`](docs/cms.md)). On in-app navigation it opens as a fullscreen modal over the program; on a direct load it renders as a page. Its Open Graph card uses the override image, then a poster with the ZSB badge, then a generated text card.

### Venue

A place where events happen, stored once as a `venue` document and reused across editions. A venue has a name, address, Google Maps link, description and venue type. It can be part of a parent venue (a studio inside CFP) through a self-reference. An event points to the most specific venue.

Each event's venue also carries a roll-up identity: the parent venue if there is one, otherwise itself (`rollUpVenue` in `src/lib/venues.ts`, stamped by `mapEvents`). The program's venue filter and the JSON-LD places both group by it.

### Event type and venue type

Taxonomies stored as `eventType` and `venueType` documents so editors can extend them. Event types drive the program's filter chips. Venue types categorize venues in the Studio; no page groups by them.

### Program section

An edition's events as a day-by-day list under the heading "Program", anchored at `#program`. Visitors can filter by venue and type, and past events are hidden by default. Whether an event is past is decided in the browser against the current instant, because the page is cached.

### Ongoing

Events whose end date falls on a later day than their start date, such as exhibitions. They are listed in a separate area, each with its date range, so they do not repeat under every day.

### Latest and Upcoming

Two derived editions. Latest is the most recent edition that has taken place. Upcoming is the next one. Neither is stored. The year-level split uses the server clock at cache-fill time; event past-ness uses the client clock (`src/lib/today.ts`).

Each surface chooses what to show:

- The homepage editions list shows a link for `live` editions and a "Coming soon" row for any other status.
- The home hero leads with Latest or with Upcoming, switched in the homepage document. When Upcoming leads, Latest appears as a compact secondary block.
- Homepage featured events are the events marked featured on the newest live edition, with past events hidden. The edition must be live because an announced edition's page returns 404.
- An edition's program shows the day-by-day list when the edition has events, and a coming-soon block otherwise. A finished edition shows a recap with social links and a collapsed archive.
