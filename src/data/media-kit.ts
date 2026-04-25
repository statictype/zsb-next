import { blobUrl } from '@/lib/blob'
import type { MediaKitItem } from '@/types/edition'

export interface MediaKitEntry extends MediaKitItem {
  year: number
}

/**
 * Aggregated media-kit assets across all ZSB editions.
 * Lives here (not in per-edition files) because the only consumer is the
 * press page, which displays them all together as a single strip.
 * Order: newest year first, posters before photography within a year.
 */
export const MEDIA_KIT: MediaKitEntry[] = [
  {
    year: 2025,
    label: 'Photography',
    name: 'Exhibition Cover',
    image: { src: blobUrl('2025/1-cover-event.jpg'), alt: 'ZSB 2025 Cover' },
  },
  {
    year: 2025,
    label: 'Key Visual',
    name: 'Official Poster',
    image: { src: blobUrl('2025/poster-zsb-2025.jpg'), alt: 'ZSB 2025 Poster' },
  },
  {
    year: 2024,
    label: 'Photography',
    name: 'Exhibition Cover',
    image: { src: blobUrl('2024/cover.jpg'), alt: 'ZSB 2024 Cover' },
  },
  {
    year: 2024,
    label: 'Key Visual',
    name: 'Official Poster',
    image: {
      src: blobUrl('2024/kv_zsb_2024_fara_logouri-01.jpg'),
      alt: 'ZSB 2024 Poster',
    },
  },
  {
    year: 2023,
    label: 'Photography',
    name: 'Exhibition Cover',
    image: { src: blobUrl('2023/cover.jpg'), alt: 'ZSB 2023 Cover' },
  },
  {
    year: 2023,
    label: 'Key Visual',
    name: 'Official Poster',
    image: { src: blobUrl('2023/poster-zsb-2023.jpg'), alt: 'ZSB 2023 Poster' },
  },
  {
    year: 2022,
    label: 'Photography',
    name: 'Exhibition Cover',
    image: { src: blobUrl('2022/cover-image.jpg'), alt: 'ZSB 2022 Cover' },
  },
  {
    year: 2022,
    label: 'Key Visual',
    name: 'Official Poster',
    image: { src: blobUrl('2022/poster-zsb-2022.jpg'), alt: 'ZSB 2022 Poster' },
  },
]
