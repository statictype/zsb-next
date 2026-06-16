'use client'

import { RiEmpathizeFill } from '@remixicon/react'
import gsap from 'gsap'
import Link from 'next/link'
import { useRef } from 'react'
import { partnerBadge } from './PartnerBadge.recipe'

export function PartnerBadge({ variant = 'light' }: { variant?: 'light' | 'dark' } = {}) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const s = partnerBadge({ variant })

  function handleEnter() {
    if (!bodyRef.current) return
    gsap.to(bodyRef.current, {
      scale: 1.12,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    })
  }

  function handleLeave() {
    if (!bodyRef.current) return
    gsap.to(bodyRef.current, {
      scale: 1,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    })
  }

  return (
    <div className={s.wrap}>
      <Link
        href="/partners"
        className={s.link}
        onMouseLeave={handleLeave}
        onMouseEnter={handleEnter}
      >
        <div ref={bodyRef} className={s.body}>
          <div className={s.textRing}>
            <svg viewBox="0 0 500 500" aria-hidden="true">
              <defs>
                <path
                  id="partnerCircle"
                  d="M 250,250 m -210,0 a 210,210 0 1,1 420,0 a 210,210 0 1,1 -420,0"
                />
              </defs>
              <text fontSize="40" fontWeight="600" letterSpacing="8">
                <textPath href="#partnerCircle" startOffset="0%">
                  SUPPORT THE MISSION • BECOME A PARTNER •{' '}
                </textPath>
              </text>
            </svg>
          </div>
          <span className={s.arrow}>
            <RiEmpathizeFill className={s.icon} />
          </span>
        </div>
      </Link>
    </div>
  )
}
