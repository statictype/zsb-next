import { externalGallery } from '@edition-components/ExternalGallery.recipe'
import { RiArrowRightLine } from '@remixicon/react'
import Image from 'next/image'
import type { CSSProperties } from 'react'
import { css, cx } from 'styled-system/css'
import { Container, Divider, Grid, HStack, Stack, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { Badge } from '@/components/ui/Badge/Badge'
import { Card } from '@/components/ui/Card/Card'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { GALERIA_BELLER_PATH } from '@/lib/galeria-beller-href'
import type { BellerImage } from '@/types/galeria-beller'

const styles = externalGallery()

const visualPanel = css({
  position: 'relative',
  aspectRatio: '[var(--beller-visual-ratio)]',
  lg: { aspectRatio: 'auto' },
})

interface BellerCalloutProps {
  visual: BellerImage
  background: string
}

export function BellerCallout({ visual, background }: BellerCalloutProps) {
  return (
    <section className={cx(section({ ground: 'dark' }), styles.section)}>
      <Container>
        <Card asChild interactive>
          <a
            className={styles.card}
            href={GALERIA_BELLER_PATH}
            hrefLang="ro"
            data-umami-event="beller_card_click"
          >
            <Grid gap="0" gridTemplateColumns={{ lg: '1.4fr 1fr' }}>
              <Stack className={styles.cardLeft}>
                <Badge>3–4 October</Badge>

                <SectionHeading as="h2" flush>
                  <AccentSplit
                    text="Sculpture takes over the street"
                    accent="the street"
                    className={styles.titleHighlight}
                  />
                </SectionHeading>

                <Text as="p" variant="body" className={styles.description}>
                  Galeria Beller: two days of contemporary sculpture in the street, in Bucharest.
                  Program, artists and map on the event page (in Romanian).
                </Text>

                <Divider />
                <HStack gap="md">
                  <Text variant="label" className={styles.ctaLabel}>
                    Visit Galeria Beller
                  </Text>
                  <span aria-hidden>
                    <RiArrowRightLine size={18} />
                  </span>
                </HStack>
              </Stack>

              <div
                className={cx(styles.cardRight, visualPanel)}
                style={
                  {
                    background,
                    '--beller-visual-ratio': `${visual.width} / ${visual.height}`,
                  } as CSSProperties
                }
              >
                <Image
                  src={visual.src}
                  alt={visual.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className={css({ objectFit: 'contain' })}
                />
              </div>
            </Grid>
          </a>
        </Card>
      </Container>
    </section>
  )
}
