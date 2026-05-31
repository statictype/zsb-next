import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const mode = await draftMode()
  mode.disable()

  // Honor a redirect target if present; otherwise send the editor back to /.
  const url = new URL(request.url)
  const to = url.searchParams.get('slug') ?? '/'
  return NextResponse.redirect(new URL(to, url.origin))
}
