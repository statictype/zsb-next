import './_load-env'
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { basename, join } from 'node:path'
import { createClient, type SanityClient } from '@sanity/client'

const dryRun = process.argv.includes('--dry')
const force = process.argv.includes('--force')

const DOWNLOADS = join(homedir(), 'Downloads')
const WORDMARK = join(DOWNLOADS, 'KV_HLine.png')
const KEY_VISUAL = join(DOWNLOADS, 'capetele din KV.png')

const ARTIST_IDS = [
  'artist-alin-carpen',
  'artist-darie-dup',
  'artist-alexandru-marinete',
  'artist-alexandru-papuc',
  'artist-alexandru-ranga',
  'artist-elena-scutaru',
  'artist-ovidiu-toader',
  'artist-victoria-zidaru',
]

const EVENT_TYPES = [
  { _id: 'eventType-vezi', title: 'Vezi', slug: 'vezi' },
  { _id: 'eventType-fa', title: 'Fă', slug: 'fa' },
  { _id: 'eventType-descopera', title: 'Descoperă', slug: 'descopera' },
] as const

type TypeSlug = (typeof EVENT_TYPES)[number]['slug']

const VENUES = [
  {
    _id: 'venue-strada-radu-beller',
    name: 'Strada Radu Beller',
    slug: 'radu-beller',
    address: 'Strada Av. Radu Beller, București',
  },
  {
    _id: 'venue-piata-dorobanti',
    name: 'Piața Dorobanți',
    slug: 'piata-dorobanti',
    address: 'Piața Dorobanți, București',
  },
] as const

type VenueSlug = (typeof VENUES)[number]['slug']

const ORGANIZATIONS = [
  {
    _id: 'organization-primaria-sectorului-1',
    name: 'Primăria Sectorului 1',
    slug: 'primaria-sectorului-1',
  },
  {
    _id: 'organization-uap-filiala-sculptura-bucuresti',
    name: 'Filiala de Sculptură București a Uniunii Artiștilor Plastici din România',
    slug: 'uap-filiala-sculptura-bucuresti',
  },
  {
    _id: 'organization-centrul-brancusi',
    name: 'Centrul de Cercetare, Documentare și Promovare „Constantin Brâncuși”',
    slug: 'centrul-constantin-brancusi',
  },
  {
    _id: 'organization-noaptea-alba-a-galeriilor',
    name: 'Noaptea Albă a Galeriilor',
    slug: 'noaptea-alba-a-galeriilor',
  },
] as const

interface EventSource {
  slug: string
  name: string
  startDate: string
  startTime?: string
  endTime?: string
  endDate?: string
  type: TypeSlug
  venue: VenueSlug
  description: string[]
}

const SAT = '2026-10-03'
const SUN = '2026-10-04'

const LASA_TI_URMA = [
  'Lucrare colectivă participativă.',
  'O sculptură temporară se construiește prin acumularea gesturilor publicului.',
  'Fiecare participant primește o porție de pastă de celuloză colorată și face un singur gest asupra unei structuri tridimensionale: materialul este aruncat controlat de la o distanță marcată și se adaugă intervențiilor precedente. Pentru cei care nu pot sau nu doresc să arunce materialul, acesta poate fi aplicat manual.',
  'Gesturile se suprapun, se acoperă și se modifică reciproc, iar forma lucrării se schimbă continuu pe parcursul celor două zile.',
  'Participare gratuită, în flux continuu. Aproximativ 300 de intervenții disponibile pe durata evenimentului.',
]

const SMALL_SCULPTURE = [
  'Patru standuri prezintă o selecție de sculpturi de mici dimensiuni și propun o întâlnire cu sculptura contemporană la o scară diferită de cea a lucrărilor instalate în stradă.',
  'Lucrările prezentate pot fi achiziționate.',
]

const DETECTIVES_FOOT =
  'Durata orientativă a unui parcurs complet: 25–40 de minute. Activități gratuite, în flux continuu · 8–12 copii simultan în punctul de activare. Copiii explorează piața numai însoțiți de un adult.'

