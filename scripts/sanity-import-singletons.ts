/**
 * Import the seven static-page singletons into Sanity.
 *
 *   siteSettings · homepage · aboutPage · partnersPage · visitPage · pressPage · privacyPage
 *
 * For each singleton:
 *   - Builds the doc from the values currently used as in-page FALLBACK constants
 *     (the same content the site renders today before any Sanity doc is published).
 *   - Downloads referenced images from their current Blob (or /public) URL and
 *     re-uploads to Sanity assets.
 *   - Skips singletons that are already present in the dataset (idempotent).
 *
 * Usage:
 *   pnpm exec tsx scripts/sanity-import-singletons.ts          # apply
 *   pnpm exec tsx scripts/sanity-import-singletons.ts --dry    # preview, no writes
 *   pnpm exec tsx scripts/sanity-import-singletons.ts --only homepage,visitPage
 */

import './_load-env'

import { readFile } from 'node:fs/promises'
import { resolve as resolvePath } from 'node:path'
import { createClient, type SanityClient } from '@sanity/client'

const SINGLETON_IDS = [
  'siteSettings',
  'homepage',
  'aboutPage',
  'partnersPage',
  'visitPage',
  'pressPage',
  'privacyPage',
] as const

type SingletonId = (typeof SINGLETON_IDS)[number]

interface ImageRef {
  _type: 'image'
  asset: { _type: 'reference'; _ref: string }
  alt: string
}

interface UploadContext {
  client: SanityClient
  cache: Map<string, string>
  dryRun: boolean
}

