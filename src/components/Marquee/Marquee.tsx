import type { ReactNode } from 'react'
import { marquee } from '@/components/Marquee/Marquee.recipe'

interface MarqueeProps {
  count: number
  gap?: 'lg' | 'xl' | '2xl'
  secondsPerItem?: number
  children: ReactNode
}

const SECONDS_PER_ITEM = 5
// The `marquee` keyframes in tokens.ts translate by one run: -100% / CLONES + 1.
const CLONES = [1, 2, 3]

export function Marquee({
  count,
  gap = '2xl',
  secondsPerItem = SECONDS_PER_ITEM,
  children,
}: MarqueeProps) {
  const s = marquee({ gap })

  return (
    <div className={s.viewport}>
      <div className={s.track} style={{ animationDuration: `${count * secondsPerItem}s` }}>
        <ul className={s.run}>{children}</ul>
        {CLONES.map((clone) => (
          <ul key={clone} className={s.run} data-clone aria-hidden inert>
            {children}
          </ul>
        ))}
      </div>
    </div>
  )
}
