import { slugify } from '@/lib/slugify'

// `slug` is the program filter key, not the venue's own URL slug.
export function rollUpVenue(venue: { name: string; partOf?: { name: string } | null }): {
  name: string
  slug: string
} {
  const name = venue.partOf?.name ?? venue.name
  return { name, slug: slugify(name) }
}
