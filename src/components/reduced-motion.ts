'use client'

import { useMediaQuery } from '@/components/media-query'

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)', true)
}
