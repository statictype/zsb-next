import { IsdayBadge } from '@/components/IsdayBadge/IsdayBadge'
import { ReadMore } from '@/components/ReadMore/ReadMore'
import type { ManifestoData } from '@/types/edition'
import styles from './Manifesto.module.css'

interface ManifestoProps {
  manifesto: ManifestoData
}

export function Manifesto({ manifesto }: ManifestoProps) {
  const titleParts = manifesto.highlight
    ? manifesto.title.split(manifesto.highlight)
    : null

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.title}>
          <p>
            {titleParts ? (
              <>
                {titleParts[0]}
                <span className={styles.titleHighlight}>
                  {manifesto.highlight}
                </span>
                {titleParts[1]}
              </>
            ) : (
              manifesto.title
            )}
          </p>
        </div>
        <div className={styles.content}>
          <ReadMore>
            <div className={styles.text}>
              {manifesto.paragraphs.map((p, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static list
                <p key={i}>{p}</p>
              ))}
            </div>
          </ReadMore>
          <IsdayBadge />
        </div>
      </div>
    </section>
  )
}
