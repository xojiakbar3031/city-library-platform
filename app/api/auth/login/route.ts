import { NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME, SESSION_TTL_SECONDS, createSessionToken, validateCredentials } from '@/lib/auth'

// Oddiy brute-force himoyasi: bitta IP'dan 15 daqiqada 5 tadan ortiq xato urinish bloklanadi.
// (Bitta server instansiyasi doirasida; ko'p instansiyali deploy uchun Redis kabi umumiy xotira kerak.)
const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5
const failures = new Map<string, { count: number; since: number }>()

function clientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local'
}

export async function POST(request: Request) {
  const ip = clientIp(request)
  const record = failures.get(ip)
  if (record && Date.now() - record.since < WINDOW_MS && record.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Juda ko'p urinish. 15 daqiqadan so'ng qayta urinib ko'ring" },
      { status: 429 },
    )
  }

  try {
    const body = await request.json()
    const username = String(body.username ?? '').trim()
    const password = String(body.password ?? '')

    if (!username || !password) {
      return NextResponse.json({ error: 'Login va parol kiritilishi shart' }, { status: 400 })
    }

    if (!validateCredentials(username, password)) {
      const fresh = !record || Date.now() - record.since >= WINDOW_MS
      failures.set(ip, { count: fresh ? 1 : record.count + 1, since: fresh ? Date.now() : record.since })
      return NextResponse.json({ error: "Login yoki parol noto'g'ri kiritildi" }, { status: 401 })
    }

    failures.delete(ip)
    const response = NextResponse.json({ success: true })
    response.cookies.set(AUTH_COOKIE_NAME, await createSessionToken(username), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_TTL_SECONDS,
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: "Tizim xatosi. Qayta urinib ko'ring" }, { status: 500 })
  }
}
