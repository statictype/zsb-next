import { cx } from 'styled-system/css'
import { editorialSplit } from 'styled-system/patterns'
import { section } from 'styled-system/recipes'
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading'
import { splitFirstMatch } from '@/lib/split-first-match'
import type { ManifestoData } from '@/types/edition'
import { manifesto as styles } from './Manifesto.recipe'

interface ManifestoProps {
  manifesto: ManifestoData
}

export function Manifesto({ manifesto }: ManifestoProps) {
  const titleParts = manifesto.highlight
    ? splitFirstMatch(manifesto.title, manifesto.highlight)
    : null
  const s = styles()

  return (
    <section className={cx(section({ ground: 'light', rhythm: 'lg' }), s.section)}>
      <div className={cx(editorialSplit(), s.container)}>
        <SectionHeading case="sentence" flush>
          {titleParts ? (
            <>
              {titleParts.before}
              <span className={s.titleHighlight}>{titleParts.match}</span>
              {titleParts.after}
            </>
          ) : (
            manifesto.title
          )}
        </SectionHeading>
        <div className={s.content}>
          <div className={s.text}>
            <p>{manifesto.body}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
