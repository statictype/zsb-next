import shared from '@/components/Shared.module.css'
import type { ProgramBlock as ProgramBlockType, ProgramData, ProgramFilm } from '@/types/edition'
import styles from './Program.module.css'

interface ProgramProps {
  year: number
  program: ProgramData
}

function ProgramCard({ block }: { block: ProgramBlockType }) {
  return (
    <div className={styles.item}>
      <div className={styles.itemHeader}>
        <span className={styles.itemType}>{block.type}</span>
        {block.dates && <span className={styles.itemDates}>{block.dates}</span>}
      </div>
      <h4 className={styles.itemTitle}>{block.title}</h4>
      {block.description && <p className={styles.itemDesc}>{block.description}</p>}
      {block.location && (
        <div className={styles.itemMeta}>
          <span>{block.location}</span>
        </div>
      )}
    </div>
  )
}

function ProgramColumn({
  blocks,
  films,
}: {
  blocks: ProgramBlockType[]
  films?: ProgramFilm[] | undefined
}) {
  const talkBlocks = blocks.filter((b) => b.type === 'Talks & Workshops')
  const otherBlocks = blocks.filter((b) => b.type !== 'Talks & Workshops')

  return (
    <div className={styles.column}>
      {otherBlocks.map((block) => (
        <ProgramCard key={block.title} block={block} />
      ))}

      {talkBlocks.length > 0 && (
        <div className={styles.item}>
          <div className={styles.itemHeader}>
            <span className={styles.itemType}>Talks &amp; Workshops</span>
          </div>
          {talkBlocks.map((block, i) => (
            <div key={i} className={styles.compactItem}>
              {block.format && <span className={styles.compactType}>{block.format}</span>}
              <span className={styles.compactTitle}>{block.title}</span>
              {block.description && <span className={styles.compactNote}>{block.description}</span>}
            </div>
          ))}
        </div>
      )}

      {films && films.length > 0 && (
        <div className={styles.item}>
          <div className={styles.itemHeader}>
            <span className={styles.itemType}>Screenings</span>
          </div>
          <h4 className={styles.itemTitle}>Short Film Breaks</h4>
          <div className={styles.filmSchedule}>
            {films.map((film, i) => (
              <div key={i} className={styles.filmEntry}>
                <span className={styles.filmDate}>{film.date}</span>
                <span className={styles.filmTitle}>{film.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function Program({ year, program }: ProgramProps) {
  const col1 = program.blocks.filter((b) => b.column === 1)
  const col2 = program.blocks.filter((b) => b.column === 2)

  return (
    <section className={`${shared.section} ${styles.section}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={`${shared.sectionTitle} ${shared.sectionTitleLight}`}>Program {year}</h2>
          </div>
        </div>

        <div className={styles.grid}>
          <ProgramColumn blocks={col1} />
          <ProgramColumn blocks={col2} films={program.films} />
        </div>

        {program.sftfBanner && (
          <div className={styles.sftfBanner}>
            <div className={styles.sftfContent}>
              <div className={styles.sftfLeft}>
                <span className={styles.sftfTag}>{program.sftfBanner.tag}</span>
                <h3 className={styles.sftfTitle}>{program.sftfBanner.title}</h3>
                <p className={styles.sftfDesc}>{program.sftfBanner.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
