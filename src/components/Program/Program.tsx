import Link from 'next/link'
import shared from '@/components/Shared.module.css'
import type { ProgramData } from '@/types/edition'
import styles from './Program.module.css'

interface ProgramProps {
  year: number
  program: ProgramData
}

export function Program({ year, program }: ProgramProps) {
  const featuredBlocks = program.blocks.filter((b) => b.featured)
  const regularBlocks = program.blocks.filter((b) => !b.featured)

  // Group regular blocks by type
  const talkBlocks = regularBlocks.filter((b) => b.type === 'Talks & Workshops')
  const otherBlocks = regularBlocks.filter(
    (b) => b.type !== 'Talks & Workshops',
  )

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={`${shared.sectionTitle} ${styles.title}`}>
              Program {year}
            </h2>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.dates}>{program.dates}</span>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Left Column */}
          <div className={styles.column}>
            <div className={styles.group}>
              {featuredBlocks.map((block, i) => (
                <div
                  key={i}
                  className={`${styles.item} ${block.featured ? styles.itemFeatured : ''} ${shared.vacuumSealed}`}
                >
                  <div className={shared.plasticSheen} />
                  <div className={styles.itemHeader}>
                    <span className={styles.itemType}>{block.type}</span>
                    {block.dates && (
                      <span className={styles.itemDates}>{block.dates}</span>
                    )}
                  </div>
                  <h4 className={styles.itemTitle}>{block.title}</h4>
                  {block.description && (
                    <p className={styles.itemDesc}>{block.description}</p>
                  )}
                  {block.location && (
                    <div className={styles.itemMeta}>
                      <span>{block.location}</span>
                    </div>
                  )}
                </div>
              ))}

              {otherBlocks.map((block, i) => (
                <div
                  key={`other-${i}`}
                  className={`${styles.item} ${shared.vacuumSealed}`}
                >
                  <div className={shared.plasticSheen} />
                  <div className={styles.itemHeader}>
                    <span className={styles.itemType}>{block.type}</span>
                    {block.dates && (
                      <span className={styles.itemDates}>{block.dates}</span>
                    )}
                  </div>
                  <h4 className={styles.itemTitle}>{block.title}</h4>
                  {block.description && (
                    <p className={styles.itemDesc}>{block.description}</p>
                  )}
                </div>
              ))}

              {program.sftfBanner && (
                <Link
                  href={program.sftfBanner.href}
                  className={styles.sftfBanner}
                >
                  <div className={styles.sftfContent}>
                    <div className={styles.sftfLeft}>
                      <span className={styles.sftfTag}>
                        {program.sftfBanner.tag}
                      </span>
                      <h3 className={styles.sftfTitle}>
                        {program.sftfBanner.title}
                      </h3>
                      <p className={styles.sftfDesc}>
                        {program.sftfBanner.description}
                      </p>
                    </div>
                    <div className={styles.sftfCta}>
                      <span className={styles.sftfCtaText}>Explore</span>
                      <span className={styles.sftfCtaArrow}>&rarr;</span>
                    </div>
                  </div>
                  <div className={styles.sftfAccent} />
                </Link>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.column}>
            {talkBlocks.length > 0 && (
              <div className={styles.group}>
                <div className={`${styles.item} ${shared.vacuumSealed}`}>
                  <div className={shared.plasticSheen} />
                  <div className={styles.itemHeader}>
                    <span className={styles.itemType}>
                      Talks &amp; Workshops
                    </span>
                  </div>
                  {talkBlocks.map((block, i) => (
                    <div key={i} className={styles.compactItem}>
                      <span className={styles.compactType}>
                        {block.title.split(': ')[0]}
                      </span>
                      <span className={styles.compactTitle}>
                        {block.title.includes(': ')
                          ? block.title.split(': ')[1]
                          : block.title}
                      </span>
                      {block.description && (
                        <span className={styles.compactNote}>
                          {block.description}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {program.films && program.films.length > 0 && (
                  <div className={`${styles.item} ${shared.vacuumSealed}`}>
                    <div className={shared.plasticSheen} />
                    <div className={styles.itemHeader}>
                      <span className={styles.itemType}>Screenings</span>
                    </div>
                    <h4 className={styles.itemTitle}>Short Film Breaks</h4>
                    <div className={styles.filmSchedule}>
                      {program.films.map((film, i) => (
                        <div key={i} className={styles.filmEntry}>
                          <span className={styles.filmDate}>{film.date}</span>
                          <span className={styles.filmTitle}>{film.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
