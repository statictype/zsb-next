import { VisualEditing } from 'next-sanity/visual-editing'
import { draftMode } from 'next/headers'
import { Suspense } from 'react'
import { CookieBanner } from '@/components/CookieBanner/CookieBanner'
import { DisableDraftMode } from '@/components/DisableDraftMode/DisableDraftMode'
import { Footer } from '@/components/Footer/Footer'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { getDynamicFetchOptions, SanityLive } from '@/sanity/lib/live'
import { SITE_NAME, SITE_URL } from '@/lib/constants'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [{ isEnabled: isDraftMode }, fetchOptions] = await Promise.all([
    draftMode(),
    getDynamicFetchOptions(),
  ])
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization',
              name: SITE_NAME,
              alternateName: 'ZSB',
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
      {children}
      <Suspense>
        <Footer fetchOptions={fetchOptions} />
      </Suspense>
      <CookieBanner />
      <SanityLive includeDrafts={isDraftMode} />
      {isDraftMode && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}
    </>
  )
}
