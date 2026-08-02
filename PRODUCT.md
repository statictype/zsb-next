# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary audience changes with the event calendar. The site has two modes.

**Edition window (~2 months/year).** An edition page publishes about one month before the event; the event itself runs about one month. In this window the primary user is a Bucharest visitor deciding what to see: which events, on which dates, at which venue, at what time, and how to get there. Secondary: event partners checking they are represented properly.

**Rest of the year.** The primary audience is potential partners and funders assessing whether ZSB is worth backing. Secondary: the general contemporary-art public, who may convert into physical visitors or share content.

Three audiences are constant across both modes:

- **Artists** — sculptors whose work is shown, and sculptors deciding whether to take part.
- **Press** — journalists covering the event, using the press kit, releases, and appearance list.
- **Buyers and galleries** — people wanting to contact an artist or ZSB about a work. The site offers no path for this today.

## Product Purpose

Bucharest Sculpture Days (ZSB) is a platform for sculpture in Bucharest. Its most visible part is an annual contemporary sculpture event; it also runs a youth award, open studios, talks, and film screenings. It exists to promote sculpture as a practice in Romania, where the profession is in decline. The site carries three jobs at once:

1. Get people to the events of the current edition.
2. Establish enough credibility to attract partners and funding.
3. Keep a permanent public record of every edition.

No single one of these outranks the others. Attendance to date has been organic, with no large sponsorship and no advertising budget, so sharing is the only growth mechanism available. Individual events are therefore first-class shareable objects — each has its own URL, opens as a modal over the calendar or as a full page on direct load, and has its own Open Graph card — on the expectation that people sharing an event they are going to is what brings the next visitor. That is the bet the architecture is placed on, not a measured result.

## Positioning

ZSB is a platform for sculpture, with emphasis on the artists. The facts behind that position:

- Sculpture is a declining profession in Romania; reviving it is the stated reason ZSB exists.
- The event has drawn substantial organic attendance without major sponsorship.
- Artists frequently pay out of pocket to transport their work to the event.
- There are no significant funds. Credibility is the asset used to attract partners.

## Operating Context

- Editions are annual. The edition page goes live about a month before the event; the event lasts about a month.
- All content lives in Sanity and is edited in the Studio embedded at `/studio`. One production dataset.
- Domain vocabulary is defined in `CONTEXT.md`: Edition, edition status (`announced` / `live`), Event, Venue, Event type / Venue type, Calendar, Ongoing, Latest & Upcoming.
- Production cache invalidation runs through a Sanity webhook.

## Capabilities and Constraints

Existing surfaces: homepage, editions index, `/editions/YYYY` edition page with day-by-day calendar (venue and type filters, hide-past default, separate Ongoing area), individually shareable event pages, all-artists list, About, Visit (venues), Partners, Press, Privacy, plus sitemap, robots, JSON-LD, and Sanity draft mode.

- **Editions accumulate.** Every past edition stays reachable at `/editions/YYYY`. The archive is not prunable.
- **Terminology.** ZSB is a *platform* that includes events. Never *just an event*, never a *festival*. The annual programme is an event; ZSB is not. The About page makes the point explicitly.
- **Content is Sanity-editable** and mostly is today; full editability is the goal. This is a direction, not a mandate to overcomplicate schema or UI in its name.
- **Language.** The site is English only (`lang="en"`, all CMS copy in English). Romanian is a planned future requirement, not scheduled. New work should not make a bilingual model harder, but no localization layer is committed.
- **Planned, not built — artist detail pages.** Two jobs at once: a professional profile a sculptor can point to, and a discovery surface for commissions. Constraint: initially only work shown at ZSB is available, plus an optional link to the artist's own site if they have one.

## Brand Commitments

- Name: Bucharest Sculpture Days / Zilele Sculpturii București. Short form: ZSB. Domain: `sculpturedays.com`.
- "Platform", not "event", for ZSB itself. "Event" for the annual programme. Never "festival", in prose, naming, or copy.
- "Platform" is a description, not a second name. There is one name — Bucharest Sculpture Days, short form ZSB. First mention on a page is "Bucharest Sculpture Days (ZSB)"; ZSB thereafter.
- Editions are named with a `#` hashtag convention. Copy such as "Five #" is intentional.

## Evidence on Hand

Real material the site can use as proof:

- **Press coverage** — genuine articles, video, and audio, modeled as `pressAppearance` documents; plus press releases and per-edition press kits.
- **Named partners and venues** — real organizations, galleries, and venues that hosted editions (`venue`, `partnersPage`).
- **Photography archive** — substantial real photography of works, artists, and venues from past editions. **Not yet tagged** by artist, work, or edition, so artist pages cannot depend on tagged imagery yet.
- **Attendance figures** — real numbers from past editions exist.

Not on hand, and not to be invented: testimonials, sponsorship or funding claims, awards, benchmarks, visitor quotes.

## Product Principles

1. **Two modes, one site.** During the edition window, answer what/when/where for a visitor. The rest of the year, build partner credibility and show the artists.
2. **Artists are the subject.** Sculptors are the reason the platform exists, not a credit line under the work.
3. **Every event is shareable.** Individual addressability and a correct share card are a feature, not a nicety — organic reach is the distribution channel.
4. **Credibility comes from real material.** Only genuine press, partners, photography, and figures.
5. **The archive is permanent.** Editions accumulate; nothing is retired.
