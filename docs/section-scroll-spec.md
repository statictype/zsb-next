# Homepage Section Scroll — Behaviour Spec

## Current implementation

The homepage uses **pure CSS** for section scrolling and reveal effects. No JS scroll controllers.

### How it works

| Mechanism | Implementation |
|-----------|---------------|
| Scroll snapping | `scroll-snap-type: y mandatory` on `<html>`, `scroll-snap-align: start; scroll-snap-stop: always` on each panel |
| Reveal effect | `position: sticky; top: 0` with ascending `z-index` (1→6) — next section slides up over the current one |
| Active nav | `IntersectionObserver` on non-sticky sentinel `<div data-nav="...">` elements with `rootMargin: '99999px 0px -99% 0px'` |
| Nav clicks | `window.scrollTo({ top: sentinel.offsetTop })` with scroll-snap temporarily disabled during smooth scroll |
| Footer | Last section uses `panelLast` (not sticky), footer has `scroll-snap-align: end` |
| Artists section | Static server component, two-column layout with CSS `mask-image` gradient fade at top/bottom edges |

### Why CSS-only

We tried several JS scroll control approaches. All introduced lag because JS-driven `scrollTo` runs on the main thread and must recompute `position: sticky` layout for all 6 sections on every animation frame. Native CSS scroll-snap runs on the compositor thread and is lag-free.

### Files

| File | Role |
|------|------|
| `src/app/globals.css` | `scroll-snap-type: y mandatory` on `html` |
| `src/app/page.module.css` | `.panel` (sticky + snap) and `.panelLast` (relative + snap), `.sentinel` |
| `src/app/page.tsx` | Homepage sections with sentinel divs and z-index |
| `src/components/Navigation/Navigation.tsx` | IO-based active tracking, nav click handling |
| `src/components/ArtistsSection/` | Static two-column name list with CSS mask fade |
| `src/components/Footer/Footer.module.css` | `scroll-snap-align: end` |

## Sections (in order)

| Index | ID | Nav link | z-index | Sticky |
|-------|----|----------|---------|--------|
| 0 | home | Home | 1 | yes |
| 1 | about | About | 2 | yes |
| 2 | editions | Editions | 3 | yes |
| 3 | artists | Artists | 4 | yes |
| 4 | (visit) | Visit | 5 | yes |
| 5 | (partner) | — | 6 | **no** (`panelLast`) |

## Known tradeoff: multi-section jumps on hard swipes

`scroll-snap-stop: always` is meant to force the browser to stop at every snap point. However, with `position: sticky` sections, multiple snap targets can collapse to the same visual position (all stuck at `top: 0`). This can cause the browser to skip sections on aggressive trackpad gestures.

### Approaches tried and why they failed

| Approach | Outcome |
|----------|---------|
| **Full JS scroll control** (intercepting wheel/touch/key, programmatic `scrollTo`) | Lag — JS `scrollTo` on the main thread triggers sticky layout recalculation every frame. Also caused React re-render cascades through context. |
| **GSAP Observer + ScrollToPlugin** | Same lag — GSAP's `scrollTo` is still JS-driven main-thread scrolling. |
| **Wheel event dampener** (`preventDefault` on excess events) | Unreliable — difficult to distinguish "excess" events from legitimate next-section scrolls. First-event-only approach didn't provide enough momentum for CSS snap to reach the next section. |
| **CSS `scroll-snap-stop: always` alone** | Works for gentle scrolls but not for hard trackpad swipes due to sticky position collapsing snap points. |

### Possible future solutions

- **Remove `position: sticky`** and use a different reveal effect (e.g., CSS `clip-path` animation or `View Transitions API`). This would let `scroll-snap-stop: always` work correctly since snap points would be at distinct positions.
- **Use `overscroll-behavior: contain`** on sections to limit momentum propagation.
- **Wait for browser improvements** — `scroll-snap-stop: always` behaviour with sticky positioning may improve in future browser versions.

## Sentinel elements

Non-sticky 1px `<div data-nav="...">` elements placed before each section in the DOM. They serve two purposes:

1. **IntersectionObserver targets** — since sticky sections all report as intersecting at viewport top, sentinels provide accurate scroll position tracking.
2. **Nav click scroll targets** — `sentinel.offsetTop` gives the correct document flow position for `window.scrollTo`, unlike sticky sections whose `getBoundingClientRect().top` is always 0 when stuck.

The observer uses `rootMargin: '99999px 0px -99% 0px'`:
- `99999px` top: extends root far above viewport — sentinels that scrolled past remain "intersecting"
- `-99%` bottom: shrinks root from below — only sentinels at/above viewport top count, preventing the next section's sentinel from falsely registering

Active = last intersecting sentinel in DOM order. No sentinels intersecting = "home".

## Nav click behaviour

Clicking a nav link while on the homepage:
1. `preventDefault()` to avoid hash navigation
2. Temporarily set `scrollSnapType = 'none'` on `<html>` — this prevents `scroll-snap-stop: always` from catching the smooth scroll at intermediate sections
3. `window.scrollTo({ top: sentinel.offsetTop, behavior: 'smooth' })`
4. On `scrollend` (with 1200ms fallback timeout), restore `scrollSnapType = ''`

This allows smooth scrolling directly to any section, forward or backward, without intermediate stops.

## SEO impact

No negative impact. All content is server-rendered in normal document flow. Without JS, the page scrolls normally. Sentinel divs are `aria-hidden` with no content. Sticky positioning and z-index do not affect content indexing.
