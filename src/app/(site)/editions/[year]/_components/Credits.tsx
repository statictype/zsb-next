import { credits as creditsRecipe } from '@edition-components/Credits.recipe'
import { IsdayBadge } from '@edition-components/IsdayBadge'
import Image from 'next/image'
import { Container, Divider, Grid, Stack, Text, Wrap } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import type { CreditEntry } from '@/types/edition'

interface CreditsProps {
  credits: CreditEntry[]
}

export function Credits({ credits }: CreditsProps) {
  const primary = credits.filter((c) => c.type === 'primary')
  const partners = credits.filter((c) => c.type === 'partner')
  const secondary = credits.filter((c) => c.type === 'secondary')
  const s = creditsRecipe()

  return (
    <section className={section({ ground: 'light' })}>
      <Container>
        <Stack gap="lg">
          <Grid
            columns={{ base: 1, md: 2, xl: 4 }}
            columnGap="lg"
            rowGap={{ base: 'lg', md: 'xl' }}
          >
            {primary.map((credit) => (
              <Stack key={credit.label} gap="sm">
                <Text variant="label">{credit.label}</Text>
                <Text variant="lead">{credit.value}</Text>
                {credit.detail && (
                  <Text variant="caption" className={s.detail}>
                    {credit.detail}
                  </Text>
                )}
                {credit.logo && (
                  <div>
                    <Image
                      src={credit.logo}
                      alt={credit.logoAlt}
                      className={s.logo}
                      width={120}
                      height={40}
                      unoptimized
                    />
                  </div>
                )}
              </Stack>
            ))}
            <IsdayBadge className={s.badge} />
          </Grid>

          {partners.length > 0 && (
            <>
              <Divider />
              <Grid columns={{ base: 1, md: 4 }} gap="lg">
                {partners.map((credit) => (
                  <Stack key={credit.label} className={s.partnersBlock} gap="sm">
                    <Text variant="label" className={s.partnersLabel}>
                      {credit.label}
                    </Text>
                    <Wrap className={s.partnersList} align="center" rowGap="xs">
                      {credit.value.split('\n').map((name) => (
                        <Text variant="caption" key={name}>
                          {name}
                        </Text>
                      ))}
                    </Wrap>
                  </Stack>
                ))}
              </Grid>
            </>
          )}

          <Divider />
          <Grid columns={{ base: 1, md: 4 }} gap="lg">
            {secondary.map((credit) => (
              <Stack key={credit.label} className={s.inline} gap="sm">
                <Text variant="label">{credit.label}</Text>
                <Text variant="caption" className={s.inlineNames}>
                  {credit.value}
                </Text>
              </Stack>
            ))}
          </Grid>
        </Stack>
      </Container>
    </section>
  )
}
