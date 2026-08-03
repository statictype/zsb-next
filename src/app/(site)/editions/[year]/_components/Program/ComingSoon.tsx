import { comingSoon } from '@program/ComingSoon.recipe'
import { FollowLinks, type SocialLink } from '@program/FollowLinks'
import { ProgramMeta } from '@program/ProgramMeta'
import { Container, Divider, Stack, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'

// Stands in for the program on a live edition whose events aren't announced
// yet (ZSB-34) — in practice only ever the forthcoming edition, since a past
// one always has its program. It keeps the program's section + "Program"
// header so the page reads continuously, then turns the empty schedule into a
// "watch this space" with a way to follow along. Newsletter signup arrives as
// a follow-up once the footer rework (ZSB-11) lands.
export function ComingSoon({ year, socials }: { year: number; socials: SocialLink[] }) {
  const s = comingSoon()
  return (
    <section className={section({ ground: 'dark' })} aria-labelledby="program-heading">
      <Container>
        <Stack gap="xl">
          <Stack as="header" gap="md">
            <SectionHeading id="program-heading" flush>
              Program
            </SectionHeading>
            <ProgramMeta year={year} label="Coming soon" tone="accent" />
          </Stack>

          <Divider />
          <Stack gap="xl">
            <Stack gap="md">
              <Text as="p" variant="title" className={s.headline}>
                The program is taking shape.
              </Text>
              <Text as="p" variant="body" className={s.body}>
                Talks, openings, exhibitions and workshops across the city are being finalised. The
                full program lands here soon.
              </Text>
            </Stack>

            <FollowLinks label="Follow for updates" socials={socials} layout="stack" />
          </Stack>
        </Stack>
      </Container>
    </section>
  )
}
