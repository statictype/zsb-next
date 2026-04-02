# ZSB Design System (Next.js)

## Architecture

**Mobile-first CSS Modules** with a hybrid fluid + stepped token system. Base styles target 320px+, enhanced via `min-width` media queries. Nine tokens use `clamp()` for smooth scaling; the rest use stepped breakpoints.

### Breakpoints

```
320px   - Base (mobile)
768px   - Tablet        (+448)
1024px  - Desktop       (+256)
1280px  - Large         (+256)
1440px  - XL2           (+160)
1536px  - XL            (+96)
1792px  - 2XL           (+256)
```

---

## CSS Custom Properties

Defined in `src/app/globals.css`. Tokens marked **Fluid** use `clamp(min, preferred, max)` across 320px-1792px viewports. Tokens marked **Stepped** change at discrete breakpoints.

### Typography Scale (~1.2x major third)

| Token | Mobile | Tablet | Desktop | Large | XL2 | XL | 2XL | Type |
|-------|--------|--------|---------|-------|-----|-----|-----|------|
| `--text-3xs` | 8px | 9px | — | — | — | — | — | Stepped |
| `--text-2xs` | 10px | 11px | — | — | — | — | — | Stepped |
| `--text-xs` | 12px | — | — | — | — | — | — | Static |
| `--text-sm` | 14px | — | — | — | 15px | — | 16px | Stepped |
| `--text-base` | 16px | — | 17px | — | 18px | — | 19px | Stepped |
| `--text-md` | 19px | | | | | | 28px | Fluid |
| `--text-lg` | 22px | | | | | | 32px | Fluid |
| `--text-xl` | 26px | | | | | | 44px | Fluid |
| `--text-2xl` | 32px | | | | | | 60px | Fluid |
| `--text-3xl` | 40px | | | | | | 72px | Fluid |
| `--text-4xl` | 48px | | | | | | 96px | Fluid |
| `--text-5xl` | 58px | | | | | | 120px | Fluid |
| `--text-hero` | 40px | 80px | 110px | — | 120px | 124px | — | Stepped |

### Spacing Scale (8px grid)

| Token | Mobile | Tablet | Desktop | Large | XL2 | XL | 2XL | Type |
|-------|--------|--------|---------|-------|-----|-----|-----|------|
| `--space-xs` | 4px | — | — | — | — | — | — | Static |
| `--space-sm` | 8px | — | — | — | — | — | — | Static |
| `--space-md` | 16px | 20px | — | — | — | — | — | Stepped |
| `--space-lg` | 24px | | | | | | 48px | Fluid |
| `--space-xl` | 32px | | | | | | 72px | Fluid |
| `--space-2xl` | 48px | 56px | 64px | 80px | 88px | 96px | 112px | Stepped |
| `--space-3xl` | 64px | 80px | 96px | 112px | 120px | 128px | 144px | Stepped |
| `--space-4xl` | 96px | 112px | 128px | 160px | 176px | 192px | 224px | Stepped |
| `--space-5xl` | 128px | 160px | 192px | 224px | 240px | 256px | 288px | Stepped |
| `--space-6xl` | 160px | 200px | 240px | 288px | 304px | 320px | 352px | Stepped |
| `--space-7xl` | 192px | 240px | 288px | 352px | 368px | 384px | 416px | Stepped |
| `--space-8xl` | 256px | 320px | 384px | 448px | 480px | 512px | 544px | Stepped |
| `--space-9xl` | 320px | 400px | 480px | 560px | 600px | 640px | 672px | Stepped |
| `--space-10xl` | 384px | 480px | 576px | 672px | 720px | 768px | 800px | Stepped |

### Layout

| Token | Mobile | Tablet | Desktop | Large | XL2 | XL | 2XL |
|-------|--------|--------|---------|-------|-----|-----|-----|
| `--content-padding` | 16px | 40px | 80px | — | 88px | 96px | 112px |
| `--section-padding-y` | 60px | 100px | 120px | 160px | 180px | 200px | 240px |
| `--grid-gap` | 16px | 32px | 48px | 60px | 66px | 72px | 84px |
| `--max-width` | 1800px | — | — | — | — | — | — |

### Component-Specific

