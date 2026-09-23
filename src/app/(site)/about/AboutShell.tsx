import { aboutPage } from '@site/about/page.recipe'
import { cx } from 'styled-system/css'
import { Container, Divider, Stack, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { GalleryCarousel } from '@/components/Carousel/GalleryCarousel'
import { Figure } from '@/components/Figure/Figure'
import { Manifesto } from '@/components/Manifesto/Manifesto'
import { PageHero } from '@/components/PageHero/PageHero'
import { PillarGrid } from '@/components/PillarGrid/PillarGrid'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import type { AboutView } from '@/sanity/lib/staticPages'

const styles = aboutPage()

export function AboutShell({ view }: { view: AboutView }) {
  const {
    hero,
    manifestoTitle,
    manifestoBody,
    pillars,
    placeImage,
    carousel,
    carouselEyebrow,
    curatorHeadline,
    curatorName,
    curatorRole,
    curatorLetter,
    curatorPortrait,
  } = view

  return (
    <main>
      <PageHero flush title={hero.title} lead={hero.lead} />

      {carousel.length > 0 && (
        <section className={cx(section({ ground: 'dark', rhythm: 'none' }), styles.plates)}>
          <GalleryCarousel
            id="about-gallery"
            label="Archive photo carousel"
            slides={carousel}
            eyebrow={carouselEyebrow}
            treatment="mono"
            preload
          />
        </section>
      )}

      <Manifesto ground="dark" title={manifestoTitle} body={manifestoBody} />

      <figure className={styles.plateFrame}>
        <Figure image={placeImage} sizes="100vw" className={styles.plateImg} />
        {placeImage?.alt && (
          <Text as="figcaption" variant="caption" color="muted" className={styles.plateCredit}>
            {placeImage.alt}
          </Text>
        )}
      </figure>

      {pillars.length > 0 && (
        <section className={cx(section({ ground: 'dark', rhythm: 'none' }), styles.supports)}>
          <Divider />
          <Container>
            <PillarGrid
              items={pillars.map((pillar) => ({ title: pillar.label, body: pillar.body }))}
              rhythm="bookend"
              titleTone="highlight"
            />
          </Container>
        </section>
      )}

      <section className={cx(section({ ground: 'light', rhythm: 'lg' }), styles.statement)}>
        <div className={styles.statementInner}>
          <Stack as="aside" className={styles.statementAside} gap="xl">
            <SectionHeading>{curatorHeadline}</SectionHeading>

            <Stack as="figure" className={styles.statementByline} gap="sm">
              <div className={styles.authorPhoto}>
                <Figure image={curatorPortrait} sizes="200px" className={styles.authorPhotoImg} />
              </div>
              <Stack as="figcaption" gap="xs" className={styles.authorCaption}>
                <Text variant="heading">{curatorName}</Text>
                <Text variant="label">{curatorRole}</Text>
              </Stack>
            </Stack>
          </Stack>

          <div className={styles.statementLetter}>
            {curatorLetter.map((para) => (
              <Text as="p" variant="body" key={para}>
                {para}
              </Text>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
