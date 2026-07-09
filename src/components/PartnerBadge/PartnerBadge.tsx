import { RiEmpathizeFill } from '@remixicon/react'
import Link from 'next/link'
import { partnerBadge } from './PartnerBadge.recipe'

export function PartnerBadge({ variant = 'light' }: { variant?: 'light' | 'dark' } = {}) {
  const s = partnerBadge({ variant })

  return (
    <div className={s.wrap}>
      <Link href="/partners" className={s.link}>
        <div className={s.body}>
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
