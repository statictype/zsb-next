# `ProgramBlock.column` is authoring intent, not a layout artifact

Each `ProgramBlock` carries a `column: 1 | 2` field that determines which of the two side-by-side columns the block renders in. This is **not** derivable from `type` or `format` — the two columns are expected to be **visually balanced in height**, and the column assignment is an explicit authoring decision driven by the rendered size of each block.

Don't propose auto-distribution rules ("Main Exhibition always goes left," "alternate by type") or refactors that collapse both columns into a single ordered list — both lose the height-balancing intent. When the data shape eventually moves to `columns: { column1: Block[], column2: Block[] }` (likely with the Sanity migration), preserve the per-block authoring intent.

Also documented in `CONTEXT.md` under "Program block."
