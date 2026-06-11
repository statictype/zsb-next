import { RiArrowRightLine } from '@remixicon/react'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { Figure } from '@/components/Figure/Figure'
import { MagneticButton } from '@/components/MagneticButton/MagneticButton'
import { Navigation } from '@/components/Navigation/Navigation'
import { PartnerBadge } from '@/components/PartnerBadge/PartnerBadge'
import shared from '@/components/Shared.module.css'
import { makePageMetadata } from '@/lib/seo'
import { type DynamicFetchOptions } from '@/sanity/lib/live'
import { getSiteSettings } from '@/sanity/lib/settings'
import { getPartnersPage, type PartnersPage } from '@/sanity/lib/staticPages'
import styles from './page.module.css'

export const generateMetadata = makePageMetadata(getPartnersPage, {
  title: 'Partners',
  path: '/partners',
})

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export default function PartnersRoute() {
  return (
    <DraftAware
      cached={(options) => <CachedPartners options={options} />}
      fallback={<PartnersShell />}
    />
  )
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
  const heroTitle = page?.hero?.title ?? ''
  const heroAccent = page?.hero?.titleAccent ?? ''
  const heroLead = page?.hero?.lead ?? ''
  const eventTitle = page?.eventTitle ?? ''
  const eventBody = page?.eventBody ?? []
  const eventImage = page?.eventImage
  const whyEyebrow = page?.whyEyebrow ?? ''
  const whyTitle = page?.whyTitle ?? ''
  const whyImage = page?.whyImage
  const whyPoints = page?.whyPoints ?? []
  const ctaHeading = page?.ctaHeading ?? ''
  const ctaAccent = page?.ctaHeadingAccent ?? ''
  const ctaBody = page?.ctaBody ?? ''
  const ctaLabel = page?.ctaLabel ?? ''
  const ctaHref = `mailto:${contactEmail ?? ''}`

  return (
    <>
      <Navigation activeId={null} />
      <main>
        <section className={shared.pageHero}>
          <div className={shared.sectionInner}>
            <h1 className={shared.pageTitle}>
              <AccentSplit text={heroTitle} accent={heroAccent} />
            </h1>
            <p className={shared.lead}>{heroLead}</p>
          </div>
        </section>

        <section className={`${shared.sectionDark} ${styles.eventSection}`}>
          <div className={shared.sectionInner}>
            <h2 className={shared.sectionTitle}>{eventTitle}</h2>
            <div className={styles.eventBody}>
              {eventBody.map((para, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: positional
                <p key={i}>{para}</p>
              ))}
            </div>
            <figure className={styles.eventImage}>
              <Figure image={eventImage} sizes="100vw" className={styles.eventImageImg} />
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
                <Figure
                  image={whyImage}
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
              <AccentSplit
                text={ctaHeading}
                accent={ctaAccent}
                className={styles.partnerCtaAccent}
                lineBreak
              />
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
