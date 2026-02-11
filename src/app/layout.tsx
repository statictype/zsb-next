import type { Metadata } from 'next'
import { Dela_Gothic_One, Raleway } from 'next/font/google'
import localFont from 'next/font/local'
import { Suspense } from 'react'
import { Footer } from '@/components/Footer/Footer'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { Navigation } from '@/components/Navigation/Navigation'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import './globals.css'

const delaGothic = Dela_Gothic_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dela-gothic',
  display: 'swap',
})

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
})

const ppFormula = localFont({
  src: './fonts/PPFormulaLight.woff2',
  variable: '--font-pp-formula',
  display: 'swap',
  weight: '300',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `ZSB — ${SITE_NAME}`,
  },
  description:
    'Zilele Sculpturii București — contemporary sculpture event in Bucharest, Romania.',
  keywords: [
    'contemporary sculpture',
    'Bucharest',
    'sculpture event',
    'Romanian art',
    'ZSB',
    'Zilele Sculpturii București',
  ],
  openGraph: {
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
    url: '/',
  },
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${delaGothic.variable} ${raleway.variable} ${ppFormula.variable}`}
    >
      <body>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                name: SITE_NAME,
                alternateName: 'ZSB',
                url: SITE_URL,
                description:
                  'Contemporary sculpture event in Bucharest, Romania.',
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
              {
                '@type': 'WebSite',
                name: SITE_NAME,
                url: SITE_URL,
              },
            ],
          }}
        />
        <Navigation />
        {children}
        <Suspense>
          <Footer />
        </Suspense>
      </body>
    </html>
  )
}
