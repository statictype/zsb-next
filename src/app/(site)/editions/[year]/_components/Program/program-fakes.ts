import { useSyncExternalStore } from 'react'

let pathname = '/editions/2026'
let search = ''
let today: string | null = null
const listeners = new Set<() => void>()

function notify() {
  for (const l of listeners) l()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function resetFakes(next: { pathname?: string; search?: string; today?: string | null }) {
  pathname = next.pathname ?? '/editions/2026'
  search = next.search ?? ''
  today = next.today ?? null
}

export function currentUrl(): string {
  return search ? `${pathname}?${search}` : pathname
}

export function fakeNavigation() {
  return {
    usePathname: () => pathname,
    useSearchParams: () =>
      new URLSearchParams(
        useSyncExternalStore(
          subscribe,
          () => search,
          () => search,
        ),
      ),
    useRouter: () => ({
      replace: (href: string) => {
        const url = new URL(href, 'https://x.test')
        pathname = url.pathname
        search = url.searchParams.toString()
        notify()
      },
    }),
  }
}

export function fakeClock() {
  return { useTodayIso: () => today }
}
