import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { Figure } from '@/components/Figure/Figure'
import shared from '@/components/Shared.module.css'
import { makePageMetadata } from '@/lib/seo'
import { imageDataOrPlaceholder } from '@/sanity/lib/image'
import { type DynamicFetchOptions } from '@/sanity/lib/live'
import { type AboutPage, getAboutPage } from '@/sanity/lib/staticPages'
import styles from './page.module.css'

export const generateMetadata = makePageMetadata(getAboutPage, {
  title: 'About',
  path: '/about',
})

export default function AboutRoute() {
  return (
    <DraftAware cached={(options) => <CachedAbout options={options} />} fallback={<AboutShell />} />
  )
}

async function CachedAbout({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const about = await getAboutPage(options)
  return <AboutShell about={about} />
}

function AboutShell({ about }: { about?: AboutPage | null } = {}) {
  const heroTitle = about?.hero?.title ?? ''
  const heroAccent = about?.hero?.titleAccent ?? ''
  const heroLead = about?.hero?.lead ?? ''
  const notFestivalTitle = about?.notFestivalTitle ?? ''
  const notFestivalBody = about?.notFestivalBody ?? []
  const pillars = about?.pillars ?? []
  const placeImage = imageDataOrPlaceholder(about?.placeImage)
  const curatorEyebrow = about?.curatorEyebrow ?? ''
  const curatorHeadline = about?.curatorHeadline ?? ''
  const curatorName = about?.curatorName ?? ''
  const curatorRole = about?.curatorRole ?? ''
  const curatorLetter = about?.curatorLetter ?? []
  const curatorPortrait = imageDataOrPlaceholder(about?.curatorPortrait)

  return (
    <main>
      <section className={shared.pageHero}>
        <div className={shared.sectionInner}>
          <h1 className={shared.pageTitle}>
            <AccentSplit text={heroTitle} accent={heroAccent} />
          </h1>
          <p className={shared.lead}>{heroLead}</p>
        </div>
      </section>
      <figure className={styles.placeImage}>
        <Figure image={placeImage} sizes="100vw" className={styles.placeImageImg} />
      </figure>
      <section className={`${shared.sectionLight} ${styles.projectSection}`}>
        <div className={shared.sectionInner}>
          <div className={styles.projectGrid}>
            <aside className={styles.projectAside}>
              <h2 className={`${styles.projectTitle}`}>{notFestivalTitle}</h2>
            </aside>

            <div className={styles.projectMain}>
              {notFestivalBody.map((para, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: positional
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`${shared.sectionDark} ${styles.pillarsSection}`}>
        <div className={shared.sectionInner}>
          <div className={styles.pillarsGrid}>
            {pillars.map((p, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: positional
              <article key={i} className={styles.pillar}>
                <div className={styles.pillarHead}>
                  <h2 className={styles.pillarTitle}>{p.label}</h2>
                </div>
                <p className={styles.pillarBody}>{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.statement}>
        <div className={styles.statementInner}>
          <aside className={styles.statementAside}>
            <div className={shared.eyebrowMuted}>{curatorEyebrow}</div>

            <h2
              className={`${shared.sectionTitle} ${shared.sectionTitleLight} ${styles.statementHeadline}`}
            >
              {curatorHeadline}
            </h2>

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
              {curatorLetter.map((para, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: positional
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
