import { programMeta } from '@program/ProgramMeta.recipe'
import { Text, Wrap } from 'styled-system/jsx'

// The board header's meta line — the edition year, then an optional trailing
// label after a dot separator (the date window on the live board, "Coming soon"
// on the stand-in). Shared by Program and ComingSoon (STRUCT-3). `tone`
// highlights the trailing label; `body` (default) leaves it in the meta color.
export function ProgramMeta({
  year,
  label,
  tone,
}: {
  year: number
  label?: string
  tone?: 'body' | 'accent'
}) {
  const s = programMeta()
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
