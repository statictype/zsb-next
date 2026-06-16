import { sva } from 'styled-system/css'

/**
 * VisitFaq — co-located slot recipe.
 *
 * Reuses the foundation: `section`/`sectionInner` layerStyles and the
 * `sectionTitle` textStyle (margin applied here, since textStyles are
 * typography-only). The list itself is the bespoke part.
 */
export const visitFaq = sva({
  slots: ['inner', 'list', 'item', 'question', 'answer'],
  base: {
    inner: { layerStyle: 'sectionInner' },
    list: { maxWidth: '760px' },
    // The `<Disclosure>` root: a hairline divider between entries. Its summary
    // row + panel own the vertical padding.
    item: {
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'borderDark',
      _last: { borderBottomWidth: '0' },
    },
    question: {
      fontFamily: 'body',
      fontSize: 'md',
      fontWeight: 'bold',
      lineHeight: 'tight',
      color: 'heading',
    },
    answer: {
      fontFamily: 'body',
      fontSize: 'base',
      lineHeight: 'body',
      color: 'body',
      // Editorial answers may contain intentional line breaks.
      whiteSpace: 'pre-line',
    },
  },
})
