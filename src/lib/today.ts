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

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/

// en-CA formats as `YYYY-MM-DD`.
const DAY_FORMAT = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Bucharest' })

export function todayInBucharest(now?: Date): string {
  if (now === undefined && process.env.NODE_ENV !== 'production') {
    const override = process.env.NEXT_PUBLIC_ZSB_TODAY
    if (override) {
      if (!ISO_DAY.test(override)) {
        throw new Error(`NEXT_PUBLIC_ZSB_TODAY must be YYYY-MM-DD, got "${override}"`)
      }
      return override
    }
  }
  return DAY_FORMAT.format(now ?? new Date())
}
