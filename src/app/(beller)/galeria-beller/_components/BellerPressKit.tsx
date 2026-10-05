import { RiDownloadLine } from '@remixicon/react'
import { Container, Stack, Text } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { Button } from '@/components/ui/Button/Button'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import type { BellerPressKit as PressKit } from '@/types/galeria-beller'

function formatMegabytes(bytes: number): string {
  return `${(bytes / 1_000_000).toLocaleString('ro-RO', { maximumFractionDigits: 1 })} MB`
}

export function BellerPressKit({ pressKit }: { pressKit: PressKit }) {
  return (
    <section className={section({ ground: 'dark' })} aria-labelledby="press-kit-heading">
      <Container>
        <Stack gap="lg" alignItems="flex-start">
          <SectionHeading as="h2" id="press-kit-heading" flush>
            {pressKit.title}
          </SectionHeading>
          {pressKit.body.map((p) => (
            <Text as="p" variant="body" key={p} maxWidth="measure">
              {p}
            </Text>
          ))}
          <Button asChild variant="primary" size="md">
            <a href={pressKit.href} download data-umami-event="press_kit_download">
              <RiDownloadLine size={16} aria-hidden />
              {pressKit.buttonLabel}
              {pressKit.sizeBytes > 0 && ` · ZIP, ${formatMegabytes(pressKit.sizeBytes)}`}
            </a>
          </Button>
        </Stack>
      </Container>
    </section>
  )
}
