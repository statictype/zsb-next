import { Checkbox, Flex, Stack, Text } from '@sanity/ui'
import { type ArrayOfPrimitivesInputProps, set, unset, useFormValue } from 'sanity'

interface ProgramEvent {
  _key: string
  name?: string
  startDate?: string
  startTime?: string
}

function when(event: ProgramEvent): string {
  return [event.startDate, event.startTime].filter(Boolean).join(' ')
}

export function MapPointEventsInput(props: ArrayOfPrimitivesInputProps) {
  const { onChange, readOnly } = props
  const selected = (props.value ?? []) as string[]
  const events = ((useFormValue(['events']) ?? []) as ProgramEvent[])
    .slice()
    .sort((a, b) => when(a).localeCompare(when(b)))
  const known = new Set(events.map((e) => e._key))
  const missing = selected.filter((key) => !known.has(key))

  const toggle = (key: string) => {
    const next = selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]
    onChange(next.length ? set(next) : unset())
  }

  if (events.length === 0 && missing.length === 0) {
    return (
      <Text muted size={1}>
        Nu există evenimente în Program.
      </Text>
    )
  }

  return (
    <Stack gap={3}>
      {events.map((event) => (
        <Flex key={event._key} as="label" align="center" gap={3}>
          <Checkbox
            checked={selected.includes(event._key)}
            readOnly={readOnly}
            onChange={() => toggle(event._key)}
          />
          <Text size={1}>{event.name ?? 'Fără nume'}</Text>
          <Text size={1} muted>
            {when(event)}
          </Text>
        </Flex>
      ))}
      {missing.map((key) => (
        <Flex key={key} as="label" align="center" gap={3}>
          <Checkbox checked readOnly={readOnly} onChange={() => toggle(key)} />
          <Text size={1} muted>
            Eveniment șters
          </Text>
        </Flex>
      ))}
    </Stack>
  )
}
