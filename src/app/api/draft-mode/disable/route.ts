import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const mode = await draftMode()
  mode.disable()

  // Honor a redirect target if present; otherwise send the editor back to /.
  // Same-site paths only — an absolute URL (or a scheme-relative `//host`)
  // in ?slug would make this an open redirect.
  const url = new URL(request.url)
  const to = url.searchParams.get('slug') ?? '/'
  const safeTo = to.startsWith('/') && !to.startsWith('//') ? to : '/'
  return NextResponse.redirect(new URL(safeTo, url.origin))
}
