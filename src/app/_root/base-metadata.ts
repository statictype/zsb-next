import type { Metadata, Viewport } from 'next'
import { SITE_URL } from '@/lib/constants'

export const baseMetadata = {
  metadataBase: new URL(SITE_URL),
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
} satisfies Metadata

// Matches the manifest's theme_color.
export const viewport: Viewport = {
  themeColor: '#0e0b10',
}
