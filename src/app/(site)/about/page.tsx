import { notFound } from 'next/navigation'
import { css, cx } from 'styled-system/css'
import { section } from 'styled-system/recipes'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { GalleryCarousel } from '@/components/Carousel/GalleryCarousel'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { EditionsNav } from '@/components/EditionsNav/EditionsNav'
import { Figure } from '@/components/Figure/Figure'
import { Manifesto } from '@/components/Manifesto/Manifesto'
import { PageHero } from '@/components/PageHero/PageHero'
import { Eyebrow } from '@/components/ui/Eyebrow/Eyebrow'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { makePageMetadata } from '@/lib/seo'
import { type DynamicFetchOptions } from '@/sanity/lib/live'
import { type AboutView, getAboutPage } from '@/sanity/lib/staticPages'
import { aboutPage } from './page.recipe'

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
        <section className={cx(section({ ground: 'dark' }), styles.carouselSection)}>
          <GalleryCarousel slides={carousel} eyebrow={carouselEyebrow} />
        </section>
      )}

      <section className={section({ ground: 'dark' })}>
        <div className={styles.inner}>
          <div className={styles.pillarsGrid}>
            {pillars.map((p) => (
              <article key={p.label} className={styles.pillar}>
                <div className={styles.pillarHead}>
                  <h2 className={styles.pillarTitle}>{p.label}</h2>
                </div>
                <p className={styles.pillarBody}>{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={cx(section({ ground: 'light', rhythm: 'lg' }), styles.statement)}>
        <div className={styles.statementInner}>
          <aside className={styles.statementAside}>
            <Eyebrow rule className={css({ marginBottom: 'xl' })}>
              {curatorEyebrow}
            </Eyebrow>

            <SectionHeading>{curatorHeadline}</SectionHeading>

            <figure className={styles.statementByline}>
              <div className={styles.authorPhotoFrame}>
                <div className={styles.authorPhoto}>
                  <Figure
                    image={curatorPortrait}
                    sizes="(max-width: 1023px) 240px, 340px"
                    className={styles.authorPhotoImg}
                  />
                </div>
              </div>
              <figcaption className={styles.authorCaption}>
                <span className={styles.authorName}>{curatorName}</span>
                <span className={styles.authorRole}>{curatorRole}</span>
              </figcaption>
            </figure>
          </aside>

          <div className={styles.statementLetter}>
            <div className={styles.letterBody}>
              {curatorLetter.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
