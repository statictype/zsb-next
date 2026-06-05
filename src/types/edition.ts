// ---- Images ----

export interface ImageData {
  src: string
  alt: string
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
