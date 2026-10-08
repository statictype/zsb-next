// Yearly facts (latest/upcoming edition) use the server fill-time clock. Daily facts
// (event past-ness) use the client clock from `useTodayIso`, which is `null` until
// hydration; no time judgement is made while it is `null`.

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
