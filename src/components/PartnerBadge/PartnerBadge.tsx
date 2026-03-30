'use client'

import gsap from 'gsap'
import Link from 'next/link'
import { useCallback, useRef } from 'react'
import { RiArrowRightUpLine } from '@remixicon/react'
import styles from './PartnerBadge.module.css'

export function PartnerBadge() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy

    gsap.to(el, {
      x: dx * 0.3,
      y: dy * 0.3,
      duration: 0.4,
      ease: 'power2.out',
    })
  }, [])

  const handleEnter = useCallback(() => {
    if (!bodyRef.current) return
    gsap.to(bodyRef.current, {
      scale: 1.12,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    })
  }, [])

  const handleLeave = useCallback(() => {
    if (!wrapRef.current || !bodyRef.current) return
    gsap.to(wrapRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.35)',
    })
    gsap.to(bodyRef.current, {
      scale: 1,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    })
  }, [])

  return (
    <div
      ref={wrapRef}
      className={styles.wrap}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      onMouseEnter={handleEnter}
    >
      <Link href="/partners" className={styles.link}>
        <div ref={bodyRef} className={styles.body}>
          <div className={styles.textRing}>
            <svg viewBox="0 0 500 500">
              <defs>
                <path
                  id="partnerCircle"
                  d="M 250,250 m -210,0 a 210,210 0 1,1 420,0 a 210,210 0 1,1 -420,0"
                />
              </defs>
              <text fontSize="40" fontWeight="600" letterSpacing="8">
                <textPath href="#partnerCircle" startOffset="0%">
                  SUPPORT THE PROJECT • BECOME A PARTNER •{' '}
                </textPath>
              </text>
            </svg>
          </div>
          <span className={styles.arrow}>
            <RiArrowRightUpLine size={240} />
          </span>
        </div>
      </Link>
    </div>
  )
}
