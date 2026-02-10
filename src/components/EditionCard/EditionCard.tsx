import Link from "next/link";
import Image from "next/image";
import { RiArrowRightLine } from "@remixicon/react";
import { imageSrc } from "@/lib/image-utils";
import styles from "./EditionCard.module.css";

export interface EditionCardData {
  year: number;
  theme: string;
  description: string;
  href: string;
  variant?: "sculpture" | "tiled" | "online";
  cardImage?: {
    basePath: string;
    alt: string;
    ext?: "jpg" | "png";
  };
  tiledBg?: string;
}

interface EditionCardProps {
  edition: EditionCardData;
}

export function EditionCard({ edition }: EditionCardProps) {
  const variantClass = edition.variant
    ? styles[`variant${edition.variant.charAt(0).toUpperCase() + edition.variant.slice(1)}`]
    : "";

  const cardClassName =
    `${styles.card} ${variantClass}`.trim();

  if (edition.variant === "online") {
    return (
      <div className={cardClassName}>
        <div className={styles.overlay} />
        <div className={styles.content}>
          <span className={styles.onlineBadge}>Online Edition</span>
          <div className={styles.year}>{edition.year}</div>
          <div className={styles.theme}>{edition.theme}</div>
          <p className={styles.desc}>{edition.description}</p>
        </div>
      </div>
    );
  }

  return (
    <Link href={edition.href} className={cardClassName}>
      <div className={styles.imageWrap}>
        {edition.variant === "tiled" && edition.tiledBg ? (
          <div
            className={styles.tiledImage}
            style={{ backgroundImage: `url(${edition.tiledBg})` }}
          />
        ) : edition.cardImage ? (
          <Image
            src={imageSrc(edition.cardImage)}
            alt={edition.cardImage.alt}
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
            className={styles.image}
          />
        ) : null}
      </div>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.year}>{edition.year}</div>
        <div className={styles.theme}>{edition.theme}</div>
        <p className={styles.desc}>{edition.description}</p>
        <span className={styles.cta}>
          View Edition <RiArrowRightLine size={16} />
        </span>
      </div>
    </Link>
  );
}
