import { sva } from 'styled-system/css'

/**
 * PageHero — co-located slot recipe (Panda migration).
 *
 * The shared dark title block every top-level page opens with: it clears the
 * fixed nav (the `pageHero` layerStyle owns the full padding, so the page-top
 * offset is deterministic) and animates the title in. Folds together what used
 * to be `shared.pageHero` + `sectionInner` + `pageTitle` + `lead` repeated on
 * every static page. `title` carries the entrance animation at the call site
 * (textStyles are typography-only); `lead` adds its `max-width`/top margin.
 */
export const pageHero = sva({
  slots: ['hero', 'inner', 'title', 'lead'],
  base: {
    hero: { layerStyle: 'pageHero' },
    inner: { layerStyle: 'sectionInner' },
    title: {
      textStyle: 'pageTitle',
      opacity: '0',
      animation: 'fadeSlideUp 1s {easings.expo} 0.2s forwards',
    },
    lead: { textStyle: 'lead', maxWidth: '60ch', marginTop: 'xl' },
  },
})