const EVENTS: EventSource[] = [
  {
    slug: 'expozitie-sculptura-contemporana',
    name: 'Expoziție de sculptură contemporană',
    startDate: SAT,
    endDate: SUN,
    type: 'vezi',
    venue: 'radu-beller',
    description: [
      'Toată ziua · 8 artiști · 28 de lucrări și instalații.',
      'Artiști: Alin Carpen, Darie Dup, Alexandru Marinete, Alexandru Papuc, Alexandru Ranga, Elena Scutaru, Ovidiu Toader, Victoria Zidaru. Curator: Reka Csapo Dup.',
      'Lucrări de mari dimensiuni, sculpturi și instalații contemporane sunt amplasate direct pe strada Radu Beller. Expoziția poate fi parcursă liber, independent de programul activităților.',
    ],
  },
  {
    slug: 'deschiderea-galeria-beller',
    name: 'Deschiderea evenimentului Galeria Beller',
    startDate: SAT,
    startTime: '10:00',
    type: 'vezi',
    venue: 'radu-beller',
    description: [
      'Galeria Beller se deschide publicului, iar strada devine, pentru două zile, spațiu expozițional.',
    ],
  },
  {
    slug: 'tur-prin-expozitie',
    name: 'Tur prin expoziție',
    startDate: SAT,
    startTime: '10:30',
    endTime: '11:15',
    type: 'vezi',
    venue: 'radu-beller',
    description: [
      'Curatoarea și artiștii prezenți deschid împreună traseul expoziției și vorbesc despre lucrările instalate pe strada Radu Beller.',
    ],
  },
  {
    slug: 'lasa-ti-urma-sambata',
    name: 'Lasă-ți urma',
    startDate: SAT,
    startTime: '10:30',
    endTime: '20:00',
    type: 'fa',
    venue: 'radu-beller',
    description: LASA_TI_URMA,
  },
  {
    slug: 'modeleaza-sesiunea-1',
    name: 'Modelează · sesiunea 1',
    startDate: SAT,
    startTime: '11:30',
    endTime: '14:30',
    type: 'fa',
    venue: 'radu-beller',
    description: [
      'Două ateliere de modelaj în lut pentru copii.',
      'Copiii descoperă modelajul tridimensional prin lucrul direct cu lutul: comprimă, adaugă, decupează, perforează, unesc, netezesc și texturează materia.',
      'Nu există un model prestabilit. Fiecare participant construiește propria formă tridimensională și își ia lucrarea acasă la final.',
      'Recomandat copiilor de 5–12 ani. Participare gratuită. Atelierele funcționează în flux continuu, cu până la 10 copii simultan (5 copii per atelier) și o capacitate estimată de 30 de participanți per sesiune. Participarea se face în ordinea sosirii. Dacă locurile sunt ocupate, copiii se pot înscrie pentru următorul loc disponibil.',
    ],
  },
  {
    slug: 'mana-devine-forma-sesiunea-1',
    name: 'Mâna devine formă · sesiunea 1',
    startDate: SAT,
    startTime: '15:00',
    endTime: '18:00',
    type: 'fa',
    venue: 'radu-beller',
    description: [
      'Atelier de amprentă și turnare în ipsos.',
      'Cum poate o urmă lăsată în lut să devină o formă nouă?',
      'Fiecare participant își imprimă palma și degetele într-un strat de lut moale. În amprenta obținută este turnat ipsos, iar după întărire apare un relief al mâinii pe care copilul îl poate lua acasă.',
      'Atelierul introduce, prin experiență directă, una dintre relațiile fundamentale ale sculpturii: trecerea de la formă la amprentă și de la amprentă la o nouă formă.',
      'Recomandat copiilor de 6–12 ani. Participare gratuită. Atelierul funcționează în flux continuu, cu până la 10 copii simultan și o capacitate estimată de 30 de participanți pe sesiune. Participarea se face în ordinea sosirii. Dacă locurile sunt ocupate, copiii se pot înscrie pentru următorul loc disponibil.',
      'Notă de siguranță: ipsosul este preparat și manipulat exclusiv de facilitatori.',
    ],
  },
  {
    slug: 'sculptura-mici-dimensiuni-sambata',
    name: 'Sculptură de mici dimensiuni',
    startDate: SAT,
    startTime: '10:00',
    endTime: '20:00',
    type: 'descopera',
    venue: 'radu-beller',
    description: SMALL_SCULPTURE,
  },
  {
    slug: 'detectivii-de-forme-sambata',
    name: 'Detectivii de forme',
    startDate: SAT,
    startTime: '10:30',
    endTime: '14:00',
    type: 'descopera',
    venue: 'piata-dorobanti',
    description: [
      'Un punct al Galeriei Beller, dedicat copiilor însoțiți de părinți sau de alți adulți, transformă Piața Dorobanți într-un loc de observare, desen și explorare a sculpturii.',
      'Activitățile funcționează în flux continuu, iar fiecare familie își poate construi propriul parcurs.',
      'Privește ca un sculptor — copiii primesc o fișă de explorare și caută în piață forme rotunde, repetiții, texturi, volume, echilibre și obiecte care ar putea deveni sculpturi.',
      'Forme din Piață — una dintre formele observate poate fi transformată prin desen: poate fi repetată, mărită, combinată, tăiată, golită sau deformată.',
      'Piața prinde formă — fiecare copil poate adăuga o formă unei lucrări colective pe hârtie, care se construiește treptat din contribuțiile participanților.',
      'Materia în mâinile tale — lut, lemn, piatră, metal și ipsos — poate fi atinsă și comparată: grea sau ușoară, rece sau caldă, netedă sau rugoasă, modelabilă sau rezistentă.',
      'Cum se face? — microexplicații despre câteva dintre procesele prin care materia devine sculptură: modelare, turnare, cioplire, asamblare, șlefuire și transformare.',
      DETECTIVES_FOOT,
    ],
  },
  {
    slug: 'proiectie-scrisoare-imaginara-brancusi',
    name: 'Proiecție de film „Scrisoare imaginară a lui Constantin Brâncuși”',
    startDate: SAT,
    startTime: '19:00',
    endTime: '22:00',
    type: 'descopera',
    venue: 'radu-beller',
    description: [
      'România, 2018 · Regia: Cornel Mihalache · Producție: Televiziunea Română, seria „Români care au schimbat lumea”.',
      'Un eseu cinematografic construit din scrisorile și documentele lui Constantin Brâncuși, materiale de arhivă, fotografii și imagini filmate chiar de artist.',
      'Proiecția marchează 150 de ani de la nașterea lui Constantin Brâncuși și are loc cu sprijinul Centrului de Cercetare, Documentare și Promovare „Constantin Brâncuși”.',
    ],
  },
  {
    slug: 'galeria-beller-noaptea-alba-a-galeriilor',
    name: 'Galeria Beller × Noaptea Albă a Galeriilor',
    startDate: SAT,
    startTime: '20:00',
    type: 'descopera',
    venue: 'radu-beller',
    description: [
      'În weekendul în care publicul intră în galerii, Galeria Beller propune mișcarea inversă: sculptura iese în stradă.',
      'Expoziția intră în circuitul Noaptea Albă a Galeriilor și rămâne accesibilă pe durata serii.',
    ],
  },
  {
    slug: 'ultima-zi-a-galeriei-beller',
    name: 'Ultima zi a Galeriei Beller',
    startDate: SUN,
    startTime: '10:00',
    endTime: '18:00',
    type: 'vezi',
    venue: 'radu-beller',
    description: ['Expoziția de sculptură contemporană rămâne accesibilă liber până la ora 18:00.'],
  },
  {
    slug: 'lasa-ti-urma-duminica',
    name: 'Lasă-ți urma · ultima zi',
    startDate: SUN,
    startTime: '10:30',
    endTime: '17:30',
    type: 'fa',
    venue: 'radu-beller',
    description: [
      'Ultima zi a lucrării colective.',
      'Publicul poate continua să participe la sculptura colectivă. Fiecare gest modifică forma construită în ziua precedentă și adaugă lucrării un strat nou.',
      'Participarea este gratuită și rămâne deschisă până la 17:30, când are loc ultimul gest asupra lucrării.',
    ],
  },
  {
    slug: 'mana-devine-forma-sesiunea-2',
    name: 'Mâna devine formă · sesiunea 2',
    startDate: SUN,
    startTime: '11:00',
    endTime: '14:00',
    type: 'fa',
    venue: 'radu-beller',
    description: [
      'Atelier de amprentă și turnare în ipsos.',
      'A doua sesiune a atelierului, în care o amprentă lăsată în lut devine un relief în ipsos. Fiecare participant își imprimă palma și degetele în lut, iar forma negativă astfel obținută este folosită pentru turnarea unei piese din ipsos, pe care copilul o poate lua acasă.',
      'Recomandat copiilor de 6–12 ani. Participare gratuită. Până la 10 copii simultan, maximum 30 de participanți în cadrul sesiunii. Participarea se face în ordinea sosirii; dacă locurile sunt ocupate, copiii se pot înscrie pentru următorul loc disponibil.',
    ],
  },
  {
    slug: 'modeleaza-sesiunea-2',
    name: 'Modelează · sesiunea 2',
    startDate: SUN,
    startTime: '14:30',
    endTime: '17:30',
    type: 'fa',
    venue: 'radu-beller',
    description: [
      'Două ateliere de modelaj în lut pentru copii.',
      'Copiii lucrează direct cu lutul și construiesc liber o formă tridimensională, folosind operații și instrumente specifice modelajului. Fiecare participant își ia lucrarea acasă la final.',
      'Recomandat copiilor de 5–12 ani. Participare gratuită. Până la 10 copii simultan (câte 5 copii per atelier), maximum 30 de participanți în cadrul sesiunii. Participarea se face în ordinea sosirii; dacă locurile sunt ocupate, copiii se pot înscrie pentru următorul loc disponibil.',
    ],
  },
  {
    slug: 'ultimul-gest',
    name: 'Ultimul Gest',
    startDate: SUN,
    startTime: '17:30',
    type: 'fa',
    venue: 'radu-beller',
    description: [
      'Intervențiile publicului asupra lucrării colective se opresc. Pentru prima și ultima dată, sculptura ajunge la forma ei finală. Lucrarea este fotografiată și documentată, păstrând rezultatul celor două zile de intervenție colectivă.',
      'Între 17:30 și 18:00, expoziția rămâne deschisă pentru ultimul parcurs al Galeriei Beller.',
    ],
  },
  {
    slug: 'sculptura-mici-dimensiuni-duminica',
    name: 'Sculptură de mici dimensiuni',
    startDate: SUN,
    startTime: '10:00',
    endTime: '17:00',
    type: 'descopera',
    venue: 'radu-beller',
    description: SMALL_SCULPTURE,
  },
  {
    slug: 'detectivii-de-forme-duminica',
    name: 'Detectivii de forme',
    startDate: SUN,
    startTime: '10:30',
    endTime: '14:00',
    type: 'descopera',
    venue: 'piata-dorobanti',
    description: [
      'A doua zi a punctului de activare din Piața Dorobanți. Copiii și adulții care îi însoțesc pot parcurge activitățile: Privește ca un sculptor, Forme din Piață, Piața prinde formă, Materia în mâinile tale și microexplicațiile „Cum se face?”.',
      DETECTIVES_FOOT,
    ],
  },
  {
    slug: 'inchiderea-galeriei-beller',
    name: 'Închiderea Galeriei Beller',
    startDate: SUN,
    startTime: '18:00',
    type: 'descopera',
    venue: 'radu-beller',
    description: ['Se încheie evenimentul și expoziția temporară de pe strada Radu Beller.'],
  },
]

