'use client'

import { artistProfile } from '@artists-components/ArtistProfile.recipe'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { RiArrowRightUpLine } from '@remixicon/react'
import { Fragment, type RefObject, useEffect, useId, useRef, useState } from 'react'
import { cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { Figure } from '@/components/Figure/Figure'
import { Lightbox, useLightbox } from '@/components/Lightbox/Lightbox'
import { Badge } from '@/components/ui/Badge/Badge'
import { Button } from '@/components/ui/Button/Button'
import { askZsbHref } from '@/lib/ask-zsb'
import { SITE_NAME } from '@/lib/constants'
import { editionHref } from '@/lib/edition-href'
import type { CreditedImage, ArtistProfile as Profile, ProfileWork } from '@/types/edition'

const PLATE_SIZES = '(min-width: 1024px) 50vw, 100vw'
const READING_LINE = '-70% 0px -30% 0px'
const PORTRAIT_FOCUS = 'center 25%'
const WORK_FOCUS = 'center'

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

function platesOf(artist: Profile): Plate[] {
  const works = artist.works.flatMap((work) => {
    const lead = work.images[0]
    return lead
      ? [
          {
            key: work.id,
            image: { ...lead, alt: '' },
            caption: work.title,
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
          caption: '',
          focus: artist.portrait.focus ?? PORTRAIT_FOCUS,
        },
        ...works,
      ]
    : works
}

function plateCaption(plate: Plate | undefined): string {
  if (!plate) return ''
  return [plate.caption, plate.image.credit].filter(Boolean).join(' · ')
}

function useActivePlate(root: RefObject<HTMLElement | null>, count: number): number {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const el = root.current
    if (!el || count < 2) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.plate))
        }
      },
      { rootMargin: READING_LINE },
    )
    for (const section of el.querySelectorAll<HTMLElement>('[data-plate]')) {
      observer.observe(section)
    }
    return () => observer.disconnect()
  }, [root, count])
  return active
}

interface ArtistProfileProps {
  artist: Profile
  contactEmail?: string | undefined
}

export function ArtistProfile({ artist, contactEmail }: ArtistProfileProps) {
  const root = useRef<HTMLDivElement>(null)
  const plates = platesOf(artist)
  const plateIndex = new Map(plates.map((plate, index) => [plate.key, index]))
  const active = useActivePlate(root, plates.length)
  const worksId = useId()
  const styles = artistProfile({ withPlate: plates.length > 0 })

  return (
    <div ref={root} className={styles.root}>
      {plates.length > 0 && (
        <figure className={styles.plate}>
          <div className={styles.plateFrame}>
            {plates.map((plate, index) => (
              <Figure
                key={plate.key}
                image={plate.image}
                sizes={PLATE_SIZES}
                preload={index === 0}
                style={{ objectPosition: plate.focus }}
                className={cx(styles.plateImage, index === active && styles.plateImageActive)}
              />
            ))}
          </div>
          <Text as="figcaption" variant="label" className={styles.plateCaption}>
            {plateCaption(plates[active])}
          </Text>
        </figure>
      )}

      <div className={styles.column}>
        <header className={styles.intro} data-plate={plates.length > 0 ? 0 : undefined}>
          {artist.editions.length > 0 && (
            <ul className={styles.editions} aria-label="Editions">
              {artist.editions.map((year) => (
                <li key={year}>
                  <Badge tone="outline">ZSB {year}</Badge>
                </li>
              ))}
            </ul>
          )}
          <Text as="h1" variant="display">
            {artist.name}
          </Text>
          {artist.discipline && (
            <Text as="p" variant="lead">
              {artist.discipline}
            </Text>
          )}
          {artist.bio.length > 0 && (
            <div className={styles.bio}>
              <PortableText value={artist.bio} components={paragraphs} />
            </div>
          )}
          {(contactEmail || artist.links.length > 0) && (
            <div className={styles.actions}>
              {contactEmail && (
                <Button asChild variant="primary" size="sm">
                  <a href={askZsbHref(contactEmail, artist.name)}>Ask ZSB about this artist</a>
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
        </header>

        {artist.works.length > 0 && (
          <section aria-labelledby={worksId}>
            <h2 id={worksId} className={styles.srOnly}>
              Works shown at {SITE_NAME}
            </h2>
            <ol className={styles.works}>
              {artist.works.map((work) => (
                <li key={work.id} data-plate={plateIndex.get(work.id)}>
                  <WorkEntry work={work} artist={artist.name} contactEmail={contactEmail} />
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </div>
  )
}

interface WorkEntryProps {
  work: ProfileWork
  artist: string
  contactEmail?: string | undefined
}

function WorkEntry({ work, artist, contactEmail }: WorkEntryProps) {
  const lightbox = useLightbox()
  const thumbs = useRef<(HTMLButtonElement | null)[]>([])
  const inline = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const styles = artistProfile()
  const lead = work.images[0]
  const facts = [work.material, work.dimensions, work.year].filter(Boolean).join(' · ')

  return (
    <article aria-labelledby={titleId} className={styles.work}>
      <div className={styles.facts}>
        <Text as="h3" id={titleId} variant="heading">
          {work.title}
        </Text>
        {facts && (
          <Text as="p" variant="caption">
            {facts}
          </Text>
        )}
        {work.with.length > 0 && (
          <Text as="p" variant="caption">
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
        <Text as="p" variant="caption">
          Shown at{' '}
          <Button asChild variant="link">
            <a href={editionHref(work.edition)}>
              {SITE_NAME} {work.edition}
            </a>
          </Button>
        </Text>
      </div>

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

      {work.description.length > 0 && (
        <div className={styles.description}>
          <PortableText value={work.description} components={paragraphs} />
        </div>
      )}

      {work.images.length > 0 && (
        <ul className={styles.thumbs}>
          {work.images.map((image, index) => (
            <li key={image.src}>
              <Button
                ref={(el) => {
                  thumbs.current[index] = el
                }}
                variant="plain"
                className={styles.thumb}
                aria-label={`Photo ${index + 1} of ${work.images.length}: ${work.title}`}
                onClick={() => lightbox.open(index)}
              >
                <Figure image={{ ...image, alt: '' }} sizes="72px" className={styles.thumbImage} />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {contactEmail && (
        <Button asChild variant="link">
          <a href={askZsbHref(contactEmail, artist, work.title)}>Ask ZSB about this work</a>
        </Button>
      )}

      {work.images.length > 0 && (
        <Lightbox
          {...lightbox.props}
          images={work.images.map((image) => ({
            image,
            caption: [work.title, image.credit].filter(Boolean).join(' · '),
          }))}
          getOrigin={(index) => {
            const thumb = thumbs.current[index]
            return thumb?.offsetParent ? thumb : inline.current
          }}
          lang="en"
        />
      )}
    </article>
  )
}
