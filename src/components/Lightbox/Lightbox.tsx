"use client";

import { useState, useEffect, useCallback } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine, RiCloseLine } from "@remixicon/react";
import styles from "./Lightbox.module.css";

interface LightboxImage {
  src: string;
  caption: string;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex = 0, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset to initialIndex when lightbox opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const navigate = useCallback(
    (direction: number) => {
      setCurrentIndex(
        (prev) => (prev + direction + images.length) % images.length,
      );
    },
    [images.length],
  );

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isOpen, onClose, navigate]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!images.length) return null;

  const current = images[currentIndex];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`${styles.lightbox} ${isOpen ? styles.isActive : ""}`}
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <button
        className={styles.close}
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <RiCloseLine size={24} />
      </button>

      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.image}
        src={current.src}
        alt={current.caption}
      />

      {/* Caption */}
      <div className={styles.caption}>{current.caption}</div>

      {/* Navigation */}
      {images.length > 1 && (
        <>
          <button
            className={`${styles.nav} ${styles.navPrev}`}
            onClick={(e) => {
              e.stopPropagation();
              navigate(-1);
            }}
            aria-label="Previous image"
          >
            <RiArrowLeftSLine size={20} />
          </button>
          <button
            className={`${styles.nav} ${styles.navNext}`}
            onClick={(e) => {
              e.stopPropagation();
              navigate(1);
            }}
            aria-label="Next image"
          >
            <RiArrowRightSLine size={20} />
          </button>
        </>
      )}
    </div>
  );
}
