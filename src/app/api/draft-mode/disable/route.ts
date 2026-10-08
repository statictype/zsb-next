import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const mode = await draftMode()
  mode.disable()

  // Same-site paths only; an absolute or scheme-relative (`//host`) ?slug would be an open redirect.
  const url = new URL(request.url)
  const to = url.searchParams.get('slug') ?? '/'
  const safeTo = to.startsWith('/') && !to.startsWith('//') ? to : '/'
  return NextResponse.redirect(new URL(safeTo, url.origin))
}
