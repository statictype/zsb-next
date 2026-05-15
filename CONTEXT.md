# Ubiquitous Language

Canonical domain terms used across data, types, and components. When you introduce a new domain concept (something a festival programmer would recognise, not an implementation detail), add it here.

## Edition

A single year of the festival. Modelled in `src/types/edition.ts` as a discriminated structure with two variants:

- **Edition** — a physical edition with venues, a program, and a carousel of on-site photography.
- **OnlineEdition** — a digital-only edition with an external gallery and no venue map.

Each edition lives in `src/data/editions/YYYY.ts` and is registered in `src/data/editions/index.ts`. The dynamic route `src/app/editions/[year]/` renders whichever variant is loaded.

## Program block

An item inside an edition's `ProgramData.blocks`. Each block has a **type** (`Exhibition`, `Film Program`, `Main Exhibition`, `Opening Event`, `Special Event`, `Student Exhibition`, `Talks & Workshops`) which controls the section it renders in, and how it's displayed.

### Format

An optional sub-label on a program block (`ProgramBlock.format`), used today only on `Talks & Workshops` blocks. Names the *kind* of event: `Roundtable`, `Workshop`, `Open Studios`. Distinct from `type`:

- `type` is the renderer-level category (which column / section the block lives in).
- `format` is the festival-programming category (what kind of event the public is attending).

A block can have a `type` of `Talks & Workshops` and a `format` of `Workshop`, `Roundtable`, or `Open Studios`. Future formats (`Lecture`, `Screening Talk`, …) extend the vocabulary without changing types.
