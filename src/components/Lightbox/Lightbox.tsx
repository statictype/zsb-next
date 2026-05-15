'use client'

import { RiArrowLeftSLine, RiArrowRightSLine, RiCloseLine } from '@remixicon/react'
import { useEffect, useState } from 'react'
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock'
import styles from './Lightbox.module.css'

export interface LightboxImage {
  src: string
  caption: string
}

export function useLightbox(images: LightboxImage[]) {
  const [isOpen, setIsOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const open = (i: number) => {
    setIndex(i)
    setIsOpen(true)
  }
  const close = () => setIsOpen(false)
  const next = () => setIndex((i) => (i + 1) % images.length)
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length)

  return {
    open,
    element: (
      <LightboxView
        images={images}
        index={index}
        isOpen={isOpen}
        onClose={close}
        onNext={next}
        onPrev={prev}
      />
    ),
  }
}

interface LightboxViewProps {
  images: LightboxImage[]
  index: number
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

function LightboxView({ images, index, isOpen, onClose, onNext, onPrev }: LightboxViewProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [isOpen, onClose, onNext, onPrev])

  useBodyScrollLock(isOpen)

  if (!images.length) return null

  const current = images[index]
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
      <button type="button" className={styles.close} onClick={onClose} aria-label="Close lightbox">
        <RiCloseLine size={24} />
      </button>

      {/* Pre-optimized lightbox images — next/image adds no value here */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.image} src={current.src} alt={current.caption} />

      <div className={styles.caption}>{current.caption}</div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className={`${styles.nav} ${styles.navPrev}`}
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
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
              onNext()
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
