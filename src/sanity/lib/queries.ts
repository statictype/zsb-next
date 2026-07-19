import { defineQuery } from 'next-sanity'

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0]{
    contactEmail,
    instagramUrl,
    facebookUrl
  }
`)

// The Visit page's edition switch (ZSB-46): 'latest' or 'upcoming'. The venues
// view shows whichever edition this resolves to against the derived editions
// (ADR 0016). Null until set — getVisitEditionLeadFromSanity defaults to latest.
export const VISIT_EDITION_QUERY = defineQuery(`
  *[_id == "siteSettings"][0].visitEdition
`)

// The home-hero edition switch (ZSB-44): 'latest' or 'upcoming'. The hero leads
// with whichever edition this resolves to against the derived editions (ADR
// 0016). Null until set — getHeroEditionLeadFromSanity defaults to latest.
export const HERO_EDITION_QUERY = defineQuery(`
  *[_id == "siteSettings"][0].heroEdition
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
      image{ ..., "lqip": asset->metadata.lqip }
    },
    editionsIntro,
    ogImage,
    metaDescription
  }
`)

export const EDITIONS_LIST_QUERY = defineQuery(`
  *[_type == "edition" && defined(year)] | order(year desc) {
    year,
    theme,
    themeHighlight,
    status,
    dateStart
  }
`)

export const ABOUT_PAGE_QUERY = defineQuery(`
  *[_id == "aboutPage"][0]{
    hero,
    manifestoTitle,
    manifestoBody,
    pillars,
    placeImage{ ..., "lqip": asset->metadata.lqip },
    carouselEyebrow,
    carousel[] {
      layout,
      images[] {
        caption,
        image{ ..., "lqip": asset->metadata.lqip }
      }
    },
    curatorEyebrow,
    curatorHeadline,
    curatorPortrait{ ..., "lqip": asset->metadata.lqip },
    curatorName,
    curatorRole,
    curatorLetter,
    ogImage,
    metaDescription
  }
`)

export const PARTNERS_PAGE_QUERY = defineQuery(`
  *[_id == "partnersPage"][0]{
    hero,
    eventTitle,
    eventBody,
    eventImage{ ..., "lqip": asset->metadata.lqip },
    whyEyebrow,
    whyTitle,
    whyImage{ ..., "lqip": asset->metadata.lqip },
    whyPoints,
    ctaHeading,
    ctaHeadingAccent,
    ctaBody,
    ctaLabel,
    ogImage,
    metaDescription
  }
`)

export const VISIT_PAGE_QUERY = defineQuery(`
  *[_id == "visitPage"][0]{
    venueName,
    street,
    city,
    mapsUrl,
    image{ ..., "lqip": asset->metadata.lqip },
    hoursLines,
    amenities,
    transport,
    faq[]{ question, answer },
    ogImage,
    metaDescription
  }
`)

export const PRIVACY_PAGE_QUERY = defineQuery(`
  *[_id == "privacyPage"][0]{
    hero,
    body,
    updatedAt,
    ogImage,
    metaDescription
  }
`)

export const PRESS_PAGE_QUERY = defineQuery(`
  *[_id == "pressPage"][0]{
    hero,
    ogImage,
    metaDescription
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

// Identity + display name, surname-ordered — for the artists index and the
// homepage banner. `_id` exists purely as a stable React key.
export const ARTIST_INDEX_QUERY = defineQuery(`
  *[_type == "artist" && defined(slug.current)] | order(coalesce(sortName, name) asc){ _id, name }
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

// Every edition's year + status, one row per edition. Serves two different
// views: the "N editions" counts (all years, announced included) and the
// generateStaticParams enumeration (filtered to live — a non-live page is
// gated `status == "live"`, so prerendering it would bake a 404).
export const EDITION_YEARS_QUERY = defineQuery(`
  *[_type == "edition" && defined(year)] | order(year desc){ year, status }
`)

// Sparse projection for the event route's generateStaticParams — every
// edition's year plus exactly the per-event fields `deriveEventSlugs` (ADR
// 0015) needs to reproduce the real slug, nothing else. Skips the images,
// carousel, credits, artists, and manifesto that `EDITION_BY_YEAR_QUERY`
// carries, but can't drop to just the stored slug field: an event without an
// editor-set slug gets one derived from name/date/venue at read time, so the
// derivation's inputs have to be fetched too. Reused by the opengraph-image
// route. `status == "live"` matches the route gate — a non-live
// edition's events have no reachable page, so they're excluded rather than
// prerendered and discarded.
export const EVENT_PATHS_QUERY = defineQuery(`
  *[_type == "edition" && defined(year) && status == "live"]{
    year,
    events[]{
      "slug": slug.current,
      name,
      startDate,
      "venue": venue->{ "slug": slug.current, name }
    }
  }
`)

// Everything the sitemap needs to emit honest `lastModified` dates in a
// single round trip: each live edition's content-update time, the six
// page singletons' update times, and the newest artist edit (the /artists
// index reflects the collection, so its freshest member dates it).
export const SITEMAP_QUERY = defineQuery(`
  {
    "editions": *[_type == "edition" && defined(year) && status == "live"]
      | order(year desc){ year, _updatedAt },
    "pages": *[_id in ["homepage", "aboutPage", "visitPage", "partnersPage", "pressPage", "privacyPage"]]{
      _id,
      _updatedAt
    },
    "lastArtistUpdate": *[_type == "artist" && defined(slug.current)]
      | order(_updatedAt desc)[0]._updatedAt
  }
`)

// The /editions archive grid: exactly the card slice (`EditionCardData`) —
// theme tape, dateTape inputs, imagery — instead of N full-edition fetches.
// Status-filtered and year-desc like the page itself, so row 0 is the
// newest live edition (the feature card).
export const EDITION_CARDS_QUERY = defineQuery(`
  *[_type == "edition" && defined(year) && status == "live"] | order(year desc) {
    year,
    theme,
    themeHighlight,
    dateStart,
    dateEnd,
    venueLine,
    heroImage{ ..., "lqip": asset->metadata.lqip },
    thumbImage{ ..., "lqip": asset->metadata.lqip }
  }
`)

// Only live editions have a viewable page — the gate tests the stable value
// (`== "live"`), so any other status (announced, legacy values, future
// additions) is unreachable by default. Fetching a non-live edition returns
// null so the route 404s.
export const EDITION_BY_YEAR_QUERY = defineQuery(`
  *[_type == "edition" && year == $year && status == "live"][0] {
    _id,
    year,
    title,
    theme,
    themeHighlight,
    dateStart,
    dateEnd,
    venueLine,
    heroImage{ ..., "lqip": asset->metadata.lqip },
    thumbImage{ ..., "lqip": asset->metadata.lqip },
    ogImage,
    metaDescription,
    manifesto,
    themeSection,
    hasProgram,
    "artists": artists[]->{_id, name, sortName} | order(coalesce(sortName, name) asc){ _id, name },
    events[] {
      _key,
      "slug": slug.current,
      name,
      startDate,
      startTime,
      endDate,
      "types": types[]->{ "title": title, "slug": slug.current },
      "venue": venue->{
        name,
        "slug": slug.current,
        "type": type->title,
        address,
        mapUrl,
        "partOf": partOf->{ name, "type": type->title }
      },
      description,
      image{ ..., "lqip": asset->metadata.lqip },
      ogImage{ ... },
      facebookUrl,
      ticketUrl,
      featured
    },
    carousel[] {
      layout,
      images[] {
        caption,
        image{ ..., "lqip": asset->metadata.lqip }
      }
    },
    credits[] {
      _type,
      type,
      label,
      detail,
      names,
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
