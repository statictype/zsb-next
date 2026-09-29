import { defineArrayMember, defineField, defineType, type ValidationContext } from 'sanity'
import { slugify } from '@/lib/slugify'
import { MapPointEventsInput } from '@/sanity/components/MapPointEventsInput'
import { PinIcon } from '@/sanity/icons'

// harta-beller (scripts/fetch-content.ts, src/types.ts) reads these kind values and the
// "lat, lng" coordinates string.
const KINDS = [
  { title: 'Lucrare', value: 'work' },
  { title: 'Stand', value: 'stand' },
  { title: 'Atelier', value: 'atelier' },
  { title: 'Proiecție', value: 'proiectie' },
  { title: 'Gustă Beller (partener)', value: 'food' },
  { title: 'Util', value: 'info' },
] as const

const COORDINATES = /^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/
const STREET_CENTER = { lat: 44.4618, lng: 26.0948 }
const MAX_DISTANCE_M = 500
const COORDINATES_HELP = 'Lipește coordonatele din Google Maps, de forma 44.46347, 26.09532.'
const WORK_ID = /^lucrare-\d+$/

interface MapPointValue {
  _key?: string
  kind?: string
  work?: { _ref?: string }
  pointId?: { current?: string }
}

function distanceM(lat: number, lng: number): number {
  const rad = (deg: number) => (deg * Math.PI) / 180
  const dLat = rad(lat - STREET_CENTER.lat)
  const dLng = rad(lng - STREET_CENTER.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat)) * Math.cos(rad(STREET_CENTER.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * 6371000 * Math.asin(Math.sqrt(h))
}

function checkCoordinates(value: string | undefined): true | string {
  if (!value?.trim()) return `Obligatoriu. ${COORDINATES_HELP}`
  const match = COORDINATES.exec(value.trim())
  if (!match) return COORDINATES_HELP
  const lat = Number(match[1])
  const lng = Number(match[2])
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return COORDINATES_HELP
  const distance = distanceM(lat, lng)
  if (distance > MAX_DISTANCE_M) {
    return `Punctul este la ${Math.round(distance)} m de strada Beller (maximum ${MAX_DISTANCE_M} m). ${COORDINATES_HELP}`
  }
  return true
}

function parentOf(context: ValidationContext): MapPointValue {
  return (context.parent ?? {}) as MapPointValue
}

function siblingsOf(context: ValidationContext): MapPointValue[] {
  const own = parentOf(context)._key
  const points = (context.document?.['mapPoints'] ?? []) as MapPointValue[]
  return points.filter((p) => p._key !== own)
}

function isWork(parent: unknown): boolean {
  return (parent as MapPointValue | undefined)?.kind === 'work'
}

export const mapPoint = defineType({
  name: 'mapPoint',
  title: 'Punct pe hartă',
  type: 'object',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'kind',
      title: 'Tip',
      type: 'string',
      options: { list: [...KINDS], layout: 'radio', direction: 'horizontal' },
      initialValue: 'work',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'work',
      title: 'Lucrare',
      description: 'Doar lucrările artiștilor din tabul Artiști.',
      type: 'reference',
      to: [{ type: 'work' }],
      hidden: ({ parent }) => !isWork(parent),
      options: {
        filter: ({ document }) => ({
          filter: 'artist._ref in $artists',
          params: {
            artists: ((document['artists'] ?? []) as { _ref?: string }[]).flatMap((a) =>
              a._ref ? [a._ref] : [],
            ),
          },
        }),
      },
      validation: (rule) =>
        rule.custom((value, context) => {
          if (!isWork(context.parent)) return true
          if (!value?._ref) return 'Alege lucrarea.'
          const taken = siblingsOf(context).some(
            (p) => p.kind === 'work' && p.work?._ref === value._ref,
          )
          return taken ? 'Lucrarea are deja un punct pe hartă.' : true
        }),
    }),
    defineField({
      name: 'label',
      title: 'Titlu',
      type: 'string',
      hidden: ({ parent }) => isWork(parent),
      validation: (rule) =>
        rule.custom((value, context) =>
          isWork(context.parent) || value?.trim() ? true : 'Completează titlul.',
        ),
    }),
    defineField({
      name: 'pointId',
      title: 'Id pentru link',
      description:
        'Apare în linkul hărții: /?poi=<id>. Linkurile deja trimise cu vechiul id nu mai funcționează după o schimbare.',
      type: 'slug',
      hidden: ({ parent }) => isWork(parent),
      options: {
        source: (_document, { parent }) => (parent as { label?: string } | undefined)?.label ?? '',
        slugify,
        maxLength: 60,
      },
      validation: (rule) =>
        rule.custom((value, context) => {
          if (isWork(context.parent)) return true
          const id = value?.current
          if (!id) return 'Completează id-ul (apasă Generate).'
          if (WORK_ID.test(id)) return 'Id-urile lucrare-<număr> sunt rezervate lucrărilor.'
          const taken = siblingsOf(context).some(
            (p) => p.kind !== 'work' && p.pointId?.current === id,
          )
          return taken ? 'Alt punct are deja acest id.' : true
        }),
    }),
    defineField({
      name: 'note',
      title: 'Notă',
      description: 'Opțional. Un rând sub titlu, de exemplu adresa.',
      type: 'string',
      hidden: ({ parent }) => isWork(parent),
    }),
    defineField({
      name: 'url',
      title: 'Link',
      description: 'Opțional.',
      type: 'url',
      hidden: ({ parent }) => isWork(parent),
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordonate',
      description:
        'În Google Maps, apasă lung pe loc, apoi copiază coordonatele din bara de căutare. Exemplu: 44.4634775998144, 26.095325607373564',
      type: 'string',
      validation: (rule) => rule.custom(checkCoordinates),
    }),
    defineField({
      name: 'events',
      title: 'Evenimente',
      description: 'Opțional. Evenimentele din Program care au loc la acest punct.',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      components: { input: MapPointEventsInput },
      validation: (rule) =>
        rule.custom((keys, context) => {
          if (!keys?.length) return true
          const events = (context.document?.['events'] ?? []) as { _key?: string }[]
          const known = new Set(events.map((e) => e._key))
          return keys.every((key) => known.has(key as string))
            ? true
            : 'Un eveniment bifat a fost șters din Program. Debifează-l.'
        }),
    }),
  ],
  preview: {
    select: {
      kind: 'kind',
      label: 'label',
      workKey: 'work.key',
      workTitle: 'work.title.ro',
      coordinates: 'coordinates',
    },
    prepare({ kind, label, workKey, workTitle, coordinates }) {
      const title =
        kind === 'work'
          ? `${workKey ?? '?'}. ${workTitle ?? 'Lucrare nealeasă'}`
          : (label ?? 'Fără titlu')
      const kindTitle = KINDS.find((k) => k.value === kind)?.title ?? ''
      return { title, subtitle: [kindTitle, coordinates].filter(Boolean).join(' · ') }
    },
  },
})
