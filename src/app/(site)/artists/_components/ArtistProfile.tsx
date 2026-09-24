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
  const styles = artistProfile({ withPortrait: artist.portrait !== undefined })

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

      <div className={styles.intro}>
        {artist.portrait && (
          <div className={styles.portrait}>
            <Figure image={artist.portrait} sizes="(min-width: 768px) 40vw, 100vw" preload />
          </div>
        )}
        {bio.value.length > 0 && (
          <section aria-label={labels.bio} className={styles.bio} lang={bio.lang}>
            <PortableText value={bio.value} />
          </section>
        )}
      </div>

      <section aria-label={labels.works}>
        <WorkCarousel works={artist.works} lang={lang} labels={labels} />
      </section>
    </Container>
  )
}
