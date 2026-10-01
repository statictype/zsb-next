'use client'

import { artistProfile } from '@artists-components/ArtistProfile.recipe'
import { ARTIST_LABELS } from '@artists-components/artist-labels'
import { useLang } from '@artists-components/use-lang'
import { useWorkCarousel, WorkIndex, WorkList } from '@artists-components/WorkList'
import { PortableText } from '@portabletext/react'
import { useId, useState } from 'react'
import { Container } from 'styled-system/jsx'
import { Figure } from '@/components/Figure/Figure'
import { Button } from '@/components/ui/Button/Button'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import type { ArtistPage, Lang } from '@/types/edition'

const LANGS: readonly Lang[] = ['ro', 'en']

interface ArtistProfileProps {
  artist: ArtistPage
}

export function ArtistProfile({ artist }: ArtistProfileProps) {
  const [lang, setLang] = useLang()
  const labels = ARTIST_LABELS[lang]
  const bio = artist.bio[lang]
  const bioId = useId()
  const aboutId = useId()
  const [bioOpen, setBioOpen] = useState(false)
  const carousel = useWorkCarousel(artist.works)
  const styles = artistProfile({ withPortrait: artist.portrait !== undefined, bioOpen })

  return (
    <Container className={styles.root} lang={lang}>
      <header className={styles.header}>
        <div className={styles.intro}>
          <h1 className={styles.name}>{artist.name}</h1>
          <div role="group" className={styles.switch} aria-label={labels.switchLabel}>
            {LANGS.map((option) => (
              <Button
                key={option}
                variant="secondary"
                size="sm"
                lang={option}
                aria-pressed={option === lang}
                onClick={() => setLang(option)}
              >
                {option.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {artist.works.length > 1 && (
          <WorkIndex
            works={artist.works}
            lang={lang}
            label={labels.works}
            current={carousel.current}
            onSelect={carousel.go}
          />
        )}
      </header>

      <WorkList works={artist.works} lang={lang} labels={labels} carousel={carousel} />

      {(artist.portrait || bio.value.length > 0) && (
        <section aria-labelledby={aboutId} className={styles.about}>
          <SectionHeading id={aboutId} size="detail" flush className={styles.aboutHeading}>
            {labels.bio}
          </SectionHeading>
          {artist.portrait && (
            <div className={styles.portrait}>
              <Figure image={artist.portrait} sizes="200px" />
            </div>
          )}
          {bio.value.length > 0 && (
            <div className={styles.bio}>
              <div id={bioId} className={styles.bioBody} lang={bio.lang}>
                <PortableText value={bio.value} />
              </div>
              {bio.value.length > 1 && (
                <Button
                  variant="link"
                  className={styles.more}
                  aria-expanded={bioOpen}
                  aria-controls={bioId}
                  onClick={() => setBioOpen(!bioOpen)}
                >
                  {bioOpen ? labels.readLess : labels.readMore}
                </Button>
              )}
            </div>
          )}
        </section>
      )}
    </Container>
  )
}
