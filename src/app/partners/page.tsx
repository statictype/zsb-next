import { RiArrowRightLine } from '@remixicon/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import shared from '@/components/Shared.module.css'
import { ZSB_STATS } from '@/data/stats'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Partners',
  description:
    "Partner with Bucharest Sculpture Days — one of Eastern Europe's most significant contemporary sculpture events.",
  alternates: { canonical: '/partners' },
}

const audienceProfiles = [
  {
    title: 'Art Professionals & Collectors',
    desc: 'Curators, gallery directors, museum professionals, and private collectors who follow ZSB as a key indicator of sculptural trends in the region.',
  },
  {
    title: 'Cultural Institutions',
    desc: 'Embassies, cultural centres, foundations, and municipal organizations that collaborate with ZSB on programming, venues, and outreach.',
  },
  {
    title: 'Media & Press',
    desc: 'National and international arts media, cultural journalists, photographers, and documentary filmmakers who cover the event annually.',
  },
  {
    title: 'General Public',
    desc: 'Design-minded urbanites, students, families, and tourists who encounter sculpture in public space — often for the first time — through ZSB events.',
  },
]

const benefits = [
  {
    type: 'Brand',
    title: 'Visibility & Brand Alignment',
    text: "Your brand appears alongside some of Eastern Europe's most compelling contemporary art. ZSB's visual identity, editorial quality, and cultural seriousness reflect directly on every partner.",
  },
  {
    type: 'Legacy',
    title: 'Cultural Impact',
    text: "Supporting ZSB means supporting the preservation and evolution of sculptural practice — one of humanity's oldest art forms. Your contribution has tangible, lasting cultural value.",
  },
  {
    type: 'Network',
    title: 'Exclusive Access & Networking',
    text: 'Partners receive invitations to private viewings, studio visits, opening events, and direct access to a network of artists, curators, and cultural leaders across Romania and beyond.',
  },
  {
    type: 'Identity',
    title: 'Association with Innovation',
    text: 'ZSB pushes boundaries — thematically, spatially, materially. Partners align themselves with an organization that values experimentation and refuses to treat art as decoration.',
  },
]

const allocations = [
  {
    title: 'Artist Fees & Production',
    text: 'Fair pay for artists whose transport costs alone can exceed their fees. Bolder proposals start with sustainable funding.',
  },
  {
    title: 'Graphic Design',
    text: 'Catalogues, posters, wayfinding, digital assets — all designed pro bono for five years.',
  },
  {
    title: 'PR & Communications',
    text: 'Press, photography, social content — the work that makes ZSB visible beyond Bucharest.',
  },
  {
    title: 'Web & Archive',
    text: 'A permanent, searchable record of contemporary Romanian sculpture. Built without budget since 2021.',
  },
  {
    title: 'Venue & Logistics',
    text: 'Exhibition spaces, insurance, lighting, installation — the invisible infrastructure behind every edition.',
  },
  {
    title: 'Curatorial Program',
    text: 'Research, artist selection, thematic development — the intellectual framework that gives each edition its identity.',
  },
]

