// ---- Images ----

export interface ImageData {
  basePath: string
  alt: string
  ext?: 'jpg' | 'png' | undefined
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

export interface ProgramBlock {
  type: string
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

export interface ProgramData {
  dates: string
  blocks: ProgramBlock[]
  films?: ProgramFilm[] | undefined
  sftfBanner?:
    | {
        tag: string
        title: string
        description: string
        href: string
      }
    | undefined
}

// ---- Carousel ----

export type CarouselLayout =
  | 'trio'
  | 'duo'
  | 'featured-portrait'
  | 'featured-stack'
  | 'full'

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

export interface EditionCardData {
  year: number
  theme: string
  description: string
  href: string
  variant?: 'sculpture' | 'tiled' | 'online' | undefined
  cardImage?:
    | {
        basePath: string
        alt: string
        ext?: 'jpg' | 'png' | undefined
      }
    | undefined
  tiledBg?: string | undefined
}

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
