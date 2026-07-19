import { useSyncExternalStore } from 'react'
import { todayInBucharest } from '@/lib/today'

// Bucharest's "today" as an ISO `YYYY-MM-DD`, resolved on the client only —
// `null` on the server and during hydration, the real date thereafter. The
// pages are cached, so past/upcoming has to be judged client-side at view time
// (the same split everywhere — calendar, featured spotlight; ADR 0016); the
// null server snapshot keeps the cached HTML and first client render in sync
// (no hydration mismatch), then React swaps in the client value.
const subscribeNoop = () => () => {}

export function useTodayIso(): string | null {
  return useSyncExternalStore(subscribeNoop, todayInBucharest, () => null)
}
