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

// The band stays mounted under the intercepted event route
// (`editions/[year]/@modal/(.)events/[slug]`), where the pathname is a
// descendant of the edition being viewed rather than the edition itself.
function isSectionActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`)
}

/** `pathname: null` renders without current state — it is the Suspense fallback. */
export function EditionsNavBandList({
  editions,
  pathname,
}: {
  editions: EditionEntry[]
  pathname: string | null
}) {
  return (
    <nav className={styles.band} aria-label="Editions">
      <div className={styles.inner}>
        <Eyebrow>Our journey</Eyebrow>
        <div className={styles.grid}>
          {editions.map((edition) => {
            const status: CellStatus =
              edition.href == null
                ? 'announced'
                : pathname !== null && isSectionActive(pathname, edition.href)
                  ? 'current'
                  : 'live'
            const statusBadge = STATUS_BADGE[status]
            const { cell, year: yearClass, theme: themeClass } = editionsNav({ status })
            const body = (
              <>
                <div className={styles.head}>
                  <p className={yearClass}>
                    <span className={styles.prefix}>ZSB</span> {edition.year}
                  </p>
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
                  className={themeClass}
                />
              </>
            )
            return edition.href != null ? (
              <Link
                key={edition.year}
                href={edition.href}
                className={cell}
                aria-current={pathname === edition.href ? 'page' : undefined}
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
    </nav>
  )
}

export function EditionsNavBand({ editions }: { editions: EditionEntry[] }) {
  return <EditionsNavBandList editions={editions} pathname={usePathname()} />
}
