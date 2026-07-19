// Owner of the site's "today" rules (2026-07-19). Edition/event dates are
// Bucharest-local day strings, so past-ness is judged against Bucharest's
// calendar date wherever the code runs. Two clock tiers:
//
// - Yearly facts (latest/upcoming edition split): server fill-time clock.
//   Every transition is editor-driven — the announced → live flip is a publish
//   that busts the caches — so fill-time is correct by the operating model.
//   `getLatestAndUpcoming` is not a 'use cache' boundary itself; the freeze
//   comes from its callers' surface cache boundaries.
// - Daily facts (event past-ness): client view-time clock (`useTodayIso`) — a
//   mid-edition day rollover must not depend on a publish. ADR 0016's
//   "computed client-side" means this tier only.
//
// Null-clock convention: the client clock is `null` until hydration; no time
// judgement is made then (nothing hidden, everything counts as taken place),
// so cached HTML and the first client render agree.

// en-CA formats as `YYYY-MM-DD`.
export function todayInBucharest(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Bucharest' }).format(now)
}
