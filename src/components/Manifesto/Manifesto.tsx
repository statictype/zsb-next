import type { ManifestoData } from '@/types/edition'
import { manifesto as styles } from './Manifesto.recipe'

interface ManifestoProps {
  manifesto: ManifestoData
}

export function Manifesto({ manifesto }: ManifestoProps) {
  const titleParts = manifesto.highlight ? manifesto.title.split(manifesto.highlight) : null
  const s = styles()

  return (
    <section className={s.section}>
      <div className={s.container}>
        <div className={s.title}>
          <p>
            {titleParts ? (
              <>
                {titleParts[0]}
                <span className={s.titleHighlight}>{manifesto.highlight}</span>
                {titleParts[1]}
              </>
            ) : (
              manifesto.title
            )}
          </p>
        </div>
        <div className={s.content}>
          <div className={s.text}>
            <p>{manifesto.body}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
