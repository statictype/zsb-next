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

// themeColor tints the mobile browser chrome / installed-PWA title bar; it
// belongs in `viewport`, not `metadata`, in the App Router. Matches the dark
// brand canvas and the manifest's theme_color.
export const viewport: Viewport = {
  themeColor: '#0e0b10',
}
