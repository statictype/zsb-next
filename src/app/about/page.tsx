import type { Metadata } from 'next'
import Image from 'next/image'
import { MasonryGallery } from '@/components/MasonryGallery/MasonryGallery'
import shared from '@/components/Shared.module.css'
import type { MasonryImage } from '@/types/edition'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Bucharest Sculpture Days — an annual platform dedicated to contemporary sculpture, born online in 2021.',
  alternates: { canonical: '/about' },
}

const MISSION = [
  'Promote sculpture globally',
  'Use art as a tool for education and social change',
  'Cultivate a strong community of sculptors',
] as const

const VISION = [
  'Inspire the public',
  'Support artists',
  'Bring sculpture to the forefront of cultural life',
] as const

const AUDIENCE = [
  'Artists',
  'Designers',
  'Teachers',
  'Students',
  'Entrepreneurs',
  'Curators',
] as const

const galleryImages: MasonryImage[] = [
  {
    basePath: '/img/2023/optimized/OD6-0349',
    alt: 'Visitors viewing sculptures in gallery at ZSB 2025',
    caption: 'ZSB 2025 Exhibition',
    cols: 2,
    rows: 5,
  },
  {
    basePath: '/img/2023/optimized/OD6-0202',
    alt: 'Visitors gathered around sculpture at ZSB 2025',
    caption: 'ZSB 2025 Exhibition',
    cols: 2,
    rows: 5,
  },
  {
    basePath: '/img/2025/optimized/BWS00764',
    alt: 'ZSB 2025 audience interaction',
    caption: 'ZSB 2025 Exhibition',
    cols: 1,
    rows: 3,
  },
  {
    basePath: '/img/2025/optimized/bws00842',
    alt: 'ZSB 2025 sculpture detail',
    caption: 'ZSB 2025 Exhibition',
    cols: 1,
    rows: 3,
  },
  {
    basePath: '/img/2025/optimized/bws01820',
    alt: 'ZSB 2025 exhibition space',
    caption: 'ZSB 2025 Exhibition',
    cols: 1,
    rows: 3,
  },
  {
    basePath: '/img/2025/optimized/BWS00744',
    alt: 'ZSB 2025 wide gallery view',
    caption: 'ZSB 2025 Exhibition',
    cols: 2,
    rows: 5,
  },
  {
    basePath: '/img/2023/optimized/OD6-0359',
    alt: 'ZSB 2025 sculpture work',
    caption: 'ZSB 2025 Exhibition',
    cols: 1,
    rows: 6,
  },
  {
    basePath: '/img/2023/optimized/OD6-0361',
    alt: 'ZSB 2023 tall sculpture view',
    caption: 'ZSB 2025 Exhibition',
    cols: 1,
    rows: 3,
  },
  {
    basePath: '/img/2025/optimized/BWS00864',
    alt: 'ZSB 2025 tall sculpture view',
    caption: 'ZSB 2025 Exhibition',
    cols: 1,
    rows: 3,
  },
  {
    basePath: '/img/2023/optimized/OD6-0221',
    alt: 'ZSB 2023 visitor experience',
    caption: 'ZSB 2025 Exhibition',
    cols: 1,
    rows: 7,
  },
  {
    basePath: '/img/2023/optimized/_DSF4145',
    alt: 'ZSB 2023 exhibition moment',
    caption: 'ZSB 2025 Exhibition',
    cols: 1,
    rows: 5,
  },
  {
    basePath: '/img/2024/optimized/night2',
    alt: 'ZSB 2024 exhibition moment',
    caption: 'ZSB 2025 Exhibition',
    cols: 1,
    rows: 5,
  },
  {
    basePath: '/img/2024/optimized/DSCF4014',
    alt: 'ZSB 2025 artwork',
    caption: 'ZSB 2024 Exhibition',
    cols: 1,
    rows: 4,
  },
]

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export default function AboutPage() {
  return (
    <main>
      {/* ---- 1. Hero ---- */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <header className={styles.heroHeader}>
            <h1 className={shared.pageTitle}>
              About <span className={shared.accent}>ZSB</span>
            </h1>
          </header>

          <div className={styles.heroContent}>
            <p className={shared.heroLead}>
              Bucharest Sculpture Days is an annual platform dedicated to contemporary sculpture.
              Born online in 2021, at a moment when physical space was temporarily suspended but
              artistic urgency was not, the event quickly transformed into a living format that
              occupies the city.
            </p>
            <div className={shared.heroBody}>
              <p>
                ZSB is not just an exhibition. It is an ecosystem that brings together contemporary
                sculpture, film, critical debate, and education. From the first digital format to
                occupying physical spaces in Bucharest, each edition adapts, shifts, and grows
                without losing its focus: sculpture as a critical and relevant practice in the
                present.
              </p>
              <p>
                Sculpture is a form of artistic expression that connects us with our history and
                identity. Through this event, we celebrate this art form and offer Romanian
                sculptors the recognition and valorization of their work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 2. Mission ---- */}
      <section className={`${shared.section} ${shared.sectionLight}`}>
        <div className={shared.sectionInner}>
          <div className={shared.eyebrowMuted}>Our Purpose</div>
          <h2 className={`${shared.sectionTitle} ${shared.sectionTitleLight}`}>Mission &amp; Vision</h2>

          <div className={styles.purposeList}>
            <div className={styles.purposeGroup}>
              <div className={styles.purposeItems}>
                {MISSION.map((item, i) => (
                  <div key={item} className={styles.purposeEntry}>
                    <span className={styles.purposeNum}>{pad(i + 1)}</span>
                    <span className={styles.purposeEntryText}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.purposeGroup}>
              <div className={styles.purposeItems}>
                {VISION.map((item, i) => (
                  <div key={item} className={styles.purposeEntry}>
                    <span className={styles.purposeNum}>{pad(i + 1)}</span>
                    <span className={styles.purposeEntryText}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Gallery ---- */}
      <section className={`${shared.section} ${shared.sectionDark}`}>
        <div className={shared.sectionInner}>
          <div className={styles.audienceStrip}>
            <div className={styles.stripHeader}>
              <div className={styles.stripLabel}>Our Audience</div>
              <p className={styles.stripDesc}>
                ZSB attracts a diverse audience from across the country — a platform where
                creativity, innovation, and cultural influence meet.
              </p>
            </div>
            <div className={styles.stripCells}>
              {AUDIENCE.map((tag) => (
                <span key={tag} className={styles.stripWord}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <MasonryGallery images={galleryImages} />
        </div>
      </section>

      {/* ---- 3. Curator ---- */}
      <section className={styles.statement}>
        <div className={styles.statementInner}>
          <div className={styles.themeHeader}>
            {/* <span className={styles.overline}>a word from</span> */}
            <h2 className={styles.headline}>A word from the curator</h2>
          </div>

          <div className={styles.statementContent}>
            <div className={styles.statementBody}>
              <p>
                Bucharest Sculpture Days began to take shape gradually from 2016, when, together
                with several fellow sculptors from Combinatul Fondului Plastic, we founded the
                Combinart 1+1=10 association to realize cultural projects that would highlight the
                power and versatility of the sculpture profession.
              </p>
              <p>
                Our first major event was organized in 2016, with the support of the Administration
                of Monuments and Tourist Heritage, where we screened films with and about sculpture
                and organized the first edition of the &ldquo;Sculptors for the Future&rdquo;
                competition. The members of the association, which dissolved in 2018, continue to be
                active largely in the leadership of the Bucharest Sculpture Branch of the Union of
                Visual Artists.
              </p>
              <p>
                After 10 years, in 2026, at the sixth edition of ZSB, it is even more important to
                continue with large-scale events through which to highlight Romanian sculpture. Over
                time, the profession has begun to age, and young sculptors find it harder to reach
                their peak due to a lack of studios and financial reasons.
              </p>
              <p>
                Our goal is to lay the foundations of a Romanian Sculpture Center where we can offer
                both working studios and transposition workshops, material resources through
                project-writing teams, and a platform where the profession can consolidate and grow.
              </p>
              <p>
                In the Brâncuși Year, 150 years after the birth of Constantin Brâncuși, let us draw
                inspiration from the support the great sculptor received from Romanian society at
                the beginning of his journey, and let us begin to build the future of Romanian
                sculpture.
              </p>
            </div>
            <div className={styles.authorCard}>
              <div className={styles.authorPhoto}>
                <Image
                  src="/img/s200_csapo_reka.dup.jpg"
                  alt="Reka Csapo Dup"
                  fill
                  sizes="88px"
                  className={styles.authorPhotoImg}
                />
              </div>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>Reka Csapo Dup</span>
                <span className={styles.authorRole}>Curator, ZSB</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 4. Organizer ---- */}
      <section className={`${styles.statement} ${styles.statementLight}`}>
        <div className={styles.statementInner}>
          <div className={styles.themeHeader}>
            {/* <span className={`${styles.overline} ${styles.overlineLight}`}>
              a word from
            </span> */}
            <h2 className={`${styles.headline} ${styles.headlineLight}`}>
              A word from the organizer
            </h2>
          </div>

          <div className={styles.statementContent}>
            <div className={`${styles.statementBody} ${styles.statementBodyLight}`}>
              <p className={styles.placeholderText}>Statement in preparation.</p>
            </div>

            <div className={styles.authorCard}>
              <div className={`${styles.authorPhoto} ${styles.authorPhotoLight}`}>
                <Image
                  src="/img/aurora_carstea.jpeg"
                  alt="Aurora Cârstea"
                  fill
                  sizes="88px"
                  className={styles.authorPhotoImg}
                />
              </div>
              <div className={styles.authorInfo}>
                <span className={`${styles.authorName} ${styles.authorNameLight}`}>
                  Aurora Cârstea
                </span>
                <span className={styles.authorRole}>Organizer, ZSB</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
