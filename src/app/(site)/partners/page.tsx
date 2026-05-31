import { RiArrowRightLine } from '@remixicon/react'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import { Suspense } from 'react'
import { MagneticButton } from '@/components/MagneticButton/MagneticButton'
import { Navigation } from '@/components/Navigation/Navigation'
import { PartnerBadge } from '@/components/PartnerBadge/PartnerBadge'
import shared from '@/components/Shared.module.css'
import { whySculpturePoints } from '@/data/partners'
import { blobUrl } from '@/lib/blob'
import { pageMetadata } from '@/lib/seo'
import { urlFor } from '@/sanity/lib/image'
import { type DynamicFetchOptions, getDynamicFetchOptions } from '@/sanity/lib/live'
import { getSiteSettings } from '@/sanity/lib/settings'
import { getPartnersPage, type PartnersPage } from '@/sanity/lib/staticPages'
import styles from './page.module.css'

export const metadata = pageMetadata({
  title: 'Partners',
  description:
    'Partner with Bucharest Sculpture Days — Romania’s annual platform for contemporary sculpture.',
  path: '/partners',
})

const FALLBACK = {
  heroTitle: 'Partners',
  heroTitleAccent: 's',
  heroLead:
    'ZSB is built by a small team and sustained by the people and organisations who believe sculpture deserves a place. If that matters to you, there is room here.',
  eventTitle: 'The event',
  eventBody: [
    'Since 2021, ZSB has brought together Romanian contemporary sculpture and its public at Combinatul Fondului Plastic. Five editions, dozens of artists, hundreds of works, and thousands of visitors who encountered sculpture, often for the first time, without a ticket.',
  ],
  whyEyebrow: 'Why Sculpture',
  whyTitle: 'The most resilient art form',
  whyPoints: whySculpturePoints.map((p) => ({ title: p.title, text: p.text })),
  ctaHeading: 'BECOME A PARTNER',
  ctaHeadingAccent: 'PARTNER',
  ctaBody:
    "We work with institutional partners, cultural organisations, and businesses that want a genuine connection to contemporary art practice in Romania. If you're interested, write to us.",
  ctaLabel: 'Get in Touch',
}
const FALLBACK_EVENT_IMAGE = {
  src: blobUrl('2025/_dsc5708.jpg'),
  alt: 'Performance and audience at ZSB 2025, Combinatul Fondului Plastic',
}
const FALLBACK_WHY_IMAGE = {
  src: blobUrl('2023/od6-0211.jpg'),
  alt: 'Visitors examining a sculpture at ZSB 2023',
}
const FALLBACK_CONTACT_EMAIL = 'office@filialadesculptura.com'

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export default async function PartnersRoute() {
  const { isEnabled: isDraftMode } = await draftMode()
  if (isDraftMode) {
    return (
      <Suspense fallback={<PartnersShell />}>
        <DynamicPartners />
      </Suspense>
    )
  }
  return <CachedPartners options={{ perspective: 'published', stega: false }} />
}

async function DynamicPartners() {
  const options = await getDynamicFetchOptions()
  return <CachedPartners options={options} />
}

