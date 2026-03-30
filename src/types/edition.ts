// ---- Images ----

export interface ImageData {
  basePath: string
  alt: string
  ext?: 'jpg' | 'png' | 'webp'
  widths?: number[]
}

// ---- Manifesto ----

export interface ManifestoData {
  title: string
  highlight: string
  paragraphs: string[]
}

// ---- Theme ----

export interface ThemeData {
  lead: string
  body: string[]
  coda: string[]
  artistsStatement: string
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

export interface ProgramBlock {
  type: ProgramBlockType
  title: string
  dates: string
  description: string
  location?: string
  featured: boolean
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
  href: string
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

export interface CarouselSlide {
  layout: CarouselLayout
  images: CarouselImage[]
}

// ---- Credits ----

export interface CreditEntry {
  type: 'primary' | 'partner' | 'secondary'
  label: string
  value: string
  detail?: string
  logo?: string
  logoAlt?: string
}

// ---- Media Kit ----

export interface MediaKitItem {
  label: string
  name: string
  image: ImageData
}

// ---- Edition Card ----

interface EditionCardBase {
  year: number
  theme: string
  description: string
}

interface ActiveEditionCard extends EditionCardBase {
  href: string
  image: ImageData
  variant?: 'sculpture' | 'tiled'
}

interface InactiveEditionCard extends EditionCardBase {
  href?: never
}

export type EditionCardData = ActiveEditionCard | InactiveEditionCard

// ---- Masonry Gallery ----

export interface MasonryImage {
  basePath: string
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
  dateTape: string
  manifesto: ManifestoData
  themeSection: ThemeData
  artists: string[]
  venues: VenueEntry[]
  program: ProgramData
  carousel: CarouselSlide[]
  credits: CreditEntry[]
  mediaKit: MediaKitItem[]
}
