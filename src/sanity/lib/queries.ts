import { defineQuery } from 'next-sanity'

// Each query is exported with its `tags`: every document type its result
// reads, including types reached through `->` joins. `queryData` forwards the
// list to `sanityFetch`, which stamps it on the cache entry — that is what the
// revalidation webhook's type-level tags (`_type` in the projection) match
// against. When a query grows a new join, its `tags` must grow with it.
//
// Typegen only reads `defineQuery` calls assigned directly to a variable, so
// each GROQ string stays its own const rather than being inlined as `query:`.

const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0]{
    contactEmail,
    instagramUrl,
    facebookUrl
  }
`)

export const SITE_SETTINGS = { query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }

// The home-hero edition switch (ZSB-44): 'latest' or 'upcoming'. The hero leads
// with whichever edition this resolves to against the derived editions (ADR
// 0016). Null until set — getHeroEditionLeadFromSanity defaults to latest.
const HERO_EDITION_QUERY = defineQuery(`
  *[_id == "siteSettings"][0].heroEdition
`)

export const HERO_EDITION = { query: HERO_EDITION_QUERY, tags: ['siteSettings'] }

const HOMEPAGE_QUERY = defineQuery(`
  *[_id == "homepage"][0]{
    heroTitle,
    heroLead,
    heroCtaLabel,
    "heroCtaEditionYear": heroCtaEdition->year,
    slideshow[]{
      _key,
      position,
      image{ ..., "lqip": asset->metadata.lqip }
    },
    partnerStrip[]->{
      _id,
      name,
      url,
      logo{ ..., "aspectRatio": asset->metadata.dimensions.aspectRatio }
    },
    editionsIntro,
    ogImage,
    metaDescription
  }
`)

export const HOMEPAGE = { query: HOMEPAGE_QUERY, tags: ['homepage', 'edition', 'organization'] }

const EDITIONS_LIST_QUERY = defineQuery(`
  *[_type == "edition" && defined(year)] | order(year desc) {
    year,
    theme,
    themeHighlight,
    status,
    dateStart
  }
`)

export const EDITIONS_LIST = { query: EDITIONS_LIST_QUERY, tags: ['edition'] }

const ABOUT_PAGE_QUERY = defineQuery(`
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
    curatorHeadline,
    curatorPortrait{ ..., "lqip": asset->metadata.lqip },
    curatorName,
    curatorRole,
    curatorLetter,
    ogImage,
    metaDescription
  }
`)

export const ABOUT_PAGE = { query: ABOUT_PAGE_QUERY, tags: ['aboutPage'] }

const PARTNERS_PAGE_QUERY = defineQuery(`
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

export const PARTNERS_PAGE = { query: PARTNERS_PAGE_QUERY, tags: ['partnersPage'] }

