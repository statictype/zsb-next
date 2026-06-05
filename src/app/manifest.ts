import type { MetadataRoute } from 'next'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/constants'

// Web app manifest — drives "add to home screen" / installed-PWA presentation.
// theme_color / background_color mirror the dark brand canvas (see globals.css
// --canvas). Icons are generated from src/app/icon.svg by
// scripts/generate-app-icons.ts; the dark full-bleed background satisfies the
// maskable safe zone, so each size is offered for both "any" and "maskable".
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'ZSB',
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#0e0b10',
    theme_color: '#0e0b10',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
