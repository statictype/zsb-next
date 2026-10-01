import { baseMetadata } from '@app/_root/base-metadata'
import { fontVariables } from '@app/_root/fonts'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { css } from 'styled-system/css'
import { Umami } from '@/components/Analytics/Umami'
import { BellerBanner } from '@/components/BellerBanner/BellerBanner'
import { CookieBanner } from '@/components/CookieBanner/CookieBanner'
import { DisableDraftMode } from '@/components/DisableDraftMode/DisableDraftMode'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { Footer } from '@/components/Footer/Footer'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { Navigation } from '@/components/Navigation/Navigation'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { SanityLive } from '@/sanity/lib/live'
import '@app/globals.css'
import '@app/panda.css'

export { viewport } from '@app/_root/base-metadata'

export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `ZSB — ${SITE_NAME}`,
  },
  description: 'Zilele Sculpturii București — contemporary sculpture event in Bucharest, Romania.',
  openGraph: {
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
    url: '/',
  },
  // iOS standalone ("add to home screen") presentation. The icon itself comes
  // from src/app/apple-icon.png (Next file convention); the manifest is linked
  // automatically from src/app/manifest.ts.
  appleWebApp: {
    capable: true,
    title: 'ZSB',
    statusBarStyle: 'black-translucent',
  },
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isDraftMode } = await draftMode()
  return (
    <html lang="en" className={fontVariables} data-scroll-behavior="smooth">
      <body>
        <BellerBanner />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                name: SITE_NAME,
                alternateName: ['ZSB', 'Zilele Sculpturii București'],
                url: SITE_URL,
                description: 'Contemporary sculpture event in Bucharest, Romania.',
                foundingDate: '2021',
                location: {
                  '@type': 'Place',
                  name: 'Bucharest',
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Bucharest',
                    addressCountry: 'RO',
                  },
                },
              },
              { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
            ],
          }}
        />
        <div className={css({ position: 'relative' })}>
          <Navigation />
          {children}
        </div>
        <DraftAware cached={(options) => <Footer fetchOptions={options} />} fallback={null} />
        <CookieBanner />
        <Umami />
        <SanityLive includeDrafts={isDraftMode} />
        {isDraftMode && <DisableDraftMode />}
      </body>
    </html>
  )
}
