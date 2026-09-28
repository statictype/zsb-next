import Link from 'next/link'
import { css } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { BELLER_SECTION_IDS, GALERIA_BELLER_PATH } from '@/lib/galeria-beller-href'

const LINKS = [
  { label: 'Info', id: BELLER_SECTION_IDS.info },
  { label: 'Program', id: BELLER_SECTION_IDS.program },
  { label: 'Artiști', id: BELLER_SECTION_IDS.artists },
] as const

const bar = css({
  position: 'sticky',
  top: '0',
  zIndex: 'nav',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'md',
  paddingBlock: 'sm',
  paddingInline: 'gutter',
  background: 'black',
  color: 'white',
  borderBottom: 'hairline',
  borderColor: 'divider',
})

const home = css({
  fontFamily: 'display',
  fontSize: 'base',
  color: 'white',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  _focusVisible: { outline: 'focus', outlineOffset: '[2px]' },
})

const list = css({
  display: 'flex',
  gap: { base: 'md', md: 'xl' },
  listStyleType: 'none',
})

const link = css({
  color: 'white',
  textDecoration: 'none',
  transition: 'colors',
  _hover: { color: 'highlight' },
  _focusVisible: { outline: 'focus', outlineOffset: '[4px]' },
})

export function BellerNav() {
  return (
    <header className={bar}>
      <Link href={GALERIA_BELLER_PATH} className={home}>
        Galeria Beller
      </Link>
      <nav aria-label="Secțiuni">
        <ul className={list}>
          {LINKS.map(({ label, id }) => (
            <li key={id}>
              <Link href={`${GALERIA_BELLER_PATH}#${id}`} className={link}>
                <Text as="span" variant="label" color="[currentColor]">
                  {label}
                </Text>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
