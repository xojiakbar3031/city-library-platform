import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_COOKIE_NAME, verifySessionToken } from '@/lib/auth'

export async function proxy(request: NextRequest) {
  const user = await verifySessionToken(request.cookies.get(AUTH_COOKIE_NAME)?.value)
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
