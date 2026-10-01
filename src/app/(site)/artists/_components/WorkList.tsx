'use client'

import type { ArtistLabels } from '@artists-components/artist-labels'
import { workIndex, workList } from '@artists-components/WorkList.recipe'
import { PortableText } from '@portabletext/react'
import { RiArrowDownSLine, RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react'
import { type CSSProperties, type RefObject, useEffect, useId, useRef, useState } from 'react'
import { Figure } from '@/components/Figure/Figure'
import { Lightbox, useLightbox } from '@/components/Lightbox/Lightbox'
import { useReducedMotion } from '@/components/reduced-motion'
import { Button } from '@/components/ui/Button/Button'
import { trackEvent } from '@/lib/analytics'
import type { ArtistWork, Lang } from '@/types/edition'

const WORK_PARAM = 'w'
const CONTAIN = { objectFit: 'contain', objectPosition: 'bottom' } as const

export interface WorkCarousel {
  track: RefObject<HTMLOListElement | null>
  current: number
  go: (index: number) => void
  onScroll: () => void
}

function slideLeft(track: HTMLOListElement, index: number): number {
  return (track.children[index] as HTMLElement | undefined)?.offsetLeft ?? 0
}

export function useWorkCarousel(works: ArtistWork[]): WorkCarousel {
  const track = useRef<HTMLOListElement>(null)
  const [current, setCurrent] = useState(0)
  const seen = useRef(new Set<number>())
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const requested = Number(new URLSearchParams(window.location.search).get(WORK_PARAM))
    const index = works.findIndex((work) => work.key === requested)
    seen.current.add(Math.max(index, 0))
    const el = track.current
    if (el && index > 0) el.scrollTo({ left: slideLeft(el, index), behavior: 'instant' })
  }, [works])

  const go = (index: number) => {
    const el = track.current
    if (!el) return
    el.scrollTo({ left: slideLeft(el, index), behavior: reducedMotion ? 'instant' : 'smooth' })
  }

  const onScroll = () => {
    const el = track.current
    if (!el) return
    const index = Math.round(el.scrollLeft / (slideLeft(el, 1) || el.clientWidth))
    setCurrent(index)
    const work = works[index]
    if (work && !seen.current.has(index)) {
      seen.current.add(index)
      trackEvent('work_view', { key: work.key })
    }
  }

  return { track, current, go, onScroll }
}

interface WorkIndexProps {
  works: ArtistWork[]
  lang: Lang
  label: string
  current: number
  onSelect: (index: number) => void
}

