import { defineQuery } from 'next-sanity'

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0]{
    contactEmail,
    instagramUrl,
    facebookUrl
  }
`)

export const HOMEPAGE_QUERY = defineQuery(`
  *[_id == "homepage"][0]{
    heroTitle,
    heroTitleAccent,
    heroLead,
    heroCtaLabel,
    "heroCtaEditionYear": heroCtaEdition->year,
    slideshow[]{
      _key,
      position,
      image
    },
    editionsIntro
  }
`)

export const EDITIONS_LIST_QUERY = defineQuery(`
  *[_type == "edition" && defined(year)] | order(year desc) {
    year,
    theme,
    status
  }
`)

export const ABOUT_PAGE_QUERY = defineQuery(`
  *[_id == "aboutPage"][0]{
    hero,
    notFestivalTitle,
    notFestivalBody,
    pillars,
    placeImage,
    curatorEyebrow,
    curatorHeadline,
    curatorPortrait,
    curatorName,
    curatorRole,
    curatorLetter
  }
`)

export const PARTNERS_PAGE_QUERY = defineQuery(`
  *[_id == "partnersPage"][0]{
    hero,
    eventTitle,
    eventBody,
    eventImage,
    whyEyebrow,
    whyTitle,
    whyImage,
    whyPoints,
    ctaHeading,
    ctaHeadingAccent,
    ctaBody,
    ctaLabel
  }
`)

export const VISIT_PAGE_QUERY = defineQuery(`
  *[_id == "visitPage"][0]{
    venueName,
    street,
    city,
    mapsUrl,
    image,
    hoursLines,
    amenities,
    transport
  }
`)

export const PRIVACY_PAGE_QUERY = defineQuery(`
  *[_id == "privacyPage"][0]{
    hero,
    body,
    updatedAt
  }
`)

export const PRESS_PAGE_QUERY = defineQuery(`
  *[_id == "pressPage"][0]{
    hero
  }
`)

export const PRESS_APPEARANCES_QUERY = defineQuery(`
  *[_type == "pressAppearance"] | order(year desc, title asc) {
    _id,
    medium,
    title,
    year,
    tag,
    url,
    excerpt
  }
`)

export const PRESS_RELEASES_QUERY = defineQuery(`
  *[_type == "pressRelease" && defined(edition->year)]
    | order(publishedAt desc, language asc) {
      _id,
      title,
      language,
      pages,
      publishedAt,
      "year": edition->year,
      "pdfUrl": pdf.asset->url,
      "sizeBytes": pdf.asset->size
    }
`)

// All editions that have at least one Press-kit asset, newest year first.
// The renderer flattens poster + coverPhoto into a single strip.
// Image fields include hotspot/crop + asset metadata for LQIP + dimensions.
export const EDITIONS_PRESS_KIT_QUERY = defineQuery(`
  *[_type == "edition" && defined(year) && (defined(pressKit.poster) || defined(pressKit.coverPhoto))]
    | order(year desc) {
      year,
      "poster": pressKit.poster{
        ...,
        asset->{ url, metadata { lqip, dimensions } }
      },
      "coverPhoto": pressKit.coverPhoto{
        ...,
        asset->{ url, metadata { lqip, dimensions } }
      }
    }
`)

export const ARTISTS_QUERY = defineQuery(`
  *[_type == "artist" && defined(slug.current)] | order(coalesce(sortName, name) asc) {
    _id,
    name,
    "slug": slug.current,
    portrait,
    shortBio,
    discipline,
    country
  }
`)

// Names only, surname-ordered — for the artists index and the homepage banner.
export const ARTIST_NAMES_QUERY = defineQuery(`
  *[_type == "artist" && defined(slug.current)] | order(coalesce(sortName, name) asc).name
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

// Only live editions have a viewable page. "Upcoming" is the single
// special-case status (shows on the homepage with a "Coming soon" badge,
// no dedicated route); everything else is reachable. Matched as
// `!= "upcoming"` rather than `== "live"` so the public route never 404s
// during the published→live value migration. Fetching an upcoming edition
// returns null so the route 404s.
export const EDITION_BY_YEAR_QUERY = defineQuery(`
  *[_type == "edition" && year == $year && status != "upcoming"][0] {
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
    "artists": artists[]->{name, sortName} | order(coalesce(sortName, name) asc).name,
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
