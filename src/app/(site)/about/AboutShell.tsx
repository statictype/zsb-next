import { aboutPage } from '@site/about/page.recipe'
import { cx } from 'styled-system/css'
import { Container, Stack, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { GalleryCarousel } from '@/components/Carousel/GalleryCarousel'
import { Figure } from '@/components/Figure/Figure'
import { PageHero } from '@/components/PageHero/PageHero'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import type { AboutView } from '@/sanity/lib/staticPages'

const styles = aboutPage()

const PILLAR_SIZES = '(min-width: 2024px) 864px, (min-width: 1024px) 48vw, 100vw'

export function AboutShell({ view }: { view: AboutView }) {
  const {
    hero,
    pillars,
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
        <section className={cx(section({ rhythm: 'none' }), styles.carousel)}>
          <GalleryCarousel
            id="about-gallery"
            label="Archive photo carousel"
            slides={carousel}
            eyebrow={carouselEyebrow}
            preload
          />
        </section>
      )}
      {pillars.length > 0 && (
        <section className={section()}>
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
                    <Text as="h2" variant="heading">
                      {pillar.label}
                    </Text>
                    <Text as="p" variant="body" className={styles.pillarText}>
                      {pillar.body}
                    </Text>
                  </Stack>
                </li>
              ))}
            </ol>
          </Container>
        </section>
      )}
      <section data-ground="light" className={cx(section({ rhythm: 'lg' }), styles.statement)}>
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
