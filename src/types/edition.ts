import type { PortableTextBlock } from '@portabletext/react'

export interface ImageData {
  src: string
  alt: string
  // Base64 LQIP, fetched only for hero, edition card and carousel images.
  blurDataURL?: string
}

export interface ShareImage {
  url: string
  alt: string
}

export interface HeroImage extends ImageData {
  /** CSS object-position value. */
  position?: string
}

export interface PartnerLogo {
  id: string
  name: string
  src: string
  alt: string
  width: number
  height: number
  url?: string
}

export interface ManifestoData {
  title: string
  highlight: string
  body: string
}

export interface EventTypeTag {
  title: string
  /** Stable key from the team-managed Event types list; used in filter URLs. */
  slug: string
}

export interface EventVenue {
  name: string
  address?: string
  partOf?: { name: string }
  /** The parent venue when this is a sub-venue, else the venue itself. `slug` is the program `venue=` filter key. */
  rollUp: { name: string; slug: string }
}

export interface CalendarEvent {
  key: string
  /** URL slug for `events/[slug]`: an editor override, else derived from date, venue and name. */
  slug: string
  name: string
  /** ISO `YYYY-MM-DD`, Bucharest-local. */
  startDate: string
  /** `HH:mm`. */
  startTime?: string
  endTime?: string
  /** ISO `YYYY-MM-DD`. Set only for a multi-day run, after `startDate`. */
  endDate?: string
  types: EventTypeTag[]
  venue: EventVenue
  description: string
  image?: ImageData
  /** Falls back to the poster, then a generated card. */
  ogImage?: ImageData
  facebookUrl?: string
  ticketUrl?: string
  featured: boolean
}

/** The `CalendarEvent` fields the program list renders; `ticketUrl`, `facebookUrl` and `ogImage` are read only by the event modal. */
export type CalendarListEvent = Omit<CalendarEvent, 'ticketUrl' | 'facebookUrl' | 'ogImage'>

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

/** `scale` is the fraction of the logo wall's cap height the mark is drawn at. */
export interface PartnerMark extends ImageData {
  width: number
  height: number
  scale: number
}

export interface MarkedPartner {
  name: string
  mark: PartnerMark
  url?: string
}

export type TeamCredit = { label: string; marks: MarkedPartner[] } & (
  | { kind: 'org'; name: string; detail?: string }
  | { kind: 'names'; names: string[] }
)

export interface CreditGroup {
  label: string
  marks: MarkedPartner[]
}

export interface EditionCredits {
  marks: MarkedPartner[]
  named: string[]
  media: CreditGroup[]
  teamOrgs: TeamCredit[]
  teamNames: TeamCredit[]
}

export interface MediaKitItem {
  label: string
  name: string
  image: ImageData
}

export interface MediaKitStripItem extends MediaKitItem {
  year: number
}

export interface ExternalGalleryData {
  tag: string
  title: string
  highlight?: string
  description: string
  linkLabel: string
  href: string
}

export interface ArtistListItem {
  _id: string
  name: string
  href?: string
}

export type ArtistTier = 1 | 2 | 3 | 4 | 5

export interface ArtistCloudItem {
  _id: string
  name: string
  years: number[]
  tier: ArtistTier
}

export interface ArtistCloud {
  cloud: ArtistCloudItem[]
  onlineOnly: ArtistListItem[]
}

export type Lang = 'ro' | 'en'

export interface LangText<T> {
  lang: Lang
  value: T
}

export type Bilingual<T> = Record<Lang, LangText<T>>

export interface WorkImage extends ImageData {
  aspectRatio: number
}

export interface ArtistWork {
  key: number
  title: Bilingual<string>
  material?: Bilingual<string>
  dimensions?: string
  year?: string
  description: Bilingual<PortableTextBlock[]>
  images: WorkImage[]
}

export interface ArtistPage {
  name: string
  slug: string
  portrait?: ImageData
  bio: Bilingual<PortableTextBlock[]>
  works: ArtistWork[]
}

export interface Edition {
  year: number
  theme: string
  themeHighlight: string
  themeGloss?: string
  heroImage: ImageData
  thumbImage?: ImageData
  // Falls back to the hero overlay generated in editions/[year]/opengraph-image.
  ogImage?: ImageData
  // Falls back to the truncated manifesto body in editionMetadata.
  metaDescription?: string
  // `dateLine` is this range plus the venue line.
  dateRange: string
  dateLine: string
  dateStart: string
  dateEnd: string
  venueLine: string
  manifesto: ManifestoData
  artists: ArtistListItem[]
  // With no events, an edition with `hasProgram` true renders the coming-soon block.
  hasProgram: boolean
  events: CalendarEvent[]
  carousel: CarouselSlide[]
  credits: EditionCredits
  facts: EditionFact[]
}

export type EditionFact =
  | { kind: 'dates'; text: string }
  | { kind: 'venue'; text: string }
  | { kind: 'artists'; count: number }
  | { kind: 'events'; count: number }

export interface EditionSummary {
  year: number
  theme: string
  themeHighlight: string
  themeBody: string
  status: 'announced' | 'live'
  href: string
  dateStart?: string
  dateLine: string
  facts: EditionFact[]
  heroImage?: ImageData
  thumbImage?: ImageData
}

export function findEvent(
  edition: { events: CalendarEvent[] } | undefined,
  slug: string,
  // eslint-disable-next-line no-restricted-syntax -- "not found" return, not a nullable field
): CalendarEvent | null {
  return edition?.events.find((e) => e.slug === slug) ?? null
}

// The fields `editionEventJsonLd` reads.
export type EditionJsonLd = Pick<
  Edition,
  | 'year'
  | 'theme'
  | 'dateStart'
  | 'dateEnd'
  | 'venueLine'
  | 'heroImage'
  | 'manifesto'
  | 'artists'
  | 'events'
>

export interface PressAppearance {
  _id: string
  medium: 'article' | 'audio' | 'video'
  title: string
  year: number
  tag: string
  url: string
  excerpt: string
}

// Mirrors the amenity schema; the key→icon map lives in VisitSection.
export type IconKey = 'wheelchair' | 'parking' | 'cafe' | 'paint'

export interface Amenity {
  label: string
  icon: IconKey
}

export interface TransportRoute {
  stop: string
  lines: string
  walk: string
}

// Produced by mapVisit, rendered by VisitSection.
export interface VisitData {
  venueName: string[]
  street: string
  city: string
  hoursLines: string[]
  amenities: Amenity[]
  transport: TransportRoute[]
  mapsUrl?: string
  image?: ImageData
}
