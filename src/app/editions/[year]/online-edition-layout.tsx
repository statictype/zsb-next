import { Credits } from '@/components/Credits/Credits'
import { ExternalGallery } from '@/components/ExternalGallery/ExternalGallery'
import { Manifesto } from '@/components/Manifesto/Manifesto'
import { OnlineHero } from '@/components/OnlineHero/OnlineHero'
import { ThemeArtists } from '@/components/ThemeArtists/ThemeArtists'
import type { OnlineEdition } from '@/types/edition'
import styles from './page.module.css'

interface OnlineEditionLayoutProps {
  edition: OnlineEdition
}

export function OnlineEditionLayout({ edition }: OnlineEditionLayoutProps) {
  return (
    <main className={styles.page}>
      <OnlineHero edition={edition} />
      <Manifesto manifesto={edition.manifesto} />
      <ThemeArtists edition={edition} />
      <ExternalGallery gallery={edition.externalGallery} theme={edition.theme} />
      <Credits credits={edition.credits} />
    </main>
  )
}
