import { definedFields } from '@/lib/defined-fields'
import { urlFor } from '@/sanity/lib/image'
import type { PartnerLogo } from '@/types/edition'

interface RawPartner {
  _id: string
  name: string
  url: string | null
  logo: { asset?: unknown; alt?: string; aspectRatio: number | null } | null
}

const LOGO_SOURCE_HEIGHT = 128

export function mapPartnerLogos(partners: readonly RawPartner[] | null): PartnerLogo[] {
  const out: PartnerLogo[] = []
  for (const partner of partners ?? []) {
    if (!partner.logo?.asset) continue
    const aspectRatio = partner.logo.aspectRatio ?? 1
    out.push({
      id: partner._id,
      name: partner.name,
      src: urlFor(partner.logo).height(LOGO_SOURCE_HEIGHT).url(),
      alt: partner.logo.alt ?? partner.name,
      width: Math.round(LOGO_SOURCE_HEIGHT * aspectRatio),
      height: LOGO_SOURCE_HEIGHT,
      ...definedFields({ url: partner.url }),
    })
  }
  return out
}
