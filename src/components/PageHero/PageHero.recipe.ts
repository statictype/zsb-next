import { sva } from 'styled-system/css'

/**
 * PageHero — co-located slot recipe.
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
      // Reveal contract is the shared `enter` animation style; only the delay
      // stays here.
      animationDelay: '0.2s',
    },
    lead: { textStyle: 'lead', color: 'body', maxWidth: '60ch', marginTop: 'xl' },
  },
  variants: {
    // Drop the hero's bottom padding when a section follows directly — the
    // section owns the gap (its `sectionY` top), so the two don't double up.
    flush: {
      true: { hero: { paddingBottom: '0' } },
    },
  },
  defaultVariants: { flush: false },
})