export function WorkIndex({ works, lang, label, current, onSelect }: WorkIndexProps) {
  const styles = workIndex()

  return (
    <nav aria-label={label} className={styles.root}>
      <div className={styles.picker}>
        <select
          className={styles.select}
          aria-label={label}
          value={current}
          onChange={(event) => onSelect(Number(event.target.value))}
        >
          {works.map((work, index) => {
            const title = work.title[lang]
            return (
              <option key={work.key} value={index} lang={title.lang}>
                {work.year ? `${title.value} · ${work.year}` : title.value}
              </option>
            )
          })}
        </select>
        <RiArrowDownSLine size={20} className={styles.chevron} aria-hidden />
      </div>
      <ol className={styles.list}>
        {works.map((work, index) => {
          const title = work.title[lang]
          return (
            <li key={work.key}>
              <Button
                variant="plain"
                className={styles.link}
                aria-current={index === current}
                onClick={() => onSelect(index)}
              >
                <span className={styles.title} lang={title.lang}>
                  {title.value}
                </span>
                {work.year && <span className={styles.year}>{work.year}</span>}
              </Button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

interface WorkListProps {
  works: ArtistWork[]
  lang: Lang
  labels: ArtistLabels
  carousel: WorkCarousel
}

export function WorkList({ works, lang, labels, carousel }: WorkListProps) {
  const { track, current, go, onScroll } = carousel
  const styles = workList()

  return (
    <section aria-label={labels.works} className={styles.root}>
      {works.length > 1 && (
        <div className={styles.controls}>
          <span className={styles.counter} aria-live="polite">
            {current + 1} / {works.length}
          </span>
          <span className={styles.arrows}>
            <Button
              variant="icon"
              onClick={() => go(current - 1)}
              disabled={current === 0}
              aria-label={labels.previous}
            >
              <RiArrowLeftLine size={20} />
            </Button>
            <Button
              variant="icon"
              onClick={() => go(current + 1)}
              disabled={current === works.length - 1}
              aria-label={labels.next}
            >
              <RiArrowRightLine size={20} />
            </Button>
          </span>
        </div>
      )}
      <ol ref={track} className={styles.track} onScroll={onScroll}>
        {works.map((work, index) => (
          <WorkEntry
            key={work.key}
            work={work}
            lang={lang}
            labels={labels}
            inert={index !== current}
          />
        ))}
      </ol>
    </section>
  )
}

interface Fact {
  term: string
  value: string
  lang?: Lang
}

interface WorkEntryProps {
  work: ArtistWork
  lang: Lang
  labels: ArtistLabels
  inert: boolean
}

function WorkEntry({ work, lang, labels, inert }: WorkEntryProps) {
  const [active, setActive] = useState(0)
  const lightbox = useLightbox()
  const stage = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const styles = workList({
    views: work.images.length > 1 ? 'multiple' : 'single',
    withMedia: work.images.length > 0,
  })
  const title = work.title[lang]
  const material = work.material?.[lang]
  const description = work.description[lang]
  const image = work.images[active]
  const stageRatio = 1 / Math.max(...work.images.map((view) => view.aspectRatio))

  const facts: Fact[] = [
    ...(work.year ? [{ term: labels.year, value: work.year }] : []),
    ...(material ? [{ term: labels.material, value: material.value, lang: material.lang }] : []),
    ...(work.dimensions ? [{ term: labels.dimensions, value: work.dimensions }] : []),
  ]

  return (
    <li className={styles.entry} inert={inert}>
      <article aria-labelledby={titleId} className={styles.article}>
        <h2 id={titleId} className={styles.title} lang={title.lang}>
          {title.value}
        </h2>

        {image && (
          <div className={styles.plate}>
            <Button
              ref={stage}
              variant="plain"
              className={styles.stage}
              style={
                {
                  '--stage-ratio': stageRatio,
                  '--view-ratio': image.aspectRatio,
                } as CSSProperties
              }
              aria-label={`${labels.enlarge}: ${title.value}`}
              onClick={() => lightbox.open(active)}
            >
              <Figure image={image} sizes="(min-width: 1024px) 60vw, 100vw" style={CONTAIN} />
            </Button>
            {work.images.length > 1 && (
              <ul className={styles.views}>
                {work.images.map((view, index) => (
                  <li key={view.src}>
                    <Button
                      variant="plain"
                      className={styles.view}
                      aria-pressed={index === active}
                      aria-label={`${labels.showImage} ${index + 1}`}
                      onClick={() => setActive(index)}
                    >
                      <Figure image={view} sizes="64px" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className={styles.text}>
          {facts.length > 0 && (
            <dl className={styles.facts}>
              {facts.map((fact) => (
                <div key={fact.term} className={styles.fact}>
                  <dt className={styles.term}>{fact.term}</dt>
                  <dd className={styles.value} lang={fact.lang}>
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {description.value.length > 0 && (
            <div className={styles.description} lang={description.lang}>
              <PortableText value={description.value} />
            </div>
          )}
        </div>
      </article>

      {work.images.length > 0 && (
        <Lightbox
          {...lightbox.props}
          onIndexChange={(index) => {
            lightbox.props.onIndexChange(index)
            setActive(index)
          }}
          images={work.images.map((view) => ({ image: view, caption: title.value }))}
          getOrigin={() => stage.current}
          lang={lang}
        />
      )}
    </li>
  )
}
