// ---- Images ----

export interface ImageData {
  src: string
  alt: string
  // Base64 LQIP from Sanity asset metadata, fetched only for the most-viewed
  // images (hero, edition cards, carousel) to drive next/image placeholder="blur".
  blurDataURL?: string
}

// A homepage slideshow image: an ImageData plus where to anchor it in frame.
export interface HeroImage extends ImageData {
  /** CSS object-position value, e.g. "top", "center", "bottom" */
  position?: string
}

// ---- Manifesto ----

export interface ManifestoData {
  title: string
  highlight: string
  body: string
}

// ---- Theme ----

export interface ThemeData {
  body: string
}

// ---- Calendar / Events (ZSB-28) ----

export interface EventTypeTag {
  title: string
  /** Stable key from the team-managed Event types list; used in filter URLs. */
  slug: string
}

export interface EventVenue {
  name: string
  type: string
  /** Optional street address; shown by the venues view, not the calendar. */
  address?: string
  /** Optional Google Maps link. */
  mapUrl?: string
  /** The bigger place this sits inside (a studio inside CFP). Carries the
   *  parent's own type so the venues view can group + label the roll-up. */
  partOf?: { name: string; type: string }
  /** The rolled-up facet identity: the parent venue when this is a sub-venue,
   *  else the venue itself. Stamped once in the data layer (`mapEvents`) so the
   *  calendar's filter chips and the Visit venues view group by one shared key
   *  and can't drift (ZSB-65). `slug` is the calendar `venue=` filter key. */
  rollUp: { name: string; slug: string; type: string }
}

// One program event, as the calendar reads it. Timing is Bucharest-local:
// `startDate` is always present; `startTime` only when it matters; `endDate`
// only for multi-day "Ongoing" runs (an exhibition that spans several days).
export interface CalendarEvent {
  /** Stable `_key` from the edition's events array — React key. */
  key: string
  /**
   * URL slug for the event's route (`events/[slug]`) — an editor override or,
   * by default, derived from date · venue · name and made unique per edition
   * (ADR 0015). Distinct from `key`: human-readable and shareable.
   */
  slug: string
  name: string
  /** ISO `YYYY-MM-DD`, Bucharest-local. */
  startDate: string
  /** Optional `HH:mm`, present only when the time matters (an 18:00 opening). */
  startTime?: string
  /** ISO `YYYY-MM-DD`. Present and after `startDate` for a multi-day run. */
  endDate?: string
  types: EventTypeTag[]
  venue: EventVenue
  description: string
  image?: ImageData
  /** Editor-set override for the social share card; falls back to the poster,
   *  then a generated card (ZSB-41). */
  ogImage?: ImageData
  facebookUrl?: string
  ticketUrl?: string
  featured: boolean
}

/** The subset of `CalendarEvent` the programme list renders. Excludes the
 *  detail-only fields (`ticketUrl`/`facebookUrl`/`ogImage`) that only the
 *  event modal reads, so list JSX can't reach for one by accident — the data
 *  is still the same fetch/array, this is a render-boundary type only. */
export type CalendarListEvent = Omit<CalendarEvent, 'ticketUrl' | 'facebookUrl' | 'ogImage'>

// ---- Carousel ----

export type CarouselLayout = 'trio' | 'duo' | 'featured-portrait' | 'featured-stack' | 'full'

export interface CarouselImage {
  image: ImageData
  caption: string
}

interface FullSlide {
  layout: 'full'
  images: [CarouselImage]
}

interface DuoSlide {
  layout: 'duo' | 'featured-portrait'
  images: [CarouselImage, CarouselImage]
}

interface TrioSlide {
  layout: 'trio' | 'featured-stack'
  images: [CarouselImage, CarouselImage, CarouselImage]
}

export type CarouselSlide = FullSlide | DuoSlide | TrioSlide

// ---- Credits ----

interface CreditEntryBase {
  type: 'primary' | 'partner' | 'secondary'
  label: string
  value: string
  detail?: string
}

interface CreditEntryWithLogo extends CreditEntryBase {
  logo: string
  logoAlt: string
}

interface CreditEntryWithoutLogo extends CreditEntryBase {
  logo?: never
  logoAlt?: never
}

export type CreditEntry = CreditEntryWithLogo | CreditEntryWithoutLogo

// ---- Media Kit ----

export interface MediaKitItem {
  label: string
  name: string
  image: ImageData
}

/** A press-kit asset shown in the press page's media strip — a MediaKitItem
 *  tagged with the edition year it belongs to. Built in the data layer
 *  (`getEditionsPressKit`) from the raw press-kit query (ZSB-66). */
export interface MediaKitStripItem extends MediaKitItem {
  year: number
}

// ---- External Gallery (for editions whose archive lives off-site) ----

export interface ExternalGalleryData {
  tag: string
  title: string
  highlight?: string
  description: string
  linkLabel: string
  href: string
}

// ---- Artists ----

/** Identity + display name for artist listings; `_id` exists purely as a
 *  stable render key. */
export interface ArtistListItem {
  _id: string
  name: string
}

// ---- Full Edition ----

export interface Edition {
  year: number
  theme: string
  themeHighlight: string
  title: string
  heroImage: ImageData
  thumbImage?: ImageData
  // Optional editor-set social share image; falls back to the branded hero
  // overlay generated in editions/[year]/opengraph-image.
  ogImage?: ImageData
  // Optional editor-set meta description; falls back to the truncated manifesto
  // body in editionMetadata.
  metaDescription?: string
  // The human date range ("10–20 September 2026"), no venue. `dateTape` is this
  // range plus the venue line; the two faces have distinct consumers.
  dateRange: string
  dateTape: string
  // Raw ISO dates + venue name, kept alongside the composed `dateTape` so
  // the Event JSON-LD can emit machine-readable startDate/endDate/location.
  dateStart: string
  dateEnd: string
  venueLine: string
  manifesto: ManifestoData
  themeSection: ThemeData
  artists: ArtistListItem[]
  // Whether this edition has a program section at all (ADR 0018). The online-only
  // 2021 has none; an edition with `hasProgram` true but no events yet renders the
  // coming-soon block. Defaults to true in the mapper for older docs.
  hasProgram: boolean
  // The events-and-venues model (ADR 0014). The calendar, filters, featured and
  // venues view all read from this list; it replaced the old program/venues
  // format (ZSB-38).
  events?: CalendarEvent[]
  carousel?: CarouselSlide[]
  credits: CreditEntry[]
}

/** Find one event in an edition by its URL `slug` (ADR 0015). Shared by the
 *  event page, the modal route, and the OG image. */
export function findEvent(edition: Edition | undefined, slug: string): CalendarEvent | null {
  return edition?.events?.find((e) => e.slug === slug) ?? null
}

// ---- Visit page ----

// Closed icon set an editor can pick per amenity, mirrored from the amenity
// schema. The renderer-side key→icon-component map lives in VisitSection.
export type IconKey = 'wheelchair' | 'parking' | 'cafe' | 'paint' | 'restroom' | 'wifi'

export interface Amenity {
  label: string
  icon: IconKey
}

export interface TransportRoute {
  from: string
  lines: string
  walk: string
}

// The runtime shape of the Visit page, produced by mapVisit and rendered by
// VisitSection.
export interface VisitData {
  venueName?: string[] | null
  street?: string | null
  city?: string | null
  mapsUrl?: string | null
  image?: ImageData | null
  hoursLines?: string[] | null
  amenities?: Amenity[] | null
  transport?: TransportRoute[] | null
}
