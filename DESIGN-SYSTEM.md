# ZSB Design System (Next.js)

## Architecture

**Mobile-first CSS Modules** with a hybrid fluid + stepped token system. Base styles target 320px+, enhanced via `min-width` media queries. Nine tokens use `clamp()` for smooth scaling; the rest use stepped breakpoints.

### Breakpoints

```
320px   - Base (mobile)
768px   - Tablet        (+448)
1024px  - Desktop       (+256)
1280px  - Large         (+256)
1536px  - XL            (+256)
1792px  - 2XL           (+256)
```

---

## CSS Custom Properties

Defined in `src/app/globals.css`. Tokens marked **Fluid** use `clamp(min, preferred, max)` across 320px-1792px viewports. Tokens marked **Stepped** change at discrete breakpoints.

### Typography Scale (~1.2x major third)

| Token | Mobile | Tablet | Desktop | Large | XL | 2XL | Type |
|-------|--------|--------|---------|-------|----|-----|------|
| `--text-3xs` | 8px | 9px | — | — | — | — | Stepped |
| `--text-2xs` | 10px | 11px | — | — | — | — | Stepped |
| `--text-xs` | 12px | — | — | — | — | — | Static |
| `--text-sm` | 14px | — | — | — | — | — | Static |
| `--text-base` | 16px | — | 17px | 19px | 21px | 23px | Stepped |
| `--text-md` | 19px | | | | | 28px | Fluid |
| `--text-lg` | 22px | | | | | 32px | Fluid |
| `--text-xl` | 26px | | | | | 44px | Fluid |
| `--text-2xl` | 32px | | | | | 60px | Fluid |
| `--text-3xl` | 40px | | | | | 72px | Fluid |
| `--text-4xl` | 48px | | | | | 96px | Fluid |
| `--text-5xl` | 58px | | | | | 120px | Fluid |
| `--text-hero` | 40px | 80px | 110px | 124px | 136px | 148px | Stepped |

### Spacing Scale (8px grid)

| Token | Mobile | Tablet | Desktop | Large | XL | 2XL | Type |
|-------|--------|--------|---------|-------|----|-----|------|
| `--space-xs` | 4px | — | — | — | — | — | Static |
| `--space-sm` | 8px | — | — | — | — | — | Static |
| `--space-md` | 16px | 20px | — | — | — | — | Stepped |
| `--space-lg` | 24px | | | | | 48px | Fluid |
| `--space-xl` | 32px | | | | | 72px | Fluid |
| `--space-2xl` | 48px | 56px | 64px | 80px | 96px | 112px | Stepped |
| `--space-3xl` | 64px | 80px | 96px | 112px | 128px | 144px | Stepped |
| `--space-4xl` | 96px | 112px | 128px | 160px | 192px | 224px | Stepped |
| `--space-5xl` | 128px | 160px | 192px | 224px | 256px | 288px | Stepped |

### Layout

| Token | Mobile | Tablet | Desktop | Large | XL | 2XL |
|-------|--------|--------|---------|-------|----|-----|
| `--content-padding` | 16px | 40px | 80px | — | 96px | 112px |
| `--section-padding-y` | 60px | 100px | 120px | 160px | 200px | 240px |
| `--grid-gap` | 16px | 32px | 48px | 60px | 72px | 84px |
| `--max-width` | 1800px | — | — | — | — | — |

### Component-Specific

| Token | Mobile | Tablet | Desktop | Large | XL | 2XL |
|-------|--------|--------|---------|-------|----|-----|
| `--nav-height` | 60px | — | — | — | — | — |
| `--carousel-height` | 50vh | 60vh | 70vh | — | 75vh | 80vh |
| `--card-padding` | 16px | 24px | 32px | — | 36px | 40px |
| `--btn-size` | 48px | 56px | 64px | — | — | — |

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--pink` | #ff0099 | Primary accent, CTAs, active states |
| `--chartreuse` | #d4e50a | Secondary accent, highlights |
| `--black` | #0a0a0a | Primary background |
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

### Animation

| Token | Value |
|-------|-------|
| `--ease-out-expo` | cubic-bezier(0.16, 1, 0.3, 1) |
| `--duration-normal` | 300ms |
| `--duration-slow` | 500ms |

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
| `--font-body` | PP Formula Light | Labels, meta text, first paragraphs |
| `--font-paragraph` | Raleway | Body text, descriptions |

Dela Gothic One and Raleway are loaded via `next/font` in `src/app/layout.tsx`, which sets CSS variables on `<html>`. PP Formula Light is loaded via CDN `@font-face` in `globals.css`. Token aliases (`--font-display`, etc.) map these to the `--font-*` CSS variables set by `next/font`.

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
6. **Transitions** — use `--duration-normal` or `--duration-slow` with `--ease-out-expo`
