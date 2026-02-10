import type { Metadata } from 'next'
import { Dela_Gothic_One, Raleway } from 'next/font/google'
import localFont from 'next/font/local'
import { Suspense } from 'react'
import { Footer } from '@/components/Footer/Footer'
import { Navigation } from '@/components/Navigation/Navigation'
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
  title: 'ZSB | Bucharest Sculpture Days',
  description:
    'Zilele Sculpturii București — contemporary sculpture festival in Bucharest, Romania.',
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
        <Navigation />
        {children}
        <Suspense>
          <Footer />
        </Suspense>
      </body>
    </html>
  )
}
