import { useSyncExternalStore } from 'react'

// Local "today" as an ISO `YYYY-MM-DD`, resolved on the client only — `null`
// on the server and during hydration, the real date thereafter. The pages are
// cached, so past/upcoming has to be judged against the visitor's own clock
// (the same split everywhere — calendar, featured spotlight; ADR 0016); the
// null server snapshot keeps the cached HTML and first client render in sync
// (no hydration mismatch), then React swaps in the client value.
const subscribeNoop = () => () => {}

function getTodayIso(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function useTodayIso(): string | null {
  return useSyncExternalStore(subscribeNoop, getTodayIso, () => null)
}