const INFO_BODY =
  'Scoasă din cadrul expozițional convențional, sculptura intră într-un spațiu care nu a fost gândit pentru artă și într-o relație diferită cu privitorul. Strada nu mai este doar locul în care lucrarea este amplasată, ci contextul care îi schimbă percepția și felul în care este întâlnită. Această relație este explorată și prin activitățile propuse, care apropie publicul de materie și de procesele sculpturale. Privirea este completată astfel de experiența directă, iar sculptura poate fi înțeleasă nu doar ca obiect expus, ci și ca practică și proces.'

let keyCounter = 0
const nextKey = () => `gb${(keyCounter++).toString(36).padStart(4, '0')}`

const ref = (_ref: string) => ({ _type: 'reference' as const, _ref })
const keyedRef = (_ref: string) => ({ ...ref(_ref), _key: nextKey() })

function eventDoc(e: EventSource) {
  const venue = VENUES.find((v) => v.slug === e.venue)
  const type = EVENT_TYPES.find((t) => t.slug === e.type)
  if (!venue || !type) throw new Error(`Unknown venue/type on ${e.slug}`)
  return {
    _type: 'event',
    _key: nextKey(),
    name: e.name,
    startDate: e.startDate,
    ...(e.startTime ? { startTime: e.startTime } : {}),
    ...(e.endTime ? { endTime: e.endTime } : {}),
    ...(e.endDate ? { endDate: e.endDate } : {}),
    types: [keyedRef(type._id)],
    venue: ref(venue._id),
    description: e.description.join('\n\n'),
    featured: false,
    slug: { _type: 'slug', current: e.slug },
  }
}

