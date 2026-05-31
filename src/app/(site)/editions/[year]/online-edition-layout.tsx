import { Credits } from '@/components/Credits/Credits'
import { ExternalGallery } from '@/components/ExternalGallery/ExternalGallery'
import { Hero } from '@/components/Hero/Hero'
import { Manifesto } from '@/components/Manifesto/Manifesto'
import { ThemeArtists } from '@/components/ThemeArtists/ThemeArtists'
import type { OnlineEdition } from '@/types/edition'
import styles from './page.module.css'

interface OnlineEditionLayoutProps {
  edition: OnlineEdition
}

export function OnlineEditionLayout({ edition }: OnlineEditionLayoutProps) {
  return (
    <main className={styles.page}>
      <Hero edition={edition} />
      <Manifesto manifesto={edition.manifesto} />
      <ThemeArtists edition={edition} />
      <ExternalGallery gallery={edition.externalGallery} theme={edition.theme} />
      <Credits credits={edition.credits} />
    </main>
  )
}
