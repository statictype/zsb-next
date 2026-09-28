import { baseMetadata } from '@app/_root/base-metadata'
import { fontVariables } from '@app/_root/fonts'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { DisableDraftMode } from '@/components/DisableDraftMode/DisableDraftMode'
import { SanityLive } from '@/sanity/lib/live'
import '@app/globals.css'
import '@app/panda.css'

export { viewport } from '@app/_root/base-metadata'

export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    template: '%s | Galeria Beller',
    default: 'Galeria Beller',
  },
  openGraph: {
    siteName: 'Galeria Beller',
    locale: 'ro_RO',
    type: 'website',
  },
}

export default async function BellerRootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isDraftMode } = await draftMode()
  return (
    <html lang="ro" className={fontVariables} data-scroll-behavior="smooth">
      <body>
        {children}
        <SanityLive includeDrafts={isDraftMode} />
        {isDraftMode && <DisableDraftMode />}
      </body>
    </html>
  )
}
