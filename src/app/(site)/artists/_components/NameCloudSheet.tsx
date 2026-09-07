'use client'

import { nameCloudSheet } from '@artists-components/NameCloudSheet.recipe'
import { RiCloseLine } from '@remixicon/react'
import { type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { EDITION_YEAR_SEPARATOR } from '@/sanity/lib/artists-mappers'

const coarsePointerQuery = '(hover: none)'

function subscribeToCoarsePointer(callback: () => void) {
  const media = window.matchMedia(coarsePointerQuery)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

function getCoarsePointer() {
  return window.matchMedia(coarsePointerQuery).matches
}

function getServerCoarsePointer() {
  return false
}

interface Entry {
  id: string
  name: string
  years: string[]
}

/** The name cloud's years are a hover bubble on pointer devices. Where there is
 *  no hover, this reads them off the server-rendered list items instead and
 *  shows them in a sheet on tap. */
export function NameCloudSheet({ children }: { children: ReactNode }) {
  const [entry, setEntry] = useState<Entry | null>(null)
  const [shown, setShown] = useState<Entry | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const coarsePointer = useSyncExternalStore(
    subscribeToCoarsePointer,
    getCoarsePointer,
    getServerCoarsePointer,
  )
  const styles = nameCloudSheet()

  // Keep the sheet's content through the exit transition once entry goes null.
  if (entry !== null && entry !== shown) setShown(entry)

  useEffect(() => {
    const root = rootRef.current
    if (!coarsePointer || root === null) return

    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof HTMLElement)) return
      const item = target.closest<HTMLElement>('[data-artist-id]')
      if (item === null) {
        setEntry(null)
        return
      }
      const id = item.dataset.artistId ?? ''
      const name = item.dataset.artist ?? ''
      const years = (item.dataset.years ?? '').split(EDITION_YEAR_SEPARATOR)
      setEntry((open) => (open?.id === id ? null : { id, name, years }))
    }

    root.addEventListener('click', onClick)
    return () => root.removeEventListener('click', onClick)
  }, [coarsePointer])

  const isOpen = entry !== null
  useEffect(() => {
    if (!isOpen) return

    const close = () => setEntry(null)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    const onPointerDown = (event: PointerEvent) => {
      const root = rootRef.current
      if (root && event.target instanceof Node && root.contains(event.target)) return
      close()
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [isOpen])

  return (
    <div ref={rootRef} className={styles.root} data-name-cloud-tap={coarsePointer || undefined}>
      {children}
      {coarsePointer && (
        // The years are already announced inline beside every name, so the
        // sheet is a second rendering of content assistive tech has read.
        <div className={styles.panel} data-open={isOpen || undefined} aria-hidden="true">
          <div className={styles.inner}>
            <div className={styles.head}>
              <span className={styles.label}>Editions</span>
              <button
                type="button"
                tabIndex={-1}
                className={styles.close}
                onClick={() => setEntry(null)}
              >
                <RiCloseLine size={20} />
              </button>
            </div>
            <p className={styles.name}>{shown?.name}</p>
            <ul className={styles.years}>
              {shown?.years.map((year) => (
                <li key={year} className={styles.year}>
                  {year}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
