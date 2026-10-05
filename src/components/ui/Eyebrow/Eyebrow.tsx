import type { ReactNode } from 'react'
import { Text } from 'styled-system/jsx'

interface EyebrowProps {
  children: ReactNode
  className?: string | undefined
}

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <Text as="p" variant="label" className={className}>
      {children}
    </Text>
  )
}