export default function PartnersPage() {
  return (
    <main>
      {/* ---- 1. Hero ---- */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <header className={styles.heroHeader}>
            <h1 className={styles.pageTitle}>
              Partner
              <span className={shared.pageTitleHighlight}>s</span>
            </h1>
          </header>

          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <p className={shared.heroLead}>
                Bucharest Sculpture Days is one of Eastern Europe&apos;s most
                significant contemporary sculpture events. Each edition
                transforms the city into an open-air museum, bringing together
                artists, curators, and audiences around the enduring power of
                three-dimensional art.
              </p>
              <div className={shared.heroBody}>
                <p>
                  Since 2021, ZSB has grown from an online inaugural edition
                  into an event that draws thousands of visitors, media
                  attention, and institutional interest. We work at the
                  intersection of public space, cultural heritage, and
                  contemporary practice — making sculpture accessible, relevant,
                  and unmissable.
                </p>
                <p>
                  Our partners are integral to this mission. They don&apos;t
                  sponsor a product — they support a movement. One that values
                  material intelligence, physical presence, and the
                  irreplaceable experience of encountering art in shared space.
                </p>
              </div>
            </div>
            <div className={styles.heroImage}>
              <Image
                src="/img/2025/optimized/_DSC5665"
                alt="ZSB 2025 — performance and audience in the exhibition space"
                fill
                preload
                sizes="(max-width: 1023px) 100vw, 50vw"
                className={styles.heroImageImg}
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
              <h2
                className={`${styles.sectionTitle} ${styles.whySculptureTitle}`}
              >
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
            {[
              {
                title: 'Permanence of Material',
                text: "Bronze, stone, steel, ceramic — sculpture is made from the materials of civilization itself. It doesn't fade, doesn't buffer, doesn't need a screen. It outlasts the artist, the gallery, the century.",
              },
              {
                title: 'Resistance to Reproduction',
                text: 'A sculpture cannot be fully experienced through a photograph or a screen. Its mass, its shadow, the way it occupies and transforms space — these resist digital replication in ways that flat images cannot.',
              },
              {
                title: 'Physical Presence',
                text: 'In an era of AI-generated imagery and virtual experiences, sculpture demands your body to be present. You walk around it, look up at it, touch it. This physicality is increasingly rare and increasingly valuable.',
              },
              {
                title: 'The Social Dimension',
                text: 'Public sculpture creates gathering points, conversation, civic identity. It turns a space into a place. ZSB amplifies this — bringing art out of galleries and into the city where it belongs.',
              },
            ].map((point) => (
              <div key={point.title} className={styles.whySculpturePoint}>
                <div className={styles.whySculpturePointTitle}>
                  {point.title}
                </div>
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
              <h2 className={styles.sectionTitle}>
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
                <div className={styles.audienceProfileTitle}>
                  {profile.title}
                </div>
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
          <h2 className={`${styles.sectionTitle} ${styles.partnershipTitle}`}>
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
                  <div className={styles.partnershipBenefitTitle}>
                    {b.title}
                  </div>
                  <p className={styles.partnershipBenefitText}>{b.text}</p>
                </div>
              ))}
            </div>

            <div>
              <div className={styles.partnershipColHeader}>
                <span className={styles.partnershipColEyebrow}>
                  Transparency
                </span>
                <h3 className={styles.partnershipColTitle}>
                  Where the money goes
                </h3>
              </div>
              <p className={styles.partnershipColLead}>
                For five editions, ZSB has been built on volunteer work —
                curators, designers, developers, PR. Artist fees don&apos;t
                cover the transport costs of their own works. Your support
                changes that.
              </p>
              <div className={styles.partnershipAllocations}>
                {allocations.map((a) => (
                  <div key={a.title} className={styles.partnershipAlloc}>
                    <div className={styles.partnershipAllocTitle}>
                      {a.title}
                    </div>
                    <p className={styles.partnershipAllocText}>{a.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 5. Contact CTA ---- */}
      <section
        className={`${shared.section} ${shared.sectionDark} ${styles.contactCta}`}
      >
        <div className={styles.contactCtaGhost}>PARTNER</div>
        <div className={styles.contactCtaImage}>
          <Image
            src="/img/2025/optimized/bws00842"
            alt="Visitors entering ZSB venue"
            fill
            sizes="100vw"
            className={styles.contactCtaImg}
          />
        </div>
        <div className={styles.contactCtaInner}>
          <div className={`${shared.eyebrowMuted} ${styles.contactCtaEyebrow}`}>
            Get in Touch
          </div>
          <h2 className={styles.contactCtaTitle}>Let&apos;s Talk</h2>
          <p className={styles.contactCtaEmail}>
            <a href="mailto:partners@sculpturedays.com">
              partners@sculpturedays.com
            </a>
          </p>
          <a
            href="mailto:partners@sculpturedays.com"
            className={`${shared.ctaBtn} ${shared.ctaBtnPink}`}
          >
            Become a Partner <RiArrowRightLine size={18} />
          </a>
        </div>
      </section>
    </main>
  )
}
