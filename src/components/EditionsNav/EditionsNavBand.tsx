'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { editionsNav } from '@/components/EditionsNav/EditionsNav.recipe'
import { EditionTheme } from '@/components/EditionTheme/EditionTheme'
import { Badge } from '@/components/ui/Badge/Badge'
import { Eyebrow } from '@/components/ui/Eyebrow/Eyebrow'
import type { EditionSummary } from '@/types/edition'

const styles = editionsNav()

const STATUS_BADGE = {
  live: null,
  current: 'Viewing',
  announced: 'Soon',
} as const

type CellStatus = keyof typeof STATUS_BADGE

export type EditionEntry = Pick<
  EditionSummary,
  'year' | 'theme' | 'themeHighlight' | 'status' | 'href'
>

// Also mounted under `editions/[year]/@modal/(.)events/[slug]`, where the pathname is below the edition's.
function isSectionActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`)
}

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
              edition.status !== 'live'
                ? 'announced'
                : pathname !== null && isSectionActive(pathname, edition.href)
                  ? 'current'
                  : 'live'
            const statusBadge = STATUS_BADGE[status]
            const {
              cell,
              year: yearClass,
              theme: themeClass,
              tag,
              face,
              faceIn,
            } = editionsNav({ status })
            const rolls = status === 'live'
            const body = (
              <>
                <div className={styles.head}>
                  <p className={yearClass}>
                    <span className={styles.clip}>
                      <span className={face}>
                        <span className={styles.prefix}>ZSB</span> {edition.year}
                      </span>
                      {rolls ? (
                        <span className={faceIn} aria-hidden="true">
                          <span className={styles.prefixIn}>ZSB</span> {edition.year}
                        </span>
                      ) : null}
                    </span>
                  </p>
                  {statusBadge ? (
                    <Badge tone={status === 'announced' ? 'muted' : 'highlight'} className={tag}>
                      {statusBadge}
                    </Badge>
                  ) : null}
                </div>
                <p className={styles.clip}>
                  <span className={face}>
                    <EditionTheme
                      as="span"
                      size="cell"
                      interactive={rolls}
                      muted={status === 'announced'}
                      accent={status === 'announced' ? 'none' : 'highlight'}
                      theme={edition.theme}
                      themeHighlight={edition.themeHighlight}
                      className={themeClass}
                    />
                  </span>
                  {rolls ? (
                    <span className={faceIn} aria-hidden="true">
                      <EditionTheme
                        as="span"
                        size="cell"
                        interactive
                        theme={edition.theme}
                        themeHighlight={edition.themeHighlight}
                      />
                    </span>
                  ) : null}
                </p>
              </>
            )
            return status !== 'announced' ? (
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
