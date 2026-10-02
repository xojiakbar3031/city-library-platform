// Imzolangan sessiya: cookie qiymati "foydalanuvchi.muddat.imzo" ko'rinishida.
// Imzo HMAC-SHA256 bilan AUTH_SECRET orqali yasaladi, shuning uchun cookie'ni
// qo'lda yozib yoki o'zgartirib admin panelga kirib bo'lmaydi.
// Web Crypto API ishlatiladi — proxy (edge) va Node muhitida bir xil ishlaydi.

export const AUTH_COOKIE_NAME = 'kutubxona-session'
export const SESSION_TTL_SECONDS = 60 * 60 * 8 // 8 soat

const encoder = new TextEncoder()

function getSecret(): string {
  const secret = process.env.AUTH_SECRET
  if (secret && secret.length >= 32) return secret
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET muhit o\'zgaruvchisi kamida 32 belgidan iborat bo\'lishi kerak')
  }
  return 'dev-only-secret-change-me-dev-only-secret'
}

function toBase64Url(bytes: ArrayBuffer): string {
  let binary = ''
  for (const b of new Uint8Array(bytes)) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  return toBase64Url(await crypto.subtle.sign('HMAC', key, encoder.encode(payload)))
}

/** Uzunligi bir xil vaqtda solishtirish — timing hujumlaridan himoya. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function createSessionToken(username: string): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const payload = `${encodeURIComponent(username)}.${expires}`
  return `${payload}.${await sign(payload)}`
}

export async function verifySessionToken(token: string | undefined): Promise<string | null> {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [user, expires, signature] = parts
  if (!safeEqual(signature, await sign(`${user}.${expires}`))) return null
  if (Number(expires) < Date.now() / 1000) return null
  return decodeURIComponent(user)
}

export function validateCredentials(username: string, password: string): boolean {
  const adminUser = process.env.ADMIN_USERNAME
  const adminPass = process.env.ADMIN_PASSWORD
  if (!adminUser || !adminPass) {
    // Lokal ishlab chiqishda demo login; production'da env majburiy
    if (process.env.NODE_ENV === 'production') return false
    return safeEqual(username, 'admin') && safeEqual(password, 'demo12345')
  }
  return safeEqual(username, adminUser) && safeEqual(password, adminPass)
}
