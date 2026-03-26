import { RiArrowRightLine } from '@remixicon/react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MagneticButton } from '@/components/MagneticButton/MagneticButton'
// import { ZSB_STATS } from '@/data/stats'
import { imageSrc } from '@/lib/image-utils'
import type { ImageData } from '@/types/edition'
import styles from './page.module.css'

export const metadata: Metadata = {
  description:
    'An annual contemporary sculpture event transforming Bucharest into an open-air museum. Discover editions, artists, and public art since 2021.',
  alternates: { canonical: '/' },
}

const spotlightImages: {
  hero: ImageData
  grid: ImageData[]
} = {
  hero: {
    basePath: '/img/2025/optimized/instagram_cap3',
    alt: 'ZSB 2025 #celălaltcorp',
  },
  grid: [
    {
      basePath: '/img/2025/optimized/_dsc5707',
      alt: 'Sculpture installation at ZSB 2025 #celălaltcorp exhibition',
    },
    {
      basePath: '/img/2025/optimized/_dsc5571',
      alt: 'Visitors exploring contemporary sculpture at ZSB 2025',
    },
    {
      basePath: '/img/2025/optimized/_dsc5686',
      alt: 'Detail of sculptural work at Bucharest Sculpture Days 2025',
    },
    {
      basePath: '/img/2025/optimized/bws02071',
      alt: 'Gallery view of ZSB 2025 exhibition space',
    },
  ],
}

const archiveEditions: {
  year: number
  theme: string
  description: string
  href: string
  image: ImageData
}[] = [
  {
    year: 2025,
    theme: '#celălaltcorp',
    description:
      'The other body — exploring corporeality, presence, and the boundaries between self and sculpture.',
    href: '/editions/2025',
    image: {
      basePath: '/img/2025/optimized/1-cover-event',
      alt: 'ZSB 2025 #celălaltcorp',
    },
  },
  {
    year: 2024,
    theme: '#syzygy',
    description:
      'Celestial alignments and the gravitational pull between bodies, materials, and meaning.',
    href: '/editions/2024',
    image: {
      basePath: '/img/2024/optimized/cover',
      alt: 'ZSB 2024 #syzygy',
    },
  },
  {
    year: 2023,
    theme: 're#situari afective',
    description:
      'Reimagining affective territories through sculptural interventions in urban and emotional landscapes.',
    href: '/editions/2023',
    image: {
      basePath: '/img/2023/optimized/cover',
      alt: 'ZSB 2023 re#situăriafective',
    },
  },
  {
    year: 2022,
    theme: '#perspectiva31',
    description:
      'A fresh perspective on sculpture 31 years after the Romanian revolution — transformation and memory.',
    href: '/editions/2022',
    image: {
      basePath: '/img/2022/optimized/cover-image',
      alt: 'ZSB 2022 #perspectiva31',
      widths: [600, 1200, 1700],
    },
  },
]

