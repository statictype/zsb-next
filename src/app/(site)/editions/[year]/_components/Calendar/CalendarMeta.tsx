import { Text, Wrap } from 'styled-system/jsx'
import { calendarMeta } from '@/app/(site)/editions/[year]/_components/Calendar/CalendarMeta.recipe'

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
    <Wrap as="p" gap="md">
      <Text variant="label" className={s.year}>
        {year}
      </Text>
      {label && (
        <>
          <span className={s.dot} aria-hidden />
          <Text variant="label" className={tone === 'accent' ? s.accent : undefined}>
            {label}
          </Text>
        </>
      )}
    </Wrap>
  )
}
