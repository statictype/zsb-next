'use client'

import { RiAddLine } from '@remixicon/react'
import { useState } from 'react'
import sharedStyles from '@/components/Shared.module.css'
import { padNum } from '@/lib/format-utils'
import type { VenueEntry } from '@/types/edition'
import styles from './Venues.module.css'

interface VenuesProps {
  venues: VenueEntry[]
}

interface Subgroup {
  subgroup: string
  venues: (VenueEntry & { displayNumber: number })[]
}

interface Group {
  group: string
  subgroups: Subgroup[]
  count: number
}

function groupVenues(venues: VenueEntry[]): Group[] {
  const groups: Group[] = []
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

export function Venues({ venues }: VenuesProps) {
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set())
  const groups = groupVenues(venues)

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
    <section className={`${sharedStyles.section} ${styles.section}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={`${sharedStyles.sectionTitle} ${sharedStyles.sectionTitleLight}`}>
              Locations
            </h2>
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
                    {/* <span className={styles.accordionCount}>{group.count}</span> */}
                  </div>
                  <div className={styles.triggerRight}>
                    {/* <span className={styles.accordionDesc}>{group.description}</span> */}
                    <span className={styles.accordionIcon}>
                      <RiAddLine size={18} />
                    </span>
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
                              <div key={venue.displayNumber} className={styles.entry}>
                                <span className={styles.num}>{padNum(venue.displayNumber)}</span>
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
