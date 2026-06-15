import { sva } from 'styled-system/css'

/**
 * VisitFaq — co-located slot recipe.
 *
 * Reuses the foundation: `section`/`sectionInner` layerStyles and the
 * `sectionTitle` textStyle (margin applied here, since textStyles are
 * typography-only). The list itself is the bespoke part.
 */
export const visitFaq = sva({
  slots: ['section', 'inner', 'title', 'list', 'item', 'question', 'answer'],
  base: {
    section: { layerStyle: 'section', background: 'canvas' },
    inner: { layerStyle: 'sectionInner' },
    title: { textStyle: 'sectionTitle', marginBottom: 'xl' },
    list: { display: 'grid', gap: 'lg', maxWidth: '760px' },
    item: {
      paddingBottom: 'lg',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'divider',
      _last: { paddingBottom: '0', borderBottomWidth: '0' },
    },
    question: {
      fontFamily: 'body',
      fontSize: 'md',
      fontWeight: 'bold',
      lineHeight: 'tight',
      color: 'heading',
      marginBottom: 'sm',
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
