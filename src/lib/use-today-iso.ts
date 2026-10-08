import { useSyncExternalStore } from 'react'
import { todayInBucharest } from '@/lib/today'

const subscribeNoop = () => () => {}

export function useTodayIso(): string | null {
  return useSyncExternalStore(subscribeNoop, todayInBucharest, () => null)
}
