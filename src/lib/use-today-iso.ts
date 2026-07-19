import { useSyncExternalStore } from 'react'
import { todayInBucharest } from '@/lib/today'

// Daily-tier clock: Bucharest "today" resolved client-side, `null` until
// hydration (see `lib/today.ts`).
const subscribeNoop = () => () => {}

export function useTodayIso(): string | null {
  return useSyncExternalStore(subscribeNoop, todayInBucharest, () => null)
}
