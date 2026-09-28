import type {
  ArtistListItem,
  CalendarEvent,
  EditionCredits,
  ImageData,
  ShareImage,
} from '@/types/edition'

export interface BellerFact {
  label: string
  value: string
}

export interface BellerPressKit {
  title: string
  body: string[]
  buttonLabel: string
  href: string
  sizeBytes: number
}

export interface GaleriaBeller {
  title: string
  heroColor: string
  wordmark?: ImageData
  keyVisual?: ImageData
  facts: BellerFact[]
  info: { title: string; body: string }
  programIntro: string[]
  artists: ArtistListItem[]
  events: CalendarEvent[]
  credits: EditionCredits
  pressKit?: BellerPressKit
  footerText: string
  ogImage?: ShareImage
  metaDescription: string
}