| Token | Mobile | Tablet | Desktop | Large | XL2 | XL | 2XL |
|-------|--------|--------|---------|-------|-----|-----|-----|
| `--nav-height` | 60px | 72px | 84px | 100px | — | — | — |
| `--carousel-height` | 50vh | 60vh | 70vh | — | 72vh | 75vh | 80vh |
| `--card-padding` | 16px | 24px | 32px | — | 34px | 36px | 40px |
| `--btn-size` | 48px | 56px | 64px | — | — | — | — |

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--pink` | #d5308e | Primary accent, CTAs, active states |
| `--light-pink` | #fbd6eb | Light accent backgrounds |
| `--chartreuse` | #d4e50a | Secondary accent, highlights |
| `--black` | #0e0b10 | Primary background |
| `--black-pure` | #000 | Footer, deep backgrounds |
| `--white` | #fff | Light backgrounds, text on dark |
| `--gray-100` | #f6f6f6 | Light section backgrounds |
| `--gray-200` | #e8e8e8 | Borders, dividers |
| `--gray-300` | #cfcfcf | Lead text on dark backgrounds |
| `--gray-350` | #a0a0a0 | Secondary text on dark |
| `--gray-400` | #9e9e9e | Body text on dark |
| `--gray-500` | #888888 | Muted body text on dark |
| `--gray-600` | #6d6d6d | Body text on light, labels on dark |
| `--gray-700` | #4c4c4c | Muted labels/meta on dark |
| `--gray-750` | #3c3c3c | Visible dividers, muted buttons on dark |
| `--gray-800` | #2b2b2b | Headings on light |
| `--gray-850` | #252525 | Borders, subtle dividers on dark |
| `--gray-900` | #1a1a1a | Dark UI elements, subtle backgrounds |
| `--gray-950` | #0d0d0d | Deepest dark UI elements |

### Typography — Line-Height

| Token | Value | Usage |
|-------|-------|-------|
| `--leading-display` | 0.85 | Page titles, hero headings |
| `--leading-heading` | 1 | Section titles, stats, card themes |
| `--leading-tight` | 1.3 | Compact body, card descriptions |
| `--leading-body` | 1.65 | Default body prose (also set on `body`) |
| `--leading-loose` | 2 | Lists, spaced items, credits |

### Typography — Letter-Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--tracking-tight` | -0.02em | Display headings (negative) |
| `--tracking-subtle` | 0.5px | Body text refinements |
| `--tracking-label` | 2px | Buttons, CTAs, small labels |
| `--tracking-wide` | 4px | Eyebrows, overlines, badges |

### Typography — Font-Weight

| Token | Value | Usage |
|-------|-------|-------|
| `--weight-light` | 300 | Light body text |
| `--weight-regular` | 400 | Regular body text |
| `--weight-medium` | 500 | Buttons, medium emphasis |
| `--weight-semibold` | 600 | Labels, navigation |
| `--weight-black` | 900 | Heavy emphasis (Program) |

### Animation

| Token | Value |
|-------|-------|
| `--ease-out-expo` | cubic-bezier(0.16, 1, 0.3, 1) |
| `--ease-out-quint` | cubic-bezier(0.23, 1, 0.32, 1) |
| `--duration-fast` | 200ms |
| `--duration-normal` | 300ms |
| `--duration-medium` | 400ms |
| `--duration-slow` | 500ms |
| `--duration-reveal` | 600ms |

### Card / Tile Interaction

| Token | Value | Usage |
|-------|-------|-------|
| `--card-hover-scale` | 1.03 | Hover transform scale for cards |
| `--card-image-filter` | grayscale(100%) brightness(0.7) | Card image resting state |
| `--card-image-filter-hover` | grayscale(0%) brightness(1) | Card image hover state |
| `--gallery-image-filter` | grayscale(100%) contrast(1.1) | Gallery image resting state |
| `--gallery-image-filter-hover` | grayscale(0%) contrast(1) | Gallery image hover state |

### Button Sizes (responsive)

Buttons scale with the viewport. A `lg` on mobile starts close to desktop `md` size.

| Token | Mobile | Tablet | Desktop | XL2 |
|-------|--------|--------|---------|-----|
| `--btn-sm-py / px` | 6/16 | 8/20 | — | — |
| `--btn-md-py / px` | 10/24 | 12/28 | 14/32 | 16/36 |
| `--btn-lg-py / px` | 12/28 | 16/36 | 20/44 | 24/52 |

