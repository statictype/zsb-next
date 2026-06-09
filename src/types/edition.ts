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

// ---- Venues ----

export interface VenueEntry {
  group: string
  subgroup: string
  name: string
  program: string
}

// ---- Program ----

export type ProgramBlockType =
  | 'Exhibition'
  | 'Film Program'
  | 'Main Exhibition'
  | 'Opening Event'
  | 'Special Event'
  | 'Student Exhibition'
  | 'Talks & Workshops'

export type ProgramBlockFormat = 'Roundtable' | 'Workshop' | 'Open Studios'

export interface ProgramBlock {
  type: ProgramBlockType
  title: string
  dates: string
  description: string
  location?: string
  column: 1 | 2
  format?: ProgramBlockFormat
}

export interface ProgramFilm {
  date: string
  title: string
  note?: string
}

export interface SFTFBanner {
  tag: string
  title: string
  description: string
}

export interface ProgramData {
  dates: string
  blocks: ProgramBlock[]
  films?: ProgramFilm[]
  sftfBanner: SFTFBanner
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
  facebookUrl?: string
  ticketUrl?: string
  featured: boolean
}

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

// ---- External Gallery (for editions whose archive lives off-site) ----

export interface ExternalGalleryData {
  tag: string
  title: string
  highlight?: string
  description: string
  linkLabel: string
  href: string
}

// ---- Masonry Gallery ----

export interface MasonryImage {
  src: string
  alt: string
  caption: string
  cols: number
  rows: number
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
  dateTape: string
  // Raw ISO dates + venue name, kept alongside the composed `dateTape` so
  // the Event JSON-LD can emit machine-readable startDate/endDate/location.
  dateStart: string
  dateEnd: string
  venueLine: string
  manifesto: ManifestoData
  themeSection: ThemeData
  artists: string[]
  venues: VenueEntry[]
  program?: ProgramData
  // The new events-and-venues model (ADR 0014). The calendar reads this list;
  // the old `program` field above is removed once every edition is migrated.
  events?: CalendarEvent[]
  carousel?: CarouselSlide[]
  credits: CreditEntry[]
}

// ---- Online Edition (digital-only year, no physical venues / no carousel) ----

export interface OnlineEdition {
  kind: 'online'
  year: number
  theme: string
  themeHighlight: string
  title: string
  heroImage: ImageData
  thumbImage?: ImageData
  ogImage?: ImageData
  metaDescription?: string
  dateTape: string
  manifesto: ManifestoData
  themeSection: ThemeData
  artists: string[]
  externalGallery: ExternalGalleryData
  credits: CreditEntry[]
}

export type AnyEdition = Edition | OnlineEdition

export function isOnlineEdition(e: AnyEdition): e is OnlineEdition {
  return 'kind' in e && e.kind === 'online'
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
