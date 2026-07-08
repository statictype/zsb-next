import { calendarMeta } from './CalendarMeta.recipe'

// The board header's meta line — the edition year, then an optional trailing
// label after a dot separator (the date window on the live board, "Coming soon"
// on the stand-in). Shared by Calendar and ComingSoon (STRUCT-3). `tone`
// highlights the trailing label; `body` (default) leaves it in the meta color.
export function CalendarMeta({
  year,
  label,
  tone,
}: {
  year: number
  label?: string | undefined
  tone?: 'body' | 'accent' | undefined
}) {
  const s = calendarMeta()
  return (
    <p className={s.meta}>
      <span className={s.year}>{year}</span>
      {label && (
        <>
          <span className={s.dot} aria-hidden />
          <span className={tone === 'accent' ? s.accent : undefined}>{label}</span>
        </>
      )}
    </p>
  )
}
