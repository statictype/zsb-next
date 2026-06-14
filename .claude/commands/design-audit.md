---
description: (Re)generate a standalone /styleguide design-audit route that mirrors the current frontend's design language
---

# Design Audit Generator

Regenerate `src/app/styleguide/` — a **standalone, throwaway design-audit route** that renders the
project's real components live, clustered by design role and annotated with provenance, so the design
team can spot inconsistency and make ZSB brand decisions.

This command is the **durable generator**; the route it writes is **disposable**. Re-run it any time the
frontend changes to get a fresh, accurate audit. Each run **re-discovers** the design language from the
current code and **overwrites** the route from scratch — never trust the inventory at the bottom of this
file blindly; it is a *starting reference* to reconcile against what you actually find.

The page is internal: `robots: noindex/nofollow`, NOT added to `Navigation` nav items or `sitemap.ts`,
mounted OUTSIDE the `(site)` route group so it gets no fixed nav/footer/cookie chrome. Do not commit
unless the user explicitly asks (per repo convention).

---

## Procedure

Execute these steps in order each run.

### 1. Discover (re-scan every run — do not assume)

- Read `src/app/globals.css` → capture **all** tokens: raw color palette, semantic role tokens
  (`--canvas`, `--surface-light`, `--heading(-light)`, `--body(-light)`, `--muted`, `--divider(-light)`,
  `--action`, `--highlight`), the fluid type scale (`--text-*` `clamp()`), spacing scale, breakpoints,
  `--ease-out-*`, `--duration-*`, radii, shadows, weights, tracking/leading, button-size tokens,
  card filters.
- Read `src/components/Shared.module.css` → capture shared utility/composable classes (titles, body,
  `.eyebrowMuted`, `.pill`/`.pillLg`, `.labelText`/`.labelSmall`, section primitives).
- Read `src/app/layout.tsx` → capture the loaded fonts and their CSS variables.
- Glob `src/components/*/` → enumerate **every** component folder. For each, read its `.tsx` + `.module.css`.
- For each component, classify its **role(s)**: token/foundation, eyebrow, tag/chip/pill/badge, link,
  button, control (arrow/close/dot/toggle/hamburger), card, banner, interactive-misc, or content-section.
- For each component's `.module.css`, record which **state selectors** exist: `:hover`, `:active`,
  `:focus-visible`, `:disabled`, `[aria-expanded]`, `[aria-current]`, `[data-*]`, and variant classes.
  This drives the states display in step 3.

### 2. Build fixtures (derive from current prop types)

Many components require Sanity-shaped props and will not render without them. For each data-driven
component:

- Read its **TypeScript `Props` type / interface** in the component `.tsx` and synthesize the **minimal
  valid mock object** to render it. Derive shapes from the *current* types each run so the route doesn't
  break when props change.
- Do **not** fetch Sanity. Use the local placeholder for images: the runtime image shape is `{ src, alt }`
  with `src` pointing at `/img/placeholder.jpg` (see `src/lib/placeholder.ts`). Use 2–3 placeholder items
  where a component takes a list (carousel, grid, table, calendar).
- Keep all fixtures in **one audit-only module**: `src/app/styleguide/fixtures.ts`. Keep them tiny but
  type-correct (the build is the type-check; it must pass `pnpm typecheck`).

### 3. Generate the route

Write these files (overwrite each run):

- `src/app/styleguide/page.tsx` — the audit page (server component; imports live client components).
- `src/app/styleguide/fixtures.ts` — mock data from step 2.
- `src/app/styleguide/Specimen.tsx` + `src/app/styleguide/styleguide.module.css` — **audit-only
  scaffolding** (labeling cards, role-section layout, light/dark panels). Clearly comment these as NOT
  part of the design system.

**page.tsx requirements:**

- `export const metadata = { title: 'Design Audit', robots: { index: false, follow: false } }`.
- Root wrapper defaults to the dark `--canvas` background; still include **light panels**
  (`.sectionLight` context) for light-context specimens (e.g. `IsdayBadge`, `.pill` on light, `*Light`
  type variants).
- **Canvas switcher (client control):** add a small fixed/sticky control —
  `src/app/styleguide/CanvasSwitcher.tsx` (`'use client'`) — that lets the user change the page
  background by **picking from the site's own color tokens**. Build the swatch list **dynamically from
  the colors discovered in step 1** (raw palette `--black`/`--white`/`--pink`/`--chartreuse`/`--gray-*`
  AND semantic roles `--canvas`/`--surface-light`/`--action`/`--highlight`/…) — do not hardcode a list;
  re-derive it each run so new tokens appear automatically. Each swatch is labeled with its token name;
  selecting one sets the page background via the chosen CSS var (e.g. set `background` to
  `var(--token)` on the audit root, or override `--canvas`). Default selection = `--canvas`. This is
  audit scaffolding, not a design-system component — keep it in the styleguide folder.
- Do **not** touch `Navigation` `NAV_ITEMS` or `sitemap.ts`.

**Organize BY DESIGN ROLE, not by component.** Cluster near-duplicates adjacent so divergence is
obvious. Suggested section order:

1. **Foundations** — color palette (every raw + semantic token as a swatch labeled name · value · role);
   type scale (each `--text-*` rendered at size, labeled with its px range); spacing scale; easing &
   duration; font families (Dela Gothic One display specimen; Montserrat at every loaded weight).
2. **Eyebrows** — all variants side by side (`.eyebrowMuted`, `StripControls` eyebrow, `FeaturedEvents`
   eyebrow…).
3. **Tags / chips / pills / badges** — all variants clustered (Hero tape labels, `.pill`/`.pillLg`,
   `FeaturedEvents` chips, `Calendar` chips, `EditionsNav` `.soon`/`.viewing`, `IsdayBadge` pill…).
