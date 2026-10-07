import { RiArrowRightLine } from '@remixicon/react'
import { partnersPage } from '@site/partners/page.recipe'
import Image from 'next/image'
import type { CSSProperties } from 'react'
import { css, cx } from 'styled-system/css'
import { Center, Container, Stack, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { Figure } from '@/components/Figure/Figure'
import { PageHero } from '@/components/PageHero/PageHero'
import { PartnerBadge } from '@/components/PartnerBadge/PartnerBadge'
import { Button } from '@/components/ui/Button/Button'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import type { PartnersView } from '@/sanity/lib/staticPages'
import type { PartnerLogo } from '@/types/edition'

const styles = partnersPage()

export function PartnersShell({
  view,
  contactEmail,
}: {
  view: PartnersView
  contactEmail: string | null
}) {
  const {
    hero,
    eventTitle,
    eventBody,
    eventImage,
    whyEyebrow,
    whyPoints,
    partners,
    ctaHeading,
    ctaHeadingAccent,
    ctaBody,
    ctaLabel,
  } = view

  return (
    <main>
      <PageHero flush title={hero.title} lead={hero.lead} />

      <section className={cx(section(), css({ paddingTop: '2xl' }))}>
        <Container>
          <div className={styles.topPlate}>
            <Figure image={eventImage} sizes="100vw" preload className={styles.plateImg} />
          </div>
          <div className={styles.eventSpread}>
            <SectionHeading flush className={styles.eventHeading}>
              {eventTitle}
            </SectionHeading>
            <Stack gap="md" className={styles.eventBody}>
              {eventBody.map((para) => (
                <Text as="p" variant="body" key={para}>
                  {para}
                </Text>
              ))}
            </Stack>
          </div>
        </Container>
      </section>

      <section data-ground="light" className={section()}>
        <Container>
          <Stack gap="2xl">
            <SectionHeading flush>{whyEyebrow}</SectionHeading>
            <ol className={styles.plates}>
              {whyPoints.map((point, index) => (
                <li
                  key={point.title}
                  className={styles.plate}
                  style={
                    {
                      '--plate-index': index,
                      '--plate-rest': whyPoints.length - 1 - index,
                    } as CSSProperties
                  }
                >
                  <Text as="h3" variant="heading" className={styles.plateTab}>
                    {point.title}
                  </Text>
                  <div className={styles.plateBody}>
                    <div className={styles.platePhoto}>
                      <Figure
                        image={point.image}
                        sizes="(min-width: 1024px) 48vw, 100vw"
                        className={styles.plateImg}
                      />
                    </div>
                    <Text as="p" variant="body" className={styles.plateText}>
                      {point.text}
                    </Text>
                  </div>
                </li>
              ))}
            </ol>
          </Stack>

          {partners.length > 0 && (
            <div className={styles.supporters}>
              <Text as="h2" variant="label">
                With the support of
              </Text>
              <ul className={styles.supporterGrid}>
                {partners.map((partner) => (
                  <li key={partner.id}>
                    <Supporter partner={partner} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </section>

      {/* No contact email in settings would mean a broken `mailto:` — hide
            the ask entirely rather than render a CTA that goes nowhere. */}
      {contactEmail && (
        <section className={cx(section(), styles.partnerCta)}>
          <Center className={styles.partnerCtaInner} flexDirection="column" gap="2xl">
            <PartnerBadge />
            <Stack gap="lg" alignItems="center">
              <Text as="h2" variant="display">
                <AccentSplit text={ctaHeading} accent={ctaHeadingAccent} lineBreak />
              </Text>
              <Text as="p" variant="body" className={styles.partnerCtaBody}>
                {ctaBody}
              </Text>
            </Stack>
            <Button asChild variant="primary" size="lg">
              <a href={`mailto:${contactEmail}`}>
                {ctaLabel} <RiArrowRightLine size={14} />
              </a>
            </Button>
          </Center>
        </section>
      )}
    </main>
  )
}

function Supporter({ partner }: { partner: PartnerLogo }) {
  const logo = (
    <Image
      src={partner.src}
      alt={partner.alt}
      width={partner.width}
      height={partner.height}
      className={styles.supporterLogo}
      unoptimized
    />
  )

  if (!partner.url) return logo

  return (
    <a
      href={partner.url}
      className={styles.supporterLink}
      target="_blank"
      rel="noreferrer"
      data-umami-event="partner_click"
      data-umami-event-partner={partner.name}
    >
      {logo}
    </a>
  )
}
