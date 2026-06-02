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
    hero,
    mediaKitEyebrow
  }
`)

export const PRESS_APPEARANCES_QUERY = defineQuery(`
  *[_type == "pressAppearance"] | order(year desc, title asc) {
    _id,
    type,
    title,
    year,
    tag,
    url,
    excerpt
  }
`)

export const PRESS_RELEASES_QUERY = defineQuery(`
  *[_type == "pressRelease" && defined(edition->year)]
    | order(edition->year desc, language asc) {
      _id,
      title,
      language,
      pages,
      "year": edition->year,
      "pdfUrl": pdf.asset->url,
      "sizeBytes": pdf.asset->size
    }
`)

// All editions that have at least one Press-kit asset, newest year first.
// The renderer flattens poster + coverPhoto into a single strip.
export const EDITIONS_PRESS_KIT_QUERY = defineQuery(`
  *[_type == "edition" && defined(year) && (defined(pressKit.poster) || defined(pressKit.coverPhoto))]
    | order(year desc) {
      year,
      "poster": pressKit.poster,
      "coverPhoto": pressKit.coverPhoto
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
