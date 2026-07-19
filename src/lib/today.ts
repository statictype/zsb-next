// The single owner of the "today" timezone rule: edition/event dates are
// Bucharest-local day-granular strings, so past/upcoming is always judged
// against Bucharest's calendar date — regardless of where the code runs
// (UTC server, visitor's browser). en-CA formats as `YYYY-MM-DD`.
export function todayInBucharest(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Bucharest' }).format(now)
}