export default function HomePage() {
  return (
    <main>
      {/* ---- Hero / Mission ---- */}
      <section className={styles.heroMission}>
        <Image
          src="/img/diamond.svg"
          alt=""
          width={815}
          height={875}
          sizes="100vw"
          className={styles.heroBg}
          priority
        />
        {/* <div className={styles.heroOverlay} /> */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.highlight}>Bucharest</span>
            Sculpture
            <br />
            Days
          </h1>
        </div>

        <div className={styles.missionText}>
          <div className={styles.missionLeft}>
            <div className={styles.missionStatement}>
              <p>
                Bucharest Sculpture Days (ZSB) is your annual checkpoint for the state of sculpture.
                For 2 weeks each year, we occupy creative hubs across the city with a series of
                exhibitions, screenings, and arguments worth having. We strip away the permanence of
                the monument to focus on the immediate tension of the process. It is a recurring
                experiment in how materials occupy our world.
              </p>
            </div>
            {/* <MagneticButton
              href="/about"
              color="var(--white)"
              hoverTextColor="var(--black)"
            >
              Read Our Story <RiArrowRightLine size={18} />
            </MagneticButton> */}
          </div>

          {/* <div className={styles.partnerCard}>
            <div className={styles.partnerCardLabel}>Support the Project</div>
            <div className={styles.partnerCardTitle}>
                  Become a<br />
                  <span>Partner</span>
                </div>
            <p className={styles.partnerCardDesc}>
              Join a growing network of cultural institutions and individuals shaping the future of
              contemporary sculpture.
            </p>
            <MagneticButton href="/partners" color="var(--pink)">
              Become a Partner <RiArrowRightLine size={18} />
            </MagneticButton>
          </div> */}

          {/* <div className={styles.missionStats}>
            {ZSB_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`${styles.statItem} ${i % 2 === 0 ? styles.statAccent : ''}`}
              >
                <span className={styles.statLabel}>{stat.label}</span>
                <span className={styles.statNumber}>{stat.value}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ---- 2025 Spotlight ---- */}
      <section className={styles.spotlight}>
        <div className={styles.spotlightHeader}>
          <div className={styles.spotlightTitleGroup}>
            <span className={styles.spotlightEyebrow}>Latest Edition</span>
            <div className={styles.spotlightYear}>2025</div>
          </div>
          <Link href="/editions" className={styles.spotlightLink}>
            View Full Archive <RiArrowRightLine size={16} />
          </Link>
        </div>

        <div className={styles.spotlightGallery}>
          <div className={styles.galleryHero}>
            <Image
              src={imageSrc(spotlightImages.hero)}
              alt={spotlightImages.hero.alt}
              fill
              preload
              sizes="(max-width: 767px) 100vw, 66vw"
              className={styles.galleryHeroImage}
            />
            <div className={styles.galleryHeroOverlay}>
              <span>Bucharest Sculpture Days 2025</span>
            </div>
          </div>

          <div className={styles.galleryGrid}>
            {spotlightImages.grid.map((img) => (
              <div key={img.basePath} className={styles.galleryItem}>
                <Image
                  src={imageSrc(img)}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 767px) 50vw, 25vw"
                  className={styles.galleryItemImage}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.editionInfoBar}>
          <div className={styles.editionInfoItem}>
            <span className={styles.editionInfoLabel}>Theme</span>
            <span className={styles.editionInfoValue}>#celălaltcorp</span>
          </div>
          <div className={styles.editionInfoItem}>
            <span className={styles.editionInfoLabel}>Dates</span>
            <span className={styles.editionInfoValue}>May 2025</span>
          </div>
          <div className={styles.editionInfoItem}>
            <span className={styles.editionInfoLabel}>Location</span>
            <span className={styles.editionInfoValue}>Bucharest</span>
          </div>
          <div className={styles.editionInfoItem}>
            <span className={styles.editionInfoLabel}>Artists</span>
            <span className={styles.editionInfoValue}>44</span>
          </div>
        </div>
      </section>

      {/* ---- Past Editions Archive ---- */}
      <section className={styles.archive}>
        <div className={styles.archiveHeader}>
          <h2 className={styles.archiveTitle}>Past Editions</h2>
        </div>

        <div className={styles.archiveGrid}>
          {archiveEditions.map((edition) => (
            <Link key={edition.year} href={edition.href} className={styles.archiveCard}>
              <div className={styles.archiveCardImage}>
                <Image
                  src={imageSrc(edition.image)}
                  alt={edition.image.alt}
                  fill
                  sizes="(max-width: 1279px) 100vw, (max-width: 1599px) 50vw, 33vw"
                  className={styles.archiveCardImg}
                />
              </div>
              <div className={styles.archiveCardContent}>
                <div className={styles.archiveCardYear}>{edition.year}</div>
                <div className={styles.archiveCardTheme}>{edition.theme}</div>
                <p className={styles.archiveCardDesc}>{edition.description}</p>
                <span className={styles.archiveCardCta}>
                  View Edition <RiArrowRightLine size={12} />
                </span>
              </div>
            </Link>
          ))}

          {/* 2021 - Online only, no link */}
          <div className={`${styles.archiveCard} ${styles.archiveCardOnline}`}>
            <div className={styles.archiveCardContent}>
              <span className={styles.onlineBadge}>Online Edition</span>
              <div className={styles.archiveCardYear}>2021</div>
              <div className={styles.archiveCardTheme}>Inaugural Edition</div>
              <p className={styles.archiveCardDesc}>
                The first Bucharest Sculpture Days, held entirely online during the pandemic. A
                digital beginning for a physical art form.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
