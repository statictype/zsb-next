'use client'

import { artistProfile } from '@artists-components/ArtistProfile.recipe'
import { ARTIST_LABELS } from '@artists-components/artist-labels'
import { useLang } from '@artists-components/use-lang'
import { WorkCarousel } from '@artists-components/WorkCarousel'
import { PortableText } from '@portabletext/react'
import { Container } from 'styled-system/jsx'
import { Figure } from '@/components/Figure/Figure'
import { Button } from '@/components/ui/Button/Button'
import type { ArtistPage, Lang } from '@/types/edition'

const LANGS: readonly Lang[] = ['ro', 'en']

interface ArtistProfileProps {
  artist: ArtistPage
}

export function ArtistProfile({ artist }: ArtistProfileProps) {
  const [lang, setLang] = useLang()
  const labels = ARTIST_LABELS[lang]
  const bio = artist.bio[lang]
  const styles = artistProfile()

  return (
    <Container className={styles.root} lang={lang}>
      <header className={styles.header}>
        <h1 className={styles.name}>{artist.name}</h1>
        <div role="group" className={styles.switch} aria-label={labels.switchLabel}>
          {LANGS.map((option) => (
            <Button
              key={option}
              variant="link"
              lang={option}
              aria-pressed={option === lang}
              onClick={() => setLang(option)}
            >
              {option.toUpperCase()}
            </Button>
          ))}
        </div>
      </header>

      {artist.portrait && (
        <div className={styles.portrait}>
          <Figure image={artist.portrait} sizes="(min-width: 640px) 480px, 100vw" preload />
        </div>
      )}

      {bio.value.length > 0 && (
        <section aria-labelledby="artist-bio" className={styles.bio} lang={bio.lang}>
          <h2 id="artist-bio" className={styles.heading}>
            {labels.bio}
          </h2>
          <PortableText value={bio.value} />
        </section>
      )}

      <section aria-labelledby="artist-works">
        <h2 id="artist-works" className={styles.heading}>
          {labels.works}
        </h2>
        <WorkCarousel works={artist.works} lang={lang} labels={labels} />
      </section>
    </Container>
  )
}
