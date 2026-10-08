import type { ReactNode } from 'react'
import { cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { sectionHeading } from '@/components/ui/SectionHeading/SectionHeading.recipe'

interface SectionHeadingProps {
  as?: 'h2' | 'h3'
  flush?: boolean
  id?: string
  className?: string | undefined
  children: ReactNode
}

export function SectionHeading({
  as: Tag = 'h2',
  flush = false,
  id,
  className,
  children,
}: SectionHeadingProps) {
  return (
    <Text as={Tag} variant="title" id={id} className={cx(sectionHeading({ flush }), className)}>
      {children}
    </Text>
  )
}
