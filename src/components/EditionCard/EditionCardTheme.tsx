'use client'

import { RiArrowDownSLine, RiArrowRightLine } from '@remixicon/react'
import Link from 'next/link'
import { useId, useState } from 'react'
import { Text } from 'styled-system/jsx'
import { editionCard } from '@/components/EditionCard/EditionCard.recipe'
import { Button } from '@/components/ui/Button/Button'

const styles = editionCard()

interface EditionCardThemeProps {
  body: string
  href: string
}

export function EditionCardTheme({ body, href }: EditionCardThemeProps) {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <div className={styles.aside}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
      >
        <Text as="span" variant="label">
          {open ? 'Hide the theme' : 'Read the theme'}
        </Text>
        <span className={styles.indicator} data-state={open ? 'open' : 'closed'}>
          <RiArrowDownSLine size={20} aria-hidden />
        </span>
      </button>

      <Text as="p" variant="body" id={id} className={styles.prose} data-open={open}>
        {body}
      </Text>

      <Button asChild variant="secondary" size="md" className={styles.cta}>
        <Link href={href}>
          View edition <RiArrowRightLine size={14} />
        </Link>
      </Button>
    </div>
  )
}