async function CachedPartners({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const [page, settings] = await Promise.all([getPartnersPage(options), getSiteSettings(options)])
  return <PartnersShell page={page} contactEmail={settings?.contactEmail ?? null} />
}

interface PartnersShellProps {
  page?: PartnersPage | null
  contactEmail?: string | null
}

function PartnersShell({ page, contactEmail }: PartnersShellProps = {}) {
  const heroTitle = page?.hero?.title ?? FALLBACK.heroTitle
  const heroAccent = page?.hero?.titleAccent ?? FALLBACK.heroTitleAccent
  const heroLead = page?.hero?.lead ?? FALLBACK.heroLead
  const eventTitle = page?.eventTitle ?? FALLBACK.eventTitle
  const eventBody = page?.eventBody ?? FALLBACK.eventBody
  const eventImage = page?.eventImage?.asset
    ? { src: urlFor(page.eventImage).url(), alt: page.eventImage.alt ?? '' }
    : FALLBACK_EVENT_IMAGE
  const whyEyebrow = page?.whyEyebrow ?? FALLBACK.whyEyebrow
  const whyTitle = page?.whyTitle ?? FALLBACK.whyTitle
  const whyImage = page?.whyImage?.asset
    ? { src: urlFor(page.whyImage).url(), alt: page.whyImage.alt ?? '' }
    : FALLBACK_WHY_IMAGE
  const whyPoints = page?.whyPoints ?? FALLBACK.whyPoints
  const ctaHeading = page?.ctaHeading ?? FALLBACK.ctaHeading
  const ctaAccent = page?.ctaHeadingAccent ?? FALLBACK.ctaHeadingAccent
  const ctaBody = page?.ctaBody ?? FALLBACK.ctaBody
  const ctaLabel = page?.ctaLabel ?? FALLBACK.ctaLabel
  const ctaHref = `mailto:${contactEmail ?? FALLBACK_CONTACT_EMAIL}`

  return (
    <>
      <Navigation activeId={null} />
      <main>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={shared.pageTitle}>
              <HeroTitle title={heroTitle} accent={heroAccent} />
            </h1>
            <p className={shared.lead}>{heroLead}</p>
          </div>
        </section>

        <section className={`${shared.section} ${shared.sectionDark} ${styles.eventSection}`}>
          <div className={shared.sectionInner}>
            <h2 className={shared.sectionTitle}>{eventTitle}</h2>
            <div className={styles.eventBody}>
              {eventBody.map((para, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: positional
                <p key={i}>{para}</p>
              ))}
            </div>
            <figure className={styles.eventImage}>
              <span aria-hidden className={shared.skeleton} />
              <Image
                src={eventImage.src}
                alt={eventImage.alt}
                fill
                sizes="100vw"
                className={styles.eventImageImg}
              />
            </figure>
          </div>
        </section>

        <section className={`${shared.section} ${shared.sectionLight}`}>
          <div className={shared.sectionInner}>
            <div className={styles.whySculptureTop}>
              <div>
                <div className={shared.eyebrowMuted}>{whyEyebrow}</div>
                <h2
                  className={`${shared.sectionTitle} ${shared.sectionTitleLight} ${styles.whySculptureTitle}`}
                >
                  {whyTitle}
                </h2>
              </div>
              <div className={styles.whySculptureImage}>
                <span aria-hidden className={shared.skeleton} />
                <Image
                  src={whyImage.src}
                  alt={whyImage.alt}
                  fill
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className={styles.whySculptureImg}
                />
              </div>
            </div>

            <div className={styles.whyGrid}>
              {whyPoints.map((point, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: positional
                <article key={i} className={styles.whyPillar}>
                  <div className={styles.whyPillarHead}>
                    <span className={styles.whyPillarNum}>{pad(i + 1)}</span>
                    <h3 className={styles.whyPillarTitle}>{point.title}</h3>
                  </div>
                  <p className={styles.whyPillarBody}>{point.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={`${shared.section} ${shared.sectionDark} ${styles.partnerCta}`}>
          <div className={styles.partnerCtaInner}>
            <div className={styles.partnerCtaBadge}>
              <PartnerBadge />
            </div>
            <h2 className={styles.partnerCtaHeading}>
              <CtaHeading heading={ctaHeading} accent={ctaAccent} />
            </h2>
            <p className={styles.partnerCtaBody}>{ctaBody}</p>
            <MagneticButton href={ctaHref}>
              {ctaLabel} <RiArrowRightLine size={14} />
            </MagneticButton>
          </div>
        </section>
      </main>
    </>
  )
}

function HeroTitle({ title, accent }: { title: string; accent: string }) {
  const idx = title.indexOf(accent)
  if (idx === -1) return <>{title}</>
  const before = title.slice(0, idx)
  return (
    <>
      {before}
      <span className={shared.accent}>{accent}</span>
    </>
  )
}

// Same shape as HeroTitle but the CTA heading wraps the accent in its
// own styled span and inserts an explicit line break before it.
function CtaHeading({ heading, accent }: { heading: string; accent: string }) {
  const idx = heading.indexOf(accent)
  if (idx === -1) return <>{heading}</>
  const before = heading.slice(0, idx).trimEnd()
  return (
    <>
      {before}
      {before && <br />}
      <span className={styles.partnerCtaAccent}>{accent}</span>
    </>
  )
}