Shared: `--btn-border-width: 2px`, `--btn-radius: 100px`

### Border-Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-badge` | 3px | Small badges, tags |
| `--radius-pill` | 100px | Pill-shaped buttons |
| `--radius-circle` | 50% | Circular elements |

### Effects

| Token | Value |
|-------|-------|
| `--shadow-md` | 0 4px 16px rgba(0, 0, 0, 0.15) |
| `--shadow-lg` | 0 10px 40px rgba(0, 0, 0, 0.2) |

---

## Fonts

| Token | Font | Usage |
|-------|------|-------|
| `--font-display` | Dela Gothic One | Headlines, titles, UI labels |
| `--font-body` | Montserrat | Body text, labels, descriptions |

Both fonts are loaded via `next/font/google` in `src/app/layout.tsx`, which sets CSS variables on `<html>`. Token aliases (`--font-display`, `--font-body`) map these to the `--font-*` CSS variables set by `next/font`.

---

## Typography Utility Classes

Defined in `src/components/Shared.module.css`. Use via `composes:` from component CSS modules.

| Class | Font Size | Font | Line-Height | Usage |
|-------|-----------|------|-------------|-------|
| `.pageTitle` | `--text-4xl` | display | `--leading-display` | Main page headings |
| `.sectionTitle` | `--text-2xl` → `--text-3xl` @768px | display | `--leading-heading` | Section headings |
| `.subsectionTitle` | `--text-xl` → `--text-2xl` @768px → `--text-3xl` @1536px | display | `--leading-heading` | Medium headings |
| `.cardTitle` | `--text-xl` | display | `--leading-heading` | Card/item headings |
| `.leadText` | `--text-md` → `--text-lg` @768px | body | `--leading-body` | Intro/lead paragraphs |
| `.bodyText` | `--text-base` | body | `--leading-body` | Standard body text |
| `.heroLead` | `--text-lg` | body | `--leading-body` | Hero lead text (gray-200) |
| `.heroBody` | `--text-base` | body | `--leading-body` | Hero body text (gray-500) |
| `.labelText` | `--text-2xs` | body | — | Small uppercase labels |
| `.labelSmall` | `--text-3xs` | body | — | Even smaller labels/meta |
| `.eyebrowMuted` | `--text-xs` | body | — | Muted eyebrow with line |
| `.eyebrowPink` | `--text-xs` | body | — | Pink eyebrow with line |
| `.overline` | `--text-xs` | — | — | Pink overline text |

---

## Reusable Patterns

### Animated Gradient Border

Pink-to-chartreuse animated border on hover, implemented per-component in `Carousel.module.css` and `MediaKit.module.css` using the `gradientBorderShift` keyframe animation.

### ReadMore (Expandable Text)

The `<ReadMore>` client component (`src/components/ReadMore/`) provides collapsible text on mobile. It clips content to a set height with a gradient fade and a toggle button. Used in `Manifesto` and `ThemeArtists` sections.

### Navigation

The `<Navigation>` client component (`src/components/Navigation/`) provides a hamburger menu on mobile (<768px) and a horizontal nav bar on desktop. Toggle state is managed in React, no external JS.

---

## Section Backgrounds

| Section | Background |
|---------|------------|
| Hero | `--black` with image overlay |
| Manifesto | `--white` |
| Gallery | `--black` |
| Venues | `--white` |
| Program | `--gray-100` |
| Syzygy/Artists | `--black` |
| Credits | `--gray-100` |
| Media Kit | `--gray-900` |
| Footer | `--black-pure` |

---

## Key Conventions

1. **CSS Modules** — each component has a co-located `.module.css` file, no global CSS classes
2. **Mobile-first** — base styles for mobile, enhanced with `@media (min-width: ...)`
3. **Design tokens** — use CSS variables, avoid hardcoded values
4. **Server components by default** — `"use client"` only where interactivity is needed
5. **No `!important`** — specificity managed through cascade
6. **Transitions** — use `--duration-*` tokens with `--ease-out-expo` or `--ease-out-quint`
7. **Typography** — use `--leading-*`, `--tracking-*`, `--weight-*` tokens instead of hardcoded values
8. **Typography classes** — compose from `Shared.module.css` utility classes for headings, body text, and labels
