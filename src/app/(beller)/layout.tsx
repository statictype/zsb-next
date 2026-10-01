import { baseMetadata } from '@app/_root/base-metadata'
import { fontVariables } from '@app/_root/fonts'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { css, cx } from 'styled-system/css'
import { Umami } from '@/components/Analytics/Umami'
import { CookieBanner } from '@/components/CookieBanner/CookieBanner'
import { DisableDraftMode } from '@/components/DisableDraftMode/DisableDraftMode'
import { SanityLive } from '@/sanity/lib/live'
import '@app/globals.css'
import '@app/panda.css'

export { viewport } from '@app/_root/base-metadata'

const noFocusRing = css({ '--borders-focus': 'none' })

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
    <html lang="ro" className={cx(fontVariables, noFocusRing)} data-scroll-behavior="smooth">
      <body>
        {children}
        <CookieBanner lang="ro" />
        <Umami />
        <SanityLive includeDrafts={isDraftMode} />
        {isDraftMode && <DisableDraftMode />}
      </body>
    </html>
  )
}
