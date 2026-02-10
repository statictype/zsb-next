// ---- Images ----

export interface ImageData {
  basePath: string;
  alt: string;
  ext?: "jpg" | "png";
  widths?: number[];
}

// ---- Manifesto ----

export interface ManifestoData {
  title: string;
  highlight?: string;
  paragraphs: string[];
}

// ---- Theme ----

export interface ThemeData {
  lead: string;
  body: string[];
  coda?: string[];
  artistsStatement: string;
}

// ---- Venues ----

export interface VenueEntry {
  group: string;
  subgroup?: string;
  name: string;
  program?: string;
  tag?: string;
}

// ---- Program ----

export interface ProgramBlock {
  type: string;
  title: string;
  dates?: string;
  description?: string;
  location?: string;
  featured: boolean;
}

export interface ProgramFilm {
  date: string;
  title: string;
  note?: string;
}

export interface ProgramData {
  dates: string;
  blocks: ProgramBlock[];
  films?: ProgramFilm[];
  sftfBanner?: {
    tag: string;
    title: string;
    description: string;
    href: string;
  };
}

// ---- Carousel ----

export interface CarouselImage {
  image: ImageData;
  caption: string;
}

export interface CarouselSlide {
  layout: string;
  images: CarouselImage[];
}

// ---- Credits ----

export interface CreditEntry {
  type: "primary" | "partner" | "secondary";
  label: string;
  value: string;
  detail?: string;
  logo?: string;
  logoAlt?: string;
}

// ---- Media Kit ----

export interface MediaKitItem {
  label: string;
  name: string;
  image: ImageData;
}

// ---- Full Edition ----

export interface Edition {
  year: number;
  theme: string;
  themeHighlight?: string;
  title: string;
  heroImage?: ImageData;
  dateTape?: string;
  manifesto: ManifestoData;
  themeSection: ThemeData;
  artists: string[];
  venues: VenueEntry[];
  program: ProgramData;
  carousel: CarouselSlide[];
  credits: CreditEntry[];
  mediaKit?: MediaKitItem[];
}
