'use client'

import type { ArtistLabels } from '@artists-components/artist-labels'
import { workCarousel } from '@artists-components/WorkCarousel.recipe'
import { PortableText } from '@portabletext/react'
import { useEffect, useRef, useState } from 'react'
import { Figure } from '@/components/Figure/Figure'
import { useReducedMotion } from '@/components/reduced-motion'
import { Button } from '@/components/ui/Button/Button'
import type { ArtistWork, Lang } from '@/types/edition'

const WORK_PARAM = 'w'

interface WorkCarouselProps {
  works: ArtistWork[]
  lang: Lang
  labels: ArtistLabels
}

export function WorkCarousel({ works, lang, labels }: WorkCarouselProps) {
  const track = useRef<HTMLOListElement>(null)
  const [current, setCurrent] = useState(0)
  const reducedMotion = useReducedMotion()
  const styles = workCarousel()

  useEffect(() => {
    const requested = Number(new URLSearchParams(window.location.search).get(WORK_PARAM))
    const index = works.findIndex((work) => work.key === requested)
    const el = track.current
    if (el && index > 0) el.scrollTo({ left: index * el.clientWidth, behavior: 'instant' })
  }, [works])

  const go = (index: number) => {
    const el = track.current
    if (!el) return
    el.scrollTo({ left: index * el.clientWidth, behavior: reducedMotion ? 'instant' : 'smooth' })
  }

  const onScroll = () => {
    const el = track.current
    if (el) setCurrent(Math.round(el.scrollLeft / el.clientWidth))
  }

  return (
    <div className={styles.root}>
      {works.length > 1 && (
        <div className={styles.controls}>
          <Button
            variant="link"
            onClick={() => go(current - 1)}
            disabled={current === 0}
            aria-label={labels.previous}
          >
            ←
          </Button>
          <span className={styles.counter} aria-live="polite">
            {current + 1} / {works.length}
          </span>
          <Button
            variant="link"
            onClick={() => go(current + 1)}
            disabled={current === works.length - 1}
            aria-label={labels.next}
          >
            →
          </Button>
        </div>
      )}
      <ol ref={track} className={styles.track} onScroll={onScroll}>
        {works.map((work) => (
          <WorkSlide key={work.key} work={work} lang={lang} labels={labels} />
        ))}
      </ol>
    </div>
  )
}

interface WorkSlideProps {
  work: ArtistWork
  lang: Lang
  labels: ArtistLabels
}

function WorkSlide({ work, lang, labels }: WorkSlideProps) {
  const [active, setActive] = useState(0)
  const styles = workCarousel()
  const title = work.title[lang]
  const material = work.material?.[lang]
  const description = work.description[lang]

  return (
    <li id={`${WORK_PARAM}-${work.key}`} className={styles.slide}>
      <div className={styles.cover}>
        <Figure image={work.images[active]} sizes="(min-width: 640px) 640px, 100vw" />
      </div>
      {work.images.length > 1 && (
        <ul className={styles.thumbs}>
          {work.images.map((image, index) => (
            <li key={image.src}>
              <Button
                variant="plain"
                className={styles.thumb}
                aria-pressed={index === active}
                aria-label={`${labels.showImage} ${index + 1}`}
                onClick={() => setActive(index)}
              >
                <Figure image={image} sizes="56px" />
              </Button>
            </li>
          ))}
        </ul>
      )}
      <h3 className={styles.title} lang={title.lang}>
        {title.value}
      </h3>
      <dl className={styles.meta}>
        {material && (
          <>
            <dt className={styles.metaTerm}>{labels.material}</dt>
            <dd lang={material.lang}>{material.value}</dd>
          </>
        )}
        {work.dimensions && (
          <>
            <dt className={styles.metaTerm}>{labels.dimensions}</dt>
            <dd>{work.dimensions}</dd>
          </>
        )}
        {work.year && (
          <>
            <dt className={styles.metaTerm}>{labels.year}</dt>
            <dd>{work.year}</dd>
          </>
        )}
      </dl>
      {description.value.length > 0 && (
        <div className={styles.description} lang={description.lang}>
          <PortableText value={description.value} />
        </div>
      )}
    </li>
  )
}
