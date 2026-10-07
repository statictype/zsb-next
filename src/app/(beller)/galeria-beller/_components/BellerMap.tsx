import { css } from 'styled-system/css'
import { Container } from 'styled-system/jsx'
import { section } from 'styled-system/recipes'
import { BELLER_MAP_URL } from '@/lib/galeria-beller-href'

const frame = css({
  display: 'block',
  width: '100%',
  aspectRatio: { base: '4 / 5', md: 'auto' },
  maxHeight: '640px',
  height: { md: '640px' },
  border: 'none',
})

export function BellerMap() {
  return (
    <section className={section()}>
      <Container>
        <iframe
          src={BELLER_MAP_URL}
          title="Harta Galeria Beller"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          className={frame}
        />
      </Container>
    </section>
  )
}
