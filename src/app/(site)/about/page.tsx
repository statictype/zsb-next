import { aboutPage } from '@site/about/page.recipe'
import { notFound } from 'next/navigation'
import { cx } from 'styled-system/css'
import { Container, Stack, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { GalleryCarousel } from '@/components/Carousel/GalleryCarousel'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { EditionsNav } from '@/components/EditionsNav/EditionsNav'
import { Figure } from '@/components/Figure/Figure'
import { Manifesto } from '@/components/Manifesto/Manifesto'
import { PageHero } from '@/components/PageHero/PageHero'
import { PillarGrid } from '@/components/PillarGrid/PillarGrid'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { makePageMetadata } from '@/lib/seo'
import { type DynamicFetchOptions } from '@/sanity/lib/live'
import { type AboutView, getAboutPage } from '@/sanity/lib/staticPages'

const styles = aboutPage()

export const generateMetadata = makePageMetadata(getAboutPage, {
  title: 'About',
  path: '/about',
})

export default function AboutRoute() {
  return (
    <>
      <DraftAware cached={(options) => <CachedAbout options={options} />} fallback={null} />
      <EditionsNav />
    </>
  )
}

async function CachedAbout({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const about = await getAboutPage(options)
  if (!about) notFound()
  return <AboutShell view={about} />
}

function AboutShell({ view }: { view: AboutView }) {
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
      <PageHero
        flush
        title={<AccentSplit text={hero.title} accent={hero.titleAccent} />}
        lead={hero.lead}
      />

      {carousel.length > 0 && (
        <section className={cx(section({ ground: 'dark', rhythm: 'none' }), styles.plates)}>
          <GalleryCarousel
            slides={carousel}
            eyebrow={carouselEyebrow}
            treatment="mono"
            size="large"
          />
        </section>
      )}

      <Manifesto flush ground="dark" size="title" title={manifestoTitle} body={manifestoBody} />

      <section className={cx(section({ ground: 'dark', rhythm: 'none' }), styles.supports)}>
        <Container>
          <PillarGrid
            items={pillars.map((pillar) => ({ title: pillar.label, body: pillar.body }))}
            rhythm="pair"
            titleTone="highlight"
          />
        </Container>
      </section>

      <figure className={styles.plateFrame}>
        <Figure image={placeImage} sizes="100vw" className={styles.plateImg} />
        {placeImage?.alt && (
          <Text as="figcaption" variant="caption" color="heading" className={styles.plateCredit}>
            {placeImage.alt}
          </Text>
        )}
      </figure>

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
