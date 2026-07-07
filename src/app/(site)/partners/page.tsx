import { RiArrowRightLine } from '@remixicon/react'
import { notFound } from 'next/navigation'
import { css, cx } from 'styled-system/css'
import { button, section } from 'styled-system/recipes'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { EditionsNav } from '@/components/EditionsNav/EditionsNav'
import { Figure } from '@/components/Figure/Figure'
import { Navigation } from '@/components/Navigation/Navigation'
import { PageHero } from '@/components/PageHero/PageHero'
import { PartnerBadge } from '@/components/PartnerBadge/PartnerBadge'
import { Eyebrow } from '@/components/ui/Eyebrow/Eyebrow'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { makePageMetadata } from '@/lib/seo'
import { type DynamicFetchOptions } from '@/sanity/lib/live'
import { getSiteSettings } from '@/sanity/lib/settings'
import { getPartnersPage, type PartnersView } from '@/sanity/lib/staticPages'
import { partnersPage } from './page.recipe'

const styles = partnersPage()

export const generateMetadata = makePageMetadata(getPartnersPage, {
  title: 'Partners',
  path: '/partners',
})

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export default function PartnersRoute() {
  return (
    <>
      <DraftAware cached={(options) => <CachedPartners options={options} />} fallback={null} />
      <EditionsNav />
    </>
  )
}

async function CachedPartners({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const [page, settings] = await Promise.all([getPartnersPage(options), getSiteSettings(options)])
  if (!page) notFound()
  return <PartnersShell view={page} contactEmail={settings?.contactEmail ?? null} />
}

function PartnersShell({
  view,
  contactEmail,
}: {
  view: PartnersView
  contactEmail?: string | null
}) {
  const {
    hero,
    eventTitle,
    eventBody,
    eventImage,
    whyEyebrow,
    whyTitle,
    whyImage,
    whyPoints,
    ctaHeading,
    ctaHeadingAccent,
    ctaBody,
    ctaLabel,
  } = view
  const ctaHref = `mailto:${contactEmail ?? ''}`

  return (
    <>
      <Navigation activeId={null} />
      <main>
        <PageHero
          flush
          title={<AccentSplit text={hero.title} accent={hero.titleAccent} />}
          lead={hero.lead}
        />

        <section className={section({ ground: 'dark' })}>
          <div className={styles.inner}>
            <SectionHeading>{eventTitle}</SectionHeading>
            <div className={styles.eventBody}>
              {eventBody.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
            <figure className={styles.eventImage}>
              <Figure image={eventImage} sizes="100vw" className={styles.eventImageImg} />
            </figure>
          </div>
        </section>

        <section className={section({ ground: 'light' })}>
          <div className={styles.inner}>
            <div className={styles.whySculptureTop}>
              <div>
                <Eyebrow rule className={css({ marginBottom: '32px' })}>
                  {whyEyebrow}
                </Eyebrow>
                <SectionHeading flush className={css({ maxWidth: '700px' })}>
                  {whyTitle}
                </SectionHeading>
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
                <article key={point.title} className={styles.whyPillar}>
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

        <section className={cx(section({ ground: 'dark' }), styles.partnerCta)}>
          <div className={styles.partnerCtaInner}>
            <div className={styles.partnerCtaBadge}>
              <PartnerBadge />
            </div>
            <h2 className={styles.partnerCtaHeading}>
              <AccentSplit
                text={ctaHeading}
                accent={ctaHeadingAccent}
                className={styles.partnerCtaAccent}
                lineBreak
              />
            </h2>
            <p className={styles.partnerCtaBody}>{ctaBody}</p>
            <a
              href={ctaHref}
              className={button({ variant: 'primary', size: 'lg' })}
              {...(ctaHref.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
            >
              {ctaLabel} <RiArrowRightLine size={14} />
            </a>
          </div>
        </section>
      </main>
    </>
  )
}
