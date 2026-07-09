import { sva } from 'styled-system/css'

/**
 * VisitFaq — co-located slot recipe.
 *
 * Reuses the foundation: `section`/`sectionInner` layerStyles and the
 * `sectionTitle` textStyle (margin applied here, since textStyles are
 * typography-only). The list itself is the bespoke part.
 */
export const visitFaq = sva({
  slots: ['inner', 'list', 'answer'],
  base: {
    inner: { layerStyle: 'sectionInner' },
    list: { maxWidth: 'measure' },
    answer: {
      textStyle: 'prose',
      // Editorial answers may contain intentional line breaks.
      whiteSpace: 'pre-line',
    },
  },
})
