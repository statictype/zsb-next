import { RiArrowRightLine } from '@remixicon/react'
import Image from 'next/image'
import Link from 'next/link'
import { Container, Stack } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { partnerStrip } from '@/components/PartnerStrip/PartnerStrip.recipe'
import { Button } from '@/components/ui/Button/Button'
import { Eyebrow } from '@/components/ui/Eyebrow/Eyebrow'
import type { PartnerLogo } from '@/types/edition'

interface PartnerStripProps {
  partners: PartnerLogo[]
}

const SECONDS_PER_LOGO = 5

export function PartnerStrip({ partners }: PartnerStripProps) {
  if (partners.length === 0) return null
  const s = partnerStrip()

  const run = (clone: boolean) => (
    <ul className={s.run} aria-hidden={clone || undefined} data-clone={clone || undefined}>
      {partners.map((partner) => {
        const logo = (
          <Image
            src={partner.src}
            alt={clone ? '' : partner.alt}
            width={partner.width}
            height={partner.height}
            className={s.logo}
            unoptimized
          />
        )
        return (
          <li key={partner.id} className={s.cell}>
            {partner.url ? (
              <a
                href={partner.url}
                className={s.link}
                target="_blank"
                rel="noreferrer"
                tabIndex={clone ? -1 : undefined}
              >
                {logo}
              </a>
            ) : (
              logo
            )}
          </li>
        )
      })}
    </ul>
  )

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
          <div className={s.viewport}>
            <div
              className={s.track}
              style={{ animationDuration: `${partners.length * SECONDS_PER_LOGO}s` }}
            >
              {run(false)}
              {run(true)}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
