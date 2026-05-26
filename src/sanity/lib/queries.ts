import { defineQuery } from 'next-sanity'

export const ARTISTS_QUERY = defineQuery(`
  *[_type == "artist" && defined(slug.current)] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    portrait,
    shortBio,
    discipline,
    country
  }
`)

export const ARTIST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "artist" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    portrait,
    shortBio,
    discipline,
    country,
    externalLinks
  }
`)
