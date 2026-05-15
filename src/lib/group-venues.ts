import type { VenueEntry } from '@/types/edition'

export interface GroupedSubgroup {
  subgroup: string
  venues: (VenueEntry & { displayNumber: number })[]
}

export interface GroupedVenue {
  group: string
  subgroups: GroupedSubgroup[]
  count: number
}

export function groupVenues(venues: VenueEntry[]): GroupedVenue[] {
  const groups: GroupedVenue[] = []
  let displayNumber = 0

  for (const venue of venues) {
    let group = groups.find((g) => g.group === venue.group)
    if (!group) {
      group = { group: venue.group, subgroups: [], count: 0 }
      groups.push(group)
    }

    let subgroup = group.subgroups.find((s) => s.subgroup === venue.subgroup)
    if (!subgroup) {
      subgroup = { subgroup: venue.subgroup, venues: [] }
      group.subgroups.push(subgroup)
    }

    displayNumber++
    subgroup.venues.push({ ...venue, displayNumber })
    group.count++
  }

  return groups
}