const BLOB_BASE = process.env.NEXT_PUBLIC_BLOB_URL
function blobUrl(path: string): string {
  if (!BLOB_BASE) throw new Error('Missing NEXT_PUBLIC_BLOB_URL')
  return `${BLOB_BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

async function uploadAsset(
  ctx: UploadContext,
  source: string,
  label: string,
): Promise<string> {
  const cached = ctx.cache.get(source)
  if (cached) return cached
  process.stdout.write(`    ↳ ${label} `)
  if (ctx.dryRun) {
    const fake = `image-dryrun-${ctx.cache.size}`
    ctx.cache.set(source, fake)
    console.log('(dry)')
    return fake
  }
  let buf: Buffer
  let filename: string
  if (source.startsWith('/')) {
    const abs = resolvePath('public', source.replace(/^\//, ''))
    buf = await readFile(abs)
    filename = source.split('/').pop() ?? 'image'
  } else {
    const res = await fetch(source)
    if (!res.ok) throw new Error(`Failed to fetch ${source}: ${res.status}`)
    buf = Buffer.from(await res.arrayBuffer())
    filename = source.split('/').pop()?.split('?')[0] ?? 'image'
  }
  const asset = await ctx.client.assets.upload('image', buf, { filename })
  ctx.cache.set(source, asset._id)
  console.log(asset._id.split('-')[1] ?? 'ok')
  return asset._id
}

async function img(ctx: UploadContext, src: string, alt: string, label: string): Promise<ImageRef> {
  const assetId = await uploadAsset(ctx, src, label)
  return { _type: 'image', asset: { _type: 'reference', _ref: assetId }, alt }
}

// ---------------------------------------------------------------------------
// Singleton builders
// ---------------------------------------------------------------------------

function buildSiteSettings(): Record<string, unknown> {
  return {
    _id: 'siteSettings',
    _type: 'siteSettings',
    contactEmail: 'office@filialadesculptura.com',
    instagramUrl: 'https://www.instagram.com/filialadesculptura/',
    facebookUrl: 'https://www.facebook.com/filiala.de.sculptura/',
  }
}

async function buildHomepage(ctx: UploadContext): Promise<Record<string, unknown>> {
  console.log('\nBuilding homepage…')
  const slides: Array<{ src: string; alt: string; position: 'top' | 'center' | 'bottom' }> = [
    { src: blobUrl('2025/_dsc5496.jpg'), alt: 'ZSB 2025', position: 'top' },
    { src: blobUrl('2025/_dsc5562.jpg'), alt: 'ZSB 2025', position: 'center' },
    { src: blobUrl('2025/bws02058.jpg'), alt: 'ZSB 2025', position: 'center' },
    { src: blobUrl('2025/_dsc5501.jpg'), alt: 'ZSB 2025', position: 'bottom' },
    { src: blobUrl('2025/_dsc5547.jpg'), alt: 'ZSB 2025', position: 'top' },
    { src: blobUrl('2025/_dsc5464.jpg'), alt: 'ZSB 2025', position: 'center' },
    { src: blobUrl('2025/_dsc5665.jpg'), alt: 'ZSB 2025', position: 'top' },
  ]
  const slideshow = []
  for (let i = 0; i < slides.length; i += 1) {
    const s = slides[i]!
    const image = await img(ctx, s.src, s.alt, `slide ${i + 1}`)
    slideshow.push({
      _key: `slide-${i}`,
      _type: 'heroSlide',
      position: s.position,
      image,
    })
  }
  return {
    _id: 'homepage',
    _type: 'homepage',
    heroTitle: 'Bucharest Sculpture Days',
    heroTitleAccent: 'Sculpture Days',
    heroLead:
      'Artists shift the boundaries of form. ZSB gives those shifts a place to land.',
    heroCtaLabel: 'Explore the 2025 edition',
    heroCtaEdition: { _type: 'reference', _ref: 'edition-2025' },
    slideshow,
    editionsIntro:
      'Edition after edition, ZSB holds open the question of what sculpture can do with body, matter, space, and memory.',
  }
}

async function buildAboutPage(ctx: UploadContext): Promise<Record<string, unknown>> {
  console.log('\nBuilding aboutPage…')
  const placeImage = await img(
    ctx,
    blobUrl('2023/od6-0441.jpg'),
    'Combinatul Fondului Plastic, Bucharest — facade at night',
    'about placeImage',
  )
  const curatorPortrait = await img(
    ctx,
    '/img/s200_csapo_reka.dup.jpg',
    'Reka Csapo Dup',
    'about curatorPortrait',
  )
  return {
    _id: 'aboutPage',
    _type: 'aboutPage',
    hero: {
      _type: 'pageHero',
      title: 'About ZSB',
      titleAccent: 'ZSB',
      lead: 'An annual platform for Romanian contemporary sculpture. Born online in 2021, built each year through exhibitions, film, critical debate, and education.',
    },
    notFestivalTitle: 'Not a festival',
    notFestivalBody: [
      'We are not running a festival. We are, year by year, building the infrastructure through which Romanian sculpture can survive, be seen, and matter.',
      'ZSB exists to position contemporary sculpture as a critical practice of the present, to support the visibility and professional recognition of Romanian sculptors, and to build a living archive of Romanian contemporary sculpture in Bucharest.',
      'Each edition creates a public context where sculpture meets film, debate, and education.',
    ],
    pillars: [
      {
        _key: 'pillar-0',
        _type: 'pillar',
        label: 'Why now?',
        body: 'The profession is ageing. Young sculptors have no studios, no visibility, no entry point. If we do not build the structures to support them now, we lose a generation. ZSB is part of that building.',
      },
      {
        _key: 'pillar-1',
        _type: 'pillar',
        label: 'Why Bucharest?',
        body: 'ZSB found its home at Combinatul Fondului Plastic, a rare complex of working studios and foundries in the heart of Bucharest. A space that proves there is still room for sculpture to be made, shown, and argued over at full scale.',
      },
    ],
    placeImage,
    curatorEyebrow: 'A word from the curator',
    curatorHeadline: 'Why we keep going',
    curatorPortrait,
    curatorName: 'Reka Csapo Dup',
    curatorRole: 'Curator, ZSB',
    curatorLetter: [
      'Bucharest Sculpture Days began to take shape gradually from 2016, when, together with several fellow sculptors from Combinatul Fondului Plastic, we founded the Combinart 1+1=10 association to realise cultural projects that would highlight the power and versatility of the sculpture profession.',
      'Our first major event was organised in 2016, in which we screened films about and with sculpture and organised the first edition of the "Sculptors for the Future" competition. The members of the association, which dissolved in 2018, continue to be active largely in the leadership of the Bucharest Sculpture Branch of the Union of Visual Artists.',
      'In 2026, at the sixth edition, it is even more important to continue with large-scale events to highlight Romanian sculpture. Over time, the profession has begun to age, and young sculptors find it harder to reach their peak due to a lack of studio space and financial constraints.',
      'Our goal is to lay the foundations for a Romanian Sculpture Centre where we can offer both working studios and transposition workshops, material resources through project-writing teams, and a platform for the profession to consolidate and grow.',
      'In the Brâncuși Year, 150 years after the birth of Constantin Brâncuși, let us draw inspiration from the support the great sculptor received from Romanian society at the beginning of his journey, and let us begin to build the future of Romanian sculpture.',
    ],
  }
}

async function buildPartnersPage(ctx: UploadContext): Promise<Record<string, unknown>> {
  console.log('\nBuilding partnersPage…')
  const eventImage = await img(
    ctx,
    blobUrl('2025/_dsc5708.jpg'),
    'Performance and audience at ZSB 2025, Combinatul Fondului Plastic',
    'partners eventImage',
  )
  const whyImage = await img(
    ctx,
    blobUrl('2023/od6-0211.jpg'),
    'Visitors examining a sculpture at ZSB 2023',
    'partners whyImage',
  )
  const whyPoints = [
    {
      title: 'Permanence of Material',
      text: "Bronze, stone, steel, ceramic: sculpture is made from materials that outlast the artist, the gallery, the century. It doesn't fade, doesn't buffer, doesn't need a screen.",
    },
    {
      title: 'Resistance to Reproduction',
      text: 'A sculpture cannot be fully experienced through a photograph or a screen. Its mass, its shadow, the way it occupies and transforms space: these resist digital replication in ways that flat images cannot.',
    },
    {
      title: 'Physical Presence',
      text: 'In an era of AI-generated imagery and virtual experiences, sculpture demands your body to be present. You walk around it, look up at it, touch it. This physicality is increasingly rare and increasingly valuable.',
    },
    {
      title: 'The Social Dimension',
      text: 'Public sculpture creates gathering points, conversation, civic identity. It turns a space into a place. ZSB amplifies this at a venue that proves there is still room for sculpture to be made, shown, and argued over at full scale.',
    },
  ].map((p, i) => ({ _key: `why-${i}`, _type: 'whyPoint', ...p }))

  return {
    _id: 'partnersPage',
    _type: 'partnersPage',
    hero: {
      _type: 'pageHero',
      title: 'Partners',
      titleAccent: 's',
      lead: 'ZSB is built by a small team and sustained by the people and organisations who believe sculpture deserves a place. If that matters to you, there is room here.',
    },
    eventTitle: 'The event',
    eventBody: [
      'Since 2021, ZSB has brought together Romanian contemporary sculpture and its public at Combinatul Fondului Plastic. Five editions, dozens of artists, hundreds of works, and thousands of visitors who encountered sculpture, often for the first time, without a ticket.',
    ],
    eventImage,
    whyEyebrow: 'Why Sculpture',
    whyTitle: 'The most resilient art form',
    whyImage,
    whyPoints,
    ctaHeading: 'BECOME A PARTNER',
    ctaHeadingAccent: 'PARTNER',
    ctaBody:
      "We work with institutional partners, cultural organisations, and businesses that want a genuine connection to contemporary art practice in Romania. If you're interested, write to us.",
    ctaLabel: 'Get in Touch',
  }
}

async function buildVisitPage(ctx: UploadContext): Promise<Record<string, unknown>> {
  console.log('\nBuilding visitPage…')
  const image = await img(
    ctx,
    blobUrl('2023/od6-0441.jpg'),
    'Combinatul Fondului Plastic venue interior during ZSB',
    'visit image',
  )
  return {
    _id: 'visitPage',
    _type: 'visitPage',
    venueName: ['COMBINATUL', 'FONDULUI', 'PLASTIC'],
    street: 'Str. Băiculești 29',
    city: 'Sector 1, București',
    mapsUrl: 'https://maps.google.com/?q=Combinatul+Fondului+Plastic+Bucuresti',
    image,
    hoursLines: ['Daily 11:00 — 20:00', 'Free Entry'],
    amenities: [
      { _key: 'am-0', _type: 'amenity', label: 'Accessible', icon: 'wheelchair' },
      { _key: 'am-1', _type: 'amenity', label: 'Free Parking', icon: 'parking' },
      { _key: 'am-2', _type: 'amenity', label: 'On-site Café', icon: 'cafe' },
      { _key: 'am-3', _type: 'amenity', label: 'Kids Workshops', icon: 'paint' },
    ],
    transport: [
      {
        _key: 'tr-0',
        _type: 'transportRoute',
        from: 'Gara de Nord',
        lines: 'Bus 205 / Tram 45',
        walk: '5 min walk',
      },
      {
        _key: 'tr-1',
        _type: 'transportRoute',
        from: 'Piața Presei',
        lines: 'Bus 301 / Bus 331',
        walk: '3 min walk',
      },
      {
        _key: 'tr-2',
        _type: 'transportRoute',
        from: 'Piața Unirii',
        lines: 'Bus 205 / Tram 45',
        walk: '5 min walk',
      },
    ],
  }
}

function buildPressPage(): Record<string, unknown> {
  return {
    _id: 'pressPage',
    _type: 'pressPage',
    hero: {
      _type: 'pageHero',
      title: 'Press room',
      titleAccent: 'room',
      lead: 'A reference desk for editors, reporters, and curators. Posters, releases, and media coverage from every edition since 2021.',
    },
    mediaKitEyebrow: 'Media',
  }
}

// Privacy body — translated from the JSX FallbackBody in
// src/app/(site)/privacy/page.tsx. Marks: `strong`, `em`, `link`.
// Link annotations use `{href, newTab}` matching the schema.
function buildPrivacyPage(): Record<string, unknown> {
  const blocks = [
    h2('b1', 'Who we are'),
    p('b2', [
      span('s1', 'This site is operated by the organisers of Bucharest Sculpture Days (Zilele Sculpturii București), a contemporary sculpture event based in Bucharest, Romania. Contact us at '),
      linkSpan('s2', 'lk1', 'office@filialadesculptura.com', false),
      span('s3', ' for any privacy question.'),
    ], [linkMark('lk1', 'mailto:office@filialadesculptura.com', false)]),

    h2('b3', 'What we collect'),
    p('b4', [
      span('s4', 'Only what Google Analytics 4 collects when you accept cookies: anonymised IP address, page views, device and browser type, and approximate location (city level). We do '),
      span('s5', 'not', ['strong']),
      span('s6', ' collect names, email addresses, or payment information through this site.'),
    ]),

    h2('b5', 'Cookies we use'),
    li('b6', 'bullet', [
      span('s7', 'zsb_consent', ['strong']),
      span('s8', ' — first-party, essential. Stores your consent choice (granted or denied). Six-month expiry. Always set.'),
    ]),
    li('b7', 'bullet', [
      span('s9', '_ga, _ga_*', ['strong']),
      span('s10', ' — third-party (Google Analytics 4). Distinguishes visitors and sessions. Set only after you click '),
      span('s11', 'Accept', ['em']),
      span('s12', '. Typical expiry: up to two years.'),
    ]),
    p('b8', [
      span('s13', 'If you click '),
      span('s14', 'Reject', ['em']),
      span('s15', ', no analytics scripts load and no analytics cookies are set.'),
    ]),

    h2('b9', 'Legal basis'),
    p('b10', [
      span('s16', 'We process analytics data on the basis of your consent (GDPR Art. 6(1)(a) and Law 506/2004 Art. 4), which you can withdraw at any time using the button below.'),
    ]),

    h2('b11', 'Your rights'),
    p('b12', [
      span('s17', 'Under GDPR you have the right to access, correct, delete, or export your data, and to lodge a complaint with '),
      linkSpan('s18', 'lk2', 'ANSPDCP', true),
      span('s19', ', the Romanian data protection authority. Email us to exercise any of these rights.'),
    ], [linkMark('lk2', 'https://www.dataprotection.ro/', true)]),
  ]
  return {
    _id: 'privacyPage',
    _type: 'privacyPage',
    hero: {
      _type: 'pageHero',
      title: 'Privacy & Cookies',
      titleAccent: 'Cookies',
      lead: 'How Bucharest Sculpture Days handles your data. Short version: we use Google Analytics to count visitors. No ads, no cross-site tracking, no selling data.',
    },
    body: blocks,
    updatedAt: '2026-04-24',
  }
}

// --- Portable Text helpers ------------------------------------------------

interface PtSpan {
  _key: string
  _type: 'span'
  text: string
  marks: string[]
}
interface PtBlock {
  _key: string
  _type: 'block'
  style: string
  children: PtSpan[]
  markDefs: Array<Record<string, unknown>>
  listItem?: string
  level?: number
}

function span(key: string, text: string, marks: string[] = []): PtSpan {
  return { _key: key, _type: 'span', text, marks }
}
function linkSpan(key: string, markKey: string, text: string, _newTab: boolean): PtSpan {
  return { _key: key, _type: 'span', text, marks: [markKey] }
}
function linkMark(key: string, href: string, newTab: boolean): Record<string, unknown> {
  return { _key: key, _type: 'link', href, newTab }
}
function h2(key: string, text: string): PtBlock {
  return {
    _key: key,
    _type: 'block',
    style: 'h2',
    children: [span(`${key}-s`, text)],
    markDefs: [],
  }
}
function p(key: string, children: PtSpan[], markDefs: Array<Record<string, unknown>> = []): PtBlock {
  return { _key: key, _type: 'block', style: 'normal', children, markDefs }
}
function li(key: string, listItem: 'bullet' | 'number', children: PtSpan[]): PtBlock {
  return {
    _key: key,
    _type: 'block',
    style: 'normal',
    children,
    markDefs: [],
    listItem,
    level: 1,
  }
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!projectId || !dataset || !apiVersion || !token) {
    throw new Error(
      'Missing env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, NEXT_PUBLIC_SANITY_API_VERSION, SANITY_API_WRITE_TOKEN',
    )
  }
  if (!BLOB_BASE) throw new Error('Missing NEXT_PUBLIC_BLOB_URL')

  const dryRun = process.argv.includes('--dry')
  const onlyIdx = process.argv.indexOf('--only')
  const onlyFilter =
    onlyIdx >= 0 && process.argv[onlyIdx + 1]
      ? new Set(process.argv[onlyIdx + 1]!.split(',').map((s) => s.trim()))
      : undefined

  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

  console.log('Fetching existing singleton IDs…')
  const existingIds = await client.fetch<string[]>(
    `*[_id in $ids]._id`,
    { ids: [...SINGLETON_IDS] },
  )
  const existing = new Set(existingIds.map((id) => id.replace(/^drafts\./, '')))
  console.log(`  found ${existing.size}/${SINGLETON_IDS.length}: ${[...existing].join(', ') || '(none)'}`)

  const targets = SINGLETON_IDS.filter(
    (id) => (!onlyFilter || onlyFilter.has(id)) && !existing.has(id),
  )
  if (!targets.length) {
    console.log('Nothing to import — all targeted singletons already present.')
    return
  }
  console.log(`Will import ${targets.length}: ${targets.join(', ')}`)
  if (dryRun) console.log('(dry run — image uploads stubbed, no writes)')

  const ctx: UploadContext = { client, cache: new Map(), dryRun }

  for (const id of targets) {
    const doc = await buildSingleton(ctx, id)
    if (dryRun) {
      console.log(`  ✓ would create ${id} (${Object.keys(doc).length} fields)`)
    } else {
      await client.create(doc as Parameters<typeof client.create>[0])
      console.log(`  ✓ created ${id}`)
    }
  }
}

async function buildSingleton(ctx: UploadContext, id: SingletonId): Promise<Record<string, unknown>> {
  switch (id) {
    case 'siteSettings':
      return buildSiteSettings()
    case 'homepage':
      return buildHomepage(ctx)
    case 'aboutPage':
      return buildAboutPage(ctx)
    case 'partnersPage':
      return buildPartnersPage(ctx)
    case 'visitPage':
      return buildVisitPage(ctx)
    case 'pressPage':
      return buildPressPage()
    case 'privacyPage':
      return buildPrivacyPage()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
