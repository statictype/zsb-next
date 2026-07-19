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
import { Eyebrow } from '@/components/ui/Eyebrow/Eyebrow'
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
    curatorEyebrow,
    curatorHeadline,
    curatorName,
    curatorRole,
    curatorLetter,
    curatorPortrait,
  } = view

  return (
    <main>
      <PageHero
        title={<AccentSplit text={hero.title} accent={hero.titleAccent} />}
        lead={hero.lead}
      />
      <figure className={styles.placeImage}>
        <Figure image={placeImage} sizes="100vw" className={styles.placeImageImg} />
      </figure>
      <Manifesto title={manifestoTitle} body={manifestoBody} />

      {carousel && (
        <section className={section({ ground: 'dark' })}>
          <GalleryCarousel slides={carousel} eyebrow={carouselEyebrow} />
        </section>
      )}

      <section className={section({ ground: 'dark' })}>
        <Container>
          <PillarGrid
            items={pillars.map((pillar) => ({ title: pillar.label, body: pillar.body }))}
            titleTone="highlight"
          />
        </Container>
      </section>

      <section className={cx(section({ ground: 'light', rhythm: 'lg' }), styles.statement)}>
        <div className={styles.statementInner}>
          <Stack as="aside" className={styles.statementAside} gap="xl">
            <Eyebrow rule>{curatorEyebrow}</Eyebrow>

            <SectionHeading>{curatorHeadline}</SectionHeading>

            <Stack as="figure" className={styles.statementByline} gap="sm">
              <div className={styles.authorPhotoFrame}>
                <div className={styles.authorPhoto}>
                  <Figure
                    image={curatorPortrait}
                    sizes="(max-width: 1023px) 240px, 340px"
                    className={styles.authorPhotoImg}
                  />
                </div>
              </div>
              <Stack as="figcaption" gap="xs" className={styles.authorCaption}>
                <Text variant="heading">{curatorName}</Text>
                <Text variant="label">{curatorRole}</Text>
              </Stack>
            </Stack>
          </Stack>

          <div className={styles.statementLetter}>
            <Stack>
              {curatorLetter.map((para) => (
                <Text as="p" variant="lead" key={para}>
                  {para}
                </Text>
              ))}
            </Stack>
          </div>
        </div>
      </section>
    </main>
  )
}
