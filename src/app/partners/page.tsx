import { RiArrowRightLine } from '@remixicon/react'
import Image from 'next/image'
import { MagneticButton } from '@/components/MagneticButton/MagneticButton'
import { Navigation } from '@/components/Navigation/Navigation'
import { PartnerBadge } from '@/components/PartnerBadge/PartnerBadge'
import shared from '@/components/Shared.module.css'
import { ALL_ARTISTS } from '@/data/artists'
import { whySculpturePoints } from '@/data/partners'
import { blobUrl } from '@/lib/blob'
import { pageMetadata } from '@/lib/seo'
import styles from './page.module.css'

export const metadata = pageMetadata({
  title: 'Partners',
  description:
    'Partner with Bucharest Sculpture Days — Romania’s annual platform for contemporary sculpture.',
  path: '/partners',
})

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export default function PartnersPage() {
  const artistCount = ALL_ARTISTS.length
  return (
    <>
      <Navigation activeId={null} />
      <main>
        {/* ---- 1. Hero ---- */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <h1 className={shared.pageTitle}>
              Partner
              <span className={shared.accent}>s</span>
            </h1>
            <p className={shared.lead}>
              ZSB is built by a small team and sustained by the people and organisations who believe
              sculpture deserves a place. If that matters to you, there is room here.
            </p>
          </div>
        </section>

        {/* ---- 2. The event ---- */}
        <section className={`${shared.section} ${shared.sectionDark} ${styles.eventSection}`}>
          <div className={shared.sectionInner}>
            <h2 className={shared.sectionTitle}>The event</h2>
            <div className={styles.eventBody}>
              <p>
                Since 2021, ZSB has brought together Romanian contemporary sculpture and its public
                at Combinatul Fondului Plastic. Five editions, {artistCount} artists, 230 works, and
                over 8,000 visitors who encountered sculpture, often for the first time, without a
                ticket.
              </p>
            </div>
            <figure className={styles.eventImage}>
              <span aria-hidden className={shared.skeleton} />
              <Image
                src={blobUrl('2025/_dsc5708.jpg')}
                alt="Performance and audience at ZSB 2025, Combinatul Fondului Plastic"
                fill
                sizes="100vw"
                className={styles.eventImageImg}
              />
            </figure>
          </div>
        </section>

        {/* ---- 3. Why Sculpture ---- */}
        <section className={`${shared.section} ${shared.sectionLight}`}>
          <div className={shared.sectionInner}>
            <div className={styles.whySculptureTop}>
              <div>
                <div className={shared.eyebrowMuted}>Why Sculpture</div>
                <h2
                  className={`${shared.sectionTitle} ${shared.sectionTitleLight} ${styles.whySculptureTitle}`}
                >
                  The most resilient
                  <br />
                  art form
                </h2>
              </div>
              <div className={styles.whySculptureImage}>
                <span aria-hidden className={shared.skeleton} />
                <Image
                  src={blobUrl('2023/od6-0211.jpg')}
                  alt="Visitors examining a sculpture at ZSB 2023"
                  fill
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className={styles.whySculptureImg}
                />
              </div>
            </div>

            <div className={styles.whyGrid}>
              {whySculpturePoints.map((point, i) => (
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

        {/* ---- 4. Become a partner ---- */}
        <section className={`${shared.section} ${shared.sectionDark} ${styles.partnerCta}`}>
          <div className={styles.partnerCtaInner}>
            <div className={styles.partnerCtaBadge}>
              <PartnerBadge />
            </div>
            <h2 className={styles.partnerCtaHeading}>
              BECOME A
              <br />
              <span className={styles.partnerCtaAccent}>PARTNER</span>
            </h2>
            <p className={styles.partnerCtaBody}>
              We work with institutional partners, cultural organisations, and businesses that want
              a genuine connection to contemporary art practice in Romania. If you&apos;re
              interested, write to us.
            </p>
            <MagneticButton href="mailto:office@filialadesculptura.com">
              Get in Touch <RiArrowRightLine size={14} />
            </MagneticButton>
          </div>
        </section>
      </main>
    </>
  )
}
