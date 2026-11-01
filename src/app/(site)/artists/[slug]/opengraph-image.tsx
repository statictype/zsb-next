import { ImageResponse } from 'next/og'
import { BRAND, loadOgFonts, loadOgLogo, OG_CONTENT_TYPE, OG_SIZE, ogImageSrc } from '@/lib/og'
import { getArtistProfile, getArtistProfileParams } from '@/sanity/lib/artists'
import { PUBLISHED } from '@/sanity/lib/live'

export const alt = 'Bucharest Sculpture Days — artist share image.'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export async function generateStaticParams() {
  return (await getArtistProfileParams()).map(({ slug }) => ({ slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const artist = await getArtistProfile(slug, PUBLISHED)
  const photo = artist?.portrait ?? artist?.works.find((work) => work.images[0])?.images[0]
  const [fonts, logo] = await Promise.all([loadOgFonts(), loadOgLogo(BRAND.heading)])
  const name = artist?.name ?? ''
  const years = artist ? [...artist.editions].sort((a, b) => a - b).join(' · ') : ''

  return new ImageResponse(
    <div style={{ display: 'flex', width: '100%', height: '100%', background: BRAND.canvas }}>
      {photo && (
        <div style={{ display: 'flex', width: 540, height: '100%' }}>
          {/* ImageResponse (Satori) renders only <img>, not next/image */}
          <img
            src={ogImageSrc(photo.src)}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          padding: '64px 72px',
        }}
      >
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
            ZSB {years}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Dela Gothic One',
              fontSize: photo ? 60 : 72,
              lineHeight: 1.05,
              textTransform: 'uppercase',
              color: BRAND.heading,
            }}
          >
            {name}
          </div>
          {artist?.discipline && (
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
              {artist.discipline}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', width: 120, height: 8, background: BRAND.pink }} />
      </div>
    </div>,
    { ...OG_SIZE, fonts },
  )
}
