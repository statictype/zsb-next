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
          <h1 className={shared.pageTitle}>
            About <span className={shared.accent}>ZSB</span>
          </h1>
          <p className={shared.lead}>
            An annual platform dedicated to contemporary sculpture — born online in 2021, now
            occupying the city each year with exhibitions, film, critical debate, and education.
          </p>
        </div>
      </section>

      {/* ---- 2. The project ---- */}
      <section className={`${shared.section} ${shared.sectionDark} ${styles.projectSection}`}>
        <div className={shared.sectionInner}>
          <h2 className={shared.sectionTitle}>The project</h2>
          <div className={styles.projectBody}>
            <p>
              ZSB is an ecosystem — contemporary sculpture, film, critical debate, and education —
              not just an exhibition. Each edition adapts and grows without losing its focus:
              sculpture as a critical, present-day practice that connects us with our history and
              gives Romanian sculptors the recognition their work deserves.
            </p>
          </div>
        </div>
      </section>

      {/* ---- 3. Mission ---- */}
      <section className={`${shared.section} ${shared.sectionLight}`}>
        <div className={shared.sectionInner}>
          <div className={shared.eyebrowMuted}>Our Purpose</div>
          <h2 className={`${shared.sectionTitle} ${shared.sectionTitleLight}`}>
            Mission &amp; Vision
          </h2>

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

      {/* ---- 4. Curator ---- */}
      <section className={styles.statement}>
        <div className={styles.statementInner}>
          <div className={styles.themeHeader}>
            <h2 className={styles.headline}>A word from the curator</h2>
          </div>

          <div className={styles.statementContent}>
            <div className={styles.statementBody}>
              <p>
                ZSB began taking shape in 2016, when a group of us from Combinatul Fondului Plastic
                founded the Combinart 1+1=10 association to champion the power and versatility of
                the sculpture profession — starting with film screenings and the first
                &ldquo;Sculptors for the Future&rdquo; competition.
              </p>
              <p>
                Ten years on, at the sixth edition, large-scale events that highlight Romanian
                sculpture matter more than ever. The profession is aging, and young sculptors
                struggle to reach their peak for lack of studios and resources.
              </p>
              <p>
                Our goal is to lay the foundations of a Romanian Sculpture Center — working
                studios, transposition workshops, project-writing support, and a platform where
                the profession can consolidate and grow. In the Brâncuși Year, 150 years after his
                birth, let us draw from the support he received at the start of his journey and
                build the future of Romanian sculpture.
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
    </main>
  )
}
