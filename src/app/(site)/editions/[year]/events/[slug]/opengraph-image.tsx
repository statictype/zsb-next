import { ImageResponse } from 'next/og'
import { getAllEditionYears, getEdition } from '@/data/editions'
import { eventWhenLabel } from '@/lib/edition-dates'
import { BRAND, loadOgFonts, loadOgLogo, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og'
import { type DynamicFetchOptions } from '@/sanity/lib/live'
import { findEvent, isOnlineEdition } from '@/types/edition'

// Per-event share card (ZSB-41). Three cases, in priority order:
//   1. editor OG override → rendered as-is (they designed it);
//   2. event poster → the poster, cropped to fill (a designed promo image);
//   3. neither → a generated card with the name, venue and when.
// The ZSB badge (ZSB-53) is composited over cases 2 + 3 once it lands; the
// override (1) is always left untouched. Served by the event route so a scraper
// resolves a real card from the shared URL (ADR 0015).

const PUBLISHED: DynamicFetchOptions = { perspective: 'published', stega: false }

export const alt = 'Bucharest Sculpture Days — event share image.'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export async function generateStaticParams() {
  const years = await getAllEditionYears()
  const params: { year: string; slug: string }[] = []
  for (const year of years) {
    const edition = await getEdition(year, PUBLISHED)
    if (!edition || isOnlineEdition(edition)) continue
    for (const event of edition.events ?? []) {
      params.push({ year: String(year), slug: event.slug })
    }
  }
  return params
}

export default async function Image({
  params,
}: {
  params: Promise<{ year: string; slug: string }>
}) {
  const { year, slug } = await params
  const edition = await getEdition(Number(year), PUBLISHED)
  const event = findEvent(edition, slug)

  // Case 1 + 2: the override (used as-is) or the poster (badge later), filling
  // the frame. The editor's override is the escape hatch when a portrait poster
  // doesn't crop well to the 1.9:1 social ratio.
  const passthrough = event?.ogImage?.src ?? event?.image?.src
  if (passthrough) {
    return new ImageResponse(
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        {/* ImageResponse (Satori) renders only <img>, not next/image */}
        <img
          src={passthrough}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>,
      { ...OG_SIZE },
    )
  }

  // Case 3: generated card — branded dark canvas with the event's essentials.
  const [fonts, logo] = await Promise.all([loadOgFonts(), loadOgLogo(BRAND.heading)])
  const name = event?.name ?? ''
  const venue = event?.venue.name ?? ''
  const parent = event?.venue.partOf?.name
  const when = event ? eventWhenLabel(event) : ''

  return new ImageResponse(
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: '64px 72px',
        background: BRAND.canvas,
      }}
    >
      {/* Header: logo + edition badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {/* ImageResponse (Satori) renders only <img>, not next/image */}
        <img src={logo} width={48} height={48} alt="" />
        <div
          style={{
            display: 'flex',
            fontFamily: 'Montserrat',
            fontWeight: 600,
            fontSize: 28,
            letterSpacing: 4,
            color: BRAND.heading,
          }}
        >
          ZSB {year}
        </div>
      </div>

      {/* Body: when (eyebrow), name, venue */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {when && (
          <div
            style={{
              display: 'flex',
              fontFamily: 'Montserrat',
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: BRAND.chartreuse,
              marginBottom: 18,
            }}
          >
            {when}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            fontFamily: 'Dela Gothic One',
            fontSize: 68,
            lineHeight: 1.05,
            color: BRAND.heading,
          }}
        >
          {name}
        </div>
        {venue && (
          <div
            style={{
              display: 'flex',
              fontFamily: 'Montserrat',
              fontWeight: 600,
              fontSize: 28,
              color: BRAND.muted,
              marginTop: 20,
            }}
          >
            {parent ? `${venue} · ${parent}` : venue}
          </div>
        )}
      </div>

      {/* Foot: pink accent rule */}
      <div style={{ display: 'flex', width: 120, height: 8, background: BRAND.pink }} />
    </div>,
    { ...OG_SIZE, fonts },
  )
}
