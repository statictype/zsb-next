import shared from '@/components/Shared.module.css'
import type { ManifestoData } from '@/types/edition'
import styles from './Manifesto.module.css'

interface ManifestoProps {
  manifesto: ManifestoData
}

export function Manifesto({ manifesto }: ManifestoProps) {
  const titleParts = manifesto.highlight ? manifesto.title.split(manifesto.highlight) : null

  return (
    <section className={`${shared.section} ${shared.sectionLight} ${styles.section}`}>
      <div className={styles.container}>
        <div className={styles.title}>
          <p>
            {titleParts ? (
              <>
                {titleParts[0]}
                <span className={styles.titleHighlight}>{manifesto.highlight}</span>
                {titleParts[1]}
              </>
            ) : (
              manifesto.title
            )}
          </p>
        </div>
        <div className={styles.content}>
          <div className={styles.text}>
            <p>{manifesto.body}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
