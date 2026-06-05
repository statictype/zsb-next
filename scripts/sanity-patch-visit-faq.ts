/**
 * Seed the Visit page's editorial FAQ (`visitPage.faq`) with the two entries
 * the derived hours/location Q&As can't cover: what the venue is, and whether
 * it's open outside the event. The opening-hours and location FAQ entries are
 * NOT stored here — they're derived from the existing fields at render time.
 *
 * Idempotent: skips if `faq` is already set (re-run with --force to overwrite).
 *
 * Usage:
 *   pnpm exec tsx scripts/sanity-patch-visit-faq.ts          # apply
 *   pnpm exec tsx scripts/sanity-patch-visit-faq.ts --dry    # preview
 *   pnpm exec tsx scripts/sanity-patch-visit-faq.ts --force  # overwrite existing
 */

import './_load-env'

import { createClient } from '@sanity/client'

const FAQ = [
  {
    _type: 'faqItem',
    _key: 'faq-venue',
    question: 'What is the main venue?',
    answer:
      "The main venue is Combinatul Fondului Plastic, a former art-production complex in Bucharest that's home to galleries and artist studios year-round. Bucharest Sculpture Days is centred here, with parts of the program hosted at partner venues and public locations elsewhere in the city.",
  },
  {
    _type: 'faqItem',
    _key: 'faq-yearround',
    question: 'Can I visit the galleries outside Bucharest Sculpture Days?',
    answer:
      "Yes — Combinatul Fondului Plastic's galleries and studios are open through the year on their own schedules. The hours and program listed here are for the Bucharest Sculpture Days event.",
  },
]

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!projectId || !dataset || !apiVersion || !token) {
    throw new Error(
      'Missing env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, NEXT_PUBLIC_SANITY_API_VERSION, SANITY_API_WRITE_TOKEN',
    )
  }

  const dryRun = process.argv.includes('--dry')
  const force = process.argv.includes('--force')
  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

  const existing = await client.fetch<Array<{ _key: string }> | null>(
    '*[_id == "visitPage"][0].faq',
  )
  if (existing?.length && !force) {
    console.log(
      `Visit FAQ already has ${existing.length} entr(y/ies); skipping. Use --force to overwrite.`,
    )
    return
  }

  if (dryRun) {
    console.log(`(dry) would set visitPage.faq to ${FAQ.length} entries:`)
    for (const item of FAQ) console.log(`  • ${item.question}`)
    return
  }

  await client.patch('visitPage').set({ faq: FAQ }).commit()
  console.log(`✓ Set visitPage.faq (${FAQ.length} entries): ${FAQ.map((f) => f._key).join(', ')}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