function pageDoc(orgIds: Record<string, string>, images: Record<string, unknown>) {
  const org = (slug: (typeof ORGANIZATIONS)[number]['slug']) => {
    const id = orgIds[slug]
    if (!id) throw new Error(`Missing organization ${slug}`)
    return keyedRef(id)
  }
  return {
    _id: 'galeriaBeller',
    _type: 'galeriaBeller',
    title: 'Galeria Beller',
    heroColor: '#e89124',
    ...images,
    facts: {
      period: '3–4 octombrie 2026',
      location: 'strada Av. Radu Beller, București',
      theme: 'Sculptura iese în stradă',
    },
    programIntro:
      'Timp de două zile, strada Radu Beller devine o galerie temporară în aer liber. Sculptura contemporană iese din spațiul expozițional și intră direct în traseul cotidian al orașului, prin lucrări, ateliere, intervenții participative și experiențe construite în jurul materiei și al formei.',
    info: { title: 'Sculptura schimbă relația noastră cu strada.', body: INFO_BODY },
    events: EVENTS.map(eventDoc),
    artists: ARTIST_IDS.map(keyedRef),
    credits: [
      {
        _type: 'creditOrgList',
        _key: nextKey(),
        type: 'primary',
        label: 'Organizatori',
        organizations: [org('primaria-sectorului-1'), org('uap-filiala-sculptura-bucuresti')],
      },
      {
        _type: 'creditOrgList',
        _key: nextKey(),
        type: 'partner',
        label: 'Parteneri',
        organizations: [org('centrul-constantin-brancusi'), org('noaptea-alba-a-galeriilor')],
      },
      {
        _type: 'creditText',
        _key: nextKey(),
        type: 'secondary',
        label: 'Curator',
        names: ['Reka Csapo Dup'],
      },
    ],
    pressKit: { title: 'Press kit', buttonLabel: 'Descarcă press kit-ul' },
    footerText: 'Două zile. O stradă fără trafic. Sculptura în mijlocul orașului.',
    metaDescription:
      'Galeria Beller, 3–4 octombrie 2026: sculptură contemporană, ateliere și intervenții participative pe strada Radu Beller din București.',
  }
}

