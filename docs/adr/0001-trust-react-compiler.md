# Trust the React Compiler; no manual `useMemo` / `useCallback`

`reactCompiler: true` is enabled in `next.config.ts` and the codebase relies on it for memoization. Do not introduce manual `useMemo`, `useCallback`, or `React.memo` — write straightforward functions and JSX and let the compiler handle equality.

The `eslint-plugin-react-compiler` rule catches code shapes the compiler can't optimize (and silently disables itself on those files), but it does *not* flag a correctly-written `useCallback` as a problem. So manual memoization can be added without lint errors while quietly disabling compiler optimization on that file. That's the failure mode this ADR guards against.

If you find yourself reaching for manual memoization to fix a perf issue, first verify the compiler isn't being disabled on that file (look for rules-of-React violations), and only fall back to manual memoization with a comment explaining why the compiler can't handle the case.
