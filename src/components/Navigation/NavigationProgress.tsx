'use client'

import { navigation } from 'styled-system/recipes'
import { useNavigationPending } from '@/components/Navigation/navigation-pending'

const s = navigation()

export function NavigationProgress() {
  const isPending = useNavigationPending()
  if (!isPending) return null
  return <div className={s.progress} aria-hidden />
}