const VISIT_PAGE_QUERY = defineQuery(`
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

export const VISIT_PAGE = { query: VISIT_PAGE_QUERY, tags: ['visitPage'] }

const PRIVACY_PAGE_QUERY = defineQuery(`
  *[_id == "privacyPage"][0]{
    hero,
    body,
    updatedAt,
    ogImage,
    metaDescription
  }
`)

export const PRIVACY_PAGE = { query: PRIVACY_PAGE_QUERY, tags: ['privacyPage'] }

const PRESS_PAGE_QUERY = defineQuery(`
  *[_id == "pressPage"][0]{
    hero,
    ogImage,
    metaDescription
  }
`)

export const PRESS_PAGE = { query: PRESS_PAGE_QUERY, tags: ['pressPage'] }

const PRESS_APPEARANCES_QUERY = defineQuery(`
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

export const PRESS_APPEARANCES = { query: PRESS_APPEARANCES_QUERY, tags: ['pressAppearance'] }

const PRESS_RELEASES_QUERY = defineQuery(`
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

export const PRESS_RELEASES = { query: PRESS_RELEASES_QUERY, tags: ['pressRelease', 'edition'] }

// All editions that have at least one Press-kit asset, newest year first.
// The renderer flattens poster + coverPhoto into a single strip.
// Image fields include hotspot/crop + asset metadata for LQIP + dimensions.
const EDITIONS_PRESS_KIT_QUERY = defineQuery(`
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

export const EDITIONS_PRESS_KIT = { query: EDITIONS_PRESS_KIT_QUERY, tags: ['edition'] }

const ARTISTS_QUERY = defineQuery(`
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

export const ARTISTS = { query: ARTISTS_QUERY, tags: ['artist'] }

// Identity + display name, surname-ordered — for the artists index and the
// homepage banner. `_id` exists purely as a stable React key. Only artists a
// live edition lists: an announced edition's lineup is not public yet.
const ARTIST_INDEX_QUERY = defineQuery(`
  *[_type == "artist" && defined(slug.current)
    && _id in *[_type == "edition" && status == "live"].artists[]._ref]
    | order(coalesce(sortName, name) asc){ _id, name }
`)

// 'edition' too: flipping an edition to live changes who this returns.
export const ARTIST_INDEX = { query: ARTIST_INDEX_QUERY, tags: ['artist', 'edition'] }

// Every artist plus each live edition's lineup, uninverted. `mapArtistCloud`
// inverts the refs and is also what drops artists no live edition lists — this
// query deliberately does not filter them, unlike ARTIST_INDEX_QUERY.
const ARTIST_CLOUD_QUERY = defineQuery(`
  {
    "artists": *[_type == "artist" && defined(slug.current)]
      | order(coalesce(sortName, name) asc){ _id, name },
    "editions": *[_type == "edition" && status == "live" && defined(year)]{
      year,
      "refs": artists[]._ref
    }
  }
`)

export const ARTIST_CLOUD = { query: ARTIST_CLOUD_QUERY, tags: ['artist', 'edition'] }

const ARTIST_BY_SLUG_QUERY = defineQuery(`
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

export const ARTIST_BY_SLUG = { query: ARTIST_BY_SLUG_QUERY, tags: ['artist'] }

// Live edition years, newest first. Live-only because the consumers enumerate
// reachable pages: the edition page is gated `status == "live"`, so any other
// year would bake a 404.
const EDITION_YEARS_QUERY = defineQuery(`
  *[_type == "edition" && defined(year) && status == "live"] | order(year desc){ year }
`)

export const EDITION_YEARS = { query: EDITION_YEARS_QUERY, tags: ['edition'] }

// Everything the sitemap needs to emit honest `lastModified` dates in a
// single round trip: each live edition's content-update time, the six
// page singletons' update times, and the newest artist edit (the /artists
// index reflects the collection, so its freshest member dates it).
const SITEMAP_QUERY = defineQuery(`
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

export const SITEMAP = {
  query: SITEMAP_QUERY,
  tags: [
    'edition',
    'homepage',
    'aboutPage',
    'visitPage',
    'partnersPage',
    'pressPage',
    'privacyPage',
    'artist',
  ],
}

// The /editions archive index: exactly the card slice (`EditionCardData`) —
// theme, date inputs, counts, imagery — instead of N full-edition fetches.
// Status-filtered and year-desc like the page itself.
const EDITION_CARDS_QUERY = defineQuery(`
  *[_type == "edition" && defined(year) && status == "live"] | order(year desc) {
    year,
    theme,
    themeHighlight,
    "themeBody": themeSection.body,
    dateStart,
    dateEnd,
    hasProgram,
    venueLine,
    "artistCount": count(artists),
    "eventCount": count(events),
    heroImage{ ..., "lqip": asset->metadata.lqip },
    thumbImage{ ..., "lqip": asset->metadata.lqip }
  }
`)

export const EDITION_CARDS = { query: EDITION_CARDS_QUERY, tags: ['edition'] }

// Only live editions have a viewable page — the gate tests the stable value
// (`== "live"`), so any other status (announced, legacy values, future
// additions) is unreachable by default. Fetching a non-live edition returns
// null so the route 404s.
const EDITION_BY_YEAR_QUERY = defineQuery(`
  *[_type == "edition" && year == $year && status == "live"][0] {
    _id,
    year,
    theme,
    themeHighlight,
    themeGloss,
    dateStart,
    dateEnd,
    venueLine,
    heroImage{ ..., "lqip": asset->metadata.lqip },
    thumbImage{ ..., "lqip": asset->metadata.lqip },
    ogImage,
    metaDescription,
    manifesto,
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
        address,
        "partOf": partOf->{ name }
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
      lead,
      label,
      detail,
      names,
      organization->{
        name,
        url,
        kind,
        logo{ ..., "dimensions": asset->metadata.dimensions }
      },
      organizations[]->{
        name,
        url,
        kind,
        logo{ ..., "dimensions": asset->metadata.dimensions }
      }
    }
  }
`)

export const EDITION_BY_YEAR = {
  query: EDITION_BY_YEAR_QUERY,
  tags: ['edition', 'artist', 'eventType', 'venue', 'organization'],
}
