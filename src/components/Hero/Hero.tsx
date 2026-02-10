import Image from "next/image";
import { imageSrc } from "@/lib/image-utils";
import styles from "./Hero.module.css";

interface HeroProps {
  year: number;
  theme: string;
  themeHighlight?: string;
  heroImage?: { basePath: string; alt: string; ext?: "jpg" | "png" };
  dateTape?: string;
  variant?: string; // "2022" | "2023" | "with-sculpture"
}

export function Hero({
  year,
  theme,
  themeHighlight,
  heroImage,
  dateTape,
  variant,
}: HeroProps) {
  const heroClassName =
    `${styles.hero} ${variant ? styles[`variant${variant}`] : ""}`.trim();

  return (
    <header className={heroClassName}>
      {/* Background layers */}
      <div className={styles.bgImage} />
      <div className={styles.colorLayer} />
      <div className={styles.overlay} />
      <div className={styles.noise} />
      <div className={styles.vignette} />

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.eyebrow}>Bucharest Sculpture Days</div>
        <div className={styles.year} data-year={year}>
          {year}
        </div>
        <h1 className={styles.theme}>
          {themeHighlight ? (
            <>
              #<span className={styles.themeHighlight}>{themeHighlight}</span>
            </>
          ) : (
            theme
          )}
        </h1>

        {dateTape && <div className={styles.dateTape}>{dateTape}</div>}
      </div>

      {/* Sculpture image (with-sculpture variant only) */}
      {heroImage && variant === "with-sculpture" && (
        <div className={styles.sculpture}>
          <Image
            src={imageSrc(heroImage)}
            alt={heroImage.alt}
            width={600}
            height={800}
            priority
          />
        </div>
      )}

      {/* Scroll indicator — hidden mobile, visible desktop */}
      <div className={styles.scroll}>
        <span className={styles.scrollText}>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </header>
  );
}
