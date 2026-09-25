import { aboutPage } from '@site/about/page.recipe'
import { cx } from 'styled-system/css'
import { Container, Stack, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { GalleryCarousel } from '@/components/Carousel/GalleryCarousel'
import { Figure } from '@/components/Figure/Figure'
import { Manifesto } from '@/components/Manifesto/Manifesto'
import { PageHero } from '@/components/PageHero/PageHero'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import type { AboutView } from '@/sanity/lib/staticPages'

const styles = aboutPage()

const PILLAR_SIZES = '(min-width: 2024px) 858px, (min-width: 1024px) 48vw, 100vw'

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

      <figure className={styles.plateFrame}>
        <Figure image={placeImage} sizes="100vw" preload className={styles.plateImg} />
        {placeImage?.alt && (
          <Text as="figcaption" variant="caption" color="muted" className={styles.plateCredit}>
            {placeImage.alt}
          </Text>
        )}
      </figure>

      <Manifesto ground="dark" title={manifestoTitle} body={manifestoBody} />

      {carousel.length > 0 && (
        <section className={section({ ground: 'dark', rhythm: 'none' })}>
          <GalleryCarousel
            id="about-gallery"
            label="Archive photo carousel"
            slides={carousel}
            eyebrow={carouselEyebrow}
            treatment="mono"
          />
        </section>
      )}

      {pillars.length > 0 && (
        <section className={section({ ground: 'dark' })}>
          <Container>
            <ol className={styles.pillars}>
              {pillars.map((pillar) => (
                <li key={pillar.label} className={styles.pillar}>
                  <div className={styles.pillarPlate}>
                    <Figure
                      image={pillar.image}
                      sizes={PILLAR_SIZES}
                      className={styles.pillarImg}
                    />
                  </div>
                  <Stack gap="lg" className={styles.pillarBody}>
                    <Text as="h2" variant="detailTitle">
                      {pillar.label}
                    </Text>
                    <Text as="p" variant="lead" className={styles.pillarText}>
                      {pillar.body}
                    </Text>
                  </Stack>
                </li>
              ))}
            </ol>
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
