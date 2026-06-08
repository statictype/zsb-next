# Decoupled per-surface edition controls (no global "current edition")

The site is dark for most of the year, with occasional run-ups to a new edition.
Several surfaces each need to answer "which edition, shown how" — the homepage
editions list, the home hero, the homepage featured events, the Visit venues
view, and each edition page's calendar. The question is whether one global lever
drives them all, or each surface owns its own.

## Each surface has its own control; there is no global site-state

We rejected a single global pointer / "site state" in favour of **independent,
local controls**, because the surfaces advance on different clocks — the hero can
start promoting next year's edition while its featured events are still empty and
its calendar still says "coming soon". One global mode can't express that without
a matrix of special cases.

| Surface | Its control |
| --- | --- |
| Editions list (homepage) | **edition status** (`upcoming` → coming-soon row; `live` → linked) |
| Home hero | a **switch: lead with Latest \| Upcoming**. Leading with Upcoming demotes Latest to a compact secondary presence (its slideshow + CTA kept, integrated) |
| Homepage featured events | **per-edition featured marking** on the newest **live** edition; past events hidden. No homepage-level switch |
| Visit venues view | a **separate switch: Latest \| Upcoming** (independent of the hero's) |
| Edition page calendar | **events presence** (calendar vs the coming-soon block); a *finished* edition shows a recap summary + social CTAs with its archive agenda collapsed |

**Latest and Upcoming are derived, not stored:** Latest = the most recent
edition that has taken place; Upcoming = the next edition. The two switches pick
between those two derived editions — the editor never maintains a pointer. When
there is no upcoming edition, "lead with Upcoming" falls back to Latest.

Past-ness ("has it taken place") is judged against *now*, which on the cached
homepage / Visit page is computed client-side — the same split the calendar uses
([ADR 0012]).

## Considered alternatives

- **A single `currentEdition` pointer** (the original [ZSB-36]). One field, but it
  couples every surface to one edition and drifts: left pointing at a finished
  edition, the homepage features events that are over. It also can't express
  surface-by-surface readiness. Its one consumer is the Visit venues view; it's
  removed in [ZSB-46] when Visit moves to its own switch.
- **A global idle/promo "site state" + per-surface behaviour tables** (the
  original [ZSB-42] framing). A second global axis each surface branches on.
  Redundant with edition status plus date-derivation, and it still forces every
  surface into one of a few blessed combinations rather than letting each move on
  its own.

## Consequences

- Two small site settings (the home-hero switch and the Visit switch); a shared
  helper that derives Latest / Upcoming; `siteSettings.currentEdition` removed in
  [ZSB-46] (its last consumer, the Visit venues view, moves to the Visit switch).
- "Featured" is purely an editorial mark on events, read off the newest **live**
  edition with past ones filtered client-side — no separate homepage control to
  keep in sync.
- The edition-status axis (`upcoming` / `live`, [ADR 0008]) is untouched and does
  more of the work; the run-up phases (announce → teaser → promo) emerge from
  status + the two switches + per-edition content, not from a global mode.

## Reversibility

Medium. The two switches, the derivation, and the `currentEdition` removal are
load-bearing across the homepage and Visit; reverting to a single pointer means
re-coupling those surfaces. Recorded so a future reader doesn't reintroduce a
global "current edition" and wonder why the hero and Visit have separate switches.

See also: [ADR 0008] (edition status / listings — the other axis),
[ADR 0012] (the cache split the client-side past-check lives in).

[ADR 0008]: ./0008-derive-edition-listings-from-status.md
[ADR 0012]: ./0012-cache-components-three-layer-fetch.md
[ZSB-36]: https://linear.app/zsb/issue/ZSB-36
[ZSB-42]: https://linear.app/zsb/issue/ZSB-42
[ZSB-46]: https://linear.app/zsb/issue/ZSB-46
