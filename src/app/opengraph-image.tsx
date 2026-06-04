import { ImageResponse } from 'next/og'
import { BRAND, loadOgFonts, loadOgLogo, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og'

// Default social-share card for every route that doesn't supply its own image.
// Lives at the app root (not in (site)) so the homepage — one segment deeper —
// can override it via metadata without a same-segment collision. /studio
// inherits it too, which is harmless (robots-blocked, never shared).
//
// Pages override by setting openGraph.images in generateMetadata; editions
// supply their own via editions/[year]/opengraph-image. A child segment's
// openGraph replaces the inherited one wholesale, so this never duplicates.

export const alt =
  'Bucharest Sculpture Days (ZSB) — Zilele Sculpturii București, a contemporary sculpture event in Bucharest, Romania.'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image() {
  const [fonts, logo] = await Promise.all([loadOgFonts(), loadOgLogo()])

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: BRAND.canvas,
        padding: 80,
        fontFamily: 'Montserrat',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* ImageResponse (Satori) renders only <img>, not next/image */}
        <img src={logo} width={64} height={64} alt="" />
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: 6,
            color: BRAND.chartreuse,
          }}
        >
          ZSB · CONTEMPORARY SCULPTURE
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            fontFamily: 'Dela Gothic One',
            fontSize: 96,
            color: BRAND.heading,
            lineHeight: 1.08,
          }}
        >
          Bucharest
        </div>
        <div
          style={{
            display: 'flex',
            fontFamily: 'Dela Gothic One',
            fontSize: 96,
            color: BRAND.heading,
            lineHeight: 1.08,
          }}
        >
          Sculpture Days
        </div>
        <div
          style={{ display: 'flex', width: 220, height: 12, marginTop: 32, background: BRAND.pink }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 26,
          fontWeight: 600,
          color: BRAND.muted,
        }}
      >
        <div style={{ display: 'flex' }}>Bucharest, Romania · since 2021</div>
        <div style={{ display: 'flex', color: BRAND.heading }}>sculpturedays.com</div>
      </div>
    </div>,
    { ...size, fonts },
  )
}
