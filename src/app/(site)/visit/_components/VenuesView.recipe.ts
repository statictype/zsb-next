import { sva } from 'styled-system/css'

/**
 * VenuesView — co-located slot recipe.
 *
 * The programme browsed by place (ZSB-27), under the Visit page's main-venue
 * block. No ground of its own — it inherits the page's dark canvas; the shared
 * Accordion owns disclosure chrome and state.
 */
export const venuesView = sva({
  slots: [
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
      transitionProperty: 'colors',
      transitionDuration: 'fast',
      transitionTimingFunction: 'quint',
      _hover: { color: 'action' },
      _motionReduce: { transitionDuration: 'instant' },
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
