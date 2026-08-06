'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { editionsNav } from '@/components/EditionsNav/EditionsNav.recipe'
import { EditionTheme } from '@/components/EditionTheme/EditionTheme'
import { Badge } from '@/components/ui/Badge/Badge'
import { Eyebrow } from '@/components/ui/Eyebrow/Eyebrow'
import type { EditionListItem } from '@/sanity/lib/editions'

const styles = editionsNav()

const STATUS_BADGE = {
  live: null,
  current: 'Viewing',
  announced: 'Soon',
} as const

type CellStatus = keyof typeof STATUS_BADGE

export type EditionEntry = Pick<EditionListItem, 'year' | 'theme' | 'themeHighlight' | 'href'>

export function EditionsNavBand({ editions }: { editions: EditionEntry[] }) {
  const pathname = usePathname()

  return (
    <section className={styles.band}>
      <div className={styles.inner}>
        <Eyebrow>Our journey</Eyebrow>
        <div className={styles.grid}>
          {editions.map((edition) => {
            const status: CellStatus =
              edition.href == null ? 'announced' : pathname === edition.href ? 'current' : 'live'
            const statusBadge = STATUS_BADGE[status]
            const cell = editionsNav({ status }).cell
            const body = (
              <>
                <div className={styles.head}>
                  <h2 className={styles.year}>
                    <span className={styles.prefix}>ZSB</span>
                    {edition.year}
                  </h2>
                  {statusBadge ? (
                    <Badge
                      tone={status === 'announced' ? 'muted' : 'outline'}
                      className={styles.tag}
                    >
                      {statusBadge}
                    </Badge>
                  ) : null}
                </div>
                <EditionTheme
                  as="p"
                  size="cell"
                  interactive={status === 'live'}
                  muted={status === 'announced'}
                  accent={status === 'announced' ? 'none' : 'highlight'}
                  theme={edition.theme}
                  themeHighlight={edition.themeHighlight}
                />
              </>
            )
            return edition.href != null ? (
              <Link
                key={edition.year}
                href={edition.href}
                className={cell}
                aria-current={status === 'current' ? 'page' : undefined}
              >
                {body}
              </Link>
            ) : (
              <div key={edition.year} className={cell}>
                {body}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