4. **Links** — nav pill, footer underline-draw, `FeaturedEvents` calendar link…
5. **Buttons** — `MagneticButton` primary / secondary / gradient / sm·md·lg; `CookieBanner` ghost & solid.
6. **Controls** — `StripControls` arrows, `HeroSlideshow` prev/next/toggle + pagination dots, `Lightbox`
   arrows + close, `Navigation` hamburger.
7. **Cards** — `FeaturedEvents` poster, `EditionsNav` card, `IsdayBadge` card.
8. **Banners** — `CookieBanner`, `ArtistsBanner`.
9. **Interactive / misc** — `ReadMore`, `PartnerBadge`, `Marquee`, `Calendar` filters/`pastToggle`.
10. **Every remaining component** — render each leftover component (content sections: `Manifesto`,
    `AnimatedStats`, `Credits`, `ThemeArtists`, `VisitSection`, `MasonryGallery`, `ArtistsTable`,
    `Figure`, etc.) live with fixtures, for completeness.

**Every specimen is the real component, fully interactive — never a screenshot or static mock.** The
user must be able to actually hover, focus, and click each one and see real behavior: `MagneticButton`'s
magnetic pull + ripple, `Lightbox` opening, `HeroSlideshow` autoplay/play-pause/dots, `Navigation`
hamburger toggling to an X, `ReadMore` expanding, `Calendar` filters, `Carousel` scrolling. Do not
disable pointer events on specimens. The forced-state clones in the states section below are *extra*
static instances shown *alongside* the live one — they never replace it.

Each specimen is wrapped in `<Specimen>` that labels it with:
- component name,
- **source file path(s)** (the `.tsx` and `.module.css`),
- the relevant **class name(s)**,
- a one-line **state annotation** parsed from the component's CSS (what `:hover`/`:active`/`:focus` change).

Add a short **audit note** wherever a role has multiple divergent implementations (e.g. "3 eyebrow
variants: differ in size / color / divider rule" or "8 badge variants: bg, text color, border, rotation
all diverge"). This is the decision-making signal — make it explicit.

**States display (split approach):**
- **Forceable** states (`:disabled`, `disabled` prop, `[aria-expanded]`, `[aria-current]`,
  current/upcoming/active variants, `[data-*]`) → render the component as **side-by-side instances in
  every state** (resting + each forced state), no hovering required. Toggle them via props/attributes in
  JSX.
- **Pseudo** states (`:hover`, `:active`, `:focus-visible`) → render the live resting specimen plus a
  small annotation describing the change (parsed from CSS). Note "hover/focus: live — interact to view".

**Containing fixed/overlay components:** `Navigation`, `CookieBanner`, `Footer`, `Lightbox`,
`HeroSlideshow` use `position: fixed`/fullscreen/full-bleed. Wrap each in a framed container that
establishes a containing block for fixed descendants — apply `transform: translateZ(0)` (or
`will-change: transform`) plus `position: relative; overflow: hidden` on the frame so they render
in-flow inside a bordered box instead of escaping to the viewport. Render `Lightbox` in its **open**
state inline within such a frame.

### 4. Verify & report

- Run `pnpm typecheck` (NOT `pnpm dev` — the user runs the dev server themselves). Fix type errors in
  fixtures until it passes.
- Tell the user to visit `http://localhost:3000/styleguide`.
- Remind them: the route is throwaway + noindex + off-nav/sitemap, and is not committed.

---

## Known inventory (reference only — reconcile against live scan each run)

Fragmentation found at authoring time, to verify still holds:

- **Buttons** — 2 unrelated systems: `MagneticButton` (primary/secondary/gradient, sm·md·lg, GSAP
  magnetic + ripple) vs. `CookieBanner` ghost/solid. No shared base.
- **Links** — 3 patterns: `Navigation` pill (fill on hover, highlight when active), `Footer`
  underline-draw, `FeaturedEvents` bordered calendar link.
- **Eyebrows** — 3+ patterns: `.eyebrowMuted` (muted + 40px rule), `StripControls` (muted, no rule),
  `FeaturedEvents` (`text-2xs`, highlight color, no rule).
- **Tags/chips/pills/badges** — 8+ patterns: Hero tape labels (chartreuse, shadow, rotation, animated),
  `.pill`/`.pillLg` (flat chartreuse), `FeaturedEvents` `.chip`/`.when`, `Calendar` chips, `EditionsNav`
  `.soon`/`.viewing`, `IsdayBadge` pill (dark on light + dot).
- **Controls/arrows** — 3+ patterns: `StripControls` (44px, hover→action, disabled→gray), `HeroSlideshow`
  (40px, opacity baselines, translate on hover, play/pause), `Lightbox` (translate arrows + 90°-rotate
  close). Plus `HeroSlideshow` pagination dots (14px→28px active) and `Navigation` hamburger
  (bars→X on `aria-expanded`).
- **Cards** — 3 one-offs: `FeaturedEvents` poster (zoom + color on hover), `EditionsNav` (underline-draw +
  current/upcoming variants), `IsdayBadge` (light, static).
- **Banners** — `CookieBanner` (system notice) vs. `ArtistsBanner` (feature card, gradient hover).

Key files: `src/app/globals.css`, `src/components/Shared.module.css`, `src/app/layout.tsx`,
`src/components/{MagneticButton,Navigation,Hero,FeaturedEvents,HeroSlideshow,EditionsNav,Lightbox,
StripControls,CookieBanner,ArtistsBanner,IsdayBadge,ReadMore,PartnerBadge,Calendar}/`.
Static-route model (no data, no DraftAware): `src/app/not-found.tsx`. Image placeholder:
`src/lib/placeholder.ts`. Fixed-children containing-block trick: any `transform` on an ancestor.
