import type { ReactNode } from 'react'
import { marquee } from '@/components/Marquee/Marquee.recipe'

interface MarqueeProps {
  count: number
  gap?: 'xl' | '2xl'
  /** The `<li>` items. Rendered twice — the second run is the seam-free loop. */
  children: ReactNode
}

const SECONDS_PER_ITEM = 5

export function Marquee({ count, gap = '2xl', children }: MarqueeProps) {
  const s = marquee({ gap })

  return (
    <div className={s.viewport}>
      <div className={s.track} style={{ animationDuration: `${count * SECONDS_PER_ITEM}s` }}>
        <ul className={s.run}>{children}</ul>
        <ul className={s.run} data-clone aria-hidden inert>
          {children}
        </ul>
      </div>
    </div>
  )
}
