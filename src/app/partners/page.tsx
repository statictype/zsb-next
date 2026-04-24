import { RiArrowRightLine } from '@remixicon/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { MagneticButton } from '@/components/MagneticButton/MagneticButton'
import { PartnerBadge } from '@/components/PartnerBadge/PartnerBadge'
import shared from '@/components/Shared.module.css'
import { allocations, audienceProfiles, benefits, whySculpturePoints } from '@/data/partners'
import { ZSB_STATS } from '@/data/stats'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Partners',
  description:
    "Partner with Bucharest Sculpture Days — one of Eastern Europe's most significant contemporary sculpture events.",
  alternates: { canonical: '/partners' },
}

export default function PartnersPage() {
  return (
    <main>
      {/* ---- 1. Hero ---- */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={shared.pageTitle}>
            Partner
            <span className={shared.accent}>s</span>
          </h1>
          <p className={shared.lead}>
            One of Eastern Europe&apos;s most significant contemporary sculpture events — turning
            Bucharest into an open-air museum each year.
          </p>
        </div>
      </section>

      {/* ---- 2. The event ---- */}
      <section className={`${shared.section} ${shared.sectionDark} ${styles.eventSection}`}>
        <div className={shared.sectionInner}>
          <h2 className={shared.sectionTitle}>The event</h2>
          <div className={styles.eventContent}>
            <div className={styles.eventBody}>
              <p>
                Since 2021, ZSB has grown from an online inaugural edition into a citywide event
                drawing thousands of visitors, media attention, and institutional interest. Our
                partners don&apos;t sponsor a product — they support a movement that values
                material intelligence, physical presence, and the irreplaceable experience of
                encountering art in shared space.
              </p>
            </div>
            <div className={styles.eventImage}>
              <Image
                src="/img/2025/optimized/_DSC5665"
                alt="ZSB 2025 — performance and audience in the exhibition space"
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                className={styles.eventImageImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---- 2. Why Sculpture ---- */}
      <section className={`${shared.section} ${shared.sectionLight}`}>
        <div className={shared.sectionInner}>
          <div className={styles.whySculptureTop}>
            <div>
              <div className={shared.eyebrowMuted}>Why Sculpture</div>
              <h2 className={`${shared.sectionTitle} ${shared.sectionTitleLight} ${styles.whySculptureTitle}`}>
                The most resilient
                <br />
                art form
              </h2>
            </div>
            <div className={styles.whySculptureImage}>
              <Image
                src="/img/2023/optimized/_DSF4076"
                alt="Visitors gathered around sculpture at ZSB 2023"
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                className={styles.whySculptureImg}
              />
            </div>
          </div>

          <div className={styles.whySculpturePoints}>
            {whySculpturePoints.map((point) => (
              <div key={point.title} className={styles.whySculpturePoint}>
                <div className={styles.whySculpturePointTitle}>{point.title}</div>
                <p className={styles.whySculpturePointText}>{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- 3. The Audience ---- */}
      <section className={`${shared.section} ${shared.sectionDark}`}>
        <div className={shared.sectionInner}>
          <div className={styles.audienceHeader}>
            <div>
              <div className={shared.eyebrowMuted}>The Audience</div>
              <h2 className={shared.sectionTitle}>
                Who engages
                <br />
                with ZSB
              </h2>
            </div>

            <div className={styles.audienceStats}>
              {ZSB_STATS.map((stat) => (
                <div key={stat.label} className={styles.audienceStat}>
                  <div className={styles.audienceStatNumber}>{stat.value}</div>
                  <div className={styles.audienceStatLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.audienceProfiles}>
            {audienceProfiles.map((profile) => (
              <div key={profile.title} className={styles.audienceProfile}>
                <div className={styles.audienceProfileTitle}>{profile.title}</div>
                <p className={styles.audienceProfileDesc}>{profile.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- 4. Partnership ---- */}
      <section className={`${shared.section} ${shared.sectionLight}`}>
        <div className={shared.sectionInner}>
          <div className={shared.eyebrowMuted}>Partnership</div>
          <h2 className={`${shared.sectionTitle} ${shared.sectionTitleLight} ${styles.partnershipTitle}`}>
            What partners gain
          </h2>

          <div className={styles.partnershipColumns}>
            <div>
              {benefits.map((b, i) => (
                <div
                  key={b.type}
                  className={`${styles.partnershipBenefit} ${i === 0 ? styles.partnershipBenefitFirst : ''}`}
                >
                  <div className={styles.partnershipBenefitType}>{b.type}</div>
                  <div className={styles.partnershipBenefitTitle}>{b.title}</div>
                  <p className={styles.partnershipBenefitText}>{b.text}</p>
                </div>
              ))}
            </div>

            <div>
              <div className={styles.partnershipColHeader}>
                <span className={styles.partnershipColEyebrow}>Transparency</span>
                <h3 className={styles.partnershipColTitle}>Where the money goes</h3>
              </div>
              <p className={styles.partnershipColLead}>
                For five editions, ZSB has been built on volunteer work — curators, designers,
                developers, PR. Artist fees don&apos;t cover the transport costs of their own works.
                Your support changes that.
              </p>
              <div className={styles.partnershipAllocations}>
                {allocations.map((a) => (
                  <div key={a.title} className={styles.partnershipAlloc}>
                    <div className={styles.partnershipAllocTitle}>{a.title}</div>
                    <p className={styles.partnershipAllocText}>{a.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 5. Partner CTA ---- */}
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
            Join the institutions and individuals who make two weeks of sculpture possible. Support
            the project, shape the future of contemporary art in Romania.
          </p>
          <MagneticButton href="mailto:partners@sculpturedays.com">
            Get In Touch <RiArrowRightLine size={14} />
          </MagneticButton>
        </div>
      </section>
    </main>
  )
}
