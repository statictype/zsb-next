'use client'

import { artistProfile } from '@artists-components/ArtistProfile.recipe'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { RiArrowDownLine, RiArrowRightUpLine } from '@remixicon/react'
import Link from 'next/link'
import { Fragment, type RefObject, useEffect, useId, useRef, useState } from 'react'
import { cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { Figure } from '@/components/Figure/Figure'
import { Lightbox, useLightbox } from '@/components/Lightbox/Lightbox'
import { Logo } from '@/components/Navigation/Logo'
import { Button } from '@/components/ui/Button/Button'
import { SITE_NAME } from '@/lib/constants'
import { editionHref } from '@/lib/edition-href'
import type { CreditedImage, ArtistProfile as Profile, ProfileWork } from '@/types/edition'

const PLATE_SIZES = '(min-width: 1024px) 50vw, 100vw'
const MIDLINE = '-50% 0px -50% 0px'
const DESKTOP = '(min-width: 1024px)'
const PORTRAIT_FOCUS = 'center 25%'
const WORK_FOCUS = 'center'
const WORKS_ANCHOR = 'works'
const EDITION_LIST = new Intl.ListFormat('en', { type: 'conjunction' })

const paragraphs: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <Text as="p" variant="body">
        {children}
      </Text>
    ),
  },
}

interface Plate {
  key: string
  image: CreditedImage
  caption: string
  focus: string
}

function photoCaption(title: string, image: CreditedImage): string {
  return [title, image.credit].filter(Boolean).join(' · ')
}

function platesOf(artist: Profile): Plate[] {
  const works = artist.works.flatMap((work) => {
    const lead = work.images[0]
    return lead
      ? [
          {
            key: work.id,
            image: { ...lead, alt: '' },
            caption: photoCaption(work.title, lead),
            focus: lead.focus ?? WORK_FOCUS,
          },
        ]
      : []
  })
  return artist.portrait
    ? [
        {
          key: 'portrait',
          image: artist.portrait,
          caption: artist.portrait.credit ?? '',
          focus: artist.portrait.focus ?? PORTRAIT_FOCUS,
        },
        ...works,
      ]
    : works
}

function useActiveChapter(root: RefObject<HTMLElement | null>, count: number): number {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const el = root.current
    if (!el || count < 2 || !window.matchMedia(DESKTOP).matches) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.chapter))
        }
      },
      { rootMargin: MIDLINE },
    )
    for (const chapter of el.querySelectorAll<HTMLElement>('[data-chapter]')) {
      observer.observe(chapter)
    }
    return () => observer.disconnect()
  }, [root, count])
  return active
}

interface ArtistProfileProps {
  artist: Profile
}

