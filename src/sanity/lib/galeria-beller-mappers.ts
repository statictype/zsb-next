import type { GALERIA_BELLER_QUERY_RESULT } from '@/../sanity.types'
import { artistHref } from '@/lib/artist-href'
import { definedFields } from '@/lib/defined-fields'
import { mapCredits, mapEvents } from '@/sanity/lib/editions-mappers'
import { type SanityImageField, toImageData, toShareImage } from '@/sanity/lib/image'
import type { ArtistListItem } from '@/types/edition'
import type { BellerFact, BellerImage, BellerPressKit, GaleriaBeller } from '@/types/galeria-beller'

export type SanityGaleriaBeller = NonNullable<GALERIA_BELLER_QUERY_RESULT>

export function paragraphs(text: string | null | undefined): string[] {
  return (text ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

function toBellerImage(field: SanityImageField | null | undefined): BellerImage | undefined {
  const image = toImageData(field)
  const ref = (field?.asset as { _ref?: string } | undefined)?._ref
  const size = ref?.match(/-(\d+)x(\d+)-\w+$/)
  if (!image || !size) return undefined
  return { ...image, width: Number(size[1]), height: Number(size[2]) }
}

function mapArtists(raw: SanityGaleriaBeller['artists']): ArtistListItem[] {
  return (raw ?? []).map((a) =>
    definedFields({
      _id: a._id,
      name: a.name,
      href: a.hasPage && a.slug ? artistHref(a.slug) : undefined,
    }),
  )
}

function mapPressKit(raw: SanityGaleriaBeller['pressKit']): BellerPressKit | undefined {
  const file = raw?.file
  if (!raw || !file?.url) return undefined
  const filename = file.originalFilename ?? 'press-kit.zip'
  return {
    title: raw.title,
    body: paragraphs(raw.body),
    buttonLabel: raw.buttonLabel,
    href: `${file.url}?dl=${encodeURIComponent(filename)}`,
    sizeBytes: file.size,
  }
}

export function bellerFacts(
  raw: Pick<SanityGaleriaBeller, 'facts'>,
  artistCount: number,
): BellerFact[] {
  const facts: BellerFact[] = []
  if (raw.facts.period) facts.push({ label: 'Perioada', value: raw.facts.period })
  if (raw.facts.location) facts.push({ label: 'Locație', value: raw.facts.location })
  if (artistCount > 0) facts.push({ label: 'Artiști', value: String(artistCount) })
  if (raw.facts.theme) facts.push({ label: 'Temă', value: raw.facts.theme })
  return facts
}

export function mapGaleriaBeller(raw: SanityGaleriaBeller): GaleriaBeller {
  const artists = mapArtists(raw.artists)
  return definedFields({
    title: raw.title,
    heroColor: raw.heroColor,
    wordmark: toBellerImage(raw.wordmark),
    keyVisual: toBellerImage(raw.keyVisual),
    facts: bellerFacts(raw, artists.length),
    info: { title: raw.info.title, body: raw.info.body },
    artists,
    programIntro: paragraphs(raw.programIntro),
    events: mapEvents(raw.events),
    credits: mapCredits(raw.credits),
    pressKit: mapPressKit(raw.pressKit),
    footerText: raw.footerText ?? '',
    ogImage: toShareImage(raw.ogImage) ?? toShareImage(raw.keyVisual),
    metaDescription: raw.metaDescription ?? '',
  })
}
