import { RiArrowRightUpLine } from '@remixicon/react'
import { cx } from 'styled-system/css'
import { Center, Container, Divider, Grid, HStack, Stack, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { Badge } from '@/components/ui/Badge/Badge'
import { Card } from '@/components/ui/Card/Card'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { splitFirstMatch } from '@/lib/split-first-match'
import type { ExternalGalleryData } from '@/types/edition'
import { externalGallery } from './ExternalGallery.recipe'

const styles = externalGallery()

interface ExternalGalleryProps {
  gallery: ExternalGalleryData
  theme: string
}

export function ExternalGallery({ gallery, theme }: ExternalGalleryProps) {
  const { tag, title, highlight, description, linkLabel, href } = gallery
  const titleParts = highlight ? splitFirstMatch(title, highlight) : null

  return (
    <section className={cx(section({ ground: 'dark' }), styles.section)}>
      <Container>
        <HStack
          className={styles.header}
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems={{ base: 'stretch', md: 'flex-end' }}
          justify={{ md: 'space-between' }}
          gap="md"
        >
          <SectionHeading flush>Archive</SectionHeading>
          <Text variant="label" className={styles.count}>
            {theme}
          </Text>
        </HStack>

        <Card asChild ground="onDark" interactive>
          <a
            className={styles.card}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${linkLabel} — opens ${href} in a new tab`}
          >
            <Grid gap="0" gridTemplateColumns={{ lg: '1.4fr 1fr' }}>
              <Stack className={styles.cardLeft}>
                <Badge>{tag}</Badge>

                <SectionHeading as="h3" flush>
                  {titleParts ? (
                    <>
                      {titleParts.before}
                      <span className={styles.titleHighlight}>{titleParts.match}</span>
                      {titleParts.after}
                    </>
                  ) : (
                    title
                  )}
                </SectionHeading>

                <Text as="p" variant="body" className={styles.description}>
                  {description}
                </Text>

                <Divider mt="md" />
                <HStack className={styles.cta} gap="md">
                  <Text variant="label" className={styles.ctaLabel}>
                    {linkLabel}
                  </Text>
                  <span aria-hidden>
                    <RiArrowRightUpLine size={18} />
                  </span>
                  <Text variant="label" className={styles.ctaUrl}>
                    {prettyHost(href)}
                  </Text>
                </HStack>
              </Stack>

              <Center
                className={styles.cardRight}
                display={{ base: 'none', lg: 'flex' }}
                flexDirection="column"
                aria-hidden
              >
                <Center className={styles.plate}>
                  <Center data-part="monogram" flexDirection="column" gap="xs">
                    <span data-part="zsb">ZSB</span>
                    <span data-part="year">2021</span>
                  </Center>
                  <Text as="div" variant="label" data-part="meta">
                    <span>Edition 01</span>
                    <span>Digital</span>
                  </Text>
                </Center>
              </Center>
            </Grid>
          </a>
        </Card>
      </Container>
    </section>
  )
}

function prettyHost(href: string): string {
  try {
    const url = new URL(href)
    return `${url.host}${url.pathname.replace(/\/$/, '')}`
  } catch {
    return href
  }
}
