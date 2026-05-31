import { draftMode } from 'next/headers'
import Image from 'next/image'
import { Suspense } from 'react'
import shared from '@/components/Shared.module.css'
import { blobUrl } from '@/lib/blob'
import { pageMetadata } from '@/lib/seo'
import { urlFor } from '@/sanity/lib/image'
import { type DynamicFetchOptions, getDynamicFetchOptions } from '@/sanity/lib/live'
import { type AboutPage, getAboutPage } from '@/sanity/lib/staticPages'
import styles from './page.module.css'

export const metadata = pageMetadata({
  title: 'About',
  description:
    'Bucharest Sculpture Days — an annual platform for Romanian contemporary sculpture, born online in 2021.',
  path: '/about',
})

const FALLBACK_PILLARS = [
  {
    label: 'Why now?',
    body: 'The profession is ageing. Young sculptors have no studios, no visibility, no entry point. If we do not build the structures to support them now, we lose a generation. ZSB is part of that building.',
  },
  {
    label: 'Why Bucharest?',
    body: 'ZSB found its home at Combinatul Fondului Plastic, a rare complex of working studios and foundries in the heart of Bucharest. A space that proves there is still room for sculpture to be made, shown, and argued over at full scale.',
  },
] as const

const FALLBACK = {
  heroTitle: 'About ZSB',
  heroTitleAccent: 'ZSB',
  heroLead:
    'An annual platform for Romanian contemporary sculpture. Born online in 2021, built each year through exhibitions, film, critical debate, and education.',
  notFestivalTitle: 'Not a festival',
  notFestivalBody: [
    'We are not running a festival. We are, year by year, building the infrastructure through which Romanian sculpture can survive, be seen, and matter.',
    'ZSB exists to position contemporary sculpture as a critical practice of the present, to support the visibility and professional recognition of Romanian sculptors, and to build a living archive of Romanian contemporary sculpture in Bucharest.',
    'Each edition creates a public context where sculpture meets film, debate, and education.',
  ],
  curatorEyebrow: 'A word from the curator',
  curatorHeadline: 'Why we keep going',
  curatorName: 'Reka Csapo Dup',
  curatorRole: 'Curator, ZSB',
  curatorLetter: [
    'Bucharest Sculpture Days began to take shape gradually from 2016, when, together with several fellow sculptors from Combinatul Fondului Plastic, we founded the Combinart 1+1=10 association to realise cultural projects that would highlight the power and versatility of the sculpture profession.',
    'Our first major event was organised in 2016, in which we screened films about and with sculpture and organised the first edition of the "Sculptors for the Future" competition. The members of the association, which dissolved in 2018, continue to be active largely in the leadership of the Bucharest Sculpture Branch of the Union of Visual Artists.',
    'In 2026, at the sixth edition, it is even more important to continue with large-scale events to highlight Romanian sculpture. Over time, the profession has begun to age, and young sculptors find it harder to reach their peak due to a lack of studio space and financial constraints.',
    'Our goal is to lay the foundations for a Romanian Sculpture Centre where we can offer both working studios and transposition workshops, material resources through project-writing teams, and a platform for the profession to consolidate and grow.',
    'In the Brâncuși Year, 150 years after the birth of Constantin Brâncuși, let us draw inspiration from the support the great sculptor received from Romanian society at the beginning of his journey, and let us begin to build the future of Romanian sculpture.',
  ],
}

const FALLBACK_PLACE_IMAGE = {
  src: blobUrl('2023/od6-0441.jpg'),
  alt: 'Combinatul Fondului Plastic, Bucharest — facade at night',
}
const FALLBACK_CURATOR_IMAGE = { src: '/img/s200_csapo_reka.dup.jpg', alt: 'Reka Csapo Dup' }

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export default async function AboutRoute() {
  const { isEnabled: isDraftMode } = await draftMode()
  if (isDraftMode) {
    return (
      <Suspense fallback={<AboutShell />}>
        <DynamicAbout />
      </Suspense>
    )
  }
  return <CachedAbout options={{ perspective: 'published', stega: false }} />
}

async function DynamicAbout() {
  const options = await getDynamicFetchOptions()
  return <CachedAbout options={options} />
}

async function CachedAbout({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const about = await getAboutPage(options)
  return <AboutShell about={about} />
}

function AboutShell({ about }: { about?: AboutPage | null } = {}) {
  const heroTitle = about?.hero?.title ?? FALLBACK.heroTitle
  const heroAccent = about?.hero?.titleAccent ?? FALLBACK.heroTitleAccent
  const heroLead = about?.hero?.lead ?? FALLBACK.heroLead
  const notFestivalTitle = about?.notFestivalTitle ?? FALLBACK.notFestivalTitle
  const notFestivalBody = about?.notFestivalBody ?? FALLBACK.notFestivalBody
  const pillars = about?.pillars ?? FALLBACK_PILLARS
  const placeImage = about?.placeImage?.asset
    ? { src: urlFor(about.placeImage).url(), alt: about.placeImage.alt ?? '' }
    : FALLBACK_PLACE_IMAGE
  const curatorEyebrow = about?.curatorEyebrow ?? FALLBACK.curatorEyebrow
  const curatorHeadline = about?.curatorHeadline ?? FALLBACK.curatorHeadline
  const curatorName = about?.curatorName ?? FALLBACK.curatorName
  const curatorRole = about?.curatorRole ?? FALLBACK.curatorRole
  const curatorLetter = about?.curatorLetter ?? FALLBACK.curatorLetter
  const curatorPortrait = about?.curatorPortrait?.asset
    ? { src: urlFor(about.curatorPortrait).url(), alt: about.curatorPortrait.alt ?? '' }
    : FALLBACK_CURATOR_IMAGE

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={shared.pageTitle}>
            <HeroTitle title={heroTitle} accent={heroAccent} />
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
            <span aria-hidden className={shared.skeleton} />
            <Image
              src={placeImage.src}
              alt={placeImage.alt}
              fill
              sizes="100vw"
              className={styles.placeImageImg}
            />
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
                  <span aria-hidden className={shared.skeleton} />
                  <Image
                    src={curatorPortrait.src}
                    alt={curatorPortrait.alt}
                    fill
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

function HeroTitle({ title, accent }: { title: string; accent: string }) {
  const idx = title.indexOf(accent)
  if (idx === -1) return <>{title}</>
  const before = title.slice(0, idx).trimEnd()
  return (
    <>
      {before && <>{before} </>}
      <span className={shared.accent}>{accent}</span>
    </>
  )
}
