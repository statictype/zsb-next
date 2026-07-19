import { Badge, Card, Flex, Spinner, Stack, Text } from '@sanity/ui'
import { useEffect, useState } from 'react'
import { useClient, useFormValue } from 'sanity'
import { IntentLink } from 'sanity/router'
import { apiVersion } from '@/sanity/env'

interface ReferencingEdition {
  _id: string
  year: number | null
  status: 'upcoming' | 'live' | null
}

// Published editions only — drafts would duplicate rows and only matter while
// an edition is being edited.
const QUERY = `*[_type == "edition" && references($id) && !(_id in path("drafts.**"))]
  | order(year desc){ _id, year, status }`

/**
 * Read-only block on the `artist` form listing the editions that reference this
 * artist — the reverse of `edition.artists[]`. Rendered as a synthetic field so
 * it sits in the form (below the "Used on N pages" panel) instead of a separate
 * view tab. Fetched once per mount via `client.fetch`; refresh to re-read.
 */
export function ArtistEditionsField() {
  const client = useClient({ apiVersion })
  const id = (useFormValue(['_id']) as string | undefined)?.replace(/^drafts\./, '')
  const [editions, setEditions] = useState<ReferencingEdition[] | null>(null)

  useEffect(() => {
    if (!id) return
    let active = true
    client
      .fetch<ReferencingEdition[]>(QUERY, { id })
      .then((rows) => {
        if (active) setEditions(rows)
      })
      .catch(() => {
        if (active) setEditions([])
      })
    return () => {
      active = false
    }
  }, [client, id])

  if (!id) {
    return (
      <Text muted size={1}>
        Save the artist to see its editions.
      </Text>
    )
  }

  if (editions === null) {
    return (
      <Flex align="center" justify="center" padding={4}>
        <Spinner muted />
      </Flex>
    )
  }

  if (editions.length === 0) {
    return (
      <Text muted size={1}>
        Not referenced by any edition yet.
      </Text>
    )
  }

  return (
    <Stack space={2}>
      {editions.map((edition) => (
        <Card key={edition._id} padding={3} radius={2} shadow={1}>
          <Flex align="center" justify="space-between" gap={3}>
            <Text size={2} weight="semibold">
              <IntentLink intent="edit" params={{ id: edition._id, type: 'edition' }}>
                ZSB {edition.year ?? '—'}
              </IntentLink>
            </Text>
            {edition.status ? (
              <Badge tone={edition.status === 'live' ? 'positive' : 'caution'} fontSize={0}>
                {edition.status === 'live' ? 'Live' : 'Upcoming'}
              </Badge>
            ) : null}
          </Flex>
        </Card>
      ))}
    </Stack>
  )
}
