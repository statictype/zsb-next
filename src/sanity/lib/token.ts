import 'server-only'

function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

export const readToken = required(process.env.SANITY_API_READ_TOKEN, 'SANITY_API_READ_TOKEN')
