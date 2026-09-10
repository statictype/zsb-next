import { slugify } from '@/lib/slugify'

// The venue rollup (ZSB-65). A venue may sit `partOf` a bigger place (a studio
// inside CFP); the schema allows one level of nesting only. Its *rolled-up
// identity* is the parent when there is one, else the venue itself. This is the
// single rule both venue-facing surfaces group by — the program's `venue=`
// filter chips and the JSON-LD Places — so they can never disagree on "which
// venues exist". It's computed once in the data layer (stamped onto every
// event's venue in `mapEvents`); nothing recomputes it from `partOf`.
//
// `slug` is the program filter key, separate from a venue's own URL slug: it's
// `slugify(rolled-up name)`, lossy but matched slug↔slug so it round-trips.
export function rollUpVenue(venue: { name: string; partOf?: { name: string } | null }): {
  name: string
  slug: string
} {
  const name = venue.partOf?.name ?? venue.name
  return { name, slug: slugify(name) }
}
