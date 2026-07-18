import { RiArrowRightLine } from '@remixicon/react'
import { notFound } from 'next/navigation'
import { css, cx } from 'styled-system/css'
import { Center, Container, Grid, Stack, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { AccentSplit } from '@/components/AccentSplit/AccentSplit'
import { DraftAware } from '@/components/DraftAware/DraftAware'
import { EditionsNav } from '@/components/EditionsNav/EditionsNav'
import { Figure } from '@/components/Figure/Figure'
import { PageHero } from '@/components/PageHero/PageHero'
import { PartnerBadge } from '@/components/PartnerBadge/PartnerBadge'
import { PillarGrid } from '@/components/PillarGrid/PillarGrid'
import { Button } from '@/components/ui/Button/Button'
import { Eyebrow } from '@/components/ui/Eyebrow/Eyebrow'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { makePageMetadata } from '@/lib/seo'
import { type DynamicFetchOptions } from '@/sanity/lib/live'
import { getSiteSettings } from '@/sanity/lib/settings'
import { getPartnersPage, type PartnersView } from '@/sanity/lib/staticPages'
import { partnersPage } from './page.recipe'

const styles = partnersPage()

export const generateMetadata = makePageMetadata(getPartnersPage, {
  title: 'Partners',
  path: '/partners',
})

export default function PartnersRoute() {
  return (
    <>
      <DraftAware cached={(options) => <CachedPartners options={options} />} fallback={null} />
      <EditionsNav />
    </>
  )
}

async function CachedPartners({ options }: { options: DynamicFetchOptions }) {
  'use cache'
  const [page, settings] = await Promise.all([getPartnersPage(options), getSiteSettings(options)])
  if (!page) notFound()
  return <PartnersShell view={page} contactEmail={settings?.contactEmail ?? null} />
}

function PartnersShell({
  view,
  contactEmail,
}: {
  view: PartnersView
  contactEmail?: string | null
}) {
  const {
    hero,
    eventTitle,
    eventBody,
    eventImage,
    whyEyebrow,
    whyTitle,
    whyImage,
    whyPoints,
    ctaHeading,
    ctaHeadingAccent,
    ctaBody,
    ctaLabel,
  } = view

  return (
    <>
      <main>
        <PageHero
          flush
          title={<AccentSplit text={hero.title} accent={hero.titleAccent} />}
          lead={hero.lead}
        />

        <section className={section({ ground: 'dark' })}>
          <Container>
            <Stack gap="2xl">
              <Stack gap="xl">
                <SectionHeading>{eventTitle}</SectionHeading>
                <Stack className={styles.eventBody}>
                  {eventBody.map((para) => (
                    <Text as="p" variant="body" key={para}>
                      {para}
                    </Text>
                  ))}
                </Stack>
              </Stack>
              <figure className={styles.eventImage}>
                <Figure image={eventImage} sizes="100vw" className={styles.eventImageImg} />
              </figure>
            </Stack>
          </Container>
        </section>

        <section className={section({ ground: 'light' })}>
          <Container>
            <Grid
              columns={{ base: 1, lg: 2 }}
              gap={{ base: '2xl', lg: '3xl' }}
              alignItems={{ lg: 'end' }}
              marginBottom="3xl"
            >
              <div>
                <Eyebrow rule className={css({ marginBottom: 'xl' })}>
                  {whyEyebrow}
                </Eyebrow>
                <SectionHeading flush className={css({ maxWidth: '[700px]' })}>
                  {whyTitle}
                </SectionHeading>
              </div>
              <div className={styles.whySculptureImage}>
                <Figure
                  image={whyImage}
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className={styles.whySculptureImg}
                />
              </div>
            </Grid>

            <PillarGrid
              items={whyPoints.map((point) => ({ title: point.title, body: point.text }))}
              titleLevel="h3"
              rhythm="pair"
              titleScale="responsive"
            />
          </Container>
        </section>

        {/* No contact email in settings would mean a broken `mailto:` — hide
            the ask entirely rather than render a CTA that goes nowhere. */}
        {contactEmail && (
          <section className={cx(section({ ground: 'dark' }), styles.partnerCta)}>
            <Center className={styles.partnerCtaInner} flexDirection="column" gap="2xl">
              <PartnerBadge />
              <Stack gap="lg" alignItems="center">
                <Text as="h2" variant="display">
                  <AccentSplit
                    text={ctaHeading}
                    accent={ctaHeadingAccent}
                    className={styles.partnerCtaAccent}
                    lineBreak
                  />
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
    </>
  )
}