export function ArtistProfile({ artist }: ArtistProfileProps) {
  const root = useRef<HTMLDivElement>(null)
  const plates = platesOf(artist)
  const plateIndex = new Map(plates.map((plate, index) => [plate.key, index]))
  const active = useActiveChapter(root, plates.length)
  const [reached, setReached] = useState(0)
  const worksId = useId()
  const hasBio = artist.bio.length > 0
  const showWorksLink = hasBio && artist.works.length > 0
  const styles = artistProfile({ withPlate: plates.length > 0 })

  if (active > reached) setReached(active)

  return (
    <div ref={root} className={styles.root}>
      {plates.length > 0 && (
        <figure className={styles.plate}>
          <Link href="/" data-logo-dock className={styles.plateLogo}>
            <Logo />
          </Link>
          <div className={styles.plateFrame}>
            {plates.map(
              (plate, index) =>
                index <= reached + 1 && (
                  <Figure
                    key={plate.key}
                    image={plate.image}
                    sizes={PLATE_SIZES}
                    preload={index === 0}
                    style={{ objectPosition: plate.focus }}
                    className={cx(
                      styles.plateImage,
                      index <= active ? styles.plateImageShown : styles.plateImageHidden,
                    )}
                  />
                ),
            )}
          </div>
          <Text as="figcaption" variant="label" className={styles.plateCaption}>
            {plates[active]?.caption}
          </Text>
        </figure>
      )}

      <div className={styles.column}>
        <header
          className={styles.chapter}
          data-chapter={hasBio && plates.length > 0 ? 0 : undefined}
        >
          <div className={styles.intro}>
            <Text as="h1" variant="display">
              {artist.name}
            </Text>
            {artist.discipline && (
              <Text as="p" variant="lead">
                {artist.discipline}
              </Text>
            )}
            {artist.editions.length > 0 && (
              <Text as="p" variant="body">
                Shown at {EDITION_LIST.format(artist.editions.map((year) => `ZSB ${year}`))}
              </Text>
            )}
            {hasBio && (
              <div className={styles.bio}>
                <PortableText value={artist.bio} components={paragraphs} />
              </div>
            )}
            {(showWorksLink || artist.links.length > 0) && (
              <div className={styles.actions}>
                {showWorksLink && (
                  <Button asChild variant="secondary" size="sm">
                    <a href={`#${WORKS_ANCHOR}`}>
                      See works
                      <RiArrowDownLine size={14} />
                    </a>
                  </Button>
                )}
                {artist.links.map((link) => (
                  <Button key={link.url} asChild variant="secondary" size="sm">
                    <a href={link.url} target="_blank" rel="noreferrer noopener">
                      {link.label}
                      <RiArrowRightUpLine size={14} />
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </header>

        {artist.works.length > 0 && (
          <section id={WORKS_ANCHOR} aria-labelledby={worksId} className={styles.works}>
            <h2 id={worksId} className={styles.srOnly}>
              Works shown at {SITE_NAME}
            </h2>
            {artist.works.map((work, index) => (
              <WorkChapter
                key={work.id}
                work={work}
                chapter={plateIndex.get(work.id) ?? null}
                flush={index === 0 && !hasBio}
              />
            ))}
          </section>
        )}
      </div>
    </div>
  )
}

interface WorkChapterProps {
  work: ProfileWork
  chapter: number | null
  flush: boolean
}

function WorkChapter({ work, chapter, flush }: WorkChapterProps) {
  const lightbox = useLightbox()
  const items = useRef<(HTMLButtonElement | null)[]>([])
  const inline = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const styles = artistProfile({ flush })
  const lead = work.images[0]
  const facts: [string, string][] = [
    ['Material', work.material ?? ''],
    ['Dimensions', work.dimensions ?? ''],
    ['Year', work.year ?? ''],
  ]

  return (
    <article
      aria-labelledby={titleId}
      className={cx(styles.chapter, styles.workChapter)}
      data-chapter={chapter ?? undefined}
    >
      <Text as="h3" id={titleId} variant="title">
        {work.title}
      </Text>

      {lead && (
        <Button
          ref={inline}
          variant="plain"
          className={styles.inlinePlate}
          aria-label={`Enlarge ${work.title}`}
          onClick={() => lightbox.open(0)}
        >
          <Figure
            image={lead}
            sizes="100vw"
            style={{ objectPosition: lead.focus ?? WORK_FOCUS }}
            className={styles.inlineImage}
          />
        </Button>
      )}

      <dl className={styles.facts}>
        {facts
          .filter(([, value]) => value)
          .map(([term, value]) => (
            <Fragment key={term}>
              <Text as="dt" variant="label" className={styles.term}>
                {term}
              </Text>
              <Text as="dd" variant="body">
                {value}
              </Text>
            </Fragment>
          ))}
        <Text as="dt" variant="label" className={styles.term}>
          Shown at
        </Text>
        <Text as="dd" variant="body">
          <Button asChild variant="link">
            <a href={editionHref(work.edition)}>ZSB {work.edition}</a>
          </Button>
        </Text>
      </dl>

      {work.with.length > 0 && (
        <Text as="p" variant="caption" className={styles.with}>
          With{' '}
          {work.with.map((other, index) => (
            <Fragment key={other.href}>
              {index > 0 && ', '}
              <Button asChild variant="link">
                <a href={other.href}>{other.name}</a>
              </Button>
            </Fragment>
          ))}
        </Text>
      )}

      {work.description.length > 0 && (
        <div className={styles.description}>
          <PortableText value={work.description} components={paragraphs} />
        </div>
      )}

      {work.images.length > 0 && (
        <ul className={styles.sheet}>
          {work.images.map((image, index) => (
            <li key={image.src}>
              <Button
                ref={(el) => {
                  items.current[index] = el
                }}
                variant="plain"
                className={styles.sheetItem}
                aria-label={`Photo ${index + 1} of ${work.images.length}: ${work.title}`}
                onClick={() => lightbox.open(index)}
              >
                <Figure
                  image={{ ...image, alt: '' }}
                  sizes="(min-width: 1024px) 136px, 25vw"
                  className={styles.sheetImage}
                />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {work.images.length > 0 && (
        <Lightbox
          {...lightbox.props}
          images={work.images.map((image) => ({
            image,
            caption: photoCaption(work.title, image),
          }))}
          getOrigin={(index) => {
            const item = items.current[index]
            return item?.offsetParent ? item : inline.current
          }}
          lang="en"
        />
      )}
    </article>
  )
}
