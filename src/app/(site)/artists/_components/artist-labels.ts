import type { Lang } from '@/types/edition'

export const ARTIST_LABELS = {
  ro: {
    switchLabel: 'Limba',
    bio: 'Despre artist',
    readMore: 'Citește mai mult',
    readLess: 'Arată mai puțin',
    works: 'Lucrări',
    material: 'Material',
    dimensions: 'Dimensiuni',
    year: 'An',
    previous: 'Lucrarea anterioară',
    next: 'Lucrarea următoare',
    showImage: 'Arată imaginea',
  },
  en: {
    switchLabel: 'Language',
    bio: 'About the artist',
    readMore: 'Read more',
    readLess: 'Show less',
    works: 'Works',
    material: 'Material',
    dimensions: 'Dimensions',
    year: 'Year',
    previous: 'Previous work',
    next: 'Next work',
    showImage: 'Show image',
  },
} as const satisfies Record<Lang, Record<string, string>>

export type ArtistLabels = (typeof ARTIST_LABELS)[Lang]
