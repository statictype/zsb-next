import { Container, Divider, Stack, Text, Wrap } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { Button } from '@/components/ui/Button/Button'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'

export interface SocialLink {
  label: string
  href: string
}

interface ComingSoonProps {
  socials: SocialLink[]
  artistsAnnounced: boolean
}

export function ComingSoon({ socials, artistsAnnounced }: ComingSoonProps) {
  return (
    <section className={section()} aria-labelledby="program-heading">
      <Container>
        <Stack gap="xl">
          <SectionHeading id="program-heading" flush>
            Program
          </SectionHeading>
          <Divider />
          <Text as="p" variant="lead" maxWidth="measure">
            {artistsAnnounced
              ? 'Talks, openings, exhibitions and workshops across the city are being finalised. The full program will be published here closer to the opening, so check back soon.'
              : 'Talks, openings, exhibitions and workshops across the city are being finalised. The full program and the list of artists will be published here closer to the opening, so check back soon.'}
          </Text>
          {socials.length > 0 && (
            <Stack gap="md" alignItems="flex-start">
              <Text variant="label">Follow for updates</Text>
              <Wrap as="ul" gap="md" listStyle="none">
                {socials.map((social) => (
                  <li key={social.label}>
                    <Button asChild variant="link">
                      <a href={social.href} target="_blank" rel="noreferrer">
                        {social.label}
                      </a>
                    </Button>
                  </li>
                ))}
              </Wrap>
            </Stack>
          )}
        </Stack>
      </Container>
    </section>
  )
}
