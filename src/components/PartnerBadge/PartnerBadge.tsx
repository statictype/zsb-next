import { RiEmpathizeFill } from '@remixicon/react'
import Link from 'next/link'
import { useId } from 'react'
import { Center } from 'styled-system/jsx'
import { partnerBadge } from './PartnerBadge.recipe'

interface PartnerBadgeProps {
  size?: 'standard' | 'footer' | 'hero' | 'upcoming' | undefined
}

export function PartnerBadge({ size = 'standard' }: PartnerBadgeProps = {}) {
  const s = partnerBadge({ size })
  const pathId = `partnerCircle-${useId().replaceAll(':', '')}`

  return (
    <div className={s.wrap}>
      <Link href="/partners" className={s.link} aria-label="Become a partner">
        <Center className={s.body}>
          <div className={s.textRing}>
            <svg viewBox="0 0 500 500" aria-hidden="true">
              <defs>
                <path
                  id={pathId}
                  d="M 250,250 m -210,0 a 210,210 0 1,1 420,0 a 210,210 0 1,1 -420,0"
                />
              </defs>
              <text>
                <textPath href={`#${pathId}`} startOffset="0%">
                  SUPPORT THE MISSION • BECOME A PARTNER •{' '}
                </textPath>
              </text>
            </svg>
          </div>
          <span className={s.arrow}>
            <RiEmpathizeFill className={s.icon} />
          </span>
        </Center>
      </Link>
    </div>
  )
}
