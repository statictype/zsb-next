import 'server-only'

export const readToken = process.env.SANITY_API_READ_TOKEN

if (!readToken) {
  throw new Error('Missing environment variable: SANITY_API_READ_TOKEN')
}
