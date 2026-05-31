import { defineQuery } from 'next-sanity'

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0]{
    contactEmail,
    instagramUrl,
    facebookUrl
  }
`)

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

export const EDITION_YEARS_QUERY = defineQuery(`
  *[_type == "edition" && defined(year)] | order(year desc).year
`)

export const EDITION_BY_YEAR_QUERY = defineQuery(`
  *[_type == "edition" && year == $year][0] {
    _id,
    year,
    title,
    theme,
    themeHighlight,
    dateTape,
    heroImage,
    thumbImage,
    manifesto,
    themeSection,
    "artists": artists[]->name,
    venues,
    program,
    carousel[] {
      _type,
      images[] {
        caption,
        image
      }
    },
    credits[] {
      _type,
      type,
      label,
      detail,
      value,
      organization->{
        name,
        logo
      },
      organizations[]->{
        name,
        logo
      }
    }
  }
`)
