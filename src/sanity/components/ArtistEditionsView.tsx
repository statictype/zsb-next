import { Badge, Box, Card, Flex, Spinner, Stack, Text } from '@sanity/ui'
import { useEffect, useState } from 'react'
import { useClient } from 'sanity'
import { IntentLink } from 'sanity/router'
import type { UserViewComponent } from 'sanity/structure'
import { apiVersion } from '../env'

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
 * Document view tab on `artist` listing the editions that reference this
 * artist — the reverse of `edition.artists[]`. Read-only; each row links into
 * the edition document.
 */
export const ArtistEditionsView: UserViewComponent = ({ documentId }) => {
  const client = useClient({ apiVersion })
  const [editions, setEditions] = useState<ReferencingEdition[] | null>(null)

  useEffect(() => {
    let active = true
    const id = documentId.replace(/^drafts\./, '')
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
  }, [client, documentId])

  if (editions === null) {
    return (
      <Flex align="center" justify="center" padding={5}>
        <Spinner muted />
      </Flex>
    )
  }

  if (editions.length === 0) {
    return (
      <Box padding={4}>
        <Text muted size={1}>
          Not referenced by any edition yet.
        </Text>
      </Box>
    )
  }

  return (
    <Box padding={4}>
      <Stack space={3}>
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
    </Box>
  )
}
