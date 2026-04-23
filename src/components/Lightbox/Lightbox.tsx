'use client'

import { RiArrowLeftSLine, RiArrowRightSLine, RiCloseLine } from '@remixicon/react'
import { useEffect } from 'react'
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock'
import styles from './Lightbox.module.css'

interface LightboxImage {
  src: string
  caption: string
}

interface LightboxProps {
  images: LightboxImage[]
  currentIndex: number
  onIndexChange: (index: number) => void
  isOpen: boolean
  onClose: () => void
}

export function Lightbox({
  images,
  currentIndex,
  onIndexChange,
  isOpen,
  onClose,
}: LightboxProps) {
  function navigate(direction: number) {
    onIndexChange((currentIndex + direction + images.length) % images.length)
  }

  useEffect(() => {
    if (!isOpen) return

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') {
        onIndexChange((currentIndex - 1 + images.length) % images.length)
      }
      if (e.key === 'ArrowRight') {
        onIndexChange((currentIndex + 1) % images.length)
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [isOpen, onClose, onIndexChange, currentIndex, images.length])

  useBodyScrollLock(isOpen)

  if (!images.length) return null

  const current = images[currentIndex]
  if (!current) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop dismiss pattern
    <div
      className={`${styles.lightbox} ${isOpen ? styles.isActive : ''}`}
      onClick={handleBackdropClick}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
      }}
    >
      {/* Close button */}
      <button type="button" className={styles.close} onClick={onClose} aria-label="Close lightbox">
        <RiCloseLine size={24} />
      </button>

      {/* Pre-optimized lightbox images — next/image adds no value here */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.image} src={current.src} alt={current.caption} />

      {/* Caption */}
      <div className={styles.caption}>{current.caption}</div>

      {/* Navigation */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            className={`${styles.nav} ${styles.navPrev}`}
            onClick={(e) => {
              e.stopPropagation()
              navigate(-1)
            }}
            aria-label="Previous image"
          >
            <RiArrowLeftSLine size={20} />
          </button>
          <button
            type="button"
            className={`${styles.nav} ${styles.navNext}`}
            onClick={(e) => {
              e.stopPropagation()
              navigate(1)
            }}
            aria-label="Next image"
          >
            <RiArrowRightSLine size={20} />
          </button>
        </>
      )}
    </div>
  )
}
