import type { ImageData } from '@/types/edition'

// Rendered only when a CMS image is missing, which happens on an unseeded dataset.
export const PLACEHOLDER_IMAGE: ImageData = {
  src: '/img/placeholder.jpg',
  alt: '',
}
