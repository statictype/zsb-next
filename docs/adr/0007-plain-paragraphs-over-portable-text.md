# Plain paragraph arrays for prose, Portable Text only on privacy

Long-form prose on the CMS-authored pages (about, partners, visit, the curator letter, the "Not a festival" block) is modelled as `array of strings` — each entry becomes a `<p>`. Portable Text is reserved for one page, `privacyPage.body`, which is the only place that requires inline marks (`<strong>` on cookie names, `<a>` for the ANSPDCP link and mailto, possibly lists) that paragraph arrays can't carry.

This goes against the Sanity default of "use Portable Text for anything text-shaped." We're picking the simpler shape on purpose:

- The pages we're modelling are largely **structured editorial content**, not long-form rich text. Hero copy, pillars, curator paragraphs, transit instructions. The fields the editor cares about are already broken out (eyebrow, headline, body, image, CTA) — there's nothing left over that needs heading levels, blockquotes, or embedded media inside the body.
- Portable Text **forces a serializer** in every renderer, even for content that has no rich features. That's editor-side complexity (the editor sees a rich-text surface they don't need), schema-side complexity (the serializer config has to be maintained), and a frontend dependency (`@portabletext/react`) used by one page if we kept the exception narrow.
- Plain `array of strings` gives the editor a stack of plain text areas with "add another paragraph" — which is exactly the mental model the existing static pages use. The migration from React to Sanity becomes a near-direct translation, not a rewrite.
- "Privacy is the exception" is a known shape: if a *second* page later genuinely needs inline marks, that's the moment to revisit. Premature generalization to Portable Text everywhere would have committed us to an editor surface no other page benefits from.

Considered alternatives:

- **Portable Text everywhere.** Default Sanity advice. Adds the serializer, the rich-text UI, and a dependency for content that's structurally simple. Skipped — the leverage isn't there for this project's content shape.
- **Strip inline marks on the privacy page too.** Plain paragraphs end-to-end, schema stays uniform. Cookie names lose their `<strong>` distinction (which is content-meaningful — they're identifiers the user needs to scan), and the legal authority link becomes a bare URL or moves to a separate "links" sidebar that doesn't read naturally in body prose. Considered; rejected by the user.
- **Keep `/privacy` as a static React file.** It updates rarely (one date per year). The cost is real but small — we'd have one page outside the CMS, contradicting the rollout goal of "editors can author every visible page." Skipped to honour the goal.

Reversibility: low cost. Plain string arrays → Portable Text is a one-shot migration script per field (`text → portable text blocks`), straightforward with `@portabletext/markdown` if we ever decide otherwise. The renderer change is mechanical.
