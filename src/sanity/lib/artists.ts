import 'server-only'

import { PUBLISHED, queryData } from './live'
import { ARTIST_NAMES_QUERY } from './queries'

/**
 * All artist names, surname-ordered (by `sortName`, falling back to `name`).
 * Published-only: the artists index and the homepage banner aren't
 * draft-previewed (no Presentation location), so this stays statically
 * cacheable. Freshness comes from `<SanityLive />` + the revalidate webhook.
 */
export async function getArtistNames(): Promise<string[]> {
  'use cache'
  return (await queryData(ARTIST_NAMES_QUERY, PUBLISHED)) ?? []
}
