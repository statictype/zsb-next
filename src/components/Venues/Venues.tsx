'use client'

import { useMemo, useState } from 'react'
import sharedStyles from '@/components/Shared.module.css'
import type { VenueEntry } from '@/types/edition'
import styles from './Venues.module.css'

interface VenuesProps {
  venues: VenueEntry[]
}

interface GroupedSubgroup {
  subgroup: string
  venues: (VenueEntry & { globalIndex: number })[]
}

interface GroupedVenue {
  group: string
  description: string
  subgroups: GroupedSubgroup[]
  count: number
}

function padNum(n: number, len = 2): string {
  return String(n).padStart(len, '0')
}

function groupVenues(venues: VenueEntry[]): GroupedVenue[] {
  const groups: GroupedVenue[] = []
  let globalIndex = 0

  for (const venue of venues) {
    let group = groups.find((g) => g.group === venue.group)
    if (!group) {
      group = {
        group: venue.group,
        description: '',
        subgroups: [],
        count: 0,
      }
      groups.push(group)
    }

    let subgroup = group.subgroups.find((s) => s.subgroup === venue.subgroup)
    if (!subgroup) {
      subgroup = { subgroup: venue.subgroup, venues: [] }
      group.subgroups.push(subgroup)
    }

    globalIndex++
    subgroup.venues.push({ ...venue, globalIndex })
    group.count++

    // Use the first subgroup's name as the description
    if (group.subgroups.length === 1 && subgroup.venues.length === 1) {
      group.description = venue.subgroup ?? ''
    }
  }

  return groups
}

export function Venues({ venues }: VenuesProps) {
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set())
  const groups = useMemo(() => groupVenues(venues), [venues])

  function toggleGroup(groupName: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(groupName)) {
        next.delete(groupName)
      } else {
        next.add(groupName)
      }
      return next
    })
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={`${styles.title} ${sharedStyles.sectionTitle}`}>Locations</h2>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalNum}>{padNum(venues.length)}</span>
          </div>
        </div>

        <div className={styles.accordion}>
          {groups.map((group) => {
            const isOpen = openGroups.has(group.group)

            return (
              <div
                key={group.group}
                className={`${styles.accordionItem} ${isOpen ? styles.isOpen : ''}`}
              >
                <button
                  type="button"
                  className={styles.trigger}
                  aria-expanded={isOpen}
                  onClick={() => toggleGroup(group.group)}
                >
                  <div className={styles.triggerLeft}>
                    <span className={styles.accordionName}>{group.group}</span>
                    <span className={styles.accordionCount}>{group.count}</span>
                  </div>
                  <div className={styles.triggerRight}>
                    <span className={styles.accordionDesc}>{group.description}</span>
                    <span className={styles.accordionIcon}>+</span>
                  </div>
                </button>

                <div className={styles.accordionContent}>
                  <div className={styles.accordionInner}>
                    <div className={styles.accordionBody}>
                      {group.subgroups.map((subgroup, si) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: static list
                        <div key={si} className={styles.accordionSubgroup}>
                          {subgroup.subgroup && (
                            <div className={styles.subgroupLabel}>{subgroup.subgroup}</div>
                          )}
                          <div className={styles.entries}>
                            {subgroup.venues.map((venue) => (
                              <div key={venue.globalIndex} className={styles.entry}>
                                <span className={styles.num}>{padNum(venue.globalIndex)}</span>
                                <span className={styles.name}>{venue.name}</span>
                                <span className={styles.program}>{venue.program}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
