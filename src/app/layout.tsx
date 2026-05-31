import type { Metadata } from 'next'
import { Dela_Gothic_One, Montserrat } from 'next/font/google'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import './globals.css'

const delaGothic = Dela_Gothic_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dela-gothic',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `ZSB — ${SITE_NAME}`,
  },
  description: 'Zilele Sculpturii București — contemporary sculpture event in Bucharest, Romania.',
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
      className={`${delaGothic.variable} ${montserrat.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>{children}</body>
    </html>
  )
}
