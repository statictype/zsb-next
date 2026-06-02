import type { ImageData } from '@/types/edition'

/**
 * Global image fallback. Only ever rendered when a CMS image is missing —
 * which, since the singleton image fields are required, happens only on an
 * un-seeded dataset (no published singleton). Real, seeded content always
 * supplies its own image, so this never shows in production.
 */
export const PLACEHOLDER_IMAGE: ImageData = {
  src: '/img/placeholder.jpg',
  alt: '',
}
