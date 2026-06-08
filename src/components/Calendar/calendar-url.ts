// Client-only URL plumbing shared by the calendar's URL-backed state — the
// filters (ZSB-29) and the event modal (ZSB-40). The edition page is cached
// (`'use cache'`), so all of this runs on the client: we never read
// `searchParams` on the server, and avoid `useSearchParams` (which forces a CSR
// bailout on a prerendered route). State is read via `useSyncExternalStore`
// with a `null` server snapshot — the prerendered HTML renders the full,
// unfiltered programme and the client reconciles once hydrated.

// `replaceState`/`pushState` don't emit `popstate`, so we dispatch our own
// event to nudge the store after a programmatic URL change.
export const URL_CHANGE_EVENT = 'zsb:calendar-url'

export function subscribeUrl(onChange: () => void): () => void {
  window.addEventListener('popstate', onChange)
  window.addEventListener(URL_CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener(URL_CHANGE_EVENT, onChange)
  }
}

export const getSearchSnapshot = (): string => window.location.search
export const getServerSnapshot = (): null => null

// Write a query string (no leading `?`) to the URL, preserving path + hash and
// without a scroll jump. `push` adds a history entry — used when opening the
// event modal so the Back gesture closes it; filters replace in place instead.
export function writeUrl(query: string, { push = false }: { push?: boolean } = {}): void {
  const url = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
  if (push) window.history.pushState(window.history.state, '', url)
  else window.history.replaceState(window.history.state, '', url)
  window.dispatchEvent(new Event(URL_CHANGE_EVENT))
}
