import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { Figure } from '@/components/Figure/Figure'
import shared from '@/components/Shared.module.css'
import { SITE_DESCRIPTION } from '@/lib/constants'
import { pageMetadata } from '@/lib/seo'
import { imageDataOrPlaceholder } from '@/sanity/lib/image'
import { type DynamicFetchOptions, getDynamicFetchOptions } from '@/sanity/lib/live'
import { type AboutPage, getAboutPage } from '@/sanity/lib/staticPages'
import styles from './page.module.css'

export async function generateMetadata() {
  const { perspective } = await getDynamicFetchOptions()
  const page = await getAboutPage({ perspective, stega: false })
  return pageMetadata({
    title: 'About',
    description: page?.metaDescription ?? SITE_DESCRIPTION,
    path: '/about',
    shareImage: page?.ogImage,
  })
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

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
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={shared.pageTitle}>
            <AccentSplit text={heroTitle} accent={heroAccent} />
          </h1>
          <p className={shared.lead}>{heroLead}</p>
        </div>
      </section>

      <section className={`${shared.section} ${shared.sectionDark} ${styles.projectSection}`}>
        <div className={shared.sectionInner}>
          <div className={styles.projectGrid}>
            <aside className={styles.projectAside}>
              <h2 className={`${shared.sectionTitle} ${styles.projectTitle}`}>
                {notFestivalTitle.split(' ').map((word, i, arr) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: positional
                  <span key={i}>
                    {word}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </h2>
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

      <section className={`${shared.section} ${shared.sectionDark} ${styles.pillarsSection}`}>
        <div className={shared.sectionInner}>
          <div className={styles.pillarsGrid}>
            {pillars.map((p, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: positional
              <article key={i} className={styles.pillar}>
                <div className={styles.pillarHead}>
                  <span className={styles.pillarNum}>{pad(i + 1)}</span>
                  <h2 className={styles.pillarTitle}>{p.label}</h2>
                </div>
                <p className={styles.pillarBody}>{p.body}</p>
              </article>
            ))}
          </div>

          <figure className={styles.placeImage}>
            <Figure image={placeImage} sizes="100vw" className={styles.placeImageImg} />
          </figure>
        </div>
      </section>

      <section className={styles.statement}>
        <div className={styles.statementInner}>
          <header className={styles.statementHead}>
            <div className={shared.eyebrowMuted}>{curatorEyebrow}</div>

            <div className={styles.statementMasthead}>
              <h2
                className={`${shared.sectionTitle} ${shared.sectionTitleLight} ${styles.statementHeadline}`}
              >
                {curatorHeadline}
              </h2>

              <figure className={styles.statementByline}>
                <div className={styles.authorPhoto}>
                  <Figure
                    image={curatorPortrait}
                    sizes="(max-width: 767px) 160px, 180px"
                    className={styles.authorPhotoImg}
                  />
                </div>
                <figcaption className={styles.authorCaption}>
                  <span className={styles.authorName}>{curatorName}</span>
                  <span className={styles.authorRole}>{curatorRole}</span>
                </figcaption>
              </figure>
            </div>
          </header>

          <div className={styles.statementBody}>
            {curatorLetter.map((para, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: positional
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
