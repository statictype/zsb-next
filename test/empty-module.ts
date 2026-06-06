// Stub for `server-only` / `client-only` under Vitest. Those packages throw
// (or are a no-op) outside Next's bundler; aliasing them here lets data-layer
// modules import cleanly in the test runner. See docs/testing.md.
export {}
