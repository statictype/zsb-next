import { sva } from 'styled-system/css'

export const venuesView = sva({
  slots: [
    'section',
    'groupTitle',
    'venues',
    'events',
    'event',
    'eventName',
    'eventWhen',
    'child',
    'childName',
  ],
  base: {
    section: { borderTop: 'hairline' },
    groupTitle: {
      color: 'highlight',
    },
    venues: { width: 'full' },

    events: { listStyle: 'none', display: 'flex', flexDirection: 'column' },
    event: {
      paddingBlock: 'sm',
      borderTop: 'hairline',
      '&:first-child': { borderTop: 'none' },
    },
    eventName: {
      color: 'white',
      width: 'fit',
      transition: 'interactive',
      _hover: { color: 'action' },
    },
    eventWhen: {
      fontVariantNumeric: 'tabular-nums',
    },
    child: {
      paddingLeft: 'md',
      borderLeft: 'hairline',
    },
    childName: {
      color: 'gray.300',
    },
  },
})
