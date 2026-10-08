/** Must be the first import in a script: `src/sanity/env.ts` reads env vars when it is evaluated. */
if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile('.env.local')
  } catch {}
}
