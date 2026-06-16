import { cva } from 'styled-system/css'

/**
 * The one entrance-reveal contract. Compose it (via `cx`) onto any element that
 * should reveal on first paint — it locks the shared `enter` keyframe, the
 * canonical easing, `animation-fill-mode: both` (so the element's resting state
 * is its visible final state, no separate initial style needed), and the
 * reduced-motion kill-switch (`animation: none`). The reveal *shape* is picked
 * with variants; the per-site **delay** stays at the call site (`animationDelay`
 * on the element's own class), since it's layout/stagger, not reveal identity.
 *
 * This is the anti-drift lock for the reveal family — every former bespoke
 * keyframe (fadeSlideUp / fadeIn / dialogIn / cardIn / imageReveal / cardReveal)
 * now spells the same contract here, so a stray duration/easing can't creep back.
 */
export const enter = cva({
  base: {
    animationName: 'enter',
    animationTimingFunction: '{easings.expo}',
    animationFillMode: 'both',
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
  },
  variants: {
    // Vertical rise distance (the dominant reveal). `none` = pure fade.
    rise: {
      none: {},
      sm: { '--enter-y': '16px' },
      md: { '--enter-y': '30px' },
    },
    // Scale-in (the Hero image).
    zoom: { true: { '--enter-scale': '1.06' } },
    // Blur-in (the editions list cards).
    soft: { true: { '--enter-blur': '6px' } },
    // Reveal speed. `entrance` is the page-reveal default; `normal` is the
    // snappier speed for overlays that must feel responsive (modal, banner).
    speed: {
      entrance: { animationDuration: '{durations.entrance}' },
      normal: { animationDuration: '{durations.normal}' },
    },
  },
  defaultVariants: { rise: 'md', speed: 'entrance' },
})
