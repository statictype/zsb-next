# `HeroSlideshow` stays separate from `Carousel`

Both components are slideshow-shaped (active index + manual nav, with `HeroSlideshow` adding autoplay), and a literal merge with `autoplay` as a prop was considered. The chrome is too different to unify: crossfade vs `translateX` transitions, bare `<div>` vs section wrapper with title/theme, corner-mounted small arrows vs big arrows + dots + progress bar, vignette overlay, and an LCP-priority hint on the first image.

The shared concept is **slideshow state**, not slideshow rendering. That shared concept lives in `src/lib/use-slideshow.ts` (`useSlideshow({ count, wrap?, autoplay? })`) and the two components consume it with different configs. Re-suggesting a component merge will pull presentation differences behind a "variant" prop — that's the regression this guards against.
