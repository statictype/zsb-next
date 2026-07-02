import { ImageResponse } from 'next/og'
import { getAllEditionYears, getEdition } from '@/data/editions'
import { asciiFold, BRAND, loadOgFonts, loadOgLogo, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og'
import { PUBLISHED } from '@/sanity/lib/live'

// Per-edition share card. If the editor set a Custom share image it's rendered
// full-bleed (they designed it); otherwise the hero photo gets a gradient scrim
// with the ZSB logo, year, theme, and dates — the branded fallback. The edition
// metadata intentionally sets no openGraph.images, so this route is the single
// source of the edition's social image (no duplication with the default card).

export const alt = 'Bucharest Sculpture Days — edition share image.'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export async function generateStaticParams() {
  const years = await getAllEditionYears()
  return years.map((year) => ({ year: String(year) }))
}

export default async function Image({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params
  const edition = await getEdition(Number(year), PUBLISHED)

  // Editor override: render their designed image, cropped to fill 1200×630.
  if (edition?.ogImage) {
    return new ImageResponse(
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        {/* ImageResponse (Satori) renders only <img>, not next/image */}
        <img
          src={edition.ogImage.src}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>,
      { ...OG_SIZE },
    )
  }

  const [fonts, logo] = await Promise.all([loadOgFonts(), loadOgLogo(BRAND.heading)])
  // Fold diacritics — the OG fonts are basic-Latin subsets (see asciiFold).
  const theme = asciiFold(edition?.theme ?? '')
  const dates = asciiFold(edition?.dateTape.split(' · ')[0] ?? '')
  const hero = edition?.heroImage.src

  return new ImageResponse(
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
        background: BRAND.canvas,
      }}
    >
      {hero && (
        // ImageResponse (Satori) renders only <img>, not next/image
        <img
          src={hero}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      {/* Full-size column anchored to the bottom; the gradient doubles as the
          scrim so logo + theme + dates stay grouped and bottom-aligned. */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '64px 72px',
          backgroundImage: `linear-gradient(to top, ${BRAND.canvas} 16%, rgba(14,11,16,0.55) 50%, rgba(14,11,16,0) 78%)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* ImageResponse (Satori) renders only <img>, not next/image */}
          <img src={logo} width={52} height={52} alt="" />
          <div
            style={{
              display: 'flex',
              fontFamily: 'Montserrat',
              fontWeight: 600,
              fontSize: 30,
              letterSpacing: 4,
              color: BRAND.heading,
            }}
          >
            ZSB {year}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontFamily: 'Dela Gothic One',
            fontSize: 76,
            color: BRAND.heading,
            marginTop: 18,
            lineHeight: 1.05,
          }}
        >
          {theme}
        </div>

        {dates && (
          <div
            style={{
              display: 'flex',
              fontFamily: 'Montserrat',
              fontWeight: 600,
              fontSize: 28,
              color: BRAND.chartreuse,
              marginTop: 10,
            }}
          >
            {dates}
          </div>
        )}
      </div>
    </div>,
    { ...OG_SIZE, fonts },
  )
}
