// ---- Images ----

export interface ImageData {
  basePath: string
  alt: string
  ext?: 'jpg' | 'png' | 'webp' | undefined
  widths?: number[] | undefined
}

// ---- Manifesto ----

export interface ManifestoData {
  title: string
  highlight?: string | undefined
  paragraphs: string[]
}

// ---- Theme ----

export interface ThemeData {
  lead: string
  body: string[]
  coda?: string[] | undefined
  artistsStatement: string
}

// ---- Venues ----

export interface VenueEntry {
  group: string
  subgroup?: string | undefined
  name: string
  program?: string | undefined
  tag?: string | undefined
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
  dates?: string | undefined
  description?: string | undefined
  location?: string | undefined
  featured: boolean
}

export interface ProgramFilm {
  date: string
  title: string
  note?: string | undefined
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
  films?: ProgramFilm[] | undefined
  sftfBanner?: SFTFBanner | undefined
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
  detail?: string | undefined
  logo?: string | undefined
  logoAlt?: string | undefined
}

// ---- Media Kit ----

export interface MediaKitItem {
  label: string
  name: string
  image: ImageData
}

// ---- Hero ----

export type HeroVariant = '2022' | '2023' | 'with-sculpture'

// ---- Edition Card ----

interface EditionCardBase {
  year: number
  theme: string
  description: string
}

interface ActiveEditionCard extends EditionCardBase {
  href: string
  image: ImageData
  variant?: 'sculpture' | 'tiled' | undefined
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
  themeHighlight?: string | undefined
  title: string
  heroImage?: ImageData | undefined
  heroVariant?: HeroVariant | undefined
  dateTape?: string | undefined
  manifesto: ManifestoData
  themeSection: ThemeData
  artists: string[]
  venues: VenueEntry[]
  program: ProgramData
  carousel: CarouselSlide[]
  credits: CreditEntry[]
  mediaKit?: MediaKitItem[] | undefined
}
