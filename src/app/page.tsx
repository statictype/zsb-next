import Link from "next/link";
import Image from "next/image";
import { RiArrowRightLine } from "@remixicon/react";
import styles from "./page.module.css";

const spotlightImages = {
  hero: {
    basePath: "/img/2025/optimized/1-cover-event",
    alt: "ZSB 2025 #celălaltcorp",
  },
  grid: [
    { basePath: "/img/2025/optimized/_dsc5707", alt: "ZSB 2025" },
    { basePath: "/img/2025/optimized/_dsc5571", alt: "ZSB 2025" },
    { basePath: "/img/2025/optimized/_dsc5686", alt: "ZSB 2025" },
    { basePath: "/img/2025/optimized/bws02071", alt: "ZSB 2025" },
  ],
};

const stats = [
  { label: "Editions", value: "5" },
  { label: "Artists", value: "150+" },
  { label: "Venues", value: "8" },
  { label: "Visitors", value: "25K+" },
];

const archiveEditions = [
  {
    year: 2024,
    shortYear: "24",
    theme: "#syzygy",
    description: "Celestial alignments and the gravitational pull between bodies, materials, and meaning.",
    href: "/editions/2024",
    image: { basePath: "/img/2024/optimized/background", alt: "ZSB 2024 #syzygy" },
  },
  {
    year: 2023,
    shortYear: "23",
    theme: "re#situari afective",
    description: "Reimagining affective territories through sculptural interventions in urban and emotional landscapes.",
    href: "/editions/2023",
    image: { basePath: "/img/2023/optimized/background", alt: "ZSB 2023 re#situăriafective" },
  },
  {
    year: 2022,
    shortYear: "22",
    theme: "#perspectiva31",
    description: "A fresh perspective on sculpture 31 years after the Romanian revolution — transformation and memory.",
    href: "/editions/2022",
    image: { basePath: "/img/2022/optimized/tile-2.webp", alt: "ZSB 2022 #perspectiva31" },
  },
];

export default function HomePage() {
  return (
    <main>
      {/* ---- Hero / Mission ---- */}
      <section className={styles.heroMission}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Bucharest<br />
            Sculpture<br />
            <span className={styles.highlight}>Days</span>
          </h1>

          <div className={styles.missionText}>
            <div className={styles.missionLeft}>
              <div className={styles.missionStatement}>
                <p>
                  Bucharest Sculpture Days is an annual festival dedicated to contemporary sculpture,
                  transforming the city into an open-air museum where art confronts urban space.
                  Each edition brings together Romanian and international artists to explore the
                  evolving language of three-dimensional art.
                </p>
                <p>
                  Founded in 2021, ZSB has grown into one of Eastern Europe&apos;s most significant
                  sculpture events, fostering dialogue between tradition and experimentation,
                  between the permanence of material and the transience of our times.
                </p>
              </div>
              <Link href="/about" className={styles.ctaBtn}>
                Read Our Story <RiArrowRightLine size={18} />
              </Link>
            </div>

            <div className={styles.missionMeta}>
              <div className={styles.missionStats}>
                {stats.map((stat, i) => (
                  <div key={stat.label} className={`${styles.statItem} ${i % 2 === 0 ? styles.statAccent : ""}`}>
                    <span className={styles.statLabel}>{stat.label}</span>
                    <span className={styles.statNumber}>{stat.value}</span>
                  </div>
                ))}
              </div>

              <div className={styles.partnerCard}>
                <div className={styles.partnerCardLabel}>Support the Project</div>
                <div className={styles.partnerCardTitle}>
                  Become a<br /><span>Partner</span>
                </div>
                <p className={styles.partnerCardDesc}>
                  Join a growing network of cultural institutions and individuals
                  shaping the future of contemporary sculpture.
                </p>
                <Link href="/partners" className={`${styles.ctaBtn} ${styles.ctaBtnPink}`}>
                  Become a Partner <RiArrowRightLine size={18} />
                </Link>
              </div>
            </div>
          </div>
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
              src={spotlightImages.hero.basePath}
              alt={spotlightImages.hero.alt}
              fill
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
                  src={img.basePath}
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
                  src={edition.image.basePath}
                  alt={edition.image.alt}
                  fill
                  sizes="(max-width: 1279px) 100vw, (max-width: 1599px) 50vw, 33vw"
                  className={styles.archiveCardImg}
                />
                <span className={styles.archiveCardYearBg}>{edition.shortYear}</span>
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
              <span className={styles.archiveCardYearBg}>21</span>
              <span className={styles.onlineBadge}>Online Edition</span>
              <div className={styles.archiveCardYear}>2021</div>
              <div className={styles.archiveCardTheme}>Inaugural Edition</div>
              <p className={styles.archiveCardDesc}>
                The first Bucharest Sculpture Days, held entirely online during the pandemic.
                A digital beginning for a physical art form.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
