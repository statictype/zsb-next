import { RiArrowRightLine } from '@remixicon/react'
import Image from 'next/image'
import Link from 'next/link'
import { Container, Stack } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { Marquee } from '@/components/Marquee/Marquee'
import { partnerStrip } from '@/components/PartnerStrip/PartnerStrip.recipe'
import { Button } from '@/components/ui/Button/Button'
import { Eyebrow } from '@/components/ui/Eyebrow/Eyebrow'
import type { PartnerLogo } from '@/types/edition'

interface PartnerStripProps {
  partners: PartnerLogo[]
}

export function PartnerStrip({ partners }: PartnerStripProps) {
  if (partners.length === 0) return null
  const s = partnerStrip()

  return (
    <section className={section({ ground: 'light' })}>
      <Container>
        <div className={s.layout}>
          <Stack gap="lg" className={s.intro}>
            <Eyebrow rule>With the support of</Eyebrow>
            <Button asChild variant="secondary" size="md">
              <Link href="/partners">
                Become a partner <RiArrowRightLine size={14} />
              </Link>
            </Button>
          </Stack>
          <Marquee count={partners.length}>
            {partners.map((partner) => {
              const logo = (
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  width={partner.width}
                  height={partner.height}
                  className={s.logo}
                  unoptimized
                />
              )
              return (
                <li key={partner.id} className={s.cell}>
                  {partner.url ? (
                    <a href={partner.url} className={s.link} target="_blank" rel="noreferrer">
                      {logo}
                    </a>
                  ) : (
                    logo
                  )}
                </li>
              )
            })}
          </Marquee>
        </div>
      </Container>
    </section>
  )
}