async function resolveOrganizations(client: SanityClient | undefined) {
  const ids: Record<string, string> = {}
  for (const o of ORGANIZATIONS) {
    const existing = client
      ? await client.fetch<string | null>(
          '*[_type == "organization" && (lower(name) == lower($name) || slug.current == $slug)][0]._id',
          { name: o.name, slug: o.slug },
        )
      : null
    ids[o.slug] = existing ?? o._id
    console.log(`organization ${o.name}: ${existing ? `reuse ${existing}` : `create ${o._id}`}`)
  }
  return ids
}

async function main() {
  if (dryRun) {
    console.log(`${EVENTS.length} events`)
    for (const e of EVENTS) {
      const time = [e.startTime, e.endTime].filter(Boolean).join('–') || '—'
      console.log(
        `  ${e.startDate} ${time.padEnd(11)} ${e.type.padEnd(9)} ${e.venue.padEnd(15)} ${e.name}`,
      )
    }
    const orgIds = await resolveOrganizations(undefined)
    const doc = pageDoc(orgIds, {})
    console.log(`artists: ${doc.artists.length}, credits: ${doc.credits.length}`)
    console.log(`images: ${WORDMARK}, ${KEY_VISUAL}`)
    return
  }

  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) throw new Error('SANITY_API_WRITE_TOKEN is not set')
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? '',
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '',
    token,
    useCdn: false,
  })

  const missing = await client.fetch<string[]>('$ids[!(@ in *[_type == "artist"]._id)]', {
    ids: ARTIST_IDS,
  })
  if (missing.length > 0) throw new Error(`Missing artists: ${missing.join(', ')}`)

  const exists = await client.fetch<boolean>('defined(*[_id == "galeriaBeller"][0]._id)')
  if (exists && !force) {
    console.log('galeriaBeller already exists; pass --force to replace it. Nothing written.')
    return
  }

  const venueTypeId = await client.fetch<string | null>(
    '*[_type == "venueType" && slug.current in ["outdoor", "public-space", "street"]][0]._id',
  )
  const typeRef = venueTypeId ?? 'venueType-public-space'
  if (!venueTypeId) {
    await client.createIfNotExists({
      _id: typeRef,
      _type: 'venueType',
      title: 'Public space',
      slug: { _type: 'slug', current: 'public-space' },
    })
  }

  for (const v of VENUES) {
    await client.createIfNotExists({
      _id: v._id,
      _type: 'venue',
      name: v.name,
      slug: { _type: 'slug', current: v.slug },
      type: ref(typeRef),
      address: v.address,
    })
    console.log(`venue ${v._id}`)
  }

  for (const t of EVENT_TYPES) {
    await client.createIfNotExists({
      _id: t._id,
      _type: 'eventType',
      title: t.title,
      slug: { _type: 'slug', current: t.slug },
    })
    console.log(`eventType ${t._id}`)
  }

  const orgIds = await resolveOrganizations(client)
  for (const o of ORGANIZATIONS) {
    if (orgIds[o.slug] !== o._id) continue
    await client.createIfNotExists({
      _id: o._id,
      _type: 'organization',
      name: o.name,
      slug: { _type: 'slug', current: o.slug },
      kind: 'institution',
    })
  }

  const upload = async (path: string, alt: string) => {
    const asset = await client.assets.upload('image', readFileSync(path), {
      filename: basename(path),
    })
    return { _type: 'image', asset: ref(asset._id), alt }
  }
  const images = {
    wordmark: await upload(WORDMARK, 'Galeria Beller'),
    keyVisual: await upload(
      KEY_VISUAL,
      'Două capete de sculptură clasică din marmură, unul cu o fantă aurie, celălalt acoperit de flori sălbatice',
    ),
  }

  await client.createOrReplace(pageDoc(orgIds, images))
  console.log(`wrote galeriaBeller (${EVENTS.length} events)`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
