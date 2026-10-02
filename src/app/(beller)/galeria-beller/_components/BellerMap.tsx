import { css } from 'styled-system/css'
import { Container, Stack } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { BELLER_MAP_URL } from '@/lib/galeria-beller-href'

const frame = css({
  display: 'block',
  width: 'full',
  height: '[640px]',
  border: 'none',
})

export function BellerMap() {
  return (
    <section className={section({ ground: 'dark' })} aria-labelledby="map-heading">
      <Container>
        <Stack gap="lg">
          <SectionHeading as="h2" id="map-heading" flush>
            Hartă
          </SectionHeading>
          <iframe
            src={BELLER_MAP_URL}
            title="Harta Galeria Beller"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            className={frame}
          />
        </Stack>
      </Container>
    </section>
  )
}
