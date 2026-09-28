import { RiArrowRightLine } from '@remixicon/react'
import Link from 'next/link'
import { css } from 'styled-system/css'
import { Stack, Text } from 'styled-system/jsx'
import { Button } from '@/components/ui/Button/Button'
import { GALERIA_BELLER_PATH } from '@/lib/galeria-beller-href'

const page = css({
  minHeight: 'svh',
  display: 'grid',
  placeItems: 'center',
  background: 'surface',
  paddingInline: 'gutter',
  textAlign: 'center',
})

export default function BellerNotFound() {
  return (
    <main className={page}>
      <Stack gap="lg" alignItems="center">
        <Text as="div" variant="display">
          404
        </Text>
        <Text as="h1" variant="heading">
          Pagina nu există
        </Text>
        <Button asChild variant="secondary" size="md">
          <Link href={GALERIA_BELLER_PATH}>
            Înapoi la Galeria Beller <RiArrowRightLine size={14} aria-hidden />
          </Link>
        </Button>
      </Stack>
    </main>
  )
}
