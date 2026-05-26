/**
 * Side-effect module: load `.env.local` before any other import is evaluated.
 *
 * Must be the FIRST import in any script that needs env vars at module-init
 * time (e.g. `src/lib/blob.ts` reads `NEXT_PUBLIC_BLOB_URL` at evaluation).
 */
if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile('.env.local')
  } catch {
    // .env.local is optional
  }
}
